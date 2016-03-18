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

from os import getcwd, makedirs
from os.path import isdir, isfile, join
from shutil import copyfile

import click

from platformio import app, exception
from platformio.commands.platforms import \
    platforms_install as cli_platforms_install
from platformio.ide.projectgenerator import ProjectGenerator
from platformio.platforms.base import PlatformFactory
from platformio.util import get_boards, get_source_dir


def validate_boards(ctx, param, value):  # pylint: disable=W0613
    unknown_boards = set(value) - set(get_boards().keys())
    try:
        assert not unknown_boards
        return value
    except AssertionError:
        raise click.BadParameter(
            "%s. Please search for the board types using "
            "`platformio boards` command" % ", ".join(unknown_boards))


@click.command("init", short_help="Initialize new PlatformIO based project")
@click.option("--project-dir", "-d", default=getcwd,
              type=click.Path(exists=True, file_okay=False, dir_okay=True,
                              writable=True, resolve_path=True))
@click.option("--board", "-b", multiple=True, metavar="TYPE",
              callback=validate_boards)
@click.option("--ide",
              type=click.Choice(ProjectGenerator.get_supported_ides()))
@click.option("--enable-auto-uploading", is_flag=True)
@click.option("--env-prefix", default="")
@click.pass_context
def cli(ctx, project_dir, board, ide,  # pylint: disable=R0913
        enable_auto_uploading, env_prefix):

    if project_dir == getcwd():
        click.secho("\nThe current working directory", fg="yellow", nl=False)
        click.secho(" %s " % project_dir, fg="cyan", nl=False)
        click.secho(
            "will be used for project.\n"
            "You can specify another project directory via\n"
            "`platformio init -d %PATH_TO_THE_PROJECT_DIR%` command.",
            fg="yellow"
        )
        click.echo("")

    click.echo("The next files/directories will be created in %s" %
               click.style(project_dir, fg="cyan"))
    click.echo("%s - Project Configuration File. |-> PLEASE EDIT ME <-|" %
               click.style("platformio.ini", fg="cyan"))
    click.echo("%s - Put your source files here" %
               click.style("src", fg="cyan"))
    click.echo("%s - Put here project specific (private) libraries" %
               click.style("lib", fg="cyan"))

    if (app.get_setting("enable_prompts") and
            not click.confirm("Do you want to continue?")):
        raise exception.AbortedByUser()

    project_file = join(project_dir, "platformio.ini")
    src_dir = join(project_dir, "src")
    lib_dir = join(project_dir, "lib")

    for d in (src_dir, lib_dir):
        if not isdir(d):
            makedirs(d)

    init_lib_readme(lib_dir)
    init_ci_conf(project_dir)
    init_cvs_ignore(project_dir)

    if not isfile(project_file):
        copyfile(join(get_source_dir(), "projectconftpl.ini"),
                 project_file)

    if board:
        fill_project_envs(
            ctx, project_file, board, enable_auto_uploading, env_prefix,
            ide is not None
        )

    if ide:
        if not board:
            raise exception.BoardNotDefined()
        if len(board) > 1:
            click.secho(
                "Warning! You have initialised project with more than 1 board"
                " for the specified IDE.\n"
                "However, the IDE features (code autocompletion, syntax lint)"
                " have been configured for the first board '%s' from your list"
                " '%s'." % (board[0], ", ".join(board)),
                fg="yellow"
            )
        pg = ProjectGenerator(
            project_dir, ide, board[0])
        pg.generate()

    click.secho(
        "\nProject has been successfully initialized!\nUseful commands:\n"
        "`platformio run` - process/build project from the current "
        "directory\n"
        "`platformio run --target upload` or `platformio run -t upload` "
        "- upload firmware to embedded board\n"
        "`platformio run --target clean` - clean project (remove compiled "
        "files)\n"
        "`platformio run --help` - additional information",
        fg="green"
    )


def fill_project_envs(  # pylint: disable=too-many-arguments,too-many-locals
        ctx, project_file, board_types, enable_auto_uploading,
        env_prefix, force_download):
    builtin_boards = get_boards()
    content = []
    used_envs = []
    used_platforms = []

    with open(project_file) as f:
        used_envs = [l.strip() for l in f.read().splitlines() if
                     l.strip().startswith("[env:")]

    for type_ in board_types:
        data = builtin_boards[type_]
        used_platforms.append(data['platform'])
        env_name = "[env:%s%s]" % (env_prefix, type_)

        if env_name in used_envs:
            continue

        content.append("")
        content.append(env_name)
        content.append("platform = %s" % data['platform'])

        # find default framework for board
        frameworks = data.get("frameworks")
        if frameworks:
            content.append("framework = %s" % frameworks[0])

        content.append("board = %s" % type_)
        if enable_auto_uploading:
            content.append("targets = upload")

    if force_download and used_platforms:
        _install_dependent_platforms(ctx, used_platforms)

    if not content:
        return

    with open(project_file, "a") as f:
        content.append("")
        f.write("\n".join(content))


def _install_dependent_platforms(ctx, platforms):
    installed_platforms = PlatformFactory.get_platforms(installed=True).keys()
    if set(platforms) <= set(installed_platforms):
        return
    ctx.invoke(
        cli_platforms_install,
        platforms=list(set(platforms) - set(installed_platforms))
    )


def init_lib_readme(lib_dir):
    if isfile(join(lib_dir, "readme.txt")):
        return
    with open(join(lib_dir, "readme.txt"), "w") as f:
        f.write("""
This directory is intended for the project specific (private) libraries.
PlatformIO will compile them to static libraries and link to executable file.

The source code of each library should be placed in separate directory, like
"lib/private_lib/[here are source files]".

For example, see how can be organised `Foo` and `Bar` libraries:

|--lib
|  |--Bar
|  |  |--docs
|  |  |--examples
|  |  |--src
|  |     |- Bar.c
|  |     |- Bar.h
|  |--Foo
|  |  |- Foo.c
|  |  |- Foo.h
|  |- readme.txt --> THIS FILE
|- platformio.ini
|--src
   |- main.c

Then in `src/main.c` you should use:

#include <Foo.h>
#include <Bar.h>

// rest H/C/CPP code

PlatformIO will find your libraries automatically, configure preprocessor's
include paths and build them.

See additional options for PlatformIO Library Dependency Finder `lib_*`:

http://docs.platformio.org/en/latest/projectconf.html#lib-install

""")


def init_ci_conf(project_dir):
    if isfile(join(project_dir, ".travis.yml")):
        return
    with open(join(project_dir, ".travis.yml"), "w") as f:
        f.write("""# Continuous Integration (CI) is the practice, in software
# engineering, of merging all developer working copies with a shared mainline
# several times a day < http://docs.platformio.org/en/latest/ci/index.html >
#
# Documentation:
#
# * Travis CI Embedded Builds with PlatformIO
#   < https://docs.travis-ci.com/user/integration/platformio/ >
#
# * PlatformIO integration with Travis CI
#   < http://docs.platformio.org/en/latest/ci/travis.html >
#
# * User Guide for `platformio ci` command
#   < http://docs.platformio.org/en/latest/userguide/cmd_ci.html >
#
#
# Please choice one of the following templates (proposed below) and uncomment
# it (remove "# " before each line) or use own configuration according to the
# Travis CI documentation (see above).
#


#
# Template #1: General project. Test it using existing `platformio.ini`.
#

# language: python
# python:
#     - "2.7"
#
# sudo: false
# cache:
#     directories:
#         - "~/.platformio"
#
# install:
#     - pip install -U platformio
#
# script:
#     - platformio run


#
# Template #2: The project is intended to by used as a library with examples
#

# language: python
# python:
#     - "2.7"
#
# sudo: false
# cache:
#     directories:
#         - "~/.platformio"
#
# env:
#     - PLATFORMIO_CI_SRC=path/to/test/file.c
#     - PLATFORMIO_CI_SRC=examples/file.ino
#     - PLATFORMIO_CI_SRC=path/to/test/directory
#
# install:
#     - pip install -U platformio
#
# script:
#     - platformio ci --lib="." --board=TYPE_1 --board=TYPE_2 --board=TYPE_N
""")


def init_cvs_ignore(project_dir):
    if isfile(join(project_dir, ".gitignore")):
        return
    with open(join(project_dir, ".gitignore"), "w") as f:
        f.write(".pioenvs")
