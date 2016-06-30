# coding=utf-8
import logging
import os
import shutil
import unittest
from os.path import join

import sys
from flexmock import flexmock, flexmock_teardown

from Test.testingUtils import restore_test_resources
from libs.PathsManager import PathsManager
from libs import utils

import web2boardLink as w2b_link


class TestWeb2boardLink(unittest.TestCase):
    def setUp(self):
        self.my_test_folder = join(PathsManager.TEST_SETTINGS_PATH, "Web2boardLink")
        self.original_working_dir = os.getcwd()

        PathsManager.MAIN_PATH = self.my_test_folder
        restore_test_resources("Web2boardLink")

    def tearDown(self):
        flexmock_teardown()
        os.chdir(self.original_working_dir)
        PathsManager.set_all_constants()
        logger = logging.getLogger()
        [logger.removeHandler(h) for h in logger.handlers if h.name == "linkLog"]

    def __prepare_new_path_file(self, file):
        shutil.copyfile(join(self.my_test_folder, file), join(self.my_test_folder, "web2board_path.txt"))
        os.chdir(join(self.my_test_folder, 'web2board'))

    def test_move_paths_manager_to_internal_web2board_path_module_setsUpsCwd(self):
        utils_mock = flexmock(utils)
        utils_mock.should_receive("are_we_frozen").and_return(True)
        # do not remove this
        w2b_link.move_paths_manager_to_internal_web2board_path()

        self.assertTrue(os.getcwd().endswith("web2board"))
        self.assertTrue(PathsManager.RES_PATH, join(self.my_test_folder, "web2board"))

    def test_start_logger_createsLoggerWithUtf8Path(self):
        w2b_link.web2board_path = join(self.my_test_folder, "ñ á bdfé", 'web2board')
        log_path = join(w2b_link.get_web2board_dir_path(), os.pardir, ".web2boardLink.log")
        self.assertFalse(os.path.exists(log_path))

        w2b_link.start_logger()
        w2b_link.log.info("test")

        self.assertTrue(os.path.exists(log_path))

    def test_is_factory_reset_WithArgument(self):
        if len(sys.argv) <= 1:
            sys.argv.append("")
        possible_options = [
            "factoryreset",
            "factoryReset",
            "FactoryReset",
            "FACTORYRESET",
            "--factoryreset",
            "--factoryReset",
            "--FactoryReset",
            "--FACTORYRESET"
        ]

        self.assertFalse(w2b_link.is_factory_reset())

        for opt in possible_options:
            sys.argv[1] = opt
            self.assertTrue(w2b_link.is_factory_reset())

    def test_needs_factory_reset_IsTrueIfFolderDoesNotExists(self):
        w2b_link.web2board_dir_path = join(self.my_test_folder, "do_not_exists")

        self.assertTrue(w2b_link.needs_factory_reset())

        w2b_link.get_web2board_dir_path().decode(sys.getfilesystemencoding())

    def test_get_w2b_path_useDefaultIfPathNotExists(self):
        self.__prepare_new_path_file("bad_new_path.txt")
        old_dir = w2b_link.get_web2board_dir_path()

        self.assertRaises(RuntimeError, w2b_link.set_w2b_path)

        self.assertEquals(w2b_link.get_web2board_dir_path(), old_dir)

    def test_get_w2b_path_ChangeW2bPath(self):
        self.__prepare_new_path_file("new_path.txt")

        w2b_link.set_w2b_path()

        self.assertEquals(w2b_link.get_web2board_dir_path(), "new_path")

    def test_get_w2b_path_ChangeW2bPathWithNoAsciiChars(self):
        self.__prepare_new_path_file("new_utf_8_path.txt")
        new_path = "new ñ path".decode('utf-8').encode(sys.getfilesystemencoding())

        w2b_link.set_w2b_path()


        self.assertEquals(w2b_link.get_web2board_dir_path(), new_path)
