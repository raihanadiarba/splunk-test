from abc import ABC, abstractmethod
from noah_self_storage_common import NoahSelfStorageArgs, build_file_path, get_new_key


class SelfStorageHandler(ABC):
    def __init__(self, args: NoahSelfStorageArgs):
        self.storage_args = args
        self._file_path = build_file_path(
            args.index_name,
            args.local_bucket_path,
            args.dest_bucket_folder
        )

    @abstractmethod
    def decrypt_key(self) -> bytes:
        pass

    @abstractmethod
    def list_objects(self) -> list[str]:
        pass

    @abstractmethod
    def copy_file(
        self,
        src_key: str,
        dest_key: str,
        encryption_key: bytes
    ) -> None:
        pass

    def create_destination_key(self, src_key: str) -> str:
        return get_new_key(src_key, self._file_path)
