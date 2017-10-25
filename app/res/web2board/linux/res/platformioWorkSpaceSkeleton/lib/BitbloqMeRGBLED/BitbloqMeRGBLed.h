/*
 * BitbloqMeRGBLed.h
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

/**
 * Derived from
 * 
 * \par Copyright (C), 2012-2016, MakeBlock
 * \class MeRGBLed
 * \brief   Driver for W2812 full-color LED lights.
 * @file    MeRGBLed.h
 * @author  MakeBlock
 * @version V1.0.0
 * @date    2015/09/01
 * @brief   Header for MeRGBLed.cpp module
 *
 */


#ifndef BITBLOQMERGBLED_H
#define BITBLOQMERGBLED_H

#include <stdint.h>
#include <stdbool.h>
#include <Arduino.h>


#define DEFAULT_MAX_LED_NUMBER  (32)

struct cRGB
{
  uint8_t g;
  uint8_t r;
  uint8_t b;
};

/**
 * Class: MeRGBLed
 *
 * \par Description
 * Declaration of Class MeRGBLed
 */

class BitbloqMeRGBLed
{
    public:
        BitbloqMeRGBLed();
        BitbloqMeRGBLed(uint8_t _pin, uint8_t led_num);
        virtual ~BitbloqMeRGBLed();
        
        void setup();
        void setup(uint8_t _pin, uint8_t led_num);
        bool setColorAt(uint8_t index, uint8_t red, uint8_t green, uint8_t blue);
        bool setColor(uint8_t index, uint8_t red, uint8_t green, uint8_t blue);
        void show(void);
        void showColor(uint8_t index, uint8_t red, uint8_t green, uint8_t blue);

    private:
        uint16_t count_led;
        uint8_t *pixels;
        int pin;

        void rgbled_sendarray_mask(uint8_t *array, uint16_t length, uint8_t pinmask, uint8_t *port);

        const volatile uint8_t *ws2812_port;
        volatile uint8_t *ws2812_port_reg;
        uint8_t pinMask;
        
        void setNumber(uint8_t num_led);
};

#endif
