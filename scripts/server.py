import os
import json
import io
import re
import time
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from snowflake.snowpark import Session
from dotenv import load_dotenv
import fitz  # PyMuPDF
import docx
from typing import Dict, Any, List, Tuple

# --- Initialization ---
load_dotenv()
app = Flask(__name__, template_folder='.')

# Configure CORS to allow requests from all origins
CORS(app, origins="*", 
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization"])

# --- Constants ---json


# --- Initialization ---

# --- Constants ---
SNOWFLAKE_MODEL = 'snowflake-arctic'
MAX_QUERY_RETRIES = 3

# ==============================================================================
# --- AI PROMPT TEMPLATES ---
# ==============================================================================

# This section centralizes the prompts sent to the AI model.
# By defining them as constants, they are easier to manage, version, and refine.

INITIAL_PROMPT_TEMPLATE = """
You are a world-class expert curriculum and career path designer. Your task is to generate a comprehensive, professional, and actionable learning roadmap based on the user's request.

*USER'S GOAL:*
{user_prompt}

*USER'S BACKGROUND (from resume, if provided):*
{resume_context}

*CRITICAL INSTRUCTIONS:*
1.  *TONE AND STYLE:* Be concise, crisp, and informative. Avoid verbose explanations. Get straight to the point.
2.  *STRUCTURE:* Organize the roadmap into logical phases (e.g., "Phase 1: Foundational Skills", "Phase 2: Core Competencies", "Phase 3: Advanced Specialization").
3.  *CONTENT:*
    * Each phase must contain 5-6 major topics.
    * Each topic must include an estimated_time ("1 Week", "2 Weeks", etc.) and a difficulty level ("Beginner", "Intermediate", "Advanced").
    * Each topic must have 3-8 granular, actionable sub_steps.
    * Each sub_step must only have a title. Do NOT include a description or project_idea.
4.  *COMPLETENESS:* The roadmap must be complete. Generate ALL phases required to get the user from their current skill to their target skill. Do not generate an incomplete plan. For a Beginner to Expert path, this usually means at least 3-4 distinct phases.
5.  *OUTPUT FORMAT:*
    * Your ENTIRE response MUST be a single, raw, valid JSON object and nothing else.
    * Do NOT include any explanatory text, markdown, or comments outside of the JSON structure.
    * Adhere strictly to the JSON schema provided below.

*REQUIRED JSON SCHEMA:*
json
{{
  "roadmap": [
    {{
      "phase": "Phase Title (e.g., Phase 1: Foundations)",
      "topics": [
        {{
          "topic": "Topic Name (e.g., Introduction to Cloud Computing)",
          "estimated_time": "1 Week",
          "difficulty": "Beginner",
          "sub_steps": [
            {{
              "title": "Understand the Core Concepts of IaaS, PaaS, SaaS"
            }}
          ]
        }}
      ]
    }}
  ]
}}

"""

REFINEMENT_PROMPT_TEMPLATE = """
You are a world-class expert curriculum and career path designer. Your task is to intelligently modify the provided JSON learning roadmap based on a user's command.

*INSTRUCTIONS:*
1.  *Analyze:* Read the user's command and the current JSON roadmap.
2.  *Modify:* Update the JSON by adding, removing, or changing phases, topics, or sub-steps as requested. Ensure the final roadmap remains logical and professional.
3.  *Maintain Structure:* Preserve the original JSON schema in your response. Do not add description or project_idea fields.
4.  *OUTPUT FORMAT:*
    * Your ENTIRE response MUST be the complete, updated, raw, valid JSON object.
    * Do NOT include any explanations, markdown, or comments outside of the JSON structure.

*CURRENT ROADMAP:*
json
{current_roadmap_json_str}


*USER'S MODIFICATION COMMAND:*
"{user_command}"

Now, provide the complete and modified JSON object that reflects the user's request.
"""

CONTINUATION_PROMPT_TEMPLATE = """
You are a world-class expert curriculum and career path designer. Your task is to continue generating a learning roadmap based on the JSON provided. The user wants the next logical phase of their learning plan.

*CRITICAL INSTRUCTIONS:*
1.  *Analyze:* Review the last phase and topic in the provided JSON to understand the context.
2.  *Generate:* Create the next single logical phase that should follow the existing roadmap. If you determine there are no more logical phases to add to complete the journey to 'expert', return an empty list for the "roadmap" key.
3.  *Maintain Style:* Keep the tone concise and crisp. Sub-steps must only have a title.
4.  *OUTPUT FORMAT:*
    * Your ENTIRE response MUST be a single, raw, valid JSON object.
    * If generating a new phase, it must be wrapped in a "roadmap" list.
    * If the roadmap is complete, respond with {{"roadmap": []}}.
    * Do NOT repeat the existing roadmap. Your response should only contain the new phase or be empty.

*EXISTING ROADMAP (for context):*
json
{current_roadmap_json_str}


*REQUIRED JSON SCHEMA FOR YOUR RESPONSE (new phase only):*
json
{{
  "roadmap": [
    {{
      "phase": "Phase Title (e.g., Phase 4: DevOps & Automation)",
      "topics": [
        {{
          "topic": "Topic Name",
          "estimated_time": "Time",
          "difficulty": "Difficulty",
          "sub_steps": [
            {{
              "title": "Sub-step title"
            }}
          ]
        }}
      ]
    }}
  ]
}}

Now, generate only the next phase, or an empty roadmap list if complete, as a single JSON object.
"""


# --- Snowflake Connection ---
connection_parameters = {
    "account": os.getenv("SNOWFLAKE_ACCOUNT"),
    "user": os.getenv("SNOWFLAKE_USER"),
    "password": os.getenv("SNOWFLAKE_PASSWORD"),
    "warehouse": os.getenv("SNOWFLAKE_WAREHOUSE"),
    "database": os.getenv("SNOWFLAKE_DATABASE"),
    "schema": os.getenv("SNOWFLAKE_SCHEMA"),
}

if not all(connection_parameters.values()):
    raise ValueError(
        "One or more Snowflake environment variables are not set. Please check your .env file.")

try:
    print("Connecting to Snowflake...")
    session = Session.builder.configs(connection_parameters).create()
    session.use_warehouse(connection_parameters["warehouse"])
    print(
        f"Successfully connected to Snowflake! Context: {session.get_fully_qualified_current_schema()}")
except Exception as e:
    raise ConnectionError(f"Failed to connect to Snowflake. Error: {e}")

# --- Utility Functions ---


def extract_text_from_pdf(file_stream: io.BytesIO) -> str | None:
    """Extracts text content from a PDF file stream."""
    try:
        doc = fitz.open(stream=file_stream.read(), filetype="pdf")
        return "".join(page.get_text() for page in doc)
    except Exception as e:
        app.logger.error(f"Error extracting PDF text: {e}")
        return None


def extract_text_from_docx(file_stream: io.BytesIO) -> str | None:
    """Extracts text content from a DOCX file stream."""
    try:
        doc = docx.Document(io.BytesIO(file_stream.read()))
        return "\n".join([para.text for para in doc.paragraphs])
    except Exception as e:
        app.logger.error(f"Error extracting DOCX text: {e}")
        return None


def escape_sql_string(value: str) -> str:
    """Escapes single quotes in a string for safe SQL embedding."""
    return value.replace("'", "''") if value else ""


def is_prompt_valid(prompt: str) -> Tuple[bool, str]:
    """
    Validates user prompts to prevent trivial or unhelpful requests to the AI.

    Args:
        prompt: The user-provided text.

    Returns:
        A tuple containing a boolean (is_valid) and an error message string.
    """
    if not prompt or len(prompt.strip()) < 10:
        return False, "Your request is too short. Please provide more detail about your learning goal."
    # A simple regex to check for common verbs and prepositions, making sure the prompt is a real sentence.
    if not re.search(r'\b(the|a|an|is|to|for|in|of|learn|become|add|remove|change|make|more|less)\b', prompt.lower()):
        return False, "Your request seems unclear. Please use descriptive language to specify your goal."
    return True, ""

# --- Data Format Converters ---


def convert_ai_to_frontend_format(ai_roadmap: Dict[str, Any]) -> Dict[str, Any]:
    """
    Converts the structured, AI-friendly roadmap format to the flat
    node/edge format required by the frontend.

    Args:
        ai_roadmap: The roadmap dictionary produced by the AI.

    Returns:
        A dictionary formatted for the frontend renderer.
    """
    nodes, edges = [], []
    node_counter = 0
    last_node_id_in_phase = None

    for phase_idx, phase_data in enumerate(ai_roadmap.get("roadmap", [])):
        phase_title = phase_data.get("phase", "Untitled Phase")
        # Add a special node for the phase title itself to display it on the frontend.
        phase_node_id = f"phase_{phase_idx}"
        nodes.append({
            "id": phase_node_id,
            "type": "phaseTitle",
            "data": {"label": phase_title},
            "position": {"x": phase_idx * 340, "y": 0}
        })

        # Connect the last topic of the previous phase to the new phase title
        if last_node_id_in_phase:
            edges.append({"id": f"e{last_node_id_in_phase}-{phase_node_id}",
                         "source": last_node_id_in_phase, "target": phase_node_id})

        last_topic_in_phase = None
        for topic_data in phase_data.get("topics", []):
            node_id = str(node_counter)
            # All data from the AI is nested inside the 'data' key for the frontend
            node_data = {
                "label": topic_data.get("topic", "Untitled Topic"),
                "phase": phase_title,  # Store phase for reconstruction
                "estimated_time": topic_data.get("estimated_time", "N/A"),
                "difficulty": topic_data.get("difficulty", "N/A"),
                "subSteps": [step.get("title") if isinstance(step, dict) else str(step) 
                           for step in topic_data.get("sub_steps", [])]
            }
            nodes.append({
                "id": node_id,
                "type": "topic",
                "data": node_data,
                "position": {"x": (phase_idx) * 340, "y": 100 + (len(nodes) - (phase_idx + 1)) * 20}
            })

            # Link from phase title to the first topic of the phase
            if not last_topic_in_phase:
                edges.append({"id": f"e{phase_node_id}-{node_id}",
                             "source": phase_node_id, "target": node_id})
            # Link from the previous topic to the current one
            if last_topic_in_phase:
                edges.append({"id": f"e{last_topic_in_phase}-{node_id}",
                             "source": last_topic_in_phase, "target": node_id})

            last_topic_in_phase = node_id
            node_counter += 1
        last_node_id_in_phase = last_topic_in_phase

    return {"nodes": nodes, "edges": edges}


def convert_frontend_to_ai_format(frontend_roadmap: Dict[str, Any]) -> Dict[str, Any]:
    """
    Converts the flat frontend node/edge format back to the structured,
    AI-friendly format for refinement.

    Args:
        frontend_roadmap: The roadmap dictionary from the frontend state.

    Returns:
        A structured dictionary ready for the AI.
    """
    nodes = frontend_roadmap.get("nodes", [])
    topic_nodes = sorted(
        [n for n in nodes if n.get('type') == 'topic'],
        key=lambda n: n.get("position", {}).get("x", 0)
    )

    phases = {}  # Use a dictionary to group topics by phase
    for node in topic_nodes:
        node_data = node.get("data", {})
        phase_name = node_data.get("phase", "Uncategorized")
        if phase_name not in phases:
            phases[phase_name] = []

        # Reconstruct the topic object, removing phase from the nested data
        topic = {
            "topic": node_data.get("label"),
            "estimated_time": node_data.get("estimated_time"),
            "difficulty": node_data.get("difficulty"),
            "sub_steps": node_data.get("subSteps", [])
        }
        phases[phase_name].append(topic)

    # Build the final roadmap structure from the grouped phases
    roadmap_list = [{"phase": name, "topics": topics}
                    for name, topics in phases.items()]
    return {"roadmap": roadmap_list}

# --- Core AI and Parsing Logic ---


def run_snowflake_query(prompt: str) -> Dict[str, Any]:
    """
    Executes a query against the Snowflake Cortex LLM, with retry logic and JSON parsing.

    Args:
        prompt: The fully-formed prompt to send to the model.

    Returns:
        A dictionary containing the parsed AI response or an error.
    """
    for attempt in range(MAX_QUERY_RETRIES):
        try:
            safe_prompt = escape_sql_string(prompt)
            sql_query = f"SELECT SNOWFLAKE.CORTEX.COMPLETE('{SNOWFLAKE_MODEL}', '{safe_prompt}') as response"

            # Execute the query and get the raw text response
            response_text = session.sql(sql_query).collect()[0]['RESPONSE']

            # The model may sometimes wrap the JSON in markdown, so we extract it.
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if not json_match:
                raise ValueError("No JSON object found in AI response.")

            parsed_json = json.loads(json_match.group(0))

            # Basic validation of the parsed JSON structure
            if "roadmap" in parsed_json and isinstance(parsed_json["roadmap"], list):
                print(
                    f"Successfully parsed AI response on attempt {attempt + 1}.")
                return parsed_json
            else:
                raise ValueError(
                    f"AI response JSON did not contain the expected 'roadmap' list. Found keys: {list(parsed_json.keys())}")

        except (json.JSONDecodeError, ValueError, IndexError) as e:
            app.logger.error(
                f"Attempt {attempt + 1}/{MAX_QUERY_RETRIES} failed: {e}. Retrying...")
            if attempt + 1 == MAX_QUERY_RETRIES:
                return {"error": f"The AI model failed to generate a valid response. Last error: {str(e)}"}
            time.sleep(1)  # Wait before retrying

    return {"error": "An unknown error occurred after all retries."}


def generate_chat_summary(old_roadmap: dict, new_roadmap: dict) -> str:
    """Generates a user-friendly summary of changes between two roadmaps."""
    try:
        old_topics = {node['data']['label'] for node in old_roadmap.get(
            'nodes', []) if node.get('type') == 'topic'}
        new_topics = {node['data']['label'] for node in new_roadmap.get(
            'nodes', []) if node.get('type') == 'topic'}

        if old_topics == new_topics:
            return "OK, I've updated the details in the roadmap as you requested."

        added_count = len(new_topics - old_topics)
        removed_count = len(old_topics - new_topics)

        changes = []
        if added_count > 0:
            changes.append(
                f"added {added_count} topic{'s' if added_count > 1 else ''}")
        if removed_count > 0:
            changes.append(
                f"removed {removed_count} topic{'s' if removed_count > 1 else ''}")

        if not changes:
            return "No major changes detected, but I'm ready for your next request."

        return "OK, I've " + " and ".join(changes) + "."
    except Exception:
        # Fallback for any comparison errors
        return "I have updated the roadmap based on your feedback."

# --- Flask API Endpoints ---


@app.route('/')
def index():
    """Serves the main HTML page."""
    return render_template('index_cb.html')


@app.route('/generate-roadmap', methods=['POST'])
def handle_initial_request():
    """Endpoint to generate the initial learning roadmap."""
    goal_prompt = request.form.get('prompt')
    is_valid, error_msg = is_prompt_valid(goal_prompt)
    if not is_valid:
        return jsonify({"error": error_msg}), 400

    # Append default context if not provided by the user, which helps the AI.
    if "current skill:" not in goal_prompt.lower():
        goal_prompt += "\nCurrent Skill: Beginner"
    if "target skill:" not in goal_prompt.lower():
        goal_prompt += "\nTarget Skill: Expert"

    resume_text = "Not provided."
    if 'resume' in request.files and request.files['resume'].filename != '':
        resume_file = request.files['resume']
        ext = os.path.splitext(resume_file.filename)[1].lower()
        if ext == '.pdf':
            resume_text = extract_text_from_pdf(resume_file)
        elif ext == '.docx':
            resume_text = extract_text_from_docx(resume_file)
        else:
            return jsonify({"error": "Unsupported file. Please upload a PDF or DOCX."}), 400
        if not resume_text:
            return jsonify({"error": "Could not extract text from the uploaded resume."}), 500

    # Build the full prompt from the template
    full_prompt = INITIAL_PROMPT_TEMPLATE.format(
        user_prompt=goal_prompt, resume_context=resume_text)

    ai_response = run_snowflake_query(full_prompt)
    if 'error' in ai_response:
        return jsonify(ai_response), 500

    frontend_roadmap = convert_ai_to_frontend_format(ai_response)

    # Check if the AI generated a reasonably complete roadmap already
    num_phases = len(ai_response.get("roadmap", []))
    is_complete = num_phases >= 3
    message = "Generated initial phase(s)." if not is_complete else "Successfully generated the complete roadmap."

    return jsonify({
        "roadmap": frontend_roadmap,
        "message": message,
        "is_complete": is_complete
    }), 200


@app.route('/refine-roadmap', methods=['POST'])
def handle_refinement_request():
    """Endpoint to modify an existing roadmap based on user chat input."""
    data = request.get_json()
    chat_message = data.get('chat_message')
    current_frontend_roadmap = data.get('current_roadmap')

    is_valid, error_msg = is_prompt_valid(chat_message)
    if not is_valid:
        return jsonify({"error": error_msg}), 400
    if not current_frontend_roadmap:
        return jsonify({"error": "Current roadmap is missing from the request."}), 400

    current_ai_roadmap = convert_frontend_to_ai_format(
        current_frontend_roadmap)
    ai_roadmap_str = json.dumps(current_ai_roadmap, separators=(',', ':'))
    refinement_prompt = REFINEMENT_PROMPT_TEMPLATE.format(
        current_roadmap_json_str=ai_roadmap_str,
        user_command=chat_message
    )

    modified_ai_roadmap = run_snowflake_query(refinement_prompt)
    if 'error' in modified_ai_roadmap:
        return jsonify(modified_ai_roadmap), 500

    # Convert nested roadmap structure to nodes and edges format
    def convert_nested_to_nodes_edges(nested_roadmap):
        nodes = []
        edges = []
        node_id_counter = 0
        
        def create_node(label, node_type, position, parent_id=None):
            nonlocal node_id_counter
            node_id = f"{node_type}_{node_id_counter}"
            node_id_counter += 1
            
            node = {
                "id": node_id,
                "type": node_type,
                "data": {"label": label},
                "position": position
            }
            
            if parent_id:
                node["parent"] = parent_id
                
            nodes.append(node)
            return node_id
        
        def process_item(item, parent_id=None, x_offset=0, y_offset=0, level=0):
            # Create main node
            if level == 0:  # Top-level items become phase titles
                node_id = create_node(item['name'], 'phaseTitle', {"x": x_offset, "y": y_offset})
            else:  # Sub-items become steps
                node_id = create_node(item['name'], 'step', {"x": x_offset, "y": y_offset}, parent_id)
            
            # Create edge from parent to current node
            if parent_id:
                edges.append({
                    "id": f"e_{parent_id}_{node_id}",
                    "source": parent_id,
                    "target": node_id
                })
            
            # Process sub_steps recursively
            if 'sub_steps' in item and item['sub_steps']:
                for i, sub_step in enumerate(item['sub_steps']):
                    process_item(
                        sub_step, 
                        node_id, 
                        x_offset + 150 + (i * 100), 
                        y_offset + 80 + (i * 40), 
                        level + 1
                    )
            
            return node_id
        
        # Process top-level roadmap items
        if isinstance(nested_roadmap, dict) and 'roadmap' in nested_roadmap:
            roadmap_items = nested_roadmap['roadmap']
        elif isinstance(nested_roadmap, list):
            roadmap_items = nested_roadmap
        else:
            roadmap_items = []
        
        for i, item in enumerate(roadmap_items):
            process_item(item, None, i * 340, 0, 0)
        
        return {"nodes": nodes, "edges": edges}

    # Check if the response has the nested format and convert it
    if isinstance(modified_ai_roadmap, dict) and 'roadmap' in modified_ai_roadmap:
        # Check if it's the nested format (has 'name' and 'sub_steps')
        roadmap_data = modified_ai_roadmap['roadmap']
        if (isinstance(roadmap_data, list) and len(roadmap_data) > 0 and 
            isinstance(roadmap_data[0], dict) and 'name' in roadmap_data[0]):
            # Convert nested format to nodes and edges
            modified_frontend_roadmap = convert_nested_to_nodes_edges(modified_ai_roadmap)
        else:
            # Use existing conversion for structured format
            modified_frontend_roadmap = convert_ai_to_frontend_format(modified_ai_roadmap)
    else:
        # Fallback to existing conversion
        modified_frontend_roadmap = convert_ai_to_frontend_format(modified_ai_roadmap)

    summary_message = generate_chat_summary(
        current_frontend_roadmap, modified_frontend_roadmap)
    
    return jsonify({
        "roadmap": modified_frontend_roadmap,
        "message": summary_message,
        "is_complete": True  # A refinement is always a "complete" action
    }), 200


@app.route('/continue-roadmap', methods=['POST'])
def handle_continuation_request():
    """Endpoint to generate the next phase of a roadmap."""
    data = request.get_json()
    current_frontend_roadmap = data.get('current_roadmap')
    if not current_frontend_roadmap:
        return jsonify({"error": "Current roadmap is missing from the request."}), 400

    # Convert to AI format to provide as context
    current_ai_roadmap = convert_frontend_to_ai_format(
        current_frontend_roadmap)
    ai_roadmap_str = json.dumps(current_ai_roadmap, separators=(',', ':'))

    # Build the continuation prompt
    continuation_prompt = CONTINUATION_PROMPT_TEMPLATE.format(
        current_roadmap_json_str=ai_roadmap_str
    )

    # The AI will return just the new part of the roadmap
    new_roadmap_part = run_snowflake_query(continuation_prompt)
    if 'error' in new_roadmap_part:
        return jsonify(new_roadmap_part), 500

    # If the AI returns an empty list, the roadmap is complete.
    if not new_roadmap_part.get('roadmap'):
        return jsonify({
            "roadmap": current_frontend_roadmap,
            "message": "Roadmap generation is complete!",
            "is_complete": True
        })

    # Otherwise, append the new phase(s) to the existing roadmap
    for new_phase in new_roadmap_part['roadmap']:
        current_ai_roadmap['roadmap'].append(new_phase)

    # Convert the fully combined roadmap back to the frontend format
    updated_frontend_roadmap = convert_ai_to_frontend_format(
        current_ai_roadmap)

    return jsonify({
        "roadmap": updated_frontend_roadmap,
        "message": f"Generated phase: {new_roadmap_part['roadmap'][0].get('phase', '')}",
        "is_complete": False
    }), 200


# --- Main Execution ---
if __name__ == '__main__':
    app.run(debug=True, port=5001)