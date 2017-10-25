/*
 * BitbloqOrion.h
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

#ifndef BITBLOQORION_H
#define BITBLOQORION_H

#include <BitbloqMPort.h>

class BitbloqOrion
{

public:
    BitbloqOrion(); // public constructor
    virtual ~BitbloqOrion(); // virtual public destructor

    /**
     * Sets pinmode of sensors and actuators (as in standard Arduino setup)
     */
    void setup();

    
    /**
     * Play tone
     * @param note note frequency
     * @param beat time active
     */
    void playTone(int note, int beat);


     //ports structure of MakeBlock Orion Board.
    static const Port ports[9];

protected:

    const int buzzerPin; /// pin where the buzzer is connected. It is hardwired on the board (D8)
    const int DCMotor1Dir;
    const int DCMotor1PWM;
    const int DCMotor2Dir;
    const int DCMotor2PWM;   
};

#endif
