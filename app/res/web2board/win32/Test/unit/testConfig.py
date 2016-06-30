import json
import os
import unittest
import logging
from flexmock import flexmock_teardown

from Test.testingUtils import restore_test_resources, restore_paths
from libs.PathsManager import PathsManager
from libs.Config import Config


class TestConfig(unittest.TestCase):
    def setUp(self):
        self.myTestFolder = os.path.join(PathsManager.TEST_SETTINGS_PATH, "Config")
        self.originalConfigDict = Config.get_config_values()
        restore_test_resources()

    def tearDown(self):
        restore_paths()
        flexmock_teardown()
        Config.__dict__.update({x: y for x, y in self.originalConfigDict.items()})

    def test_readConfigFile_changesConfigParameters(self):
        PathsManager.CONFIG_PATH = os.path.join(self.myTestFolder, "testConfig.json")
        Config.read_config_file()

        self.assertEqual(Config.log_level, logging.DEBUG)

    def test_readConfigFile_catchesErrorIfCorruptedFile(self):
        PathsManager.CONFIG_PATH = os.path.join(self.myTestFolder, "testConfigCorrupted.json")

        try:
            Config.read_config_file()
        except:
            self.fail("Exception not catched")

    def test_readConfigFile_ConfigNotChangedIfCorruptedFile(self):
        PathsManager.CONFIG_PATH = os.path.join(self.myTestFolder, "testConfigCorrupted.json")

        Config.read_config_file()

        for k, v in Config.get_config_values().items():
            self.assertEqual(self.originalConfigDict[k], v)

    def test_storeConfigInFile_createsNewFileIfNotExists(self):
        PathsManager.CONFIG_PATH = os.path.join(self.myTestFolder, "newConfig.json")
        self.assertFalse(os.path.exists(PathsManager.CONFIG_PATH))

        Config.store_config_in_file()

        self.assertTrue(os.path.exists(PathsManager.CONFIG_PATH))

    def test_storeConfigInFile_overWriteFileIfExist(self):
        PathsManager.CONFIG_PATH = os.path.join(self.myTestFolder, "newConfig.json")
        with open(PathsManager.CONFIG_PATH, "w") as f:
            f.write("Testing")

        Config.store_config_in_file()

        with open(PathsManager.CONFIG_PATH) as f:
            self.assertNotEqual(f.read(), "Testing")

    def test_storeConfigInFile_createsAJsonWithAllConfigValues(self):
        PathsManager.CONFIG_PATH = os.path.join(self.myTestFolder, "newConfig.json")

        Config.store_config_in_file()

        with open(PathsManager.CONFIG_PATH) as f:
            obj = json.load(f)

        for k, v in self.originalConfigDict.items():
            self.assertEqual(obj[k], v)