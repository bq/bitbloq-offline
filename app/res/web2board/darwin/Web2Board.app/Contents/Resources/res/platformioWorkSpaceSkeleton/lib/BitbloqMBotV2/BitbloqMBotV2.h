/*
 * BitbloqMBot.h
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


#ifndef BITBLOQMBOTV2_H
#define BITBLOQMBOTV2_H

#include <BitbloqMCore.h>
#include <BitbloqUS.h>
#include <BitbloqDCMotor.h>

// class predeclaration

class BitbloqMBot:public BitbloqMCore
{

public:
    BitbloqMBot(int lineFollowerPort=-1, int USPort=-1); // public constructor
    virtual ~BitbloqMBot(); // virtual public destructor
    
    void setLineFollowerPort(int port);
    void setUSPort(int port);

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
     * gets right IR sensor status (digital)
     * @return IR sensor status
     */
    int readRightLineFollowerSensor() const;


    /**
     * gets left IR sensor status (digital)
     * @return IR sensor status
     */
    int readLeftLineFollowerSensor() const;

    /**
     * gets IR sensor status (digital)
     * @return IR sensor status, 0 both, 1 left, 2 right
     */
    int readLineFollowerSensor() const;

    void move(int direction, int speed);
    void setRightMotorSpeed(int speed);
    void setLeftMotorSpeed(int speed);


private:
    int usTriggerPin; /// set from port using ports array.
    int usEchoPin; /// set from port using ports array.
    int rightLineFollowerPin; /// set from port using ports array.
    int leftLineFollowerPin; /// set from port using ports array.

    BitbloqUltrasound* usSensor;
    Bitbloq::DCMotor* rightDCMotor;
    Bitbloq::DCMotor* leftDCMotor;
};

#endif
