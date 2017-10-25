#include "Arduino.h"

#include "BitbloqMBotRanger.h"


BitbloqMBotRanger::BitbloqMBotRanger(int lineFollowerPort, int USPort):
        BitbloqAuriga(),
        leftLineFollowerPin(-1),
        rightLineFollowerPin(-1),
        usTriggerPin(-1),
        usEchoPin(-1)
{
    if (lineFollowerPort != -1){
		rightLineFollowerPin = ports[lineFollowerPort][1];
		leftLineFollowerPin = ports[lineFollowerPort][1];
	}
	
	if (USPort != -1){
		usTriggerPin = ports[USPort][2]; /// this is weird. There are two components, but only one signal.
		usEchoPin = ports[USPort][2];
	}
}


BitbloqMBotRanger::~BitbloqMBotRanger(){
	
}


void BitbloqMBotRanger::setLineFollowerPort(int port){
    rightLineFollowerPin = ports[port][1];
    leftLineFollowerPin = ports[port][2];
}

void BitbloqMBotRanger::setUSPort(int port){
    usTriggerPin = ports[port][2]; /// this is weird. There are two components, but only one signal.
    usEchoPin = ports[port][2];
}



void BitbloqMBotRanger::setup(){
    BitbloqAuriga::setup();

    //set PinMode if pins are defined (otherwise pins = -1)
    
    if (leftLineFollowerPin != -1 && rightLineFollowerPin != -1){
		pinMode(leftLineFollowerPin,INPUT);
		pinMode(rightLineFollowerPin, INPUT);
    }
    
    if (usTriggerPin != -1){
		//initialize usSensor
		usSensor.setup(usTriggerPin,usEchoPin);
	}
        
    //dc motors setup
    rightDCMotor.setup(48,49,11);
    leftDCMotor.setup(47,46,10);
}


int BitbloqMBotRanger::readLeftLineFollowerSensor() const{
    return (leftLineFollowerPin != -1 ? digitalRead(leftLineFollowerPin) : -1) ;
}

int BitbloqMBotRanger::readRightLineFollowerSensor() const{
    return (leftLineFollowerPin != -1 ? digitalRead(rightLineFollowerPin) : -1 );
}


int BitbloqMBotRanger::readUSMeasuredDistanceCM(){
	return (usTriggerPin != -1 ? usSensor.readDistanceInCM(): - 1 ); //in centimeters
}

int BitbloqMBotRanger::readUSMeasuredDistanceIN(){
	return (usTriggerPin != -1 ? usSensor.readDistanceInInches() : -1); //in inches
}
    
void BitbloqMBotRanger::move(int direction, int speed){
	int leftSpeed = 0;
	int rightSpeed = 0;
	if(direction == 1){ //forward
		leftSpeed = speed; 
		rightSpeed = speed;
	}else if(direction == 2){ //backwards
		leftSpeed = -speed;
		rightSpeed = -speed;	
	}else if(direction == 3){ //right
		leftSpeed = speed; 
		rightSpeed = -speed;
	}else if(direction == 4){ //left
		leftSpeed = -speed; 
		rightSpeed = speed;
	}

    setLeftMotorSpeed(leftSpeed);
    setRightMotorSpeed(rightSpeed);
}

void BitbloqMBotRanger::setRightMotorSpeed(int speed){
    rightDCMotor.setSpeed(speed);
}

void BitbloqMBotRanger::setLeftMotorSpeed(int speed){
    leftDCMotor.setSpeed(speed);
}

