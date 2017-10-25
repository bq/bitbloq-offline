//Motor Left
const int pwmMotor1 = 11;
const int inMotor1_1 = 49;
const int inMotor1_2 = 48;
 
//Motor Right
const int pwmMotor2 = 10;
const int inMotor2_1 = 47;
const int inMotor2_2 = 46;

void setup() {
    
  Serial.begin(9600);
 
  pinMode(pwmMotor1,OUTPUT);    //We have to set PWM pin as output
  pinMode(inMotor1_1,OUTPUT);  //Logic pins are also set as output
  pinMode(inMotor1_2,OUTPUT);
  pinMode(pwmMotor2,OUTPUT);    //We have to set PWM pin as output
  pinMode(inMotor2_1,OUTPUT);  //Logic pins are also set as output
  pinMode(inMotor2_2,OUTPUT);
 
}

void loop() {
    digitalWrite(inMotor1_1, HIGH);
    digitalWrite(inMotor1_2, LOW);
    analogWrite(pwmMotor1,255);
    digitalWrite(inMotor2_1, LOW);
    digitalWrite(inMotor2_2, HIGH);
    analogWrite(pwmMotor2,255);
    Serial.println("Full speed mode"); //For debugging
}
