import unittest

from wshubsapi.hubs_inspector import HubsInspector
from wshubsapi.test.utils.hubs_utils import remove_hubs_subclasses

from Test.testingUtils import create_compiler_uploader_mock, create_sender_mock

# do not remove
import libs.WSCommunication.Hubs

from flexmock import flexmock, flexmock_teardown

from libs.WSCommunication.Hubs.SerialMonitorHub import SerialMonitorHub


class TestSerialMonitorHub(unittest.TestCase):
    def setUp(self):
        global subprocess
        HubsInspector.inspect_implemented_hubs(force_reconstruction=True)
        self.serialMonitorHub = flexmock(HubsInspector.get_hub_instance(SerialMonitorHub))
        """:type : flexmock"""
        self.sender = create_sender_mock()

        self.compileUploaderMock, self.CompileUploaderConstructorMock = create_compiler_uploader_mock()

    def tearDown(self):
        flexmock_teardown()
        remove_hubs_subclasses()

    def test_changeBaudrate_doesNotClosePortIfNotCreated(self):
        port = "COM4"
        baudrate = 115200
        self.serialMonitorHub.should_receive("close_connection").never()
        self.serialMonitorHub.should_receive("start_connection").with_args(port, baudrate).once()

        self.serialMonitorHub.change_baudrate(port, baudrate)

    def test_changeBaudrate_closePortIfAlreadyCreated(self):
        port = "COM4"
        baudrate = 9600
        self.serialMonitorHub.serial_connections[port] = flexmock(is_closed=lambda: False, change_baudrate=lambda *args: None)
        self.serialMonitorHub.serial_connections[port].should_receive("change_baudrate").with_args(baudrate).once()

        self.serialMonitorHub.change_baudrate(port, baudrate)

    def test_changeBaudrate_callsBaudrateChangedForSubscribed(self):
        port = "COM4"
        baudrate = 115200
        self.serialMonitorHub.should_receive("start_connection").with_args(port, baudrate).once()
        subscribedClients = flexmock(baudrate_changed=lambda p, b: None)
        clientsHolder = flexmock(self.serialMonitorHub.clients, get_subscribed_clients=lambda: subscribedClients)
        clientsHolder.get_subscribed_clients().should_receive("baudrate_changed").once()

        self.serialMonitorHub.change_baudrate(port, baudrate)
