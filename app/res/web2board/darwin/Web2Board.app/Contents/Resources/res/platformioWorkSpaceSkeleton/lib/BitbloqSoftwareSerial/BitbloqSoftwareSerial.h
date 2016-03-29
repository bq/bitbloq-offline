#ifndef bqSoftwareSerial_h
#define bqSoftwareSerial_h

#include "Arduino.h"
#include <SoftwareSerial.h>

class bqSoftwareSerial : public SoftwareSerial {
public:
	bqSoftwareSerial(uint8_t receivePin, uint8_t transmitPin, int baudRate = 9600, bool inverse_logic = false): SoftwareSerial(receivePin, transmitPin){
		pinMode(receivePin,INPUT);
		pinMode(transmitPin, OUTPUT);
		bqSoftwareSerial::begin(baudRate);
		bqSoftwareSerial::flush();
	}
	String readString();
};

#endif //bqSoftwareSerial_h

