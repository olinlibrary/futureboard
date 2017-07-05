#include <CapacitiveSensor.h>

CapacitiveSensor   cs_4_2 = CapacitiveSensor(4,2);        // 1M resistor between pins 4 & 2, pin 2 is sensor pin
CapacitiveSensor   cs_8_7 = CapacitiveSensor(8,7);        // 1M resistor between pins 5 & 3, pin 3 is sensor pin


void setup()                    
{

   cs_4_2.set_CS_AutocaL_Millis(0xFFFFFFFF);     // turn off autocalibrate on channel 1 - just as an example
   cs_8_7.set_CS_AutocaL_Millis(0xFFFFFFFF);     // turn off autocalibrate on channel 2 - just as an example
   Serial.begin(38400);
   Serial.println("started...");
}

void loop()                    
{
    long start = millis();
    long left =  cs_4_2.capacitiveSensor(30);
    long right =  cs_8_7.capacitiveSensor(30);

    Serial.print(millis() - start);        // check on performance in milliseconds
    Serial.print("\t");                    // tab character for debug windown spacing

    Serial.print(left);                  // print sensor output 1
    Serial.print("\t");
    Serial.print(right);                  // print sensor output 2
    Serial.print("\t");
    Serial.print((left - right) / (right * 1.0));
    Serial.println();

    delay(10);                             // arbitrary delay to limit data to serial port 
}

