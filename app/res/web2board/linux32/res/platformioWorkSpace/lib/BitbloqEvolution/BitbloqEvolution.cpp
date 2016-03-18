#include "Arduino.h"

#include "BitbloqEvolution.h"

void Evolution::init(int WL, int WR, int Head, int LDRL, int LDRR, int LFL, int LFR, int Buzzer, int USTrigger, int USEcho) {

  wheel_pins[0] = WL;
  wheel_pins[1] = WR;
  head_pin = Head;

  attachWheels();
  attachHead();

  head.SetTrim(HEAD_TRIM-90);

  head_position = HEAD_CENTER;

  //US sensor init with the pins:
  us.init(USTrigger, USEcho, 15000);

  //Buzzer  sensor pin: 
  pinBuzzer = Buzzer;

  pinMode(Buzzer,OUTPUT);

  //LDR sensor pins:
  pinLDRL = LDRL;
  pinLDRR = LDRR;

  pinMode(LDRL,INPUT);
  pinMode(LDRR,INPUT);

  //LineFollower sensor pins:
  pinLFL = LFL;
  pinLFR = LFR;

  pinMode(LFL,INPUT);
  pinMode(LFR,INPUT);
}

///////////////////////////////////////////////////////////////////
//-- ATTACH & DETACH FUNCTIONS ----------------------------------//
///////////////////////////////////////////////////////////////////
void Evolution::attachWheels(){
  wheel[0].attach(wheel_pins[0]);
  wheel[1].attach(wheel_pins[1]);
  if (getRestWheelState()){
    setRestWheelState(false);
  }
}

void Evolution::detachWheels(){
  wheel[0].detach();
  wheel[1].detach();
  if (!getRestWheelState()){
    setRestWheelState(true);
  }
}

void Evolution::attachHead(){
  head.attach(head_pin);
  if (getRestHeadState()){
    setRestHeadState(false);
  }
}

void Evolution::detachHead(){
  head.detach();
  if (!getRestHeadState()){
    setRestHeadState(true);
  }
}


///////////////////////////////////////////////////////////////////
//-- BASIC MOTION FUNCTIONS -------------------------------------//
///////////////////////////////////////////////////////////////////
void Evolution::turnHead(int head_target, int time){

  attachHead();

  if(time > 10){
    increment = (head_target - head_position) / (time / 10.0);
    final_time =  millis() + time;

    for (int iteration = 1; millis() < final_time; iteration++) {
      partial_time = millis() + 10;
      head.SetPosition(head_position + 90 + (iteration * increment));
      while (millis() < partial_time); //pause
    }
  }
  else{
    head.SetPosition(head_target + 90);
  }
  head_position = head_target;
}

void Evolution::oscillateHead(int A, int O, int T, double phase_diff, float cycles){

  attachHead();

  head.SetA(A);
  head.SetO(O);
  head.SetT(T);
  head.SetPh(phase_diff);

  double ref = millis();
  for (double x = ref; x <= T*cycles+ref; x = millis()) head.refresh();
}

void Evolution::move(int WL, int WR){

  attachWheels();

  wheel[0].write(90 - WL);
  wheel[1].write(90 + WR);
}


///////////////////////////////////////////////////////////////////
//-- HOME = Evolution at rest position --------------------------//
///////////////////////////////////////////////////////////////////
void Evolution::home(){

  if(!getRestWheelState()) detachWheels(); //Go to rest position only if necessary

  if(!getRestHeadState()){

    turnHead(HEAD_CENTER);   //Move the head at default position in half a second

    detachHead();
  }
}

bool Evolution::getRestWheelState(){

    return isEvolutionWheelResting;
}

void Evolution::setRestWheelState(bool state){

    isEvolutionWheelResting = state;
}

bool Evolution::getRestHeadState(){

    return isEvolutionHeadResting;
}

void Evolution::setRestHeadState(bool state){

    isEvolutionHeadResting = state;
}


///////////////////////////////////////////////////////////////////
//-- PREDETERMINED MOTIONS  -------------------------------------//
///////////////////////////////////////////////////////////////////

void Evolution::stop(){

  move(0, 0);
}

void Evolution::fordward(int V){

  move(V, V);
}

void Evolution::backward(int V){

  move(-V, -V);
}

void Evolution::right(int V){

  move(V, 0);
}

void Evolution::left(int V){

  move(0, V);
}


///////////////////////////////////////////////////////////////////
//-- SENSORS FUNCTIONS  -----------------------------------------//
///////////////////////////////////////////////////////////////////

//-----------------------------------------------------------------------
//-- Evolution getDistance: return Evolution's ultrasonic sensor measure
//-----------------------------------------------------------------------
float Evolution::getDistance(){

  return us.read();
}

//-----------------------------------------------------------------------
//-- Evolution getLight: return Evolution's LDR sensor measure
//-----------------------------------------------------------------------
int Evolution::getLight(int side){

  if (side > 0){
    return analogRead(PIN_LDRL);
  }
  return analogRead(PIN_LDRR);
}

//-----------------------------------------------------------------------
//-- Evolution getLine: return Evolution's LDR sensor measure
//-----------------------------------------------------------------------
int Evolution::getLine(int side){

  if (side > 0){
    return digitalRead(PIN_LFL);
  }
  return digitalRead(PIN_LFR);
}

bool Evolution::getLightRange(int side, int range){

  int read;

  if (side > 0){
    read = analogRead(PIN_LDRL);
  }
  else {
    read = analogRead(PIN_LDRR);
  }

  if (read > MEDIUM_HIGH_LIGHT && range == HIGH_LIGHT){
    return true;
  }
  else if (read <= MEDIUM_HIGH_LIGHT && read >= LOW_MEDIUM_LIGHT && range == MEDIUM_LIGHT){
    return true;
  }
  else if (read < LOW_MEDIUM_LIGHT && range == LOW_LIGHT) {
    return true;
  }

  return false;
}

///////////////////////////////////////////////////////////////////
//-- SOUNDS -----------------------------------------------------//
///////////////////////////////////////////////////////////////////

void Evolution::_tone (float noteFrequency, long noteDuration, int silentDuration){

      if(silentDuration==0){silentDuration=1;}

      tone(pinBuzzer, noteFrequency, noteDuration);
      delay(silentDuration);     
}


void Evolution::bendTones (float initFrequency, float finalFrequency, float prop, long noteDuration, int silentDuration){

  //Examples:
  //  bendTones (880, 2093, 1.02, 18, 1);
  //  bendTones (note_A5, note_C7, 1.02, 18, 0);

  if(silentDuration==0){silentDuration=1;}

  if(initFrequency < finalFrequency)
  {
      for (int i=initFrequency; i<finalFrequency; i=i*prop) {
          _tone(i, noteDuration, silentDuration);
      }

  } else{

      for (int i=initFrequency; i>finalFrequency; i=i/prop) {
          _tone(i, noteDuration, silentDuration);
      }
  }
}


///////////////////////////////////////////////////////////////////
//-- PREDETERMINED MOTION SEQUENCES -----------------------------//
///////////////////////////////////////////////////////////////////

