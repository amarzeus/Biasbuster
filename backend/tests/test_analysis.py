import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
import json


def test_create_analysis(client: TestClient, db: Session):
    # Register and login user
    client.post("/auth/register", json={
        "email": "analysis@example.com",
        "password": "testpass123"
    })
    login_response = client.post("/auth/login", data={
        "username": "analysis@example.com",
        "password": "testpass123"
    })
    token = login_response.json()["access_token"]

    # Create analysis
    analysis_data = {
        "source_text": "This is a test text for bias analysis.",
        "result": {"bias_score": 0.5, "findings": ["Some bias detected"]},
        "sources": ["source1", "source2"]
    }
    response = client.post("/analyses/", 
                          json=analysis_data,
                          headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["source_text"] == analysis_data["source_text"]
    assert "id" in data
    assert "created_at" in data


def test_get_analyses(client: TestClient, db: Session):
    # Register and login user
    client.post("/auth/register", json={
        "email": "getanalysis@example.com",
        "password": "testpass123"
    })
    login_response = client.post("/auth/login", data={
        "username": "getanalysis@example.com",
        "password": "testpass123"
    })
    token = login_response.json()["access_token"]

    # Create multiple analyses
    for i in range(3):
        analysis_data = {
            "source_text": f"Test text {i}",
            "result": {"bias_score": 0.1 * i},
            "sources": [f"source{i}"]
        }
        client.post("/analyses/", 
                   json=analysis_data,
                   headers={"Authorization": f"Bearer {token}"})

    # Get analyses
    response = client.get("/analyses/", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3


def test_get_analyses_pagination(client: TestClient, db: Session):
    # Register and login user
    client.post("/auth/register", json={
        "email": "pagination@example.com",
        "password": "testpass123"
    })
    login_response = client.post("/auth/login", data={
        "username": "pagination@example.com",
        "password": "testpass123"
    })
    token = login_response.json()["access_token"]

    # Create 5 analyses
    for i in range(5):
        analysis_data = {
            "source_text": f"Test text {i}",
            "result": {"bias_score": 0.1 * i},
            "sources": [f"source{i}"]
        }
        client.post("/analyses/", 
                   json=analysis_data,
                   headers={"Authorization": f"Bearer {token}"})

    # Get first 2
    response = client.get("/analyses/?limit=2", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_submit_feedback(client: TestClient, db: Session):
    # Register and login user
    client.post("/auth/register", json={
        "email": "feedback@example.com",
        "password": "testpass123"
    })
    login_response = client.post("/auth/login", data={
        "username": "feedback@example.com",
        "password": "testpass123"
    })
    token = login_response.json()["access_token"]

    # Create analysis
    analysis_data = {
        "source_text": "Test text for feedback",
        "result": {"bias_score": 0.3},
        "sources": ["source1"]
    }
    create_response = client.post("/analyses/", 
                                 json=analysis_data,
                                 headers={"Authorization": f"Bearer {token}"})
    analysis_id = create_response.json()["id"]

    # Submit feedback
    feedback_data = {"vote": 1}
    response = client.post(f"/analyses/{analysis_id}/feedback",
                          json=feedback_data,
                          headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["vote"] == 1
    assert data["analysis_id"] == analysis_id


def test_submit_feedback_nonexistent_analysis(client: TestClient, db: Session):
    # Register and login user
    client.post("/auth/register", json={
        "email": "nonexistent@example.com",
        "password": "testpass123"
    })
    login_response = client.post("/auth/login", data={
        "username": "nonexistent@example.com",
        "password": "testpass123"
    })
    token = login_response.json()["access_token"]

    # Try to submit feedback for nonexistent analysis
    feedback_data = {"vote": 1}
    response = client.post("/analyses/nonexistent-id/feedback",
                          json=feedback_data,
                          headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 404
    assert "Analysis not found" in response.json()["detail"]


def test_create_analysis_unauthorized(client: TestClient):
    analysis_data = {
        "source_text": "Test text",
        "result": {"bias_score": 0.5},
        "sources": ["source1"]
    }
    response = client.post("/analyses/", json=analysis_data)
    assert response.status_code == 401
