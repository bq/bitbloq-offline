#include "Arduino.h"
#include "BitbloqAuriga.h"

//setting Auriga ports values
const Port BitbloqAuriga::ports[11] = {Port(-1,-1),Port(4,5),Port(2,3),Port(6,7),Port(8,9),Port(17,16), Port(A10,A15),Port(A9,A14),Port(A8,A13),Port(A7,A12),Port(A6,A11)};

BitbloqAuriga::BitbloqAuriga():
        powerSensorPin(A4),
        lightSensor1Pin(A3),
        lightSensor2Pin(A2),
        soundSensorPin(A1),
        temperatureSensorPin(A0),
        RGBLedsPin(44),
        buzzerPin(45),
        gyro(ports[1][1], ports[1][2],0x69)
{
}

BitbloqAuriga::~BitbloqAuriga(){	
	//check that all of them are not NULL pointers, delete and set to NULL

}

void BitbloqAuriga::setup(){
    
    pinMode(powerSensorPin,INPUT);
    pinMode(lightSensor1Pin,INPUT);
    pinMode(lightSensor2Pin,INPUT);
    pinMode(soundSensorPin,INPUT);
    pinMode(temperatureSensorPin,INPUT);
    pinMode(buzzerPin,OUTPUT);
    boardLeds.setup(RGBLedsPin,12);
    gyro.begin();
}


/**
 * Returns 1 when powered on and 0 when powered off
 */
int BitbloqAuriga::readPowerStatus() const{
    return digitalRead(powerSensorPin);
    
}

void BitbloqAuriga::setLed(int led, int red, int green, int blue){
	boardLeds.setColor(led, red, green, blue);
	boardLeds.show();
}

void BitbloqAuriga::playTone(int note, int beat){
	tone(buzzerPin, note, beat);
}

int BitbloqAuriga::readTemperature(){
    return analogRead(temperatureSensorPin);
}

int BitbloqAuriga::readSoundLevel() const{
    return analogRead(soundSensorPin);
}
    
int BitbloqAuriga::readLightSensor(int number) const{
    if (number==1)
        return analogRead(lightSensor1Pin);
    if (number==2)
        return analogRead(lightSensor2Pin);
        
    return 0;
}
