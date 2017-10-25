#ifndef BITBLOQULSTRASOUND_H
#define BITBLOQULSTRASOUND_H


#include "Arduino.h"

class BitbloqUltrasound
{
public:
	BitbloqUltrasound();
	BitbloqUltrasound(int pinTrigger, int pinEcho, unsigned long timeOut = 58000);
	float read();
	float readDistanceInCM();
	float readDistanceInInches();
	void setTimeOut(unsigned long timeOut);
	void setup();
	void setup(int pinTrigger, int pinEcho, unsigned long timeOut = 58000);

private:
	int _pinTrigger;
	int _pinEcho;
	unsigned long _timeOut;
	long TP_init();
};

class US
{
public:
	US();
	US(int pinTrigger, int pinEcho, unsigned long timeOut = 58000);
	void init(int pinTrigger, int pinEcho, unsigned long timeOut = 58000);
	float read();
	void setTimeOut(unsigned long timeOut);

private:
	int _pinTrigger;
	int _pinEcho;
	unsigned long _timeOut;
	long TP_init();

};


#endif //US_h
