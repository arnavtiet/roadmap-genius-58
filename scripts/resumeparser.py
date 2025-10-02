from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF
import re

app = FastAPI()

# Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Predefined skills list
SKILLS = [
    "Python", "C++", "Java", "JavaScript", "React", "Node.js", "Express.js", "MongoDB",
    "SQL", "R", "Matlab", "Git", "Docker", "Kubernetes", "AWS", "HTML", "CSS",
    "Machine Learning", "Deep Learning", "NLP", "TensorFlow", "PyTorch", "Scikit-learn",
    "Pandas", "NumPy", "Matplotlib", "Seaborn", "Data Analysis", "Computer Vision"
]

def extract_text_from_pdf(file_bytes):
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text("text")
    return text

def extract_skills(text):
    found = []
    text_lower = text.lower()
    for skill in SKILLS:
        if re.search(r'\b' + re.escape(skill.lower()) + r'\b', text_lower):
            found.append(skill)
    return list(set(found))

@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):
    file_bytes = await file.read()
    text = extract_text_from_pdf(file_bytes)
    skills = extract_skills(text)
    return {"skills": skills}
