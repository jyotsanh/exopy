"""
Integration tests for ai_backend API endpoints.

We deliberately skip the FastAPI lifespan (see conftest.py) so external services
aren't required. Tests focus on endpoints that don't need MongoDB/Pinecone/S3:
  - GET /api/v1/health
  - POST /api/v1/chat/chat (returns 501 unconditionally for now)
  - File-router auth gate (verify_api_key) — rejects requests without a valid header

Middleware behaviour (security headers, X-Process-Time) is also asserted here
since it applies to every response.
"""

from fastapi.testclient import TestClient

from src.config import settings


class TestHealthEndpoint:
    def test_returns_200_with_health_message(self, client: TestClient):
        response = client.get(f"{settings.API_V1_STR}/health")
        assert response.status_code == 200
        assert response.json() == {"message": "app is healthy!!!"}

    def test_attaches_security_headers(self, client: TestClient):
        response = client.get(f"{settings.API_V1_STR}/health")
        assert response.headers["X-Content-Type-Options"] == "nosniff"
        assert response.headers["X-Frame-Options"] == "Deny"
        assert response.headers["Referrer-Policy"] == "no-referrer"
        assert "Strict-Transport-Security" in response.headers
        assert response.headers["Content-Security-Policy"] == "frame-ancestors 'self'"

    def test_attaches_process_time_header(self, client: TestClient):
        response = client.get(f"{settings.API_V1_STR}/health")
        assert "X-Process-Time" in response.headers
        # Header value must parse as a float (seconds)
        assert float(response.headers["X-Process-Time"]) >= 0.0


class TestChatEndpoint:
    """Chat is currently stubbed out — it must reject with 501."""

    def test_valid_payload_returns_501_not_implemented(self, client: TestClient):
        response = client.post(
            f"{settings.API_V1_STR}/chat/chat",
            json={"query": "hello", "sender_id": "user-1"},
        )
        assert response.status_code == 501
        assert response.json() == {"detail": "Not Implemented"}

    def test_missing_required_fields_returns_422(self, client: TestClient):
        response = client.post(f"{settings.API_V1_STR}/chat/chat", json={})
        assert response.status_code == 422
        body = response.json()
        # Our validation_exception_handler returns {"error": ..., "details": [...]}
        assert body["error"] == "Validation failed"
        missing_fields = {err["loc"][-1] for err in body["details"]}
        assert {"query", "sender_id"}.issubset(missing_fields)

    def test_wrong_method_returns_405(self, client: TestClient):
        response = client.get(f"{settings.API_V1_STR}/chat/chat")
        assert response.status_code == 405


class TestFileRouterAuth:
    """All routes under /file require a valid `apikey` header via verify_api_key."""

    def test_missing_apikey_header_is_unauthorized(self, client: TestClient):
        response = client.get(
            f"{settings.API_V1_STR}/file/vectordb/similarity/search",
            params={"query": "hi", "organization_id": "o"},
        )
        assert response.status_code == 401
        assert response.json() == {"detail": "Invalid or missing API key"}

    def test_wrong_apikey_is_unauthorized(self, client: TestClient):
        response = client.get(
            f"{settings.API_V1_STR}/file/vectordb/similarity/search",
            params={"query": "hi", "organization_id": "o"},
            headers={"apikey": "definitely-not-the-key"},
        )
        assert response.status_code == 401

    def test_delete_route_also_gated(self, client: TestClient):
        response = client.delete(f"{settings.API_V1_STR}/file/vectordb/delete/abc")
        assert response.status_code == 401


class TestUnknownRoute:
    def test_unknown_path_returns_404(self, client: TestClient):
        response = client.get("/this/route/does/not/exist")
        assert response.status_code == 404
