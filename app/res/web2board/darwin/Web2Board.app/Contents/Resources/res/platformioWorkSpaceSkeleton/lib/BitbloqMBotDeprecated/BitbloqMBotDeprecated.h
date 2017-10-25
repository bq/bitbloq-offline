
/******************************************************************************
* MakeBlock MBot control library for Bitbloq
* 
*
* @author Tomas Calvo - tomas.calvo@bq.com
* @author Alberto Valero - alberto.valero@bq.com
*
******************************************************************************/

#ifndef BITBLOQMBOTDEPRECATED_H
#define BITBLOQMBOTDEPRECATED_H

class MeRGBLed;
class MeBuzzer;
class MeLightSensor;
class MeDCMotor;

class MBot
{

	public:
		MBot(); //public constructor
		virtual ~MBot(); //virtual public destructor

		void init();
		
		/**
		 * Choose led and set color
		 * @param led led number
		 * @param red red component of rgb color
		 * @param green green component of rgb color
		 * @param blue blue component of rgb color
		 */
		void setLed(int led, int red, int green, int blue);
		void tone(int note, int beat);
		/**
		 * gets distance measured by US sensor
		 * @param port port number
		 * @return distance in cm*/
		int getDistance(int port);
		/**
		 * gets wether buttons is pressed or not
		 * @return button status
		 */
		int getButtonStatus();
		/**
		 * Gets LDR sensor measure (analog)
		 * @return LDR reading
		 */
		int getLightSensor();
		/**
		 * gets IR sensor status (digital)
		 * @param IR sensor pin
		 * @return IR sensor status
		 */
		int getLineFollower(int port);
		void move(int direction, int speed);

	private:
		MeRGBLed* boardLeds;
		MeBuzzer* buzzer;
		MeLightSensor* lightSensor;
		MeDCMotor* leftMotor;
		MeDCMotor* rightMotor;
};

#endif
