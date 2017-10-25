/*
 * BitbloqDCMotor.cpp
 * 
 * Copyright 2016 Alberto Valero <alberto.valero@bq.com>
 * 
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 * 
 * 
 */


#include <Arduino.h>
#include "BitbloqDCMotor.h"

namespace Bitbloq{

DCMotor::DCMotor():
	dirPin(-1),
	enPin1(-1),
    enPin2(-1)
{

}

DCMotor::DCMotor(int _dirPin, int _pwmPin):
    dirPin(_dirPin),
    pwmPin(_pwmPin),
    enPin1(-1),
    enPin2(-1)
{
    
}

void DCMotor::setup(int _dirPin, int _pwmPin){
	dirPin = _dirPin;
	pwmPin = _pwmPin;
	setup();
}

DCMotor::DCMotor(int _enPin1, int _enPin2, int _pwmPin):
	dirPin(-1),
    pwmPin(_pwmPin),
    enPin1(_enPin1),
    enPin2(_enPin2)
{
	
}

void DCMotor::setup(int _enPin1, int _enPin2, int _pwmPin){
	enPin1 = _enPin1;
	enPin2 = _enPin2;
	pwmPin = _pwmPin;
	setup();
}


void DCMotor::setup(){
    
    if (dirPin > 0) pinMode(dirPin,OUTPUT); //motors with direction pin
    
    if (enPin1 > 0) pinMode(enPin1,OUTPUT); //motors with 2 control pins
    if (enPin2 > 0) pinMode(enPin2,OUTPUT);

    pinMode(pwmPin,OUTPUT);
}

void DCMotor::setSpeed(int _speed){
    
    //speed in [-255, 255]
    speed	= _speed > 255 ? 255 : _speed;
    speed	= _speed < -255 ? -255 : _speed;
    
    
    //check if speed has changed
    if(last_speed != speed){
        last_speed = speed;
    }else{
        return;
    }
    
    //control DC Motor
    if(speed >= 0)
    {
		if(dirPin>0) digitalWrite(dirPin,HIGH); //motor with direction pin
		if (enPin1 > 0 & enPin2 > 0){ //motor with two control pins
			digitalWrite(enPin1,HIGH);
			digitalWrite(enPin2,LOW);
		}
        analogWrite(pwmPin,speed);
    }else{
		if(dirPin>0) digitalWrite(dirPin,LOW); //motor with direction pin
		if (enPin1 > 0 & enPin2 > 0){ //motor with two control pins
			digitalWrite(enPin1,LOW);
			digitalWrite(enPin2,HIGH);
		}
        analogWrite(pwmPin,-speed);
	}
		
}

} //end namespace
