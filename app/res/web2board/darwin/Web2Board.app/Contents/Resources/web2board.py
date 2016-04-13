#!/usr/bin/env python

# -*- coding: utf-8 -*-
# -----------------------------------------------------------------------#
#                                                                       #
# This file is part of the web2board project                            #
#                                                                       #
# Copyright (C) 2015 Mundo Reader S.L.                                  #
#                                                                       #
# Date: April - May 2015                                                #
# Authors: Irene Sanz Nieto <irene.sanz@bq.com>,                        #
#          Sergio Morcuende <sergio.morcuende@bq.com>                   #
#                                                                       #
# -----------------------------------------------------------------------#

import importlib
import pprint
import signal
import click
from wshubsapi.HubsInspector import HubsInspector

from Scripts.TestRunner import *
from libs.LoggingUtils import initLogging
from libs.PathsManager import PathsManager

log = initLogging(__name__)  # initialized in main
originalEcho = click.echo
originalSEcho = click.secho

def getEchoFunction(original):
    def clickEchoForExecutable(message, *args, **kwargs):
        try:
            original(message, *args, **kwargs)
        except:
            log.debug(message)
    return clickEchoForExecutable


click.echo = getEchoFunction(originalEcho)
click.secho = getEchoFunction(originalSEcho)

def clickConfirm(message):
    print message
    return True

click.confirm = clickConfirm


def runSconsScript():
    pprint.pprint(sys.path)
    platformioPath = sys.argv.pop(-1)
    pathDiff = os.path.relpath(os.path.dirname(PathsManager.SCONS_EXECUTABLE_PATH), platformioPath)
    os.chdir(platformioPath)
    sys.path.extend([pathDiff + os.sep + 'sconsFiles'])
    execfile(pathDiff + os.sep + "sconsFiles" + os.sep + "scons.py")

if "-Q" in sys.argv:
    runSconsScript()
    os._exit(1)

if __name__ == "__main__":
    qtApp = None
    try:
        importlib.import_module("libs.WSCommunication.Hubs")
        HubsInspector.inspectImplementedHubs()
        from libs.MainApp import getMainApp, forceQuit
        app = getMainApp()

        def closeSigHandler(signal, frame):
            try:
                log.warning("closing server")
                getMainApp().w2bServer.server_close()
                log.warning("server closed")
            except:
                log.warning("unable to close server")
            forceQuit()
            os._exit(1)


        signal.signal(signal.SIGINT, closeSigHandler)
        qtApp = app.startMain()
        sys.exit(qtApp.exec_())
    except SystemExit:
        pass
    except Exception as e:
        if log is None:
            print(20)
            raise e
        else:
            log.critical("critical exception", exc_info=1)
    if qtApp is not None:
        qtApp.quit()
    os._exit(1)
