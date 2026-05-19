from .base import BaseCloudStorage


class GCPCloudStorage(BaseCloudStorage):

    async def upload(self): ...


    async def delete(self): ...
