from urllib.parse import urlencode, urljoin


from src.schemas.vector_store_schema import DataCategory
from src.services.ingestion.exception import FileUnSupportedTypeException

def buildUrl(base_url, endpoint, queryParams):
    url = urljoin(base_url, endpoint)
    query = urlencode(queryParams, safe=":+")
    return f"{url}?{query}"


def get_file_type(file_name:str) -> str:
    """
    takes input file name and outputs the file extension

    Args:
        file_name (str): name of file in string.

    Raises:
        FileUnSupportedTypeException: if file doesn't have any extension

    Returns:
        str: extension of a file
    """
    parts = file_name.rsplit(".", 1) # split once from right side of string

    if len(parts)==2:
        return parts[1]
    else:
        raise FileUnSupportedTypeException(
            status_code=500,
            details={},
            message="File extension not found"
        )

def ext_to_category(ext: str) -> DataCategory:
    """
    takes the extension name as string. output **DataCategory** instance

    Args:
        ext (str): file extension

    Raises:
        FileUnSupportedTypeException: if file extension is not supported

    Returns:
        DataCategory: extension category based on **DataCategory** instance.
    """
    try:
        return DataCategory(ext.lower())
    except ValueError as err:
        raise FileUnSupportedTypeException(
            status_code=422,
            details={},
            message=f"Unsupported file type: {ext}"
        ) from err # results in traceback
