# snowflake_llm_example.py

from snowflake.snowpark import Session
from snowflake.ml.model import Summarize, Complete, ExtractAnswer, Sentiment
import os

# ---------------------------
# 1️⃣ Connect to Snowflake
# ---------------------------
connection_parameters = {
    "account": os.environ.get("SNOWFLAKE_ACCOUNT"),
    "user": os.environ.get("SNOWFLAKE_USER"),
    "password": os.environ.get("SNOWFLAKE_PASSWORD"),
    "warehouse": os.environ.get("SNOWFLAKE_WAREHOUSE"),
    "database": os.environ.get("SNOWFLAKE_DATABASE"),
    "schema": os.environ.get("SNOWFLAKE_SCHEMA"),
    "role": os.environ.get("SNOWFLAKE_ROLE")
}

session = Session.builder.configs(connection_parameters).create()

# ---------------------------
# 2️⃣ LLM Functions
# ---------------------------
def summarize(user_text: str):
    """Summarize input text"""
    summary = Summarize(text=user_text, session=session)
    return summary

def complete(user_text: str):
    """Generate text completions"""
    completion = Complete(
        model="snowflake-arctic",
        prompt=f"Provide 5 keywords from the following text: {user_text}",
        session=session
    )
    return completion

def extract_answer(user_text: str, question: str):
    """Extract answer to a question from the text"""
    answer = ExtractAnswer(
        from_text=user_text,
        question=question,
        session=session
    )
    return answer

def sentiment(user_text: str):
    """Analyze sentiment of the text"""
    sentiment_result = Sentiment(text=user_text, session=session)
    return sentiment_result

# ---------------------------
# 3️⃣ Example Usage
# ---------------------------
if __name__ == "__main__":
    text = """
    Snowflake recently launched native support for generative AI, enabling users to run
    LLM models directly on their data tables using simple Python or SQL calls.
    """

    print("Summary:", summarize(text))
    print("Completion:", complete(text))
    print("Answer:", extract_answer(text, "What did Snowflake launch recently?"))
    print("Sentiment:", sentiment(text))
