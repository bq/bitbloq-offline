#ifndef HTS221_H
#define HTS221_H
/**
 * FILE: HTS221.h
 * AUTHOR: Raul de Pablos
 * PURPOSE: library for ST HTS221 sensor
 * VERSION: 0.0.2
 * HW VERSION: 0.0
 *     URL: http://www.bq.com
 *
 */
#include "HTS221_Registers.h"

// #if defined(ARDUINO) && ARDUINO >= 100
#include "Arduino.h"
// #else
// #include "WProgram.h"
// #include "Wstring.h"
// #include "Wiring.h"
// #endif

/**
 * 0 - No debug
 * 1 - High Level debug
 * 2 - Low Level debug
 */
#define HTS221_DEBUG 0

#if HTS221_DEBUG == 1
 #define DEBUG(string) Serial.print(string)
 #define DEBUGF(string, format) Serial.print(string, format)
 #define LDEBUG(string) ;
 #define LDEBUGF(string, format) ;
#elif HTS221_DEBUG == 2
 #define DEBUG(string) Serial.print(string)
 #define DEBUGF(string, format) Serial.print(string, format)
 #define LDEBUG(string) Serial.print(string)
 #define LDEBUGF(string, format) Serial.print(string, format)
#else
 #define DEBUG(string) ;
 #define DEBUGF(string, format) ;
 #define LDEBUG(string) ;
 #define LDEBUGF(string, format) ;
#endif


class HTS221 {
public:
    /**
    * Constructor
    */
    HTS221(void);

	/**
	 * Methods
	 */
	void begin(void);
    char checkConnection(void);
	char changeTempResolution(char resolution);
	char changeHumResolution(char resolution);
	char powerDown(void);
	char powerUp(void);
	char updateMode(char mode);
	char outputDataRate(char rate);
	char reboot(void);
	char heater(void);
	char startConversion(void);
/* DRDY_H_L function non implemented. Always DRDY active high */
/* PP_OD function non implemented. Always PUSH-PULL on DRDY pin */
	char enableDRDY(void);
	char disableDRDY(void);
	char humAvailable(void);
	char tempAvailable(void);
	float getHumidity(void);
	float readHumidity(void);
	float getTemperature(void);
	float readTemperature(void);


private:
	// Temperature values for calibration
	float T0_degC;
	float T1_degC;
	int T0_out;
	int T1_out;
	
	// Humidity values for calibration
	float H0_rh;
	float H1_rh;
	int H0_T0_out;
	int H1_T0_out;
	
	
	char readCalibration(void);
	int writeReg(unsigned char address, unsigned char data);
	int readReg(unsigned char address);
    
};




#endif
// END OF FILE
