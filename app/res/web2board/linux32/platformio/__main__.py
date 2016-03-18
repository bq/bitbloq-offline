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

from os import listdir
from os.path import join
from platform import system
from sys import exit as sys_exit
from traceback import format_exc

import click
import requests

from platformio import __version__, exception, maintenance
from platformio.util import get_source_dir


class PlatformioCLI(click.MultiCommand):  # pylint: disable=R0904

    def list_commands(self, ctx):
        cmds = []
        for filename in listdir(join(get_source_dir(), "commands")):
            if filename.startswith("__init__"):
                continue
            if filename.endswith(".py"):
                cmds.append(filename[:-3])
        cmds.sort()
        return cmds

    def get_command(self, ctx, name):
        mod = None
        try:
            mod = __import__("platformio.commands." + name,
                             None, None, ["cli"])
        except ImportError:
            try:
                return self._handle_obsolate_command(name)
            except AttributeError:
                raise click.UsageError('No such command "%s"' % name, ctx)
        return mod.cli

    @staticmethod
    def _handle_obsolate_command(name):
        if name in ("install", "list", "search", "show", "uninstall"):
            click.secho(
                "Warning! `platformio %s` command is deprecated and will be "
                "removed in the next release! Please use "
                "`platformio platforms %s` instead." % (name, name),
                fg="yellow"
            )
            from platformio.commands import platforms
            return getattr(platforms, "platforms_" + name)
        raise AttributeError()


@click.command(cls=PlatformioCLI,
               context_settings=dict(help_option_names=["-h", "--help"]))
@click.version_option(__version__, prog_name="PlatformIO")
@click.option("--force", "-f", is_flag=True,
              help="Force to accept any confirmation prompts.")
@click.option("--caller", "-c", help="Caller ID (service).")
@click.pass_context
def cli(ctx, force, caller):
    maintenance.on_platformio_start(ctx, force, caller)


@cli.resultcallback()
@click.pass_context
def process_result(ctx, result, force, caller):  # pylint: disable=W0613
    maintenance.on_platformio_end(ctx, result)


def main():
    try:
        if "cygwin" in system().lower():
            raise exception.CygwinEnvDetected()

        # https://urllib3.readthedocs.org
        # /en/latest/security.html#insecureplatformwarning
        try:
            requests.packages.urllib3.disable_warnings()
        except AttributeError:
            raise exception.PlatformioException(
                "Invalid installation of Python `requests` package`. See "
                "< https://github.com/platformio/platformio/issues/252 >")

        cli(None, None, None)
    except Exception as e:  # pylint: disable=W0703
        if not isinstance(e, exception.ReturnErrorCode):
            maintenance.on_platformio_exception(e)
            error_str = "Error: "
            if isinstance(e, exception.PlatformioException):
                error_str += str(e)
            else:
                error_str += format_exc()
                error_str += """
============================================================

An unexpected error occurred. Further steps:

* Verify that you have the latest version of PlatformIO using
  `pip install -U platformio` command

* Try to find answer in FAQ Troubleshooting section
  http://docs.platformio.org/en/latest/faq.html

* Report this problem to the developers
  https://github.com/platformio/platformio/issues

============================================================
"""
            click.secho(error_str, fg="red", err=True)
        return 1
    return 0


if __name__ == "__main__":
    sys_exit(main())
