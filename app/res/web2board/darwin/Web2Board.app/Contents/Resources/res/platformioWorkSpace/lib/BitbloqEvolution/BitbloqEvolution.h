#ifndef Evolution_h
#define Evolution_h

#include <Servo.h>
#include <BitbloqOscillator.h>
#include <BitbloqUS.h>

#include <Evolution_sounds.h>


//-- Constants
#define HEAD_TRIM    80
#define HEAD_LEFT    45
#define HEAD_CENTER  0
#define HEAD_RIGHT   -45

#define LEFT         1
#define RIGHT        -1

#define STOP         0
#define LOW_SPEED    15
#define MEDIUM_SPEED 22
#define HIGH_SPEED   90

#define LOW_MEDIUM_LIGHT  267 //800*1/3
#define MEDIUM_HIGH_LIGHT 533 //800*2/3

#define LOW_LIGHT    0
#define MEDIUM_LIGHT 1
#define HIGH_LIGHT   2

#define PIN_LFL      2
#define PIN_LFR      3
#define PIN_Trigger  4
#define PIN_Echo     5
#define PIN_WL       8 //wheel[0]
#define PIN_WR       9 //wheel[1]
#define PIN_Head     11
#define PIN_Buzzer   12
#define PIN_LDRL     A2
#define PIN_LDRR     A3


class Evolution
{
  public:
    //--Evolution inizialization
    void init(int WL=PIN_WL, int WR=PIN_WR, int Head=PIN_Head, int LDRL=PIN_LDRL, int LDRR=PIN_LDRR, int LFL=PIN_LFL, int LFR=PIN_LFR, int Buzzer=PIN_Buzzer, int USTrigger=PIN_Trigger, int USEcho=PIN_Echo);

    //-- Attach & detach functions
    void attachWheels();
    void detachWheels();
    void attachHead();
    void detachHead();

    //-- Predetermined Motion Functions
    void turnHead( int head_target, int time=500);
    void oscillateHead(int A, int O, int T, double phase_diff, float cycles=1);
    void move(int WL, int WR);

    //-- HOME = Evolution at rest position
    void home();
    bool getRestWheelState();
    void setRestWheelState(bool state);
    bool getRestHeadState();
    void setRestHeadState(bool state);

    //-- Predetermined Motion Functions
    void stop();
    void fordward(int V=HIGH_SPEED);
    void backward(int V=HIGH_SPEED);
    void right(int V=HIGH_SPEED);
    void left(int V=HIGH_SPEED);

    //-- Sensor functions
    float getDistance(); //US sensor
    int getLight(int side); //LDR sensors
    int getLine(int side); //LineFollower sensors
    bool getLightRange(int side, int range); //LDR sensor range

    //-- Sounds
    void _tone (float noteFrequency, long noteDuration, int silentDuration=1);
    void bendTones (float initFrequency, float finalFrequency, float prop, long noteDuration, int silentDuration);



  private:

    Servo wheel[2];
    Oscillator head;
    US us;

    int wheel_pins[2];
    int head_pin;
    int head_position;
    int pinBuzzer;
    int pinLDRL;
    int pinLDRR;
    int pinLFL;
    int pinLFR;

    unsigned long final_time;
    unsigned long partial_time;
    float increment;

    //bool isEvolutionResting;
    bool isEvolutionHeadResting;
    bool isEvolutionWheelResting;

    int parseV(int V, int low, int medium, int high);
};

#endif