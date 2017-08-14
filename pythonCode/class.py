#!/usr/bin/env python

import rospy
from bitbloq.srv import Speed, IRSensor
import time

class BotbloqVehicle():

    def readIRSensor(self, side):
        if side == "LEFT":
            address = 0x32
        else:
            address = 0x33

        rospy.wait_for_service('irsensor_service')
        try:
            irsensor_srv = rospy.ServiceProxy('irsensor_service', IRSensor)
            resp = irsensor_srv(address)
            return resp.value

        except rospy.ServiceException, e:
            print "Service call failed: %s" % e

    def moveWheel(self, address, speed):
        rospy.wait_for_service('speed_service')
        try:
            speed_srv = rospy.ServiceProxy('speed_service', Speed)
            resp = speed_srv(address, speed)
            print resp.response

        except rospy.ServiceException, e:
            print "Service call failed: %s" % e

    def move(self, delay, speed, direction):
        velocidad_avance = int(90.0 + float(speed) * 90 / 100)
        velocidad_retroceso = int(90.0 - float(speed) * 90 / 100)

        if (direction == "FORWARD"):
            self.moveWheel(0x04, velocidad_avance)
            self.moveWheel(0x06, velocidad_avance)
            self.moveWheel(0x03, velocidad_retroceso)
            self.moveWheel(0x05, velocidad_retroceso)

        elif (direction == "BACKWARD"):
            self.moveWheel(0x04, velocidad_retroceso)
            self.moveWheel(0x06, velocidad_retroceso)
            self.moveWheel(0x03, velocidad_avance)
            self.moveWheel(0x05, velocidad_avance)

        elif (direction == "TURN_LEFT"):
            self.moveWheel(0x04, velocidad_retroceso)
            self.moveWheel(0x06, velocidad_retroceso)
            self.moveWheel(0x03, velocidad_retroceso)
            self.moveWheel(0x05, velocidad_retroceso)

        elif (direction == "TURN_RIGHT"):
            self.moveWheel(0x04, velocidad_avance)
            self.moveWheel(0x06, velocidad_avance)
            self.moveWheel(0x03, velocidad_avance)
            self.moveWheel(0x05, velocidad_avance)

        time.sleep(float(delay) / 1000.0)

    def wait(self, delay):
        self.moveWheel(0x04, 90)
        self.moveWheel(0x06, 90)
        self.moveWheel(0x03, 90)
        self.moveWheel(0x05, 90)

        time.sleep(float(delay) / 1000.0)

    def stop(self):
        self.moveWheel(0x04, 90)
        self.moveWheel(0x06, 90)
        self.moveWheel(0x03, 90)
        self.moveWheel(0x05, 90)

        exit()
