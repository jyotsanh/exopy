# standard library
import datetime

# third-party
import aiohttp
from aiohttp import ClientConnectionError, ClientResponseError, InvalidUrlClientError
from fastapi import UploadFile

from src.core.cloud.base import BaseCloudStorage
from src.core.preprocessing import (
    ChunkingDispatcher,
    CleaningDispatcher,
    EmbeddingDispatcher,
)

# application
from src.core.vector_store.base import BaseVectorStore

# configs
from src.config import logger, settings

# schema
from src.schemas.vector_store_schema import Config, DataCategory, FileMetadataModel

# utility
from src.utils.helpers import buildUrl, ext_to_category, get_file_type

class FileProcessingService:

    def __init__(
            self,
            vector_store:BaseVectorStore,
            cloud_storage:BaseCloudStorage,
            config: Config
        ):
        self.vector_store = vector_store
        self.cloud_storage = cloud_storage
        self.config = config


    async def get_branch_details_from_org_id(self)-> str:
        """
        This function is use to fetch the client openai key, from **database**.
        In case api key is **missing** it return fallback openai key.

        Returns:
            str: openai api key
        """
        base_url = settings.EXOPY_DASHBOARD_URL
        endpoint = f"/api/bot/get-bot/{self.config.organization_id}"
        query_params = {}
        if self.config.branch_id:
            query_params["branch"] = self.config.branch_id
        if self.config.region_id:
            query_params["region"] = self.config.region_id

        url = buildUrl(base_url, endpoint, query_params)
        headers = {
        "apikey": settings.EXOPY_DASHBOARD_KEY,
            "Content-Type": "application/json"
        }
        try:
            async with aiohttp.ClientSession() as session, session.get(
                url=url,
                headers=headers,
            ) as response:
                response.raise_for_status()
                details:dict = await response.json()

                if "data" in details and details.get('data'):
                    openApi:dict = details.get('data', {})
                    openai_api_key = openApi.get('apiKey')
                    if not openai_api_key:
                        logger.info("[DEBUG] - no openai key found, using fallback key")
                        logger.info(f"details found through api: {details}")
                        return settings.FALLBACK_OPENAI_API_KEY

                    return openai_api_key

                return settings.FALLBACK_OPENAI_API_KEY

        except ClientResponseError as e:
            logger.error(f"`branch details` error {e}")
            return settings.FALLBACK_OPENAI_API_KEY

        except InvalidUrlClientError as error:
            logger.error(f"`InvalidUrlClientError ` url: {url}")
            return settings.FALLBACK_OPENAI_API_KEY

        except ClientConnectionError:
            return settings.FALLBACK_OPENAI_API_KEY


    async def process_files(self, files:list[UploadFile]) -> list[FileMetadataModel]:
        """
        process each uploaded file into following steps:
            1.clean
            2.chunk
            3.embed + upsert
            4.cloud storage upload

        Args:
            files (list[UploadFile]): list of uploaded files
        """
        client_openai_key = None
        file_metadata_lis = []

        for file in files:
            file_ext = get_file_type(
                file_name=file.filename
            )
            data_category = ext_to_category(ext=file_ext)
            logger.info(f"processing file: {file.filename}")
            if data_category == DataCategory.TEXT: # fetch key only for text documents
                client_openai_key = await self.get_branch_details_from_org_id()

            # 1.clean
            cleaning_inst = CleaningDispatcher.dispatch(data_category)
            document_raw_text = await cleaning_inst.clean(file)
            logger.info(f"file cleaning successful: {file.filename}")

            # 2.chunk
            chunking_inst = ChunkingDispatcher.dispatch(data_category)
            documents_chunk_list = await chunking_inst.chunk(
                    file_text=document_raw_text,
                    openai_api_key=client_openai_key,
                    config=self.config,
                    use_agentic_chunking=False, # no need for agentic chunking
                )
            logger.info(f"file chunking successful: {file.filename}")

            # 3.embed + upsert
            embed_inst = EmbeddingDispatcher.dispatch(data_category)
            await embed_inst.upsert(
                documents=documents_chunk_list,
                vector_store=self.vector_store,
                config=self.config
            )
            logger.info(f"file embed & vector_store upload successful: {file.filename}")

            # TODO: cloud upload s3 bucket upload method.
            # TODO: __str__ for cloud_storage_inst for better logging.
            cloud_storage_url, unique_file_name =  await self.cloud_storage.upload(
                uploaded_file=file,
                organization_id=self.config.organization_id,
            )
            logger.info(f"file upload to {self.cloud_storage} successful: {file.filename}")

            file_metadata_lis.append(
                FileMetadataModel(
                    filename=unique_file_name,
                    original_filename=file.filename,
                    content_type=file.content_type,
                    cloud_storage_url=cloud_storage_url,
                    upload_date=datetime.datetime.now(datetime.UTC),
                )
            )
        return file_metadata_lis
