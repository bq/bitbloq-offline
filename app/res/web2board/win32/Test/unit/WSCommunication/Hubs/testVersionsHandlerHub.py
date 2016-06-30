import unittest

import sys
from concurrent.futures import Future
from wshubsapi.hubs_inspector import HubsInspector

from Test.testingUtils import restore_test_resources, create_compiler_uploader_mock, create_sender_mock
from libs.Version import Version
from libs.WSCommunication.Hubs.VersionsHandlerHub import VersionsHandlerHub

# do not remove
import libs.WSCommunication.Hubs

from flexmock import flexmock, flexmock_teardown

class TestVersionsHandlerHub(unittest.TestCase):
    def setUp(self):
        HubsInspector.inspect_implemented_hubs(force_reconstruction=True)
        Version.read_version_values()
        self.versionsHandlerHub = HubsInspector.get_hub_instance(VersionsHandlerHub)
        """ :type : VersionsHandlerHub"""
        self.libUpdater = self.versionsHandlerHub.lib_updater
        self.updater = self.versionsHandlerHub.w2b_updater
        self.sender = create_sender_mock()

        self.compileUploaderMock, self.CompileUploaderConstructorMock = create_compiler_uploader_mock()
        self.testLibVersion = "1.1.1"

        restore_test_resources()

    def tearDown(self):
        flexmock_teardown()

    def test_getVersion_returnsAVersionStringFormat(self):
        version = self.versionsHandlerHub.get_version()

        self.assertRegexpMatches(version, '^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$')

    def test_setLibVersion_doesNotDownloadLibsIfHasRightVersion(self):
        flexmock(self.libUpdater, is_necessary_to_update=lambda **kwargs: False).should_receive("update").never()
        self.libUpdater.current_version_info.version = self.testLibVersion

        self.versionsHandlerHub.set_lib_version(self.testLibVersion)

    def test_setLibVersion_DownloadsLibsIfHasNotTheRightVersion(self):
        Version.bitbloq_libs = "0.0.1"
        self.libUpdater = flexmock(self.libUpdater).should_receive("update").once()

        self.versionsHandlerHub.set_lib_version(self.testLibVersion)

    def test_setLibVersion_returnsTrue(self):
        self.libUpdater = flexmock(self.libUpdater, update=lambda x: None)
        self.versionsHandlerHub.set_lib_version(self.testLibVersion)

    def test_setWeb2boardVersion_returnsTrue(self):
        result = Future()
        result.set_result(True)
        flexmock(self.updater).should_receive("download_version").and_return(result).once()

        self.versionsHandlerHub.set_web2board_version("0.0.1")
