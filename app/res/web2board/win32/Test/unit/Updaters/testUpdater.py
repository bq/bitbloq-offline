import json
import os
import unittest

import shutil

from concurrent.futures import Future
from flexmock import flexmock, flexmock_teardown

from Test.testingUtils import restore_test_resources
from libs.Downloader import Downloader
from libs.PathsManager import PathsManager as pm
from libs.Updaters.Updater import Updater, VersionInfo
from libs import utils

versionTestData = {
    "version": "9.9.9",
    "file_to_download_url": "file2DownloadUrl",
    "libraries_names": ["l1"]
}

onlineVersionTestData = {
    "version": "90.90.90",
    "file_to_download_url": "file2DownloadUrl",
}


class TestUpdater(unittest.TestCase):
    ORIGINAL_DOWNLOAD_ZIP_PATH = os.path.join(pm.TEST_SETTINGS_PATH, "Updater", "bitbloqLibsV1.zip")
    COPY_DOWNLOAD_ZIP_PATH = os.path.join(pm.TEST_SETTINGS_PATH, "Updater", "copy_000.zip")

    def setUp(self):
        self.updater = Updater()
        self.updater.currentVersionInfoPath = os.path.join(pm.TEST_SETTINGS_PATH, "Updater", "currentVersion.version")
        self.updater.onlineVersionUrl = "onlineVersionUrl"
        self.updater.destination_path = os.path.join(pm.TEST_SETTINGS_PATH, "Updater", "destinationPath")

        def download(*args):
            f = Future()
            f.set_result(None)
            return f
        self.updater.downloader = flexmock(Downloader(), download=download)

        restore_test_resources()
        self.zipToClearPath = None

    def tearDown(self):
        flexmock_teardown()

        for libraryName in versionTestData["libraries_names"]:
            if os.path.exists(self.updater.destination_path + os.sep + libraryName):
                shutil.rmtree(self.updater.destination_path + os.sep + libraryName)
        if os.path.exists(self.COPY_DOWNLOAD_ZIP_PATH):
            os.remove(self.COPY_DOWNLOAD_ZIP_PATH)

        if os.path.exists(self.updater.destination_path):
            shutil.rmtree(self.updater.destination_path)

    @staticmethod
    def __getMockForGetDataFromUrl(returnValue=json.dumps(versionTestData)):
        return flexmock(utils).should_receive("get_data_from_url").and_return(returnValue)

    def __getMockForDownloadFile(self):
        shutil.copy2(self.ORIGINAL_DOWNLOAD_ZIP_PATH, self.COPY_DOWNLOAD_ZIP_PATH)
        return flexmock(utils).should_receive("download_file").and_return(self.COPY_DOWNLOAD_ZIP_PATH)

    @staticmethod
    def __getMockForExtractZip():
        return flexmock(utils).should_receive("extract_zip")


    def test_isNecessaryToUpdate_raiseExceptionIfCurrentVersionIsNone(self):
        self.updater.onlineVersionInfo = VersionInfo(**onlineVersionTestData)

        with self.assertRaises(Exception):
            self.updater.is_necessary_to_update()

    def test_isNecessaryToUpdate_returnsTrueIfVersionsAreDifferent(self):
        self.updater.current_version_info = VersionInfo(**versionTestData)
        self.updater.onlineVersionInfo = VersionInfo(**onlineVersionTestData)
        self.updater.current_version_info.version = "0.1.1"

        self.assertTrue(self.updater.is_necessary_to_update())

    def test_isNecessaryToUpdate_returnsTrueIfDestinationPathDoesNotExist(self):
        self.updater.current_version_info = VersionInfo(**versionTestData)
        self.updater.onlineVersionInfo = VersionInfo(**versionTestData)
        if os.path.exists(self.updater.destination_path):
            shutil.rmtree(self.updater.destination_path)

        self.assertTrue(self.updater.is_necessary_to_update())

    def test_isNecessaryToUpdate_returnsTrueIfVersionsAreEqualButNoLibrariesInDestinationPath(self):
        self.updater.current_version_info = VersionInfo(**versionTestData)
        self.updater.onlineVersionInfo = VersionInfo(**versionTestData)
        os.makedirs(self.updater.destination_path)

        self.assertTrue(self.updater.is_necessary_to_update())

    def test_isNecessaryToUpdate_returnsTrueIfVersionsAreEqualAndLibrariesInDestinationPath(self):
        self.updater.current_version_info = VersionInfo(**versionTestData)
        self.updater.onlineVersionInfo = VersionInfo(**versionTestData)
        for libraryName in versionTestData["libraries_names"]:
            if not os.path.exists(self.updater.destination_path + os.sep + libraryName):
                os.makedirs(self.updater.destination_path + os.sep + libraryName)

        self.assertFalse(self.updater.is_necessary_to_update())