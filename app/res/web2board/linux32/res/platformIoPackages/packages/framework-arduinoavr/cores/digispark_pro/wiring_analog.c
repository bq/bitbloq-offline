/*
  wiring_analog.c - analog input and output
  Part of Arduino - http://www.arduino.cc/

  Copyright (c) 2005-2006 David A. Mellis

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

  $Id: wiring.c 248 2007-02-03 15:36:30Z mellis $

  Modified  28-08-2009 for attiny84 R.Wiersma
  Modified  14-10-2009 for attiny45 Saposoft
  Corrected 17-05-2010 for ATtiny84 B.Cook
*/

#include "wiring_private.h"
#include "pins_arduino.h"

#ifndef DEFAULT
//For those with no ADC, need to define default.
#define DEFAULT (0)
#endif

uint8_t analog_reference = DEFAULT;

void analogReference(uint8_t mode)
{
  // can't actually set the register here because the default setting
  // will connect AVCC and the AREF pin, which would cause a short if
  // there's something connected to AREF.
  // fix? Validate the mode?
  analog_reference = mode;
}



int analogRead(uint8_t pin)
{
  #if defined( NUM_DIGITAL_PINS )
  if ( pin >= NUM_DIGITAL_PINS ) pin -= NUM_DIGITAL_PINS; // allow for channel or pin numbers
  #endif
  
  // fix? Validate pin?
  if(pin >= NUM_ANALOG_INPUTS) return 0; //Not a valid pin.
  //if(pin < 4) return 9; //Not a valid pin.
  #ifndef ADCSRA
  return digitalRead(analogInputToDigitalPin(pin)) ? 1023 : 0; //No ADC, so read as a digital pin instead.
  #endif
  
  #if defined(ADMUX)
  #if defined(MUX4)
  ADMUX = ((analog_reference & 0x03) << REFS0) | ((pin & 0x1F) << MUX0); //select the channel and reference
  #elif defined(MUX3)
  ADMUX = ((analog_reference & 0x03) << REFS0) | ((pin & 0x0F) << MUX0); //select the channel and reference
  #else
  ADMUX = ((analog_reference & 0x03) << REFS0) | ((pin & 0x07) << MUX0); //select the channel and reference
  #endif
  #endif
  #if defined(REFS2)
  ADMUX |= (((analog_reference & 0x04) >> 2) << REFS2); //some have an extra reference bit in a weird position.
  #endif
  
  #if defined(HAVE_ADC) && HAVE_ADC
  sbi(ADCSRA, ADSC); //Start conversion

  while(ADCSRA & (1<<ADSC)); //Wait for conversion to complete.

  uint8_t low = ADCL;
  uint8_t high = ADCH;
  return (high << 8) | low;
  #else
  return LOW;
  #endif
}

void pwmReset()
{
  cbi(TCCR1D, OC1AV);
  cbi(TCCR1D, OC1AU);
  cbi(TCCR1D, OC1AW);
  cbi(TCCR1D, OC1AX);
  cbi(TCCR1D, OC1BV);
  cbi(TCCR1D, OC1BU);
  cbi(TCCR1D, OC1BW);
  cbi(TCCR1D, OC1BX);
}
void pwmWrite(uint8_t channel, int val)
{
  if( channel == TIMER1A){
    // connect pwm to pin on timer 1, channel A
    sbi(TCCR1A, COM1A1);
    sbi(TCCR1A, WGM10);
    cbi(TCCR1A, COM1A0);
    sbi(TCCR1B, WGM10);
    sbi(TCCR1B, CS11);
    //sbi(TCCR1B, CS10);
    OCR1A = val; // set pwm duty
  } else if( channel == TIMER1B){
    // connect pwm to pin on timer 1, channel B
    sbi(TCCR1A, COM1B1);
    sbi(TCCR1A, WGM10);
    cbi(TCCR1A, COM1B0);
    sbi(TCCR1B, WGM10);
    sbi(TCCR1B, CS11);
    //sbi(TCCR1B, CS10);
    OCR1B = val; // set pwm duty
  } 
}

void pwmConnect(uint8_t pin)
{
  pinMode(pin,OUTPUT);
  if(pin == 2)
    sbi(TCCR1D, OC1AV);
  else if(pin == 0)
    sbi(TCCR1D, OC1AU);
  //  cbi(TCCR1D, OC1AW);//used by crystal
  else if(pin == 3)
    sbi(TCCR1D, OC1AX);
  else if(pin == 4)
    sbi(TCCR1D, OC1BV);
  else if(pin == 1)
    sbi(TCCR1D, OC1BU);
  //  cbi(TCCR1D, OC1BW);//used by crystal
  //  sbi(TCCR1D, OC1BX);//reset pin

}
void pwmDisconnect(uint8_t pin)
{
  pinMode(pin,OUTPUT);
  if(pin == 2)
    cbi(TCCR1D, OC1AV);
  else if(pin == 0)
    cbi(TCCR1D, OC1AU);
  //  cbi(TCCR1D, OC1AW);//used by crystal
  else if(pin == 3)
    cbi(TCCR1D, OC1AX);
  else if(pin == 4)
    cbi(TCCR1D, OC1BV);
  else if(pin == 1)
    cbi(TCCR1D, OC1BU);
  //  cbi(TCCR1D, OC1BW);//used by crystal
  //  cbi(TCCR1D, OC1BX);//reset pin

}



// Right now, PWM output only works on the pins with
// hardware support.  These are defined in the appropriate
// pins_*.c file.  For the rest of the pins, we default
// to digital output.
void analogWrite(uint8_t pin, int val)
{
  // We need to make sure the PWM output is enabled for those pins
  // that support it, as we turn it off when digitally reading or
  // writing with them.  Also, make sure the pin is in output mode
  // for consistenty with Wiring, which doesn't require a pinMode
  // call for the analog output pins.
  pinMode(pin, OUTPUT);

  if (val <= 0)
  {
    digitalWrite(pin, LOW);
  }
  else if (val >= 255)
  {
    digitalWrite(pin, HIGH);
  }
  else
  {
    uint8_t timer = digitalPinToTimer(pin);



	if( timer == TIMER0A){
		// connect pwm to pin 8 on timer 0, channel A
		sbi(TCCR0A, COM0A1);
		cbi(TCCR0A, COM0A0);
    sbi(TCCR0A, WGM01);
    sbi(TCCR0A, WGM00);
		OCR0A = val; // set pwm duty
	} else

	if( timer == TIMER1A){
		// connect pwm to pin on timer 1, channel A
    sbi(TCCR1A, COM1A1);
		sbi(TCCR1A, WGM10);
    cbi(TCCR1A, COM1A0);
    sbi(TCCR1B, WGM10);
    sbi(TCCR1B, CS11);
		//sbi(TCCR1B, CS10);

		cbi(TCCR1D, OC1AV);
		cbi(TCCR1D, OC1AU);
		cbi(TCCR1D, OC1AW);
		cbi(TCCR1D, OC1AX);

    if(pin == 2)
      sbi(TCCR1D, OC1AV);
    else if(pin == 0)
      sbi(TCCR1D, OC1AU);
    else if(pin == 3)
      sbi(TCCR1D, OC1AX);



		OCR1A = val; // set pwm duty
	} else





	if( timer == TIMER1B){
		// connect pwm to pin on timer 1, channel B
    sbi(TCCR1A, COM1B1);
		sbi(TCCR1A, WGM10);
		cbi(TCCR1A, COM1B0);
    sbi(TCCR1B, WGM10);
    sbi(TCCR1B, CS11);
    //sbi(TCCR1B, CS10);

		cbi(TCCR1D, OC1BV);
		cbi(TCCR1D, OC1BU);
		cbi(TCCR1D, OC1BW);
		cbi(TCCR1D, OC1BX);
    
    if(pin == 4)
      sbi(TCCR1D, OC1BV);
    else if(pin == 1)
      sbi(TCCR1D, OC1BU);

		OCR1B = val; // set pwm duty
	} else
    {
      if (val < 128)
      {
        digitalWrite(pin, LOW);
      }
      else
      {
        digitalWrite(pin, HIGH);
      }
    }

  }
}
