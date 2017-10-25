/*
 * BitbloqFreaksCar.h
 *
 * Copyright 2017 Alberto Valero <alberto.valero@bq.com>
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


#ifndef BITBLOQFREAKSCAR_H
#define BITBLOQFREAKSCAR_H

#include <BitbloqUS.h>
#include <BitbloqDCMotor.h>
#include <BitbloqElecFreaksIRControl.h>

// Constants
#define LEFT         1
#define RIGHT        -1

#define LOW_MEDIUM_LIGHT  166 //500*1/3
#define MEDIUM_HIGH_LIGHT 333 //500*2/3

#define LOW_LIGHT    0
#define MEDIUM_LIGHT 1
#define HIGH_LIGHT   2

class BitbloqFreaksCar
{

public:
    BitbloqFreaksCar(); // public constructor
    virtual ~BitbloqFreaksCar(); // virtual public destructor
    

    /**
     * Sets pinmode of sensors and actuators (as in standard Arduino setup)
     */
    void setup();

    /**
     * gets distance measured by US sensor
     * @return distance in cm
     */
    int readUSMeasuredDistanceCM() const;

    /**
     * gets distance measured by US sensor
     * @return distance in inches
     */
    int readUSMeasuredDistanceIN() const;
    
    /**
     * reading of IR with index
     * @param index IR index
     * @return IR reading
     */
    byte readIR(int index) const;

	int readLDRLeft() const;
	int readLDRRight() const;
	bool getLightRange(int side, int range);

    void move(int direction, int speed);
    void setRightMotorSpeed(int speed);
    void setLeftMotorSpeed(int speed);
    
    void playTone(int note, int beat) const;
    byte readEndStop() const;
    
    Bitbloq::ElecfreaksIRControl* irControl;
    char getInfraredControlCommand();

private:
    const int usTriggerPin; /// set from port using ports array.
    const int usEchoPin; /// set from port using ports array.
    const int irPinArray[5]; ///robot has an 4 IR sensors
    const int buzzerPin;
    const int endStopPin;
    const int DCMotor1Dir;
    const int DCMotor1PWM;
    const int DCMotor2Dir;
    const int DCMotor2PWM;
    const int ldrRightPin;
    const int ldrLeftPin;
    const int InfraredReceivePin;
    BitbloqUltrasound* usSensor;
    Bitbloq::DCMotor* rightDCMotor;
    Bitbloq::DCMotor* leftDCMotor;
    
};

#endif
