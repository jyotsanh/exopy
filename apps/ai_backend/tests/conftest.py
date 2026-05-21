"""
Shared pytest fixtures for ai_backend tests.

The FastAPI app's lifespan boots MongoDB, Redis, and the active vector store on
startup. We deliberately skip the lifespan in tests so the import-time `app`
object is usable without those services being live. Routes that depend on
`app.state.mongo_db` won't work here — those need a separate integration setup.
"""

import pytest
from fastapi.testclient import TestClient

from src.server import app


@pytest.fixture
def client() -> TestClient:
    # NOTE: not using `with TestClient(app)` because that triggers the lifespan,
    # which connects to MongoDB/Redis. Plain construction skips it.
    return TestClient(app)
