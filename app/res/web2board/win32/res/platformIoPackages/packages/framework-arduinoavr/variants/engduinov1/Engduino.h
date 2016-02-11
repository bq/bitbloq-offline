/*
 * Endruino.h
 * 
 * Vesrion	  Date		     By		Comment
 * 1.0.1	  12.04.2013	 Jan	Change ports to Arduino definition.
 * 1.0.0	  05.04.2013	 Jan	Initial release.
 *
 * \file
 *        Configuration file for the Endruino board.
 *
 * \authors
 *		  Stephen Hailes
 *        Jan Medvesek
 */

#ifndef __ENGDUINO_H__
#define __ENGDUINO_H__

// User LED
#define LED1   		13

// User Button
#define BUTTON  	 7

// RGB LED drivers - output enable lines
#define LED_R_OE  	10
#define LED_G_OE  	 9
#define LED_B_OE  	 8

// Data connection to the RGB LEDs
#define LED_MOSI	16
#define LED_MISO	14
#define LED_SCLK	15
#define LED_LATCH	11

// NTC
#define NTC  		 0

// IR transsceiver
#define IR_SD  		 4
#define IR_TX  		 1
#define IR_RX  		 0

// Accelerometer connection 
#define ACC_SDA  	 2
#define ACC_SCL  	 3
#define ACC_INT1 	 4
#define ACC_INT2 	 3

// External USART connection
#define USART_TXD  	 1
#define USART_RXD  	 0

// External I2C connection 
#define I2C_SDA  	 2
#define I2C_SCL  	 3


#endif
