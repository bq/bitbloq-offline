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
#include <BitbloqGyro.h>

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
     * @return power status 0 (powered off)  1 (powered on)
     */ 
    int readPowerStatus() const;
    
    /**
     * gets Temperature
     * @return Temperature (0 - 1023) the greater the hotter
    */
    int readTemperature();
    
    /**
     * gets sound level
     * @return sounds level (0 - 1023) the greater the louder
     */
    int readSoundLevel() const; 

    
     //ports structure of MakeBlock Auriga Board.
    static const Port ports[11];

	/**
 * \par Function
 *   getAngleX
 * \par Description
 *   Get the angle value of X-axis.
 * \param[in]
 *   None
 * \par Output
 *   None
 * \return
 *   The angle value of X-axis
 * \par Others
 *   X-axis angle value is calculated by complementary filter.
 */
  double getAngleX(void){gyro.update(); return gyro.getAngleX();}

/**
 * \par Function
 *   getAngleY
 * \par Description
 *   Get the angle value of Y-axis.
 * \param[in]
 *   None
 * \par Output
 *   None
 * \return
 *   The angle value of Y-axis
 * \par Others
 *   Y-axis angle value is calculated by complementary filter.
 */
  double getAngleY(void){gyro.update(); return gyro.getAngleY();}

/**
 * \par Function
 *   getAngleZ
 * \par Description
 *   Get the angle value of Z-axis.
 * \param[in]
 *   None
 * \par Output
 *   None
 * \return
 *   The angle value of Z-axis
 * \par Others
 *   Z-axis angle value is integral of Z-axis angular velocity.
 */
  double getAngleZ(void){gyro.update(); return gyro.getAngleZ();}

/**
 * \par Function
 *   getGyroX
 * \par Description
 *   Get the data of gyroXrate.
 * \param[in]
 *   None
 * \par Output
 *   None
 * \return
 *   The data of gyroXrate
 * \par Others
 *   None
 */
  double getGyroX(void){gyro.update(); return gyro.getGyroX();}

/**
 * \par Function
 *   getGyroY
 * \par Description
 *   Get the data of gyroYrate.
 * \param[in]
 *   None
 * \par Output
 *   None
 * \return
 *   The data of gyroYrate
 * \par Others
 *   None
 */
  double getGyroY(void){gyro.update(); return gyro.getGyroY();}

/**
 * \par Function
 *   getAngle
 * \par Description
 *   Get the angle value of setting axis.
 * \param[in]
 *   index - Axis settings(1:X-axis, 2:Y-axis, 3:Z-axis)
 * \par Output
 *   None
 * \return
 *   The angle value of setting axis
 * \par Others
 *   Z-axis angle value is integral of Z-axis angular velocity.
 */
  double getAngle(uint8_t index){gyro.update(); return gyro.getAngle(index);}

protected:

	Bitbloq::Gyro gyro;
	
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
