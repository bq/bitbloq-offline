#ifndef US_h
#define US_h
#include "Arduino.h"

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