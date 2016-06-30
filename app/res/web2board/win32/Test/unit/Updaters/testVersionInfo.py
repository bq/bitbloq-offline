import unittest

from libs.Updaters.Updater import VersionInfo


class TestVersionInfo(unittest.TestCase):
    def _cmd(self, comparing_values, comparing_function):
        for new_version, old_version in comparing_values:
            new_v = VersionInfo(new_version)
            old_v = VersionInfo(old_version)
            comparing_function(new_v, old_v)


    def test_eq(self):
        equals = [
            ('0.0.0','0.0.0'),
            ('1.0.0','1.0.0'),
            ('1.15.0','1.15.0')
        ]
        self._cmd(equals, self.assertEqual)

    def test_ne(self):
        equals = [
            ('0.0.0','0.0.1'),
            ('1.0.0','1.2.0'),
            ('1.15.0','1.5.0')
        ]
        self._cmd(equals, self.assertNotEqual)

    def test_gt(self):
        equals = [
            ('1.0.0','0.1.1'),
            ('1.0.0','0.99.99'),
            ('1.15.0','1.14.50')
        ]
        self._cmd(equals, self.assertGreater)

    def test_ge(self):
        equals = [
            ('1.0.0','0.1.1'),
            ('1.0.0','0.99.99'),
            ('1.15.0','1.14.50'),
            ('1.15.0','1.15.0')
        ]
        self._cmd(equals, self.assertGreaterEqual)

    def test_lt(self):
        equals = [
            ('0.0.0','0.1.1'),
            ('3.99.57','4.00.00'),
            ('1.15.0','1.16.50'),
            ('1.15.0','1.15.1')
        ]
        self._cmd(equals, self.assertLess)

    def test_le(self):
        equals = [
            ('0.0.0','0.1.1'),
            ('3.99.57','4.00.00'),
            ('1.15.0','1.16.50'),
            ('1.15.0','1.15.0')
        ]
        self._cmd(equals, self.assertLessEqual)

