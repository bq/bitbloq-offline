/*
 * BitbloqMCore.h
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

#ifndef BITBLOQMCORE_H
#define BITBLOQMCORE_H

#include <BitbloqMPort.h>
#include <BitbloqMeRGBLed.h>
#include <BitbloqMakeblockIRControl.h>

class BitbloqMCore
{

public:
    BitbloqMCore(); // public constructor
    virtual ~BitbloqMCore(); // virtual public destructor

    /**
     * Sets pinmode of sensors and actuators (as in standard Arduino setup)
     */
    void setup();

    /**
     * Choose led and set color
     * @param led led number
     * @param red red component of rgb color
     * @param green green component of rgb color
     * @param blue blue component of rgb color
     */
    void setLed(int led, int red, int green, int blue);

    /**
     * Play tone
     * @param note note frequency
     * @param beat time active
     */
    void playTone(int note, int beat);


    /**
     * gets button status (0, 1023)
* @return button status
     */
    int readButtonStatus() const;

    /**
             * gets wether buttons is pressed or not
     * @return button is pressed (true false)
             */
    bool isButtonPushed() const;

    /**
             * Gets LDR sensor measure (analog)
             * @return LDR reading
             */
    int readLightSensor() const;
    
    char getInfraredControlCommand();
    
     //ports structure of MCore Board.
    static const Port ports[5];
    
	BitbloqMeRGBLed boardLeds;
	
	Bitbloq::MakeblockIRControl* irControl; /// Remote IR Control
    
protected:
    // void portsInit();

    

    const int buzzerPin; /// pin where the buzzer is connected. It is hardwired on the board (D8)
    const int lightSensorPin; /// pin where the light sensor is connected. It is hardwired on the
                              /// board (A6)
    const int buttonPin; /// pin where the buzzer is connected. It is hardwired on the board (A7)
    const int DCMotor1Dir;
    const int DCMotor1PWM;
    const int DCMotor2Dir;
    const int DCMotor2PWM;
    const int rgbLEDPin;
    const int IRTransmitterPin; /// IR transmitter hardwired to board (D3)
    const int IRReceiverPin; /// IR receiver hardwired to board (D2)
    
    
    
   

};

#endif
