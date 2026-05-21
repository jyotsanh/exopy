"""Unit tests for pydantic schemas — Config.collection_name is a derived value."""

import pytest

from src.schemas.cloud_store_schema import CloudStorageType
from src.schemas.vector_store_schema import (
    Config,
    IntentEnum,
    VectorStoreType,
)


class TestConfigCollectionName:
    def test_branch_id_takes_precedence_over_region(self):
        cfg = Config(
            organization_id="org42",
            region_id="region-A",
            branch_id="branch-1",
            uploaded_by="alice",
        )
        # branch_id wins when both are set
        assert cfg.collection_name == "general_info_org42_branch-1"

    def test_region_used_when_no_branch(self):
        cfg = Config(
            organization_id="org42",
            region_id="region-A",
            uploaded_by="alice",
        )
        assert cfg.collection_name == "general_info_org42_region-A"

    def test_organization_only(self):
        cfg = Config(organization_id="org42", uploaded_by="alice")
        assert cfg.collection_name == "general_info_org42"


class TestConfigDefaults:
    def test_default_values(self):
        cfg = Config(organization_id="o", uploaded_by="u")
        assert cfg.intent is IntentEnum.general
        assert cfg.vector_store is VectorStoreType.PINECONE
        assert cfg.cloud_storage is CloudStorageType.S3
        assert cfg.is_hybrid is False
        assert cfg.clear_old_documents is False
        assert cfg.old_doc_id is None

    def test_organization_id_is_required(self):
        with pytest.raises(Exception):
            Config(uploaded_by="u")  # type: ignore[call-arg]

    def test_uploaded_by_is_required(self):
        with pytest.raises(Exception):
            Config(organization_id="o")  # type: ignore[call-arg]
