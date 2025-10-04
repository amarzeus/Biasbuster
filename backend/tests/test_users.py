import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.user import User


def test_get_current_user(client: TestClient, db: Session):
    # Register and login user
    client.post("/auth/register", json={
        "email": "user@example.com",
        "password": "testpass123"
    })
    login_response = client.post("/auth/login", data={
        "username": "user@example.com",
        "password": "testpass123"
    })
    token = login_response.json()["access_token"]

    # Get current user
    response = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "user@example.com"


def test_get_current_user_unauthorized(client: TestClient):
    response = client.get("/users/me")
    assert response.status_code == 401


def test_get_current_user_invalid_token(client: TestClient):
    response = client.get("/users/me", headers={"Authorization": "Bearer invalid"})
    assert response.status_code == 401


def test_update_user(client: TestClient, db: Session):
    # Register and login user
    client.post("/auth/register", json={
        "email": "update@example.com",
        "password": "testpass123"
    })
    login_response = client.post("/auth/login", data={
        "username": "update@example.com",
        "password": "testpass123"
    })
    token = login_response.json()["access_token"]

    # Update user
    response = client.put("/users/me", 
                         json={"email": "updated@example.com"},
                         headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "updated@example.com"


def test_update_user_password(client: TestClient, db: Session):
    # Register and login user
    client.post("/auth/register", json={
        "email": "passupdate@example.com",
        "password": "oldpass"
    })
    login_response = client.post("/auth/login", data={
        "username": "passupdate@example.com",
        "password": "oldpass"
    })
    token = login_response.json()["access_token"]

    # Update password
    response = client.put("/users/me", 
                         json={"password": "newpass"},
                         headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

    # Try login with new password
    new_login = client.post("/auth/login", data={
        "username": "passupdate@example.com",
        "password": "newpass"
    })
    assert new_login.status_code == 200
