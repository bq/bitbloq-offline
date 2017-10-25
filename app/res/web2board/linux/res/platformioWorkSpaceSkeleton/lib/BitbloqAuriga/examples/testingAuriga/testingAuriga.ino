#include <BitbloqAuriga.h>

BitbloqAuriga aurigaBoard;

void setup() {
  aurigaBoard.setup();
  Serial.begin(9600);
}

void loop() {
  //testing buzzer
  aurigaBoard.playTone(200,10);

  //testing LDR
  Serial.print("LDR1: "); Serial.println(aurigaBoard.readLightSensor(1));
  Serial.print("LDR2: "); Serial.println(aurigaBoard.readLightSensor(2));

  //testing power status
  Serial.print("Power: "); Serial.println(aurigaBoard.readPowerStatus());

  //testing sound
  Serial.print("Microphone: "); Serial.println(aurigaBoard.readSoundLevel());

   //testing temperature
  Serial.print("Temp (aRead(): "); Serial.println(aurigaBoard.readTemperature());
  
  //testing RGB LED Ring
  for (int i = 1 ; i<=12; i++){
    for (int r = 0 ; r < 100; r++){
      aurigaBoard.setLed(i,r/10,10,0);
      delay(1);
    }
  }

  aurigaBoard.setLed(0,0,0,0);

  delay(1000);
}

