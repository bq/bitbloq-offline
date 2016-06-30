/*
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

  $Id: wiring.h 249 2007-02-03 16:52:51Z mellis $
*/

#ifndef Pins_Arduino_h
#define Pins_Arduino_h

#include <avr/pgmspace.h>

#define NUM_DIGITAL_PINS            32
#define NUM_ANALOG_INPUTS           8
#define analogInputToDigitalPin(p)  ((p < 8) ? (p) + 24 : -1)
#define digitalPinHasPWM(p)         ((p) == 2 || (p) == 3 || (p) == 4 || (p) == 5 || (p) == 21 || (p) == 22 || (p) == 23)

#define RX0             0
#define TX0             1

#define D2              2
#define D3              3
#define D4              4
#define D5              5
#define D6              6
#define D7              7
#define D8              8

#define SS              9
#define MOSI            10
#define MISO            11
#define SCK             12
#define RX1             13
#define TX1             14
#define SCL             15
#define SDA             16

#define VCC_ENABLE      17
#define BATT_ALERT      18
#define BACKPACK_BUS    19
#define CHG_STATUS      20
#define LED_BLUE        21
#define LED_RED         22
#define LED_GREEN       23
#define LED_BUILTIN     23
#define LED             23

#define A0              24
#define A1              25
#define A2              26
#define A3              27
#define A4              28
#define A5              29
#define A6              30
#define A7              31

#define analogPinToChannel(p) ((p)>=A0?(p)-A0:(p))

// ~: PWM, *: external interrupt
// Pin num   Pin functions     Connected to / label on board
// D0:  PE0  RXD0/PCINT8       RX0 (Connected to 16u2 USB chip)
// D1:  PE1  TXD0              TX0 (Connected to 16u2 USB chip)
// D2:  PB7  OC0A/OC1C/PCINT7  D2~
// D3:  PE3  AIN1/OC3A         D3~
// D4:  PE4  INT4/OC3B         D4*~
// D5:  PE5  INT5/OC3C         D5*~
// D6:  PE2  AIN0/XCK0         D6
// D7:  PE6  INT6/T3           D7*
// D8:  PD5  XCK1              D8
// D9:  PB0  SS/PCINT0         SS
// D10: PB2  MOSI/PDI/PCINT2   MOSI
// D11: PB3  MISO/PDO/PCINT3   MISO
// D12: PB1  SCK/PCINT1        SCK
// D13: PD2  INT2/RXD1         RX1*
// D14: PD3  INT3/TXD1         TX1*
// D15: PD0  INT0/SCL          SCL*
// D16: PD1  INT1/SDA          SDA*
// D17: PD4  ICP1              VCC_ENABLE (Controls 3V3 pin)
// D18: PE7  INT7/ICP3/CLK0    BATT_ALERT* (Connected to charge controller)
// D19: PD6  T1                BACKPACK_BUS
// D20: PD7  T0                CHG_STATUS (Connected to charge controller)
// D21: PB4  OC2A/PCINT4       LED_BLUE~ (On-board RGB led)
// D22: PB5  OC1A/PCINT5       LED_RED~ (On-board RGB led)
// D23: PB6  OC1B/PCINT6       LED_GREEN~  (On-board RGB led)
// D24: PF0  ADC0              A0
// D25: PF1  ADC1              A1
// D26: PF2  ADC2/DIG2         A2
// D27: PF3  ADC3/DIG4         A3
// D28: PF4  ADC4/TCK          A4
// D29: PF5  ADC5/TMS          A5
// D30: PF6  ADC6/TDO          A6
// D31: PF7  ADC7/TDI          A7
//
// These pins are not connected / don't have a pin
// number:
// PG5 OC0B
// PG4 TOSC1 (Connected to RTC Xtal 32.768Khz)
// PG3 TOSC2 (Connected to RTC Xtal 32.768Khz)
// PG2 AMR
// PG1 DIG1
// PG0 DIG3
//
// Interrupt mapping
//   Note that the interrupt numbers (as passed to attachInterrupt) do
//   _not_ correspond directly to the INTx values in the datasheet,
//   due to the way the Arduino core maps them (probably for backward
//   compatibility).
//
// Number  Pin          Datasheet name
// 0       D4           INT4
// 1       D5           INT5
// 2       SCL          INT0
// 3       SDA          INT1
// 4       RX1          INT2
// 5       TX1          INT3
// 6       D7           INT6
// 7       BATT_ALERT   INT7
//

// Arduino.h only defines the Px constants when ARDUINO_MAIN is defined,
// so we just copy it here (with a PINOCCIO_ prefix to prevent
// collisions).
#define PINOCCIO_PB 2
// Function to convert a mask with a single bit enabled back to the bit
// number of the enabled bit. We need this, because digitalPinToBitMask
// returns a bitmask and we want to use it in digitalPinToPCMSKbit,
// which uses a bit number...
#ifdef __cplusplus
constexpr
#endif
inline uint8_t pinoccio_mask_to_bit(uint8_t mask) {
  return (mask == 0) ? -1 : (pinoccio_mask_to_bit(mask >> 1) + 1);
}

#define digitalPinToPCICR(p)    ((p) == 0 || digitalPinToPort(p) == PINOCCIO_PB ? (&PCICR) : ((uint8_t *)0))
#define digitalPinToPCICRbit(p) ((p) == 0 ? PCIE1 : (digitalPinToPort(p) == PINOCCIO_PB ? PCIE0 : 0))
#define digitalPinToPCMSK(p)    ((p) == 0 ? (&PCMSK1) : (digitalPinToPort(p) == PINOCCIO_PB ? &PCMSK0 :((uint8_t *)0)))
#define digitalPinToPCMSKbit(p) ((p) == 0 ? PCINT8 : (digitalPinToPort(p) == PINOCCIO_PB ? pinoccio_mask_to_bit(digitalPinToBitMask(p)) : -1))

#ifdef ARDUINO_MAIN

const uint16_t PROGMEM port_to_mode_PGM[] = {
  NOT_A_PORT,
  NOT_A_PORT,
  (uint16_t)&DDRB,
  NOT_A_PORT,
  (uint16_t)&DDRD,
  (uint16_t)&DDRE,
  (uint16_t)&DDRF,
  (uint16_t)&DDRG,
  NOT_A_PORT,
  NOT_A_PORT,
  NOT_A_PORT,
  NOT_A_PORT,
  NOT_A_PORT,
};

const uint16_t PROGMEM port_to_output_PGM[] = {
  NOT_A_PORT,
  NOT_A_PORT,
  (uint16_t)&PORTB,
  NOT_A_PORT,
  (uint16_t)&PORTD,
  (uint16_t)&PORTE,
  (uint16_t)&PORTF,
  (uint16_t)&PORTG,
  NOT_A_PORT,
  NOT_A_PORT,
  NOT_A_PORT,
  NOT_A_PORT,
  NOT_A_PORT,
};

const uint16_t PROGMEM port_to_input_PGM[] = {
  NOT_A_PIN,
  NOT_A_PIN,
  (uint16_t)&PINB,
  NOT_A_PIN,
  (uint16_t)&PIND,
  (uint16_t)&PINE,
  (uint16_t)&PINF,
  (uint16_t)&PING,
  NOT_A_PIN,
  NOT_A_PIN,
  NOT_A_PIN,
  NOT_A_PIN,
  NOT_A_PIN,
};

const uint8_t PROGMEM digital_pin_to_port_PGM[] = {
  /*  D0: */ PE,
  /*  D1: */ PE,
  /*  D2: */ PB,
  /*  D3: */ PE,
  /*  D4: */ PE,
  /*  D5: */ PE,
  /*  D6: */ PE,
  /*  D7: */ PE,
  /*  D8: */ PD,
  /*  D9: */ PB,
  /* D10: */ PB,
  /* D11: */ PB,
  /* D12: */ PB,
  /* D13: */ PD,
  /* D14: */ PD,
  /* D15: */ PD,
  /* D16: */ PD,
  /* D17: */ PD,
  /* D18: */ PE,
  /* D19: */ PD,
  /* D20: */ PD,
  /* D21: */ PB,
  /* D22: */ PB,
  /* D23: */ PB,
  /* D24: */ PF,
  /* D25: */ PF,
  /* D26: */ PF,
  /* D27: */ PF,
  /* D28: */ PF,
  /* D29: */ PF,
  /* D30: */ PF,
  /* D31: */ PF,
};

const uint8_t PROGMEM digital_pin_to_bit_mask_PGM[] = {
  /*  D0: */ _BV(PE0),
  /*  D1: */ _BV(PE1),
  /*  D2: */ _BV(PB7),
  /*  D3: */ _BV(PE3),
  /*  D4: */ _BV(PE4),
  /*  D5: */ _BV(PE5),
  /*  D6: */ _BV(PE2),
  /*  D7: */ _BV(PE6),
  /*  D8: */ _BV(PD5),
  /*  D9: */ _BV(PB0),
  /* D10: */ _BV(PB2),
  /* D11: */ _BV(PB3),
  /* D12: */ _BV(PB1),
  /* D13: */ _BV(PD2),
  /* D14: */ _BV(PD3),
  /* D15: */ _BV(PD0),
  /* D16: */ _BV(PD1),
  /* D17: */ _BV(PD4),
  /* D18: */ _BV(PE7),
  /* D19: */ _BV(PD6),
  /* D20: */ _BV(PD7),
  /* D21: */ _BV(PB4),
  /* D22: */ _BV(PB5),
  /* D23: */ _BV(PB6),
  /* D24: */ _BV(PF0),
  /* D25: */ _BV(PF1),
  /* D26: */ _BV(PF2),
  /* D27: */ _BV(PF3),
  /* D28: */ _BV(PF4),
  /* D29: */ _BV(PF5),
  /* D30: */ _BV(PF6),
  /* D31: */ _BV(PF7),
};

const uint8_t PROGMEM digital_pin_to_timer_PGM[] = {
  /*  D0: */ NOT_ON_TIMER,
  /*  D1: */ NOT_ON_TIMER,
  /*  D2: */ TIMER0A,
  /*  D3: */ TIMER3A,
  /*  D4: */ TIMER3B,
  /*  D5: */ TIMER3C,
  /*  D6: */ NOT_ON_TIMER,
  /*  D7: */ NOT_ON_TIMER,
  /*  D8: */ NOT_ON_TIMER,
  /*  D9: */ NOT_ON_TIMER,
  /* D10: */ NOT_ON_TIMER,
  /* D11: */ NOT_ON_TIMER,
  /* D12: */ NOT_ON_TIMER,
  /* D13: */ NOT_ON_TIMER,
  /* D14: */ NOT_ON_TIMER,
  /* D15: */ NOT_ON_TIMER,
  /* D16: */ NOT_ON_TIMER,
  /* D17: */ NOT_ON_TIMER,
  /* D18: */ NOT_ON_TIMER,
  /* D19: */ NOT_ON_TIMER,
  /* D20: */ NOT_ON_TIMER,
  /* D21: */ TIMER2A,
  /* D22: */ TIMER1A,
  /* D23: */ TIMER1B,
  /* D24: */ NOT_ON_TIMER,
  /* D25: */ NOT_ON_TIMER,
  /* D26: */ NOT_ON_TIMER,
  /* D27: */ NOT_ON_TIMER,
  /* D28: */ NOT_ON_TIMER,
  /* D29: */ NOT_ON_TIMER,
  /* D30: */ NOT_ON_TIMER,
  /* D31: */ NOT_ON_TIMER,
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
#define SERIAL_PORT_MONITOR         Serial
#define SERIAL_PORT_HARDWARE        Serial
#define SERIAL_PORT_HARDWARE1       Serial1
#define SERIAL_PORT_HARDWARE2       Serial2
#define SERIAL_PORT_HARDWARE3       Serial3
#define SERIAL_PORT_HARDWARE_OPEN   Serial1
#define SERIAL_PORT_HARDWARE_OPEN1  Serial2
#define SERIAL_PORT_HARDWARE_OPEN2  Serial3

#endif