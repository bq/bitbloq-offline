/*
 * Engduino.h
 * EngduinoV3
 * 
 * Vesrion	  Date			By		Comment
 * 1.0.2	  06.03.2014	Jan		Engduino V3 definitions.
 * 1.0.1	  12.04.2013	Jan		Change ports to Arduino definition.
 * 1.0.0	  05.04.2013	Jan		Initial release.
 *
 * \file
 *        Configuration file for the Endruino board.
 *
 * \author
 *	Engduino team: support@engduino.org
 */

#ifndef __ENGDUINO_H__
#define __ENGDUINO_H__


// User LED
#define LED1   		13

// User Button
#define BUTTON  	 7

// RGB LED drivers - output enable lines
#define LED_R_OE  	11
#define LED_G_OE  	10
#define LED_B_OE  	 9

// Data connection to the RGB LEDs
#define LED_MOSI	16
#define LED_MISO	14
#define LED_SCLK	15
#define LED_LATCH	12

//LED pins with regard to ports, used for better performance, digitalWrite is slow
#define LED_MOSI_PORT	PORTB
#define LED_MOSI_BIT	PORTB2
#define LED_MISO_PORT	PORTB
#define LED_MISO_BIT	PORTB3
#define LED_SCLK_PORT	PORTB
#define LED_SCLK_BIT	PORTB1
#define LED_LATCH_PORT	PORTD
#define LED_LATCH_BIT	PORTD6

// NTC
#define NTC  		 5

// IR transsceiver
#define IR_SD  		 4
#define IR_TX  		 6
#define IR_RX  		 8
#define IR_RX_PORT	 PINB
#define IR_RX_BIT	 PORTB4

// Accelerometer connection 
#define ACC_SDA  	 2
#define ACC_SCL  	 3

// Light sensor 
#define LIGHTSENSOR	A4

// SD Card
#define SDCARD_CS	 	5
#define SDCARD_ATTACHED	A1

// External USART connection
#define USART_TXD  	 1
#define USART_RXD  	 0

// External I2C connection 
#define I2C_SDA  	 2
#define I2C_SCL  	 3

// SPI Bus
#define SPI_SS_PIN	 17


#endif
