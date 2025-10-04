from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
import json

from ..database import get_db
from ..models.analysis import Analysis, Feedback
from ..schemas.analysis import AnalysisCreate, Analysis as AnalysisSchema, FeedbackCreate, Feedback as FeedbackSchema
from .auth import get_current_user
from ..models.user import User

router = APIRouter()


@router.post("/", response_model=AnalysisSchema)
def create_analysis(
    analysis: AnalysisCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_analysis = Analysis(
        user_id=current_user.id,
        source_text=analysis.source_text,
        result=json.dumps(analysis.result),
        sources=json.dumps(analysis.sources),
    )
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)
    return db_analysis


@router.get("/", response_model=List[AnalysisSchema])
def get_analyses(
    skip: int = 0,
    limit: int = Query(default=10, lte=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analyses = db.query(Analysis).filter(Analysis.user_id == current_user.id).offset(skip).limit(limit).all()
    return analyses


@router.post("/{analysis_id}/feedback", response_model=FeedbackSchema)
def submit_feedback(
    analysis_id: str,
    feedback: FeedbackCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_analysis = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.user_id == current_user.id).first()
    if not db_analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    db_feedback = Feedback(
        analysis_id=analysis_id,
        user_id=current_user.id,
        vote=feedback.vote
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback
