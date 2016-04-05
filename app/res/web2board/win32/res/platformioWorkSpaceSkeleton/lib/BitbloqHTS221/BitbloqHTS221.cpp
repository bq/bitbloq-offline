/**
 * FILE: HTS221.h
 * AUTHOR: Raul de Pablos
 * PURPOSE: library for ST HTS221 sensor
 * VERSION: 0.0.2
 * HW VERSION: 0.0
 *     URL: http://www.bq.com
 *
 *
 * Changelog:
 *	20141022 - First version
 * 
 */
#include "BitbloqHTS221.h"
#include <Wire.h>

/*
 * Macros to make the library compatible with old and new Wire Library
 */
// #if defined(ARDUINO) && ARDUINO >= 100
#define WIRE_WRITE Wire.write
#define WIRE_READ  Wire.read
// #else
// #define WIRE_WRITE Wire.send
// #define WIRE_READ  Wire.receive
// #endif


/**
 * HTS221
 *
 * Constructor
 *
 */
HTS221::HTS221(void) {
}


/**
 * begin
 *
 * Initiates the device
 */
void HTS221::begin(void) {
	// Be sure to initialize I2C before calling this method. (Wire.begin();)
	
	// Device power up
	powerUp();
	// Save calibration values to obtain real temp. and hum. data
	readCalibration();
	// Prevent the reading of LSB and MSB related to different samples
//	updateMode(HTS221_BDU_ENABLED);
	updateMode(HTS221_BDU_DISABLED);		// When it is enabled, there are errors in the readings
	// One-shot by default
	outputDataRate(HTS221_ODR_ONE_SHOT);
	
	DEBUG("HTS221 - Device initialized\n\r");
}

/**
 * checkConnection
 *
 * Queries WHO_AM_I register and check that returned value is same as expected
 *
 * @return char - 0 if OK, 1 if FAIL
 */
char HTS221::checkConnection(void) {
	int temp;

	if((temp = readReg(HTS221_WHO_AM_I)) < 0) return 1;
	if((unsigned char)temp == HTS221_WAI_DFLT) return 0;
	else return 1;
	
}

/**
 * changeTempResolution
 *
 * Changes temperature averaged samples
 * 		Averaged Samples = 2^(param + 1) --> (2,4,8,16,32,64,128,256)
 * take into account that this changes sensor consumption and conversion time
 *
* @param char resolution - Resolution to be applied (HTS221_T_RES_AVG_2, ... , HTS221_T_RES_AVG_256)
 * @return char - != 0 if any error happened
 */
char HTS221::changeTempResolution(char resolution) {
	int temp;
	
	DEBUG("HTS221 - Changing Temperature Resolution to ");
	DEBUG(resolution);
	DEBUG("\n\r");
	
	if(((resolution & HTS221_T_RES_MASK) == 0) && (resolution != 0)) return 1;
	
	if((temp = readReg(HTS221_AV_CONF)) < 0) return 2;
	
	temp &= ~(HTS221_T_RES_MASK); // All AVGTx to 0
	temp |= resolution;
	
	if(writeReg(HTS221_AV_CONF, (unsigned char)temp) < 0) return 3;
	else return 0;
}

/**
 * changeHumResolution
 *
 * Changes humidity averaged samples
 * 		Averaged Samples = (4,8,16,32,64,128,256,512)
 * take into account that this changes sensor consumption
 *
* @param char resolution - Resolution to be applied (HTS221_H_RES_AVG_4, ... , HTS221_H_RES_AVG_512)
 * @return char - != 0 if any error happened
 */
char HTS221::changeHumResolution(char resolution) {
	int temp;
	
	DEBUG("HTS221 - Changing Humidity Resolution to ");
	DEBUG(resolution);
	DEBUG("\n\r");
	
	if(resolution > 7) return 1;
	
	if((temp = readReg(HTS221_AV_CONF)) < 0) return 2;
	
	temp &= ~(HTS221_H_RES_MASK); // All AVGHx to 0
	temp |= resolution;
	
	if(writeReg(HTS221_AV_CONF, (unsigned char)temp) < 0) return 3;
	else return 0;
}

/**
 * powerDown
 *
 * Power down mode
 *
 * @return char - != 0 if any error happened
 */
char HTS221::powerDown(void) {
	int temp;
	
	DEBUG("HTS221 - Powering down\n\r");
	
	if((temp = readReg(HTS221_CTRL_REG1)) < 0) return 1;
	
	temp &= ~(HTS221_PD);
	
	if(writeReg(HTS221_CTRL_REG1, (unsigned char)temp) < 0) return 2;
	else return 0;
}

/**
 * powerUp
 *
 * Disable power down mode
 *
 * @return char - != 0 if any error happened
 */
char HTS221::powerUp(void) {
	int temp;
	
	DEBUG("HTS221 - Powering up\n\r");
	
	if((temp = readReg(HTS221_CTRL_REG1)) < 0) return 1;
	
	temp |= HTS221_PD;
	
	if(writeReg(HTS221_CTRL_REG1, (unsigned char)temp) < 0) return 2;
	else return 0;
}


/**
 * updateMode
 *
 * Controls the block data update to avoid changing values while reading
 * upper and lower register parts
 *
 * @param char - HTS221_BDU_ENABLED | HTS221_BDU_DISABLED
 * @return char - != 0 if any error happened
 */
char HTS221::updateMode(char mode) {
	int temp;
	
	DEBUG("HTS221 - Changing mode to ");
	DEBUGF(mode, HEX);
	DEBUG("\n\r");
	
	if(mode > 1) return 1;
	
	if((temp = readReg(HTS221_CTRL_REG1)) < 0) return 2;
	
	if(!mode) temp &= ~(HTS221_BDU);
	else temp |= HTS221_BDU;
	
	if(writeReg(HTS221_CTRL_REG1, (unsigned char)temp) < 0) return 3;
	else return 0;
}


/**
 * outputDataRate
 *
 * Control the output data rates of humidity and temperature samples.
 * The default value is "one shot".
 *
 * @param char - HTS221_ODR_ONE_SHOT | HTS221_ODR_1HZ | HTS221_ODR_7HZ
 *					| HTS221_ODR_12_5HZ
 * @return char - != 0 if any error happened
 */
char HTS221::outputDataRate(char rate) {
	int temp;
	
	DEBUG("HTS221 - Changing data rate to ");
	DEBUGF(rate, HEX);
	DEBUG("\n\r");
	
	if(rate > 3) return 1;
	
	if((temp = readReg(HTS221_CTRL_REG1)) < 0) return 2;
	
	temp  &= ~(HTS221_ODR_MASK);
	temp |= rate;
	
	if(writeReg(HTS221_CTRL_REG1, (unsigned char)temp) < 0) return 3;
	else return 0;
}


/**
 * reboot
 *
 * Refresh the content of the internal registers
 *
 * @return char - != 0 if any error happened
 */
char HTS221::reboot(void) {

	DEBUG("HTS221 - Rebooting\n\r");
	
	if(writeReg(HTS221_CTRL_REG2, HTS221_BOOT) < 0) return 1;
	else return 0;
}


/**
 * heater
 *
 * Enables the internal heater which recover sensor in case of condensation.
 *
 * @return char - != 0 if any error happened
 */
char HTS221::heater(void) {
	DEBUG("HTS221 - Activating heater\n\r");
	if(writeReg(HTS221_CTRL_REG2, HTS221_HEATER) < 0) return 1;
	else return 0;
}

 
/**
 * startConversion
 *
 * If ONE_SHOT mode, starts a new conversion. Check tempAvailable() and
 * humAvailable() to know if data is ready. DRDY will interrupt if enabled
 *
 * @return char - != 0 if any error happened
 */
char HTS221::startConversion(void) {
	DEBUG("HTS221 - One-Shot Conversion started\n\r");
	if(writeReg(HTS221_CTRL_REG2, HTS221_ONE_SHOT) < 0) return 1;
	else return 0;
}

/* DRDY_H_L function non implemented. Always DRDY active high */
/* PP_OD function non implemented. Always PUSH-PULL on DRDY pin */


/**
 * enableDRDY
 *
 * Enables DRDY pin
 *
 * @return char - != 0 if any error happened
 */
char HTS221::enableDRDY(void) {
	int temp;
	
	DEBUG("HTS221 - DRDY Enabled\n\r");
	
	if((temp = readReg(HTS221_CTRL_REG3)) < 0) return 1;
	
	temp |= HTS221_DRDY;
	
	if(writeReg(HTS221_CTRL_REG3, (unsigned char)temp) < 0) return 2;
	else return 0;
}


/**
 * disableDRDY
 *
 * Disable DRDY pin
 *
 * @return char - != 0 if any error happened
 */
char HTS221::disableDRDY(void) {
	int temp;
	
	DEBUG("HTS221 - DRDY Disabled\n\r");
		
	if((temp = readReg(HTS221_CTRL_REG3)) < 0) return 1;
	
	temp &= ~(HTS221_DRDY);
	
	if(writeReg(HTS221_CTRL_REG3, (unsigned char)temp) < 0) return 2;
	else return 0;
}


/**
 * humAvailable
 *
 * Check if humidity data is available
 *
 * @return char - 1-data is available, 0-data still not available
 */
char HTS221::humAvailable(void) {
	int temp;
	
	if((temp = readReg(HTS221_STATUS_REG)) < 0) return 2;
	
	if((unsigned char)temp & HTS221_H_DA) {
		DEBUG("HTS221 - Humidity Available\n\r");
		return 1;
	}
	else return 0;
}


/**
 * tempAvailable
 *
 * Check if temperature data is available
 *
 * @return char - 1-data is available, 0-data still not available
 */
char HTS221::tempAvailable(void) {
	int temp;
		
	if((temp = readReg(HTS221_STATUS_REG)) < 0) return 2;

	if((unsigned char)temp & HTS221_T_DA) {
		DEBUG("HTS221 - Temperature Available\n\r");
		return 1;
	}
	else return 0;
}


/**
 * getHumidity
 *
 * High level method to read humidity. Polling if ONE_SHOT is configured
 *
 * @return int - humidity value
 */
float HTS221::getHumidity(void) {
	unsigned char temp;
	
	temp = (unsigned char)readReg(HTS221_CTRL_REG1);
	temp &= HTS221_ODR_MASK;
	
	if(temp == 0) {		// One shot configuration
		startConversion();
		while(!humAvailable());
	}
	
	return readHumidity();
}


/**
 * readHumidity
 *
 * Reads sensed humidity. This method doesn't check if there is
 * available humidity. If high level read is needed, call getHumidity()
 *
 * @return int - humidity value
 */
float HTS221::readHumidity(void) {
	unsigned char temp;
	int value;
	float result;
	
	value = readReg(HTS221_HUMIDITY_OUT_H);
	temp = (unsigned char)readReg(HTS221_HUMIDITY_OUT_L);
	value = (value << 8) | temp;
	
	DEBUG("HTS221 - H_OUT: ");
	DEBUGF(value, DEC);
	DEBUG("\n\r");

	result = (((float)value - H0_T0_out)/(H1_T0_out - H0_T0_out)) * (H1_rh - H0_rh) + H0_rh;
	
	if (result > 100.00) result = 100.00;
	else if (result < 0.00) result = 0.00;
	
	DEBUG("HTS221 - Humidity value readed: ");
	DEBUGF(result, 2);
	DEBUG("%");
	DEBUG("\n\r");
	
	return result;
}


/**
 * getTemperature
 *
 * High level method to read temperature. Polling if ONE_SHOT is configured
 *
 * @return int - temperature value
 */
float HTS221::getTemperature(void) {
	unsigned char temp;
	
	temp = (unsigned char)readReg(HTS221_CTRL_REG1);
	temp &= HTS221_ODR_MASK;
	
	if(temp == 0) {		// One shot configuration
		startConversion();
		while(!tempAvailable());
	}
	
	return readTemperature();
}


/**
 * readTemperature
 *
 * Reads sensed temperature. This method doesn't check if there is
 * available temperature. If high level read is needed, call getTemperature()
 *
 * @return int - temperature value
 */
float HTS221::readTemperature(void) {
	unsigned char temp;
	int value;
	float result;
	
	value = readReg(HTS221_TEMP_OUT_H);
	temp = (unsigned char)readReg(HTS221_TEMP_OUT_L);
	value = (value << 8) | temp;
	
	DEBUG("HTS221 - T_OUT: ");
	DEBUGF(value, DEC);
	DEBUG("\n\r");
	
	result = (((float)value - T0_out)/(T1_out - T0_out)) * (T1_degC - T0_degC) + T0_degC;
	
	DEBUG("HTS221 - Temperature value readed: ");
	DEBUGF(result, 2);
	DEBUG("\n\r");
	
	return result;
	// x100?
}


 /**
 * HTS221_readCalibration
 *
 * Reads calibration values
 * @return char - != 0 if any error happened
 */
char HTS221::readCalibration(void) {
	unsigned char T0_degC_x8_H;
	unsigned char T0_degC_x8_L;
	unsigned char T1_degC_x8_H;
	unsigned char T1_degC_x8_L;
	
	unsigned char H0_rh_x2;
	unsigned char H1_rh_x2;
	
	int temp;
		
	DEBUG("HTS221 - Reading Calibration: ");
	DEBUG("\n\r");
	
	/**
	 * Humidity calibration values
	 */
	if((temp = readReg(HTS221_H0_RH_X2)) < 0) return 1;
	H0_rh_x2 = (unsigned char)temp;
	H0_rh = H0_rh_x2 / 2.0;
	
	DEBUG("HTS221 - H0_rh: ");
	DEBUGF(H0_rh, 2);
	DEBUG("\n\r");
	
	if((temp = readReg(HTS221_H1_RH_X2)) < 0) return 2;
	H1_rh_x2 = (unsigned char)temp;
	H1_rh = H1_rh_x2 / 2.0;
	
	DEBUG("HTS221 - H1_rh: ");
	DEBUGF(H1_rh, 2);
	DEBUG("\n\r");
	
	if((temp = readReg(HTS221_H0_T0_OUT_L)) < 0) return 3;
	H0_T0_out = (unsigned char)temp;
	if((temp = readReg(HTS221_H0_T0_OUT_H)) < 0) return 4;
	H0_T0_out |= ((unsigned char)temp << 8);
	
	DEBUG("HTS221 - H0_T0_out: ");
	DEBUGF(H0_T0_out, DEC);
	DEBUG("\n\r");
	
	if((temp = readReg(HTS221_H1_T0_OUT_L)) < 0) return 5;
	H1_T0_out = (unsigned char)temp;
	if((temp = readReg(HTS221_H1_T0_OUT_H)) < 0) return 6;
	H1_T0_out |= ((unsigned char)temp << 8);
	
	DEBUG("HTS221 - H1_T0_out: ");
	DEBUGF(H1_T0_out, DEC);
	DEBUG("\n\r");
	
	
	/**
	 * Temperature calibration values
	 */
	if((temp = readReg(HTS221_T1T0_MSB)) < 0) return 7;
	T0_degC_x8_H = (unsigned char)(temp & 0x03);	
	if((temp = readReg(HTS221_T0_DEGC_X8)) < 0) return 8;
	T0_degC_x8_L = (unsigned char)temp;
	T0_degC = (((T0_degC_x8_H << 8) | T0_degC_x8_L)) / 8.0;

	DEBUG("HTS221 - T0_degC: ");
	DEBUGF(T0_degC, 2);
	DEBUG("\n\r");
	
	if((temp = readReg(HTS221_T1T0_MSB)) < 0) return 9;
	T1_degC_x8_H = (unsigned char)((temp & 0x0C) >> 2);
	if((temp = readReg(HTS221_T1_DEGC_X8)) < 0) return 10;
	T1_degC_x8_L = (unsigned char)temp;
	T1_degC = ((T1_degC_x8_H << 8) | T1_degC_x8_L) / 8.0;
	
	DEBUG("HTS221 - T1_degC: ");
	DEBUGF(T1_degC, 2);
	DEBUG("\n\r");
	
	if((temp = readReg(HTS221_T0_OUT_L)) < 0) return 11;
	T0_out = (unsigned char)temp;
	if((temp = readReg(HTS221_T0_OUT_H)) < 0) return 12;
	T0_out |= ((unsigned char)temp << 8);
	
	DEBUG("HTS221 - T0_out: ");
	DEBUGF(T0_out, DEC);
	DEBUG("\n\r");
	
	if((temp = readReg(HTS221_T1_OUT_L)) < 0) return 13;
	T1_out = (unsigned char)temp;
	if((temp = readReg(HTS221_T1_OUT_H)) < 0) return 14;
	T1_out |= ((unsigned char)temp << 8);
	
	DEBUG("HTS221 - T1_out: ");
	DEBUGF(T1_out, DEC);
	DEBUG("\n\r");
	
	return 0;
}


/**
 * writeReg
 *
 * Writes values to the device through I2C
 *
 * @param char address - Device register to write to
 * @param char data - Data to write
 * @param return int -1 if any error happened
 */
int HTS221::writeReg(unsigned char address, unsigned char data) {
	Wire.beginTransmission(HTS221_ADDR);
	WIRE_WRITE(address);
	WIRE_WRITE(data);
	if(Wire.endTransmission() != 0) {
		DEBUG("HTS221 - I2C Transmission ERROR\n\r");
		LDEBUG("Address: 0x");
		LDEBUGF(address, HEX);
		LDEBUG(", Data: 0x");
		LDEBUGF(data, HEX);
		LDEBUG("\n\r");
		return -1;
	}
	else {
		LDEBUG("HTS221 - I2C Transmission OK\n\r");
		LDEBUG("Address: 0x");
		LDEBUGF(address, HEX);
		LDEBUG(", Data: 0x");
		LDEBUGF(data, HEX);
		LDEBUG("\n\r");
		return 0;
	}
}


/**
 * readReg
 *
 * Read values from the device through I2C
 *
 * @param char address - Device register to read from
 * @return int -1 if any error happened >0 data
 */
int HTS221::readReg(unsigned char address) {
#if HTS221_DEBUG == 2
	int result;
#endif

	Wire.beginTransmission(HTS221_ADDR);
	WIRE_WRITE(address);
	if(Wire.endTransmission() != 0) {
		DEBUG("HTS221 - I2C Reception ERROR\n\r");
		LDEBUG("Address: 0x");
		LDEBUGF(address, HEX);
		LDEBUG("\n\r");
		return -1;
	}
	
	Wire.requestFrom(HTS221_ADDR, 1);
	if(Wire.available() == 1) {
		LDEBUG("HTS221 - I2C Reception OK\n\r");
		LDEBUG("Address: 0x");
		LDEBUGF(address, HEX);
		#if HTS221_DEBUG == 2
			result = WIRE_READ();
			LDEBUG(", Data: 0x");
			LDEBUGF(result, HEX);
			LDEBUG("\n\r");
			return result;
		#else
			return WIRE_READ();
		#endif
	} else {
		DEBUG("HTS221 - I2C Reception ERROR\n\r");
		LDEBUG("Address: 0x");
		LDEBUGF(address, HEX);
		LDEBUG("\n\r");
		return -1;
	}
}


 
 
 
 
 
 
 