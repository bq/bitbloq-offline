# Copyright 2014-2015 Ivan Kravets <me@ikravets.com>
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
import logging
import os
import re
from imp import load_source
from multiprocessing import cpu_count
from os.path import isdir, isfile, join

import click
import sys

from libs.PathsManager import PathsManager
from platformio import app, exception, util
from platformio.app import get_state_item, set_state_item
from platformio.pkgmanager import PackageManager

log = logging.getLogger(__name__)

PLATFORM_PACKAGES = {

    "framework-arduinoavr": [
        ("Arduino Wiring-based Framework (AVR Core, 1.6)",
         "http://arduino.cc/en/Reference/HomePage")
    ],
    "framework-arduinosam": [
        ("Arduino Wiring-based Framework (SAM Core, 1.6)",
         "http://arduino.cc/en/Reference/HomePage")
    ],
    "framework-arduinoteensy": [
        ("Arduino Wiring-based Framework",
         "http://arduino.cc/en/Reference/HomePage")
    ],
    "framework-arduinomsp430": [
        ("Arduino Wiring-based Framework (MSP430 Core)",
         "http://arduino.cc/en/Reference/HomePage")
    ],
    "framework-arduinoespressif": [
        ("Arduino Wiring-based Framework (ESP8266 Core)",
         "https://github.com/esp8266/Arduino")
    ],
    "framework-energiamsp430": [
        ("Energia Wiring-based Framework (MSP430 Core)",
         "http://energia.nu/reference/")
    ],
    "framework-energiativa": [
        ("Energia Wiring-based Framework (LM4F Core)",
         "http://energia.nu/reference/")
    ],
    "framework-cmsis": [
        ("Vendor-independent hardware abstraction layer for the Cortex-M "
         "processor series",
         "http://www.arm.com/products/processors/"
         "cortex-m/cortex-microcontroller-software-interface-standard.php")
    ],
    "framework-spl": [
        ("Standard Peripheral Library for STM32 MCUs",
         "http://www.st.com"
         "/web/catalog/tools/FM147/CL1794/SC961/SS1743/PF257890")
    ],
    "framework-libopencm3": [
        ("libOpenCM3 Framework", "http://www.libopencm3.org/")
    ],
    "framework-mbed": [
        ("mbed Framework", "http://mbed.org")
    ],
    "framework-wiringpi": [
        ("GPIO Interface library for the Raspberry Pi", "http://wiringpi.com")
    ],
    "sdk-esp8266": [
        ("ESP8266 SDK", "http://bbs.espressif.com")
    ],
    "ldscripts": [
        ("Linker Scripts",
         "https://sourceware.org/binutils/docs/ld/Scripts.html")
    ],
    "toolchain-atmelavr": [
        ("avr-gcc", "https://gcc.gnu.org/wiki/avr-gcc"),
        ("GDB", "http://www.gnu.org/software/gdb/"),
        ("AVaRICE", "http://avarice.sourceforge.net/"),
        ("SimulAVR", "http://www.nongnu.org/simulavr/")
    ],
    "toolchain-gccarmnoneeabi": [
        ("gcc-arm-embedded", "https://launchpad.net/gcc-arm-embedded"),
        ("GDB", "http://www.gnu.org/software/gdb/")
    ],
    "toolchain-gccarmlinuxgnueabi": [
        ("GCC for Linux ARM GNU EABI", "https://gcc.gnu.org"),
        ("GDB", "http://www.gnu.org/software/gdb/")
    ],
    "toolchain-gccmingw32": [
        ("MinGW", "http://www.mingw.org")
    ],
    "toolchain-gcclinux32": [
        ("GCC for Linux i686", "https://gcc.gnu.org")
    ],
    "toolchain-gcclinux64": [
        ("GCC for Linux x86_64", "https://gcc.gnu.org")
    ],
    "toolchain-xtensa": [
        ("xtensa-gcc", "https://github.com/jcmvbkbc/gcc-xtensa"),
        ("GDB", "http://www.gnu.org/software/gdb/")
    ],
    "toolchain-timsp430": [
        ("msp-gcc", "http://sourceforge.net/projects/mspgcc/"),
        ("GDB", "http://www.gnu.org/software/gdb/")
    ],
    "tool-avrdude": [
        ("AVRDUDE", "http://www.nongnu.org/avrdude/")
    ],
    "tool-micronucleus": [
        ("Micronucleus", "https://github.com/micronucleus/micronucleus")
    ],
    "tool-bossac": [
        ("BOSSA CLI", "https://sourceforge.net/projects/b-o-s-s-a/")
    ],
    "tool-stlink": [
        ("ST-Link", "https://github.com/texane/stlink")
    ],
    "tool-teensy": [
        ("Teensy Loader", "https://www.pjrc.com/teensy/loader.html")
    ],
    "tool-lm4flash": [
        ("Flash Programmer", "http://www.ti.com/tool/lmflashprogrammer")
    ],
    "tool-mspdebug": [
        ("MSPDebug", "http://mspdebug.sourceforge.net/")
    ],
    "tool-esptool": [
        ("esptool-ck", "https://github.com/igrr/esptool-ck")
    ]
}


def get_packages():
    return PLATFORM_PACKAGES


class PlatformFactory(object):
    @staticmethod
    def get_clsname(type_):
        return "%s%sPlatform" % (type_.upper()[0], type_.lower()[1:])

    @staticmethod
    def load_module(type_, path):
        module = None
        try:
            module = load_source(
                "platformio.platforms.%s" % type_, path)
        except ImportError:
            raise exception.UnknownPlatform(type_)
        return module

    @classmethod
    @util.memoized
    def _lookup_platforms(cls):
        platforms = {}
        for d in (util.get_home_dir(), util.get_source_dir()):
            pdir = join(d, "platforms")
            if not isdir(pdir):
                continue
            for p in sorted(os.listdir(pdir)):
                if (p in ("__init__.py", "base.py") or not
                p.endswith(".py")):
                    continue
                type_ = p[:-3]
                path = join(pdir, p)
                try:
                    isplatform = hasattr(
                        cls.load_module(type_, path),
                        cls.get_clsname(type_)
                    )
                    if isplatform:
                        platforms[type_] = path
                except exception.UnknownPlatform:
                    pass
        return platforms

    @classmethod
    def get_platforms(cls, installed=False):
        platforms = cls._lookup_platforms()

        if not installed:
            return platforms

        installed_platforms = {}
        for type_ in get_state_item("installed_platforms", []):
            if type_ in platforms:
                installed_platforms[type_] = platforms[type_]
        return installed_platforms

    @classmethod
    def newPlatform(cls, type_):
        platforms = cls.get_platforms()
        if type_ not in platforms:
            raise exception.UnknownPlatform(type_)

        _instance = getattr(
            cls.load_module(type_, platforms[type_]),
            cls.get_clsname(type_)
        )()
        assert isinstance(_instance, BasePlatform)
        return _instance


class BasePlatform(object):
    PACKAGES = {}
    LINE_ERROR_RE = re.compile(r"(\s+error|error[:\s]+)", re.I)

    def __init__(self):
        self._found_error = False
        self._last_echo_line = None

        # 1 = errors
        # 2 = 1 + warnings
        # 3 = 2 + others
        self._verbose_level = 3

    def get_type(self):
        return self.__class__.__name__[:-8].lower()

    def get_name(self):
        return self.get_type().title()

    def get_build_script(self):
        builtin = join(util.get_source_dir(), "builder", "scripts", "%s.py" %
                       self.get_type())
        if isfile(builtin):
            return builtin
        raise NotImplementedError()

    def get_description(self):
        if self.__doc__:
            doclines = [l.strip() for l in self.__doc__.splitlines() if
                        l.strip()]
            return " ".join(doclines[:-1]).strip()
        else:
            raise NotImplementedError()

    def get_vendor_url(self):
        if self.__doc__ and "http" in self.__doc__:
            return self.__doc__[self.__doc__.index("http"):].strip()
        else:
            raise NotImplementedError()

    def is_embedded(self):
        for name, opts in self.get_packages().items():
            if name == "framework-mbed" or opts.get("alias") == "uploader":
                return True
        return False

    def get_packages(self):
        return self.PACKAGES

    def get_package_alias(self, pkgname):
        return self.PACKAGES[pkgname].get("alias")

    def pkg_aliases_to_names(self, aliases):
        names = []
        for alias in aliases:
            name = alias
            # lookup by package aliases
            for _name, _opts in self.get_packages().items():
                if _opts.get("alias") == alias:
                    name = None
                    names.append(_name)
            # if alias is the right name
            if name:
                names.append(name)
        return names

    def get_default_packages(self):
        return [k for k, v in self.get_packages().items()
                if v.get("default", False)]

    def get_installed_packages(self):
        pm = PackageManager()
        return [n for n in self.get_packages().keys() if pm.is_installed(n)]

    def install(self, with_packages=None, without_packages=None,
                skip_default_packages=False):
        with_packages = set(
            self.pkg_aliases_to_names(with_packages or []))
        without_packages = set(
            self.pkg_aliases_to_names(without_packages or []))

        upkgs = with_packages | without_packages
        ppkgs = set(self.get_packages().keys())
        if not upkgs.issubset(ppkgs):
            raise exception.UnknownPackage(", ".join(upkgs - ppkgs))

        requirements = []
        for name, opts in self.get_packages().items():
            if name in without_packages:
                continue
            elif (name in with_packages or (not skip_default_packages and
                                                opts.get("default"))):
                requirements.append(name)

        pm = PackageManager()
        for name in requirements:
            pm.install(name)

        # register installed platform
        data = get_state_item("installed_platforms", [])
        if self.get_type() not in data:
            data.append(self.get_type())
            set_state_item("installed_platforms", data)

        return len(requirements)

    def uninstall(self):
        platform = self.get_type()
        installed_platforms = PlatformFactory.get_platforms(
            installed=True).keys()

        if platform not in installed_platforms:
            raise exception.PlatformNotInstalledYet(platform)

        deppkgs = set()
        for item in installed_platforms:
            if item == platform:
                continue
            p = PlatformFactory.newPlatform(item)
            deppkgs = deppkgs.union(set(p.get_packages().keys()))

        pm = PackageManager()
        for name in self.get_packages().keys():
            if not pm.is_installed(name) or name in deppkgs:
                continue
            pm.uninstall(name)

        # unregister installed platform
        installed_platforms.remove(platform)
        set_state_item("installed_platforms", installed_platforms)

        return True

    def update(self):
        pm = PackageManager()
        for name in self.get_installed_packages():
            pm.update(name)

    def is_outdated(self):
        pm = PackageManager()
        obsolated = pm.get_outdated()
        return not set(self.get_packages().keys()).isdisjoint(set(obsolated))

    def configure_default_packages(self, envoptions, targets):
        # enbale used frameworks
        for pkg_name in self.pkg_aliases_to_names(["framework"]):
            for framework in envoptions.get("framework", "").split(","):
                framework = framework.lower().strip()
                if not framework:
                    continue
                if framework in pkg_name:
                    self.PACKAGES[pkg_name]['default'] = True

        # enable upload tools for upload targets
        if any(["upload" in t for t in targets] + ["program" in targets]):
            for _name, _opts in self.PACKAGES.iteritems():
                if _opts.get("alias") == "uploader":
                    self.PACKAGES[_name]['default'] = True
                elif "uploadlazy" in targets:
                    # skip all packages, allow only upload tools
                    self.PACKAGES[_name]['default'] = False

    def _install_default_packages(self):
        installed_platforms = PlatformFactory.get_platforms(
            installed=True).keys()

        if (self.get_type() in installed_platforms and
                    set(self.get_default_packages()) <=
                    set(self.get_installed_packages())):
            return True

        if (not app.get_setting("enable_prompts") or
                    self.get_type() in installed_platforms or
                click.confirm(
                        "The platform '%s' has not been installed yet. "
                        "Would you like to install it now?" % self.get_type())):
            return self.install()
        else:
            raise exception.PlatformNotInstalledYet(self.get_type())

    def run(self, variables, targets, verbose):
        assert isinstance(variables, list)
        assert isinstance(targets, list)

        envoptions = {}
        for v in variables:
            _name, _value = v.split("=", 1)
            envoptions[_name.lower()] = _value

        self.configure_default_packages(envoptions, targets)
        self._install_default_packages()

        self._verbose_level = int(verbose)

        if "clean" in targets:
            targets.remove("clean")
            targets.append("-c")

        if "build_script" not in envoptions:
            variables.append("BUILD_SCRIPT=%s" % self.get_build_script())

        for v in variables:
            if not v.startswith("BUILD_SCRIPT="):
                continue
            _, path = v.split("=", 1)
            if not isfile(path):
                raise exception.BuildScriptNotFound(path)

        # append aliases of the installed packages
        installed_packages = PackageManager.get_installed()
        for name, options in self.get_packages().items():
            if "alias" not in options or name not in installed_packages:
                continue
            variables.append(
                "PIOPACKAGE_%s=%s" % (options['alias'].upper(), name))

        self._found_error = False
        args = []
        try:
            args = [os.path.relpath(PathsManager.EXECUTABLE_FILE),  # [JORGE_GARCIA] modified for scons compatibility
                    "-Q",
                    "-j %d" % self.get_job_nums(),
                    "--warn=no-no-parallel-support",
                    "-f", join(util.get_source_dir(), "builder", "main.py")
                    ] + variables + targets + [PathsManager.PLATFORMIO_WORKSPACE_PATH]
            if PathsManager.EXECUTABLE_FILE.endswith(".py"):
                args = ["python"] + args
            # test that SCons is installed correctly
            # assert util.test_scons()
            log.debug("Executing: {}".format("\n".join(args)))
            result = util.exec_command(args,
                                       stdout=util.AsyncPipe(self.on_run_out),
                                       stderr=util.AsyncPipe(self.on_run_err))

        except (OSError, AssertionError) as e:
            log.exception("error running scons with \n{}".format(args))
            raise exception.SConsNotInstalledError()

        assert "returncode" in result
        # if self._found_error:
        #     result['returncode'] = 1

        if self._last_echo_line == ".":
            click.echo("")

        return result

    def on_run_out(self, line):
        self._echo_line(line, level=3)

    def on_run_err(self, line):
        is_error = self.LINE_ERROR_RE.search(line) is not None
        if is_error:
            self._found_error = True
        self._echo_line(line, level=1 if is_error else 2)

    def _echo_line(self, line, level):
        assert 1 <= level <= 3

        fg = ("red", "yellow", None)[level - 1]
        if level == 3 and "is up to date" in line:
            fg = "green"

        if level > self._verbose_level:
            click.secho(".", fg=fg, err=level < 3, nl=False)
            self._last_echo_line = "."
            return

        if self._last_echo_line == ".":
            click.echo("")
        self._last_echo_line = line

        click.secho(line, fg=fg, err=level < 3)

    @staticmethod
    def get_job_nums():
        try:
            return cpu_count()
        except NotImplementedError:
            return 1
