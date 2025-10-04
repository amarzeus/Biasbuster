import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.database import get_db
from app.models.user import User


def test_register_user(client: TestClient, db: Session):
    response = client.post("/auth/register", json={
        "email": "test@example.com",
        "password": "testpass123"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data
    assert "created_at" in data


def test_register_duplicate_email(client: TestClient, db: Session):
    # First registration
    client.post("/auth/register", json={
        "email": "duplicate@example.com",
        "password": "testpass123"
    })
    # Second registration with same email
    response = client.post("/auth/register", json={
        "email": "duplicate@example.com",
        "password": "testpass123"
    })
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_login_success(client: TestClient, db: Session):
    # Register user first
    client.post("/auth/register", json={
        "email": "login@example.com",
        "password": "testpass123"
    })
    # Login
    response = client.post("/auth/login", data={
        "username": "login@example.com",
        "password": "testpass123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client: TestClient, db: Session):
    # Register user
    client.post("/auth/register", json={
        "email": "wrongpass@example.com",
        "password": "correctpass"
    })
    # Login with wrong password
    response = client.post("/auth/login", data={
        "username": "wrongpass@example.com",
        "password": "wrongpass"
    })
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]


def test_login_nonexistent_user(client: TestClient):
    response = client.post("/auth/login", data={
        "username": "nonexistent@example.com",
        "password": "testpass"
    })
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]
