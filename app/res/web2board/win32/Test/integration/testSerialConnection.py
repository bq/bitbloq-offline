import unittest

from serial.serialutil import SerialException

from libs.WSCommunication.Hubs.SerialMonitorHub import SerialConnection
from libs import utils


class TestSerialConnection(unittest.TestCase):

    @unittest.skip("test not working")
    def test_construct_isAbleToConnectToSerialPort(self):
        port = utils.list_serial_ports()[0][0]
        try:
            self.serialConnection = SerialConnection(port, 9600, lambda *args: None)
        except SerialException as e:
            self.fail("unable to connect to port: {0} due to: {1}".format(port, e))
