#!/usr/bin/env python
import os
import sys
from pprint import pprint

from libs.PathsManager import PathsManager

# PathsManager.logRelevantEnvironmentalPaths()

# if areWeFrozen():
#     with zipfile.ZipFile(PathsManager.RES_SCONS_ZIP_PATH, "r") as z:
#         z.extractall(PathsManager.MAIN_PATH)

# args = ['C:\Users\jorgarira\SoftwareProjects\web2board\src\scons.exe',
#         '-Q',
#         '-j 4',
#         '--warn=no-no-parallel-support',
#         '-f',
#         PathsManager.MAIN_PATH + os.sep + 'scons\\platformio\\builder\\main.py',
#         'PIOENV=uno',
#         'PLATFORM=atmelavr',
#         'UPLOAD_PORT=COM3',
#         'BOARD=diecimilaatmega328',
#         'FRAMEWORK=arduino',
#         'BUILD_SCRIPT=' + PathsManager.MAIN_PATH + os.sep + 'scons\\platformio\\builder\\scripts\\atmelavr.py',
#         'PIOPACKAGE_TOOLCHAIN=toolchain-atmelavr',
#         'PIOPACKAGE_FRAMEWORK=framework-arduinoavr',
#         "upload",
#         os.path.join(PathsManager.TEST_SETTINGS_PATH, "platformio")]
#
# sys.argv[1:] = args[1:]

pprint(sys.argv)
web2boardPath = sys.argv[5].split("platformio" + os.sep)[0]
print web2boardPath
platformioPath = sys.argv.pop(-1)
pathDiff = os.path.relpath(os.path.dirname(PathsManager.SCONS_EXECUTABLE_PATH), platformioPath)
os.chdir(platformioPath)

sys.path.extend([pathDiff + os.sep + 'sconsFiles'])
execfile(pathDiff + os.sep + "sconsFiles" + os.sep + "scons.py")
