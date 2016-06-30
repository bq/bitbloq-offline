import unittest
from flexmock import flexmock, flexmock_teardown

from libs.WSCommunication.ConsoleMessageParser import ConsoleMessageParser


class TestConsoleMessageParserHub(unittest.TestCase):
    def setUp(self):
        self.parser = ConsoleMessageParser()

    def tearDown(self):
        flexmock_teardown()

    def __construct_messages(self, message):
        return self.parser.add_data(message.format(i=self.parser.INIT, e=self.parser.END))

    def test_add_data_returnsOneMessageIfMessageHasINITandEND(self):
        messages = self.__construct_messages("test {i}my message{e}")

        self.assertEqual(len(messages), 1)
        self.assertEqual(messages[0], "my message")

    def test_add_data_returnsManyMessages(self):
        messages = self.__construct_messages("test {i}1{e}{i}2{e}{i}3{e}extra")

        self.assertEqual(len(messages), 3)
        self.assertEqual(messages[0], "1")
        self.assertEqual(messages[1], "2")
        self.assertEqual(messages[2], "3")

    def test_add_data_concatenateExtraData(self):
        messages = self.__construct_messages("test {i}init")
        self.assertEqual(len(messages), 0)
        messages = self.__construct_messages("end{e}extra")
        self.assertEqual(len(messages), 1)
        self.assertEqual(messages[0], "initend")

    def test_add_data_ignoresCorruptedMessages(self):
        self.parser.log = flexmock(self.parser.log)
        self.parser.log.should_call("exception").once()
        messages = self.__construct_messages("test {i}1{e}__2{e}{i}3{e}extra")

        self.assertEqual(len(messages), 2)
        self.assertEqual(messages[0], "1")
        self.assertEqual(messages[1], "3")

