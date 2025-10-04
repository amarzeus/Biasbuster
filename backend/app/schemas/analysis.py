from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime


class AnalysisBase(BaseModel):
    source_text: str
    result: Dict[str, Any]
    sources: List[Dict[str, Any]]


class AnalysisCreate(AnalysisBase):
    pass


class Analysis(AnalysisBase):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        orm_mode = True


class FeedbackBase(BaseModel):
    vote: str  # "up" or "down"


class FeedbackCreate(FeedbackBase):
    pass


class Feedback(FeedbackBase):
    id: str
    analysis_id: str
    user_id: str
    created_at: datetime

    class Config:
        orm_mode = True
