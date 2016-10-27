import mraa
import time
import ctypes

class BotbloqVehicle():

    def __init__(self):
        self.x = mraa.I2c(0)

    def moveWheel(self, address, speed):
        self.x.address(address)
        self.x.writeByte(ctypes.c_uint8(182).value)
        time.sleep(0.001)
        self.x.writeByte(ctypes.c_uint8(int(speed)).value)
        time.sleep(0.001)

    def move(self, delay, speed, direction):
        velocidad_avance = int(90.0 + float(velocidad) * 90 / 100)
        velocidad_retroceso = int(90.0 - float(velocidad) * 90 / 100)

        if (direction == "FORWARD"):
            moveWheel(0x04, velocidad_avance)
            moveWheel(0x06, velocidad_avance)
            moveWheel(0x03, velocidad_retroceso)
            moveWheel(0x05, velocidad_retroceso)
        elif (direction == "BACKWARD"):
            moveWheel(0x04, velocidad_retroceso)
            moveWheel(0x06, velocidad_retroceso)
            moveWheel(0x03, velocidad_avance)
            moveWheel(0x05, velocidad_avance)
        elif (direction == "TURN_LEFT"):
            moveWheel(0x04, velocidad_retroceso)
            moveWheel(0x06, velocidad_retroceso)
            moveWheel(0x03, velocidad_retroceso)
            moveWheel(0x05, velocidad_retroceso)
        elif (direction == "TURN_RIGHT"):
            moveWheel(0x04, velocidad_avance)
            moveWheel(0x06, velocidad_avance)
            moveWheel(0x03, velocidad_avance)
            moveWheel(0x05, velocidad_avance)
        time.sleep(delay)

    def wait(self, delay):
        moveWheel(0x04, 90)
        moveWheel(0x06, 90)
        moveWheel(0x03, 90)
        moveWheel(0x05, 90)

        time.sleep(delay)

    def stop(self):
        moveWheel(0x04, 90)
        moveWheel(0x06, 90)
        moveWheel(0x03, 90)
        moveWheel(0x05, 90)

        exit()
    
    def readIRSensor(self, side):
    	if side == "LEFT":
    		address = 0x32
    	else:
    		address = 0x33
        self.x.address(address)
        return self.x.readByte()
   
    

