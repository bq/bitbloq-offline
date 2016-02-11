#ifndef Zowi_h
#define Zowi_h

#include <Servo.h>
#include <BitbloqOscillator.h>
#include <EEPROM.h>

#include <BitbloqUS.h>
#include <BitbloqLedMatrix.h>
#include <BitbloqBatteryReader.h>

#include "Zowi_mouths.h"
#include "Zowi_sounds.h"
#include "Zowi_gestures.h"


//-- Constants
#define FORWARD         1
#define BACKWARD        -1
#define LEFT            1
#define RIGHT           -1

#define SMALL_HEIGHT           5
#define MEDIUM_HEIGHT         15
#define BIG_HEIGHT          30

#define LOW_SPEED       0
#define MEDIUM_SPEED    1
#define HIGH_SPEED      2


#define PIN_YL 2 //servo[0]
#define PIN_YR 3 //servo[1]
#define PIN_RL 4 //servo[2]
#define PIN_RR 5 //servo[3]
#define PIN_AButton 6
#define PIN_BButton 7
#define PIN_Trigger 8
#define PIN_Echo    9
#define PIN_Buzzer  10
#define PIN_NoiseSensor A6


class Zowi
{
  public:
    //-- Zowi constructors
    Zowi(char *ID="ZOWI_BITBLOQ");

    //-- Zowi initialization
    void init(int YL=PIN_YL, int YR=PIN_YR, int RL=PIN_RL, int RR=PIN_RR, bool load_calibration = true, int AButton=PIN_AButton, int BButton=PIN_BButton, int NoiseSensor=PIN_NoiseSensor, int Buzzer=PIN_Buzzer, int USTrigger=PIN_Trigger, int USEcho=PIN_Echo);

    //-- Attach & detach functions
    void attachServos();
    void detachServos();

    //-- Oscillator Trims
    void setTrims(int YL, int YR, int RL, int RR);
    void saveTrimsOnEEPROM();

    //-- Predetermined Motion Functions
    void _moveServos(int time, int  servo_target[]);
    void oscillateServos(int A[4], int O[4], int T, double phase_diff[4], float cycle);

    //-- HOME = Zowi at rest position
    void home();
    bool getRestState();
    void setRestState(bool state);
    
    //-- Predetermined Motion Functions
    void jump(float steps=1, int T = 2000);

    void walk(float steps=4, int T=1000, int dir = FORWARD);
    void turn(float steps=4, int T=2000, int dir = LEFT);
    void bend (int steps=1, int T=1400, int dir=LEFT);
    void shakeLeg (int steps=1, int T = 2000, int dir=RIGHT);

    void updown(float steps=1, int T=1000, int h = 20);
    void swing(float steps=1, int T=1000, int h=20);
    void tiptoeSwing(float steps=1, int T=900, int h=20);
    void jitter(float steps=1, int T=500, int h=20);
    void ascendingTurn(float steps=1, int T=900, int h=20);

    void moonwalker(float steps=1, int T=900, int h=20, int dir=LEFT);
    void crusaito(float steps=1, int T=900, int h=20, int dir=LEFT);
    void flapping(float steps=1, int T=1000, int h=20, int dir=FORWARD);

    //-- Sensors functions
    float getDistance(); //US sensor
    int getNoise();      //Noise Sensor

    //-- Battery
    double getBatteryLevel();
    double getBatteryVoltage();
    
    //-- Mouth & Animations
    void putMouth(unsigned long int mouth, bool predefined = true);
    void putAnimationMouth(unsigned long int anim, int index);
    void clearMouth();

    //-- Sounds
    void _tone (float noteFrequency, long noteDuration, int silentDuration);
    void bendTones (float initFrequency, float finalFrequency, float prop, long noteDuration, int silentDuration);
    void sing(int songName);

    //-- Gestures
    void playGesture(int gesture);

    //-- App
    void requestName();
    void requestBattery();
    void requestProgramId();

 
  private:
    
    LedMatrix ledmatrix;
    BatReader battery;
    Oscillator servo[4];
    US us;

    int servo_pins[4];
    int servo_trim[4];
    int servo_position[4];

    int pinBuzzer;
    int pinNoiseSensor;
    
    unsigned long final_time;
    unsigned long partial_time;
    float increment[4];

    bool isZowiResting;

    char *programID;

    unsigned long int getMouthShape(int number);
    unsigned long int getAnimShape(int anim, int index);
    void _execute(int A[4], int O[4], int T, double phase_diff[4], float steps);

    int parseT(int T, int low, int medium, int high);
};

#endif


