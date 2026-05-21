"""Unit tests for src/utils/helpers.py — pure functions, no I/O."""

import pytest

from src.schemas.vector_store_schema import DataCategory
from src.services.ingestion.exception import FileUnSupportedTypeException
from src.utils.helpers import buildUrl, ext_to_category, get_file_type


class TestBuildUrl:
    def test_joins_base_and_endpoint_with_query(self):
        url = buildUrl("https://api.example.com", "/v1/items", {"page": 2, "size": 10})
        assert url == "https://api.example.com/v1/items?page=2&size=10"

    def test_empty_query_params_still_emits_question_mark(self):
        # urlencode({}) -> ""; current implementation appends "?" unconditionally.
        url = buildUrl("https://api.example.com", "/health", {})
        assert url == "https://api.example.com/health?"

    def test_preserves_colon_and_plus_in_values(self):
        url = buildUrl("https://x.io", "/q", {"time": "12:30+05:45"})
        assert "time=12:30+05:45" in url

    def test_urlencodes_unsafe_characters(self):
        url = buildUrl("https://x.io", "/q", {"name": "a b&c"})
        assert "name=a+b%26c" in url


class TestGetFileType:
    @pytest.mark.parametrize(
        "filename,expected",
        [
            ("report.pdf", "pdf"),
            ("notes.txt", "txt"),
            ("data.CSV", "CSV"),  # case preserved — ext_to_category handles lowercasing
            ("archive.tar.gz", "gz"),  # only the last extension
            ("with spaces.pdf", "pdf"),
        ],
    )
    def test_returns_extension_after_last_dot(self, filename, expected):
        assert get_file_type(filename) == expected

    def test_raises_when_no_extension(self):
        with pytest.raises(FileUnSupportedTypeException) as exc_info:
            get_file_type("README")
        assert exc_info.value.status_code == 500
        assert "extension not found" in exc_info.value.message.lower()


class TestExtToCategory:
    @pytest.mark.parametrize(
        "ext,expected",
        [
            ("pdf", DataCategory.PDF),
            ("PDF", DataCategory.PDF),
            ("txt", DataCategory.TEXT),
            ("TXT", DataCategory.TEXT),
            ("csv", DataCategory.CSV),
            ("Csv", DataCategory.CSV),
        ],
    )
    def test_maps_known_extensions(self, ext, expected):
        assert ext_to_category(ext) is expected

    def test_raises_on_unsupported_extension(self):
        with pytest.raises(FileUnSupportedTypeException) as exc_info:
            ext_to_category("docx")
        assert exc_info.value.status_code == 422
        assert "docx" in exc_info.value.message

    def test_unsupported_exception_chains_value_error(self):
        with pytest.raises(FileUnSupportedTypeException) as exc_info:
            ext_to_category("xlsx")
        assert isinstance(exc_info.value.__cause__, ValueError)
