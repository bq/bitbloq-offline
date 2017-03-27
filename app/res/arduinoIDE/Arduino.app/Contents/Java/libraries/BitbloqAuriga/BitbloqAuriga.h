/*
 * BitbloqAuriga.h
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

#ifndef BITBLOQAURIGA_H
#define BITBLOQAURIGA_H

#include <BitbloqMPort.h>
#include <BitbloqMeRGBLed.h>

class BitbloqAuriga
{

public:
    BitbloqAuriga(); // public constructor
    virtual ~BitbloqAuriga(); // virtual public destructor

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
     * Gets LDR sensor measure (analog)
     * @param There are 2 onboard LDR sensors. which one?
     * @return LDR reading
     */
    int readLightSensor(int number) const;
    
    
    /**
     * get power status
     * @return power status 0 to 1023
     */ 
    int readPowerStatus() const;
    
    /**
     * gets Temperature
     * @return Temperature
    */
    int readTemperature();
    
    /**
     * gets sound level
     * @return sounds level
     */
    int readSoundLevel() const; 

    
     //ports structure of MakeBlock Auriga Board.
    static const Port ports[11];



protected:

    BitbloqMeRGBLed boardLeds;

    const int powerSensorPin; 
    const int lightSensor1Pin;
    const int lightSensor2Pin;
    const int soundSensorPin;
    const int temperatureSensorPin;
    const int RGBLedsPin;
    const int buzzerPin;
    
};

#endif
