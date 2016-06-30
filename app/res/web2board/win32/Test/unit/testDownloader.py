import os
import time
import unittest
import urllib2
from flexmock import flexmock, flexmock_teardown

from Test.testingUtils import restore_test_resources
from libs.Downloader import Downloader
import logging

from libs.PathsManager import PathsManager


class TestDownloader(unittest.TestCase):
    def setUp(self):
        logging.basicConfig()
        logging.getLogger().setLevel(logging.DEBUG)

        self.relative_data_path = 'Downloader'
        self.data_path = os.path.join(PathsManager.TEST_SETTINGS_PATH, self.relative_data_path)
        self.downloader = Downloader(refresh_time=0.01)
        self.metaMock = flexmock(getheaders=lambda x: [1000])
        self.read_sleep = 0

        def read_mock(bytes=-1):
            if self.read_sleep is not None:
                time.sleep(self.read_sleep)
                self.read_sleep = None
                return "testing"
            return ''

        self.site_mock = flexmock(info=lambda: self.metaMock, read=read_mock)
        self.urllib2_mock = flexmock(urllib2)
        self.urlopen_mock = self.urllib2_mock.should_receive("urlopen").and_return(self.site_mock)

        restore_test_resources(self.relative_data_path)

    def tearDown(self):
        flexmock_teardown()

    def __infoCallbackMock(self, *args):
        pass

    def __finishCallbackMock(self, *args):
        pass

    def test_download_createsFileInDestinationPath(self):
        url = "url"
        dst = self.data_path + os.sep + 'testing.txt'
        self.assertFalse(os.path.exists(dst))
        self.urlopen_mock.with_args(url).at_least().times(1)

        self.downloader.download(url, dst).result()

        self.assertTrue(os.path.exists(dst))

    def test_download_callsInfoCallback(self):
        url = "url"
        dst = self.data_path + os.sep + 'testing.txt'
        self.read_sleep = 0.6
        self.urlopen_mock.with_args(url).at_least().times(1)
        flexmock(self).should_call("__infoCallbackMock") \
            .with_args(object, 1000, float).at_least().times(1)

        self.downloader.download(url, dst, info_callback=self.__infoCallbackMock).result()
