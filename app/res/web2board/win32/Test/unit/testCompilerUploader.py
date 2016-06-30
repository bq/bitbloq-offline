import unittest

from flexmock import flexmock, flexmock_teardown

from libs import CompilerUploader
from libs.LoggingUtils import init_logging

log = init_logging(__name__)


class TestCompilerUploader(unittest.TestCase):

    def setUp(self):
        self.compiler = CompilerUploader.CompilerUploader.construct()
        self.platformio_run_mock = flexmock(CompilerUploader)

    def tearDown(self):
        flexmock_teardown()

    def test_parse_error_getsFileLineColumnAnErrorIfErrorExists(self):
        error_message = """"main.ino: In function 'int sum(int, int)':
main.ino:9:14: error: invalid conversion from 'const char*' to 'int' [-fpermissive]
main.ino: In function 'int sum2()':
main.ino:14:1: error: expected ';' before '}' token
scons: *** [.pioenvs/bt328/src/tmp_ino_to.o] Error 1"""
        error_info = [[False, dict(err=error_message)]]
        self.platformio_run_mock.should_receive("platformio_run").and_return(error_info)

        result = self.compiler.compile("")
        parse_error = result[1]["err"]

        self.assertFalse(result[0])
        self.assertEqual(len(parse_error), 2)
        self.assertEqual(parse_error[0]["file"], 'main.ino')
        self.assertEqual(parse_error[0]["line"], 9)
        self.assertEqual(parse_error[0]["column"], 14)
        self.assertEqual(parse_error[0]["error"], "invalid conversion from 'const char*' to 'int' [-fpermissive]")

        self.assertEqual(parse_error[1]["file"], 'main.ino')
        self.assertEqual(parse_error[1]["line"], 14)
        self.assertEqual(parse_error[1]["column"], 1)
        self.assertEqual(parse_error[1]["error"], "expected ';' before '}' token")

    def test_parse_error_doesNotParseIfCompileSuccess(self):
        error_message = """"main.ino: In function 'int sum(int, int)':
main.ino:9:14: error: invalid conversion from 'const char*' to 'int' [-fpermissive]
main.ino: In function 'int sum2()':
main.ino:14:1: error: expected ';' before '}' token
scons: *** [.pioenvs/bt328/src/tmp_ino_to.o] Error 1"""

        error_info = [[True, dict(err=error_message)]]
        self.platformio_run_mock.should_receive("platformio_run").and_return(error_info)

        result = self.compiler.compile("")

        self.assertTrue(result[0])
        self.assertIsInstance(result[1]["err"], str)

    def test_parse_error_returnsRawErrorIfUnableToParse(self):
        error_message = "this is a non parsable text"

        error_info = [[False, dict(err=error_message)]]
        self.platformio_run_mock.should_receive("platformio_run").and_return(error_info)

        result = self.compiler.compile("")

        self.assertFalse(result[0])
        self.assertEqual(result[1]["err"], error_message)

    def test_parse_error_getsErrorDataIfReferenceError(self):
        error_message = """".pioenvs/bt328/libFrameworkArduino.a(main.o): In function `main':
/home/startic/repos/web2board/src/res/platformioWorkSpace/.pioenvs/bt328/FrameworkArduino/main.cpp:37: undefined reference to `setup'
/home/startic/repos/web2board/src/res/platformioWorkSpace/.pioenvs/bt328/FrameworkArduino/main.cpp:47: undefined reference to `loop'
collect2: error: ld returned 1 exit status
scons: *** [.pioenvs/bt328/firmware.elf] Error 1"""

        error_info = [[False, dict(err=error_message)]]
        self.platformio_run_mock.should_receive("platformio_run").and_return(error_info)

        result = self.compiler.compile("")
        parse_error = result[1]["err"]

        self.assertFalse(result[0])
        self.assertEqual(len(parse_error), 2)
        self.assertIn("main.cpp", parse_error[0]["file"])
        self.assertEqual(parse_error[0]["error"], 'undefined reference to `setup\'')

        self.assertIn("main.cpp", parse_error[1]["file"])
        self.assertEqual(parse_error[1]["error"], 'undefined reference to `loop\'')
