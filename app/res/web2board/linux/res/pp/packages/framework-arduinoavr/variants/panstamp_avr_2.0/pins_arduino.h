/*
  ************************************************************************
  *	pins_arduino.h
  *
  *	Arduino core files for panStamp AVR 2
  * Copyright (c) 2015 panStamp
  *
  ***********************************************************************
  Derived from:
  pins_arduino.h - Pin definition functions for Arduino
  Part of Arduino - http://www.arduino.cc/

  Copyright (c) 2007 David A. Mellis

  This library is free software; you can redistribute it and/or
  modify it under the terms of the GNU Lesser General Public
  License as published by the Free Software Foundation; either
  version 2.1 of the License, or (at your option) any later version.

  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
  Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General
  Public License along with this library; if not, write to the
  Free Software Foundation, Inc., 59 Temple Place, Suite 330,
  Boston, MA  02111-1307  USA
*/

#ifndef Pins_Arduino_h
#define Pins_Arduino_h

#include <avr/pgmspace.h>

#define NOT_A_PIN 0

// SPI CC1101 interface
#define CC1101_SPI_SS   17      // PB2 = SPI_SS
#define CC1101_GDO0	    16      // PD2 = INT0

// On-board LED
#define ONBOARD_LED 15
#define LED      ONBOARD_LED
#define INIT_ONBOARD_LED()    pinMode(ONBOARD_LED, OUTPUT)

// LD-BOARD definitions
#define HGM     20
#define LNA_EN  19
#define PA_EN   18

#define NUM_DIGITAL_PINS            23
#define NUM_ANALOG_INPUTS           8
#define analogInputToDigitalPin(p)  ((p < 6) ? (p) + 14 : -1)

#define digitalPinHasPWM(p)         ((p) == 1 || (p) == 2 || (p) == 3 || (p) == 4 || (p) == 18 || (p) == 19)


static const uint8_t SS   = 22;
static const uint8_t MOSI = 0;
static const uint8_t MISO = 1;
static const uint8_t SCK  = 2;

static const uint8_t SDA = 3;
static const uint8_t SCL = 4;

static const uint8_t A0 = 8;
static const uint8_t A1 = 9;
static const uint8_t A2 = 10;
static const uint8_t A3 = 11;
static const uint8_t A4 = 3;
static const uint8_t A5 = 4;
static const uint8_t A6 = 12;
static const uint8_t A7 = 13;

// Preferred analog pin to measure battery voltage
#define BATT_VOLT_PIN   A0

// NTC power pin
#define NTC_POWER_PIN   22
// NTC ADC pin
#define NTC_PIN    A7

// ADC resolution
#define ADC_RESOLUTION  1023

#define digitalPinToPCICR(p)    (((p) >= 0 && (p) <= 22) ? (&PCICR) : ((uint8_t *)0))
#define digitalPinToPCICRbit(p) (((p) <= 22 && (p) >= 18 || (p) == 0 || (p) == 1) ? 2 : (((p) <= 11 && (p) >= 3) ? 1 : 0))
#define digitalPinToPCMSK(p)    (((p) <= 22 && (p) >= 18 || (p) == 0 || (p) == 1) ? (&PCMSK2) : (((p) <= 11 && (p) >= 3) ? (&PCMSK1) : (&PCMSK0)))
#define digitalPinToPCMSKbit(p) digital_pin_to_bit_mask_PGM[p]

#define digitalPinToInterrupt(p)  ((p) == 18 ? 1 : NOT_AN_INTERRUPT)

#ifdef ARDUINO_MAIN

// On the Arduino board, digital pins are also used
// for the analog output (software PWM).  Analog input
// pins are a separate set.

//                            ANT
//                         GND | GND
//                       GND | | | GND
//                     GND | | | | | GND
//                       | | | | | | |
//                      +-------------+
//               N.C.  1|     ||||    |27  PD3 (D18) (PWM)
//               N.C.  2|             |26  PD4 (D19) (PWM)
//    (D15) (LED) PB1  3|             |25  PD5 (D20)
//          (D14) PB0  4|             |24  PD6 (D21)
//          (A7) ADC7  5|             |23  PD7 (D22)
//          (A6) ADC6  6|             |22  PB3 (SPI_MOSI) (D0)
//       (D11/A3) PC3  7|             |21  PB4 (SPI_MISO) (D1) (PWM)
//       (D10/A2) PC2  8|             |20  PB5 (SPI_SCK) (D2) (PWM)
//        (D9/A1) PC1  9|             |19  PC4 (I2C_SDA) (D3/A4) (PWM)
//        (D8/A0) PC0 10|             |18  PC5 (I2C_SCL) (D4/A5) (PWM)
//                      +-------------+
//                       | | | | | | |
//                    AREF | | | | | PD0 (D5/RXD)
//                       RST | | | PD1 (D6/TXD)
//                         VCC | N.C.
//                            GND
//
//                    ONBOARD_LED   -- PB1 (D15)
//                    CC1101_GDO0   -- PD2/INT0 (D16)
//                    CC1101_SPI_SS -- PB2 (D17)


// these arrays map port names (e.g. port B) to the
// appropriate addresses for various functions (e.g. reading
// and writing)
const uint16_t PROGMEM port_to_mode_PGM[] = {
	NOT_A_PORT,
	NOT_A_PORT,
	(uint16_t) &DDRB,
	(uint16_t) &DDRC,
	(uint16_t) &DDRD,
};

const uint16_t PROGMEM port_to_output_PGM[] = {
	NOT_A_PORT,
	NOT_A_PORT,
	(uint16_t) &PORTB,
	(uint16_t) &PORTC,
	(uint16_t) &PORTD,
};

const uint16_t PROGMEM port_to_input_PGM[] = {
	NOT_A_PORT,
	NOT_A_PORT,
	(uint16_t) &PINB,
	(uint16_t) &PINC,
	(uint16_t) &PIND,
};

const uint8_t PROGMEM digital_pin_to_port_PGM[] = {
	PB, /* 0 */
	PB,
	PB,
	PC,
	PC,
	PD,
	PD,
	NOT_A_PIN,
	PC, /* 8 */
	PC,
	PC,
	PC,
	PC,
	PC,
	PB, /* 14 */
	PB,
	PD, // CC1101_GDO0 : PD2 - INT0 - D16
	PB, // CC1101_SPI_SS : PB2 - D17
	PD,
	PD,
	PD,
	PD,
  PD
};

const uint8_t PROGMEM digital_pin_to_bit_mask_PGM[] = {
	_BV(3),
	_BV(4),
	_BV(5),
	_BV(4),
	_BV(5),
	_BV(0),
	_BV(1),
	NOT_A_PIN,
	_BV(0),
	_BV(1),
	_BV(2),
	_BV(3),
	_BV(6),
	_BV(7),
	_BV(0),
	_BV(1),
  _BV(2),
  _BV(2),
	_BV(3),
	_BV(4),
	_BV(5),
	_BV(6),
	_BV(7)
};

const uint8_t PROGMEM digital_pin_to_timer_PGM[] = {
	NOT_ON_TIMER,
  TIMER2A,
	TIMER2B,
  TIMER0A,
  TIMER0B,
	NOT_ON_TIMER,
	NOT_ON_TIMER,
	NOT_ON_TIMER,
	NOT_ON_TIMER,
	NOT_ON_TIMER,
	NOT_ON_TIMER,
	NOT_ON_TIMER,
	NOT_ON_TIMER,
	NOT_ON_TIMER,
	NOT_ON_TIMER,
	NOT_ON_TIMER,
	NOT_ON_TIMER,
	NOT_ON_TIMER,
	TIMER1A,
	TIMER1B,
	NOT_ON_TIMER,
	NOT_ON_TIMER,
	NOT_ON_TIMER
};

#endif

// These serial port names are intended to allow libraries and architecture-neutral
// sketches to automatically default to the correct port name for a particular type
// of use.  For example, a GPS module would normally connect to SERIAL_PORT_HARDWARE_OPEN,
// the first hardware serial port whose RX/TX pins are not dedicated to another use.
//
// SERIAL_PORT_MONITOR        Port which normally prints to the Arduino Serial Monitor
//
// SERIAL_PORT_USBVIRTUAL     Port which is USB virtual serial
//
// SERIAL_PORT_LINUXBRIDGE    Port which connects to a Linux system via Bridge library
//
// SERIAL_PORT_HARDWARE       Hardware serial port, physical RX & TX pins.
//
// SERIAL_PORT_HARDWARE_OPEN  Hardware serial ports which are open for use.  Their RX & TX
//                            pins are NOT connected to anything by default.
#define SERIAL_PORT_MONITOR   Serial
#define SERIAL_PORT_HARDWARE  Serial

#endif
