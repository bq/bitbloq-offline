#ifndef ENCODER_H
#define ENCODER_H

#include <Arduino.h>

class Encoder{

public:
  Encoder(void (*f)(),int kPin, int saPin, int sbPin);
  // Encoder(int saPin, int sbPin, int kPin);
  long read();
  void update();

private:
  int sum;
  int saPin;
  int sbPin;
  int kPin;
  volatile long encoderValue;
  volatile int lastEncoded;
};
  void trial();

#endif 