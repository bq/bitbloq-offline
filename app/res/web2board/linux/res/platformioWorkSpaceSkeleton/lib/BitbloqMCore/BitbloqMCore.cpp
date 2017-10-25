#include "Arduino.h"
#include "BitbloqMCore.h"


//setting ports value
const Port BitbloqMCore::ports[5] = {Port(-1,-1),Port(11,12),Port(9,10),Port(A2,A3),Port(A0,A1)};

BitbloqMCore::BitbloqMCore():
        buzzerPin(8),
        lightSensorPin(A6),
        buttonPin(A7),
        DCMotor2Dir(4),
        DCMotor2PWM(5),
        DCMotor1Dir(7),
        DCMotor1PWM(6),
        rgbLEDPin(13),
        IRTransmitterPin(3),
        IRReceiverPin(2)
{
	irControl = new Bitbloq::MakeblockIRControl(IRReceiverPin);
}


BitbloqMCore::~BitbloqMCore(){
	if(irControl != NULL){
		delete irControl;
		irControl=NULL;
	}

}

void BitbloqMCore::setup(){
    //sensors
    pinMode(lightSensorPin,INPUT);
    pinMode(buttonPin,INPUT);
    
    //actuators
    pinMode(buzzerPin,OUTPUT);
    boardLeds.setup(rgbLEDPin,2);
    
    //ir remote control
    irControl->setup();
}

void BitbloqMCore::setLed(int led, int red, int green, int blue){
	boardLeds.setColor(led, red, green, blue);
	boardLeds.show();
}

void BitbloqMCore::playTone(int note, int beat){
	tone(buzzerPin, note, beat);
}

char BitbloqMCore::getInfraredControlCommand()
{
	return irControl->getInfraredControlCommand();
}

int BitbloqMCore::readButtonStatus() const{
	return analogRead(A7);
}

bool BitbloqMCore::isButtonPushed() const{
    if (readButtonStatus() == 0) return true;
    else return false;
}
    
int BitbloqMCore::readLightSensor() const{
	return analogRead(lightSensorPin);
}
