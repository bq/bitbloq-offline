import os
import shutil
import unittest

import serial.tools.list_ports
from flexmock import flexmock

from Test.testingUtils import restore_test_resources
from libs import utils
from libs.PathsManager import PathsManager


class TestUtils(unittest.TestCase):
    def setUp(self):
        self.my_test_folder = os.path.join(PathsManager.TEST_SETTINGS_PATH, "testUtils")
        self.copy_tree_old = os.path.join(self.my_test_folder, "copytree_old")
        self.copy_tree_new = os.path.join(self.my_test_folder, "copytree_new")
        self.zip_path = os.path.join(self.my_test_folder, "zip.zip")
        self.zip_folder = os.path.join(self.my_test_folder, "zip")

        self.original_list_ports_comports = serial.tools.list_ports.comports
        restore_test_resources()

    def tearDown(self):
        serial.tools.list_ports.comports = self.original_list_ports_comports

        if os.path.exists(self.copy_tree_new):
            shutil.rmtree(self.copy_tree_new)
        if os.path.exists(self.zip_folder):
            shutil.rmtree(self.zip_folder)

    @unittest.skipIf(utils.are_we_frozen(), "module path returns exe path and can not be tested")
    def test_getModulePath_returnsThisModulePath(self):
        module_path = utils.get_module_path()

        self.assertIn(os.path.join("src", "Test"), module_path)

    @unittest.skipIf(utils.are_we_frozen(), "module path returns exe path and can not be tested")
    def test_getModulePath_getsUnittestPathWithPreviousFrame(self):
        import inspect
        module_path = utils.get_module_path(inspect.currentframe().f_back)

        self.assertIn("unittest", module_path)

    def __assertCopyTreeNewHasAllFiles(self):
        self.assertTrue(os.path.exists(self.copy_tree_new))
        self.assertTrue(os.path.exists(self.copy_tree_new + os.path.sep + "01.txt"))
        self.assertTrue(os.path.exists(self.copy_tree_new + os.path.sep + "02.txt"))

    def test_copytree_createsNewFolderIfNotExists(self):
        utils.copytree(self.copy_tree_old, self.copy_tree_new)

        self.__assertCopyTreeNewHasAllFiles()

    def test_copytree_worksEvenWithExistingFolder(self):
        os.mkdir(self.copy_tree_new)

        utils.copytree(self.copy_tree_old, self.copy_tree_new)

        self.__assertCopyTreeNewHasAllFiles()

    def test_copytree_doNotOverwriteExistingFiles(self):
        os.mkdir(self.copy_tree_new)
        txt_file_path = self.copy_tree_new + os.path.sep + "01.txt"
        with open(txt_file_path, "w") as f:
            f.write("01")

        utils.copytree(self.copy_tree_old, self.copy_tree_new)
        with open(txt_file_path, "r") as f:
            file_data = f.read()

        self.__assertCopyTreeNewHasAllFiles()
        self.assertEqual(file_data, "01")

    def test_listDirectoriesInPath(self):
        print self.my_test_folder
        directories = utils.list_directories_in_path(self.my_test_folder)
        directories = map(lambda x: x.lower(), directories)
        self.assertEqual(set(directories), {"copytree_old", "otherdir"})

    def test_extractZip(self):
        utils.extract_zip(self.zip_path, self.my_test_folder)

        self.assertTrue(os.path.exists(self.zip_folder))
        self.assertTrue(os.path.exists(self.zip_folder + os.sep + "zip.txt"))

    def test_listSerialPorts_useSerialLib(self):
        ports = [(1, 2, 3), (4, 5, 6)]
        flexmock(serial.tools.list_ports).should_receive("comports").and_return(ports).once()

        self.assertEqual(utils.list_serial_ports(), ports)

    def test_listSerialPorts_filterWithFunction(self):
        ports = [(1, 2, 3), (4, 5, 6)]
        flexmock(serial.tools.list_ports).should_receive("comports").and_return(ports).once()

        self.assertEqual(utils.list_serial_ports(lambda x: x[0] == 1), ports[0:1])
