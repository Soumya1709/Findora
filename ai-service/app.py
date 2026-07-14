from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

from matcher import calculate_similarity
from utils.text_builder import build_item_text

app = FastAPI(title="Findora AI Service")


class AIItem(BaseModel):
    title: str
    description: Optional[str] = ""
    category: Optional[str] = ""
    brand: Optional[str] = ""
    color: Optional[str] = ""
    location: Optional[str] = ""


class CompareRequest(BaseModel):
    item1: AIItem
    item2: AIItem


@app.get("/")
def home():
    return {
        "message": "Findora AI Running 🚀"
    }


@app.post("/compare")
def compare(data: CompareRequest):
    text1 = build_item_text(data.item1.model_dump())
    text2 = build_item_text(data.item2.model_dump())

    similarity = calculate_similarity(text1, text2)

    return {
        "similarity": round(similarity * 100, 2),
        "text1": text1,
        "text2": text2,
    }