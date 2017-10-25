#include "Arduino.h"
#include "BitbloqMBotDeprecated.h"
#include <MeMCore.h>


MBot::MBot(){
	boardLeds = new MeRGBLed(7);
	buzzer = new MeBuzzer();
	lightSensor = new MeLightSensor(6);
	leftMotor = new MeDCMotor(9);
	rightMotor = new MeDCMotor(10);
}

MBot::~MBot(){
	
	//check that all of them are not NULL pointers, delete and set to NULL
	if (boardLeds != NULL){
		delete boardLeds;
		boardLeds = NULL;
	}
	if (buzzer != NULL){
		delete buzzer;
		buzzer = NULL;
	}

	if (lightSensor != NULL){
		delete lightSensor;
		lightSensor = NULL;
	}

}

void MBot::init(){

}

void MBot::setLed(int led, int red, int green, int blue){
	boardLeds->setColor(led, red, green, blue);
	boardLeds->show();
}

void MBot::tone(int note, int beat){
	buzzer->tone(note, beat);
}

int MBot::getDistance(int port){
	MeUltrasonicSensor ultrasonicSensor(port);
	return ultrasonicSensor.distanceCm();
}

int MBot::getLineFollower(int port){
	MeLineFollower lineFollower(port);
	return lineFollower.readSensors();
}

int MBot::getButtonStatus(){
	return analogRead(A7);
}

int MBot::getLightSensor(){
	return lightSensor->read();
}

void MBot::move(int direction, int speed){
	int leftSpeed = 0;
	int rightSpeed = 0;
	if(direction == 1){
		leftSpeed = -speed; //adelante
		rightSpeed = speed;
		
	}else if(direction == 2){
		leftSpeed = speed;
		rightSpeed = -speed;
		
	}else if(direction == 3){
		leftSpeed = -speed; //derecha
		rightSpeed = -speed;
	}else if(direction == 4){
		
		leftSpeed = speed; //inzquierda
		rightSpeed = speed;
	}
	leftMotor->run(leftSpeed);
	rightMotor->run(rightSpeed);
}
