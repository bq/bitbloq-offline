import os
import sys
import unittest

from flexmock import flexmock, flexmock_teardown

from Test.testingUtils import restore_test_resources, restore_paths
from libs.PathsManager import PathsManager as pm
from libs.Updaters.Web2boardUpdater import Web2BoardUpdater, UpdaterError


class TestWeb2boardUpdater(unittest.TestCase):
    def setUp(self):
        relative_data_path = os.path.join("Updater", "Web2boardUpdater")
        self.test_data_path = os.path.join(pm.TEST_SETTINGS_PATH, relative_data_path)
        self.main_path = os.path.join(self.test_data_path, "main")
        self.updater = Web2BoardUpdater()
        self.os_mock = flexmock(os, popen=lambda x: None)
        self.exit_mock = flexmock(sys, exit=lambda x: None)
        restore_test_resources(relative_data_path)
        pm.get_dst_path_for_update = classmethod(lambda cls, v: self.main_path + os.sep + "_" + v)
        pm.PROGRAM_PATH = os.path.join(self.test_data_path, 'programPath')

    def tearDown(self):
        flexmock_teardown()
        restore_paths()

    def test_update_updatesFilesInProgramPath(self):
        self.assertFalse(os.path.isdir(pm.PROGRAM_PATH))

        self.updater.update("0", pm.PROGRAM_PATH).result()

        self.assertTrue(os.path.isfile(pm.PROGRAM_PATH + os.sep + 'readme'))

    def test_update_removesOriginalFiles(self):
        pm.PROGRAM_PATH = os.path.join(self.test_data_path, 'otherProgramPath')
        self.assertTrue(os.path.isfile(pm.PROGRAM_PATH + os.sep + 'new'))

        self.updater.update("0", pm.PROGRAM_PATH).result()

        self.assertTrue(os.path.isfile(pm.PROGRAM_PATH + os.sep + 'readme'))
        self.assertFalse(os.path.isfile(pm.PROGRAM_PATH + os.sep + 'new'))

    def test_update_raiseExceptionIfNoConfirmFile(self):
        with self.assertRaises(UpdaterError):
            self.updater.update("1", pm.PROGRAM_PATH).result()

        self.assertFalse(os.path.isdir(pm.PROGRAM_PATH))

    def test_get_new_download_version__returnsVersionIfOnlyOneConfirm(self):
        self.assertEqual(self.updater.get_new_downloaded_version(), "0")

    def test_get_new_download_version__returnsNewerVersion(self):
        versions = ["3.0.1", "3.0.0", "2.99.1"]
        for v in versions:
            with open(pm.get_dst_path_for_update(v) + ".confirm", "w"):
                pass

        self.assertEqual(self.updater.get_new_downloaded_version(), versions[0])

    def test_get_new_download_version__returnsNoneIfNoConfirm(self):
        os.remove(pm.get_dst_path_for_update("0") + ".confirm")

        self.assertIsNone(self.updater.get_new_downloaded_version())

    def test_clear_new_versions_removesAllVersionsFiles(self):
        self.updater.clear_new_versions()

        files = os.listdir(self.main_path)
        self.assertEqual(len(files), 1)
        self.assertEqual(files[0], "readme")
