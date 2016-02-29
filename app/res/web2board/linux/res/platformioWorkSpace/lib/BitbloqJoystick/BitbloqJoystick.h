#ifndef JOYSTICK_H
#define JOYSTICK_H
#include "Arduino.h"

class Joystick
{
public:
	Joystick(float pinX, float pinY, float pinButton);
	float * read();
	float readPinX();
	float readPinY();
	float readPinButton();
private:
	float _pinX;
	float _pinY;
	float _pinButton;
};

#endif //JOYSTICK_H