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
import os

import click
import click.globals
from platformio import exception, util
from platformio.commands.run import EnvironmentProcessor, _clean_pioenvs_dir


def run(ctx=None, environment=(), target=(), upload_port=None,  # pylint: disable=R0913,R0914
        project_dir=os.getcwd(), verbose=3, disable_auto_clean=False):
    with util.cd(project_dir):
        config = util.get_project_config()

        if not config.sections():
            raise exception.ProjectEnvsNotAvailable()

        known = set([s[4:] for s in config.sections()
                     if s.startswith("env:")])
        unknown = set(environment) - known
        if unknown:
            raise exception.UnknownEnvNames(
                    ", ".join(unknown), ", ".join(known))

        # clean obsolete .pioenvs dir
        if not disable_auto_clean:
            try:
                _clean_pioenvs_dir(util.get_pioenvs_dir())
            except Exception:
                raise exception.CleanPioenvsDirError(util.get_pioenvs_dir())

        results = []
        for section in config.sections():
            # skip main configuration section
            if section == "platformio":
                continue

            if not section.startswith("env:"):
                raise exception.InvalidEnvName(section)

            envname = section[4:]
            if environment and envname not in environment:
                # echo("Skipped %s environment" % style(envname, fg="yellow"))
                continue

            if results:
                click.echo()

            options = {}
            for k, v in config.items(section):
                options[k] = v

            ep = EnvironmentProcessor(
                    ctx, envname, options, target, upload_port, verbose)
            results.append(ep.process()) # [JORGE_GARCIA] modified to get process description

        return results



