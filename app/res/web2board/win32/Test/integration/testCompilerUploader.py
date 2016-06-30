import os
import unittest
from pprint import pprint

import click
from flexmock import flexmock, flexmock_teardown

from Test.testingUtils import restore_test_resources
from libs.CompilerUploader import CompilerUploader, CompilerException
from libs.LoggingUtils import init_logging
from libs.PathsManager import PathsManager as pm
from libs.utils import is_windows, is_linux, is_mac

log = init_logging(__name__)


class TestCompilerUploader(unittest.TestCase):
    platform_to_use = None
    portToUse = None

    @classmethod
    def setUpClass(cls):
        if cls.portToUse is None:
            try:
                cls.portToUse = CompilerUploader.construct(cls.__get_platform_to_use()).get_port()
            except:
                cls.portToUse = -1
        cls.platform_to_use = cls.__get_platform_to_use()
        log.info("""\n\n
        #######################################
        Remember to connect a {} board
        #######################################\n""".format(cls.platform_to_use))

        def click_confirm(message):
            print message
            return True

        click.confirm = click_confirm

    @classmethod
    def __get_platform_to_use(cls):
        board = os.environ.get("platformioBoard", None)
        if board is None:
            raise Exception("No board defined")
        return board

    def setUp(self):
        self.platformio_path = pm.PLATFORMIO_WORKSPACE_SKELETON
        self.hex_file_path = os.path.join(pm.TEST_SETTINGS_PATH, "CompilerUploader", "hex.hex")
        self.src_copy_path = os.path.join(pm.TEST_SETTINGS_PATH, "CompilerUploader", "srcCopy")
        self.working_cpp_path = os.path.join(self.src_copy_path, "working.ino")
        self.working_pre_compiler_cpp_path = os.path.join(self.src_copy_path, "precompiller.ino")
        self.not_working_cpp_path = os.path.join(self.src_copy_path, "notWorking.ino")
        self.with_libraries_cpp_path = os.path.join(self.src_copy_path, "withLibraries.ino")
        self.connected_board = self.platform_to_use
        self.compiler = CompilerUploader.construct(self.__get_platform_to_use())

        restore_test_resources()

    def tearDown(self):
        flexmock_teardown()

    def test_getPort_raisesExceptionIfBoardNotSet(self):
        self.compiler.board = None
        self.assertRaises(CompilerException, self.compiler.get_port)

    def test_getPort_raiseExceptionIfNotReturningPort(self):
        self.compiler = flexmock(self.compiler, _search_board_port=lambda: None)

        self.compiler.set_board('uno')

        self.assertRaises(CompilerException, self.compiler.get_port)

    def test_getPort_raiseExceptionIfNotAvailablePort(self):
        self.compiler = flexmock(self.compiler, get_available_ports=lambda: [])

        self.compiler.set_board('uno')

        self.assertRaises(CompilerException, self.compiler.get_port)

    def test_getPort_returnPortIfSearchPortsReturnsOnePort(self):
        self.compiler = flexmock(self.compiler, _search_board_port=lambda: 1)
        self.compiler.set_board('uno')

        port = self.compiler.get_port()

        self.assertEqual(port, 1)

    def __assertRightPortName(self, port):
        if is_windows():
            self.assertTrue(port.startswith("COM"))
        elif is_linux():
            self.assertTrue(port.startswith("/dev/tty"))
        elif is_mac():
            self.assertTrue(port.startswith("/dev/"))

    def test_getPort_returnsBoardConnectedBoard(self):
        self.compiler.set_board(self.connected_board)

        port = self.compiler.get_port()

        self.__assertRightPortName(port)

    def test_compile_raisesExceptionIfBoardIsNotSet(self):
        self.compiler.board = None
        with open(self.working_cpp_path) as f:
            workingCpp = f.read()

        self.assertRaises(CompilerException, self.compiler.compile, workingCpp)

    def test_compile_compilesSuccessfullyWithWorkingCpp(self):
        self.compiler.set_board(self.connected_board)
        with open(self.working_cpp_path) as f:
            workingCpp = f.read()

        compile_result = self.compiler.compile(workingCpp)

        self.assertTrue(compile_result[0])

    def test_compile_compilesSuccessfullyWithLibraries(self):
        self.compiler.set_board(self.connected_board)
        with open(self.with_libraries_cpp_path) as f:
            with_libraries_cpp = f.read()

        compile_result = self.compiler.compile(with_libraries_cpp)
        pprint(compile_result)
        self.assertTrue(compile_result[0])

    def test_compile_resultErrorIsFalseUsingNotWorkingCpp(self):
        self.compiler.set_board(self.connected_board)
        with open(self.not_working_cpp_path) as f:
            not_working_cpp = f.read()

        compile_result = self.compiler.compile(not_working_cpp)
        pprint(compile_result)
        print compile_result[1]['err']
        self.assertFalse(compile_result[0])

    def test_compile_worksWithArduinoPreCompiler(self):
        self.compiler.set_board(self.connected_board)
        with open(self.working_pre_compiler_cpp_path) as f:
            working_pre_compiler_cpp = f.read()

        compile_result = self.compiler.compile(working_pre_compiler_cpp)
        pprint(compile_result)
        self.assertTrue(compile_result[0])

    def __assertPortFount(self):
        if self.portToUse == -1:
            self.assertFalse(True, "port not found, check board: {} is connected".format(self.connected_board))

    def test_upload_raisesExceptionIfBoardIsNotSet(self):
        self.__assertPortFount()
        self.compiler.board = None
        with open(self.working_cpp_path) as f:
            workingCpp = f.read()

        self.assertRaises(CompilerException, self.compiler.upload, workingCpp, upload_port=self.portToUse)

    def test_upload_compilesSuccessfullyWithWorkingCpp(self):
        self.__assertPortFount()
        self.compiler.set_board(self.connected_board)
        with open(self.working_cpp_path) as f:
            workingCpp = f.read()

        uploadResult = self.compiler.upload(workingCpp, upload_port=self.portToUse)

        pprint(uploadResult)
        self.assertTrue(uploadResult[0])

    def test_upload_resultErrorIsFalseUsingNotWorkingCpp(self):
        self.__assertPortFount()
        self.compiler.set_board(self.connected_board)
        with open(self.not_working_cpp_path) as f:
            notWorkingCpp = f.read()

        uploadResult = self.compiler.upload(notWorkingCpp, upload_port=self.portToUse)

        pprint(uploadResult)
        self.assertFalse(uploadResult[0])

    def test_uploadAvrHex_returnsOkResultWithWorkingHexFile(self):
        self.__assertPortFount()
        self.compiler.set_board(self.connected_board)
        path = os.path.relpath(self.hex_file_path, os.getcwd())
        result = self.compiler.upload_avr_hex(path, upload_port=self.portToUse)
        print(result[1])
        self.assertTrue(result[0])

    def test_uploadAvrHex_returnsBadResultWithNonExistingFile(self):
        self.__assertPortFount()
        self.compiler.set_board(self.connected_board)

        result = self.compiler.upload_avr_hex("notExistingFile", upload_port=self.portToUse)

        self.assertFalse(result[0])

