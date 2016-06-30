import os

import shutil
from flexmock import flexmock

from libs import utils
from libs.CompilerUploader import CompilerUploader
from libs.PathsManager import PathsManager

__original_pathManagerDict = {x: y for x, y in PathsManager.__dict__.items()}


def restore_test_resources(relative_path=""):
    settings_path = os.path.join(PathsManager.TEST_SETTINGS_PATH, relative_path)
    res_path = os.path.join(PathsManager.TEST_RES_PATH, relative_path)
    if os.path.exists(PathsManager.TEST_SETTINGS_PATH):
        utils.remove_folder(PathsManager.TEST_SETTINGS_PATH)
    os.makedirs(settings_path)
    if os.path.isdir(res_path):
        utils.copytree(res_path, settings_path, ignore=".pioenvs", force_copy=True)


def create_compiler_uploader_mock():
    compileUploaderMock = flexmock(CompilerUploader(),
                                   compile=lambda *args: [True, None],
                                   get_port="PORT")
    CompileUploaderConstructorMock = flexmock(CompilerUploader,
                                              construct=lambda *args: compileUploaderMock)

    return compileUploaderMock, CompileUploaderConstructorMock


def create_sender_mock():
    class Sender:
        def __init__(self):
            self.is_compiling = lambda: None
            self.is_uploading = lambda x: None
            self.ID = None

    return flexmock(Sender(), ID="testID")


def restore_paths():
    PathsManager.__dict__ = {x: y for x, y in __original_pathManagerDict.items()}
