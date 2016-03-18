/******************************************************************
 This is the core graphics library for all our displays, providing
 basic graphics primitives (points, lines, circles, etc.). It needs
 to be paired with a hardware-specific library for each display
 device we carry (handling the lower-level functions).
 
 Adafruit invests time and resources providing this open
 source code, please support Adafruit and open-source hardware
 by purchasing products from Adafruit!
 
 Written by Limor Fried/Ladyada for Adafruit Industries.
 Processing-like API written by Enrico Gueli for Officine Arduino.
 BSD license, check license.txt for more information.
 All text above must be included in any redistribution.
 ******************************************************************/

#ifndef _ADAFRUIT_GFX_H
#define _ADAFRUIT_GFX_H

#if ARDUINO >= 100
 #include "Arduino.h"
 #include "Print.h"
#else
 #include "WProgram.h"
#endif

/*
 * This library can work with or without the presence of an SD
 * reading library (to load images). At the moment, only the
 * Arduino SD library is supported; it is included in
 * standard Arduino libraries.
 * 
 * The presence of the SD library is detected by looking at the
 * __SD_H__ preprocessor variable, defined into 
 * Arduino SD library to avoid double inclusion. This means
 * that in order to use the image-related API of Adafruit_GFX,
 * SD.h *must* be included before Adafruit_GFX.
 * 
 * The bottom part of this include file contains the actual image
 * loading code; if it was in a separate .cpp file, there were no
 * way to check if the SD library was present or not.
 * 
 * A partial solution was to include SD.h anyway, see if that works
 * (i.e. it is found in the include search path) and act accordingly.
 * But this solution relied on the preprocessor to issue only a
 * warning when an include file is not found. Avr-gcc, used for
 * Arduino 8-bit MCUs, does that, but the standard gcc-4.4, used for
 * Arduino Due, issues a fatal error and stops compilation.
 * 
 * The best solution so far is to put the code here. It works if this
 * include is used only in one .cpp file in the build (this is the
 * case of most Arduino sketches); if used in multiple .cpp files,
 * the linker may complain about duplicate definitions.
 * 
 */

#if defined(__SD_H__)  // Arduino SD library
#  include "PImage.h"
#else
#  warning "The SD library was not found. loadImage() and image() won't be supported."
#endif

#define swap(a, b) { int16_t t = a; a = b; b = t; }

/* TODO
enum RectMode {
  CORNER,
  CORNERS,
  RADIUS,
  CENTER
};
*/

typedef uint16_t color;

class Adafruit_GFX : public Print {
 public:

  //Adafruit_GFX();
  // i have no idea why we have to formally call the constructor. kinda sux
  void constructor(int16_t w, int16_t h);

  // this must be defined by the subclass
  virtual void drawPixel(int16_t x, int16_t y, uint16_t color);
  virtual void invertDisplay(boolean i);

  // these are 'generic' drawing functions, so we can share them!
  virtual void drawLine(int16_t x0, int16_t y0, int16_t x1, int16_t y1, 
		uint16_t color);
  virtual void drawFastVLine(int16_t x, int16_t y, int16_t h, uint16_t color);
  virtual void drawFastHLine(int16_t x, int16_t y, int16_t w, uint16_t color);
  virtual void drawRect(int16_t x, int16_t y, int16_t w, int16_t h, 
		uint16_t color);
  virtual void fillRect(int16_t x, int16_t y, int16_t w, int16_t h, 
		uint16_t color);
  virtual void fillScreen(uint16_t color);

  void drawCircle(int16_t x0, int16_t y0, int16_t r, uint16_t color);
  void drawCircleHelper(int16_t x0, int16_t y0,
			int16_t r, uint8_t cornername, uint16_t color);
  void fillCircle(int16_t x0, int16_t y0, int16_t r, uint16_t color);
  void fillCircleHelper(int16_t x0, int16_t y0, int16_t r,
		      uint8_t cornername, int16_t delta, uint16_t color);

  void drawTriangle(int16_t x0, int16_t y0, int16_t x1, int16_t y1,
		    int16_t x2, int16_t y2, uint16_t color);
  void fillTriangle(int16_t x0, int16_t y0, int16_t x1, int16_t y1,
		    int16_t x2, int16_t y2, uint16_t color);
  void drawRoundRect(int16_t x0, int16_t y0, int16_t w, int16_t h,
		     int16_t radius, uint16_t color);
  void fillRoundRect(int16_t x0, int16_t y0, int16_t w, int16_t h,
		     int16_t radius, uint16_t color);

  void drawBitmap(int16_t x, int16_t y, 
		  const uint8_t *bitmap, int16_t w, int16_t h,
		  uint16_t color);
  void drawChar(int16_t x, int16_t y, unsigned char c,
		uint16_t color, uint16_t bg, uint8_t size);
#if ARDUINO >= 100
  virtual size_t write(uint8_t);
#else
  virtual void   write(uint8_t);
#endif
  void setCursor(int16_t x, int16_t y);
  void setTextColor(uint16_t c);
  void setTextColor(uint16_t c, uint16_t bg);
  void setTextSize(uint8_t s);
  void setTextWrap(boolean w);

  int16_t height(void);
  int16_t width(void);

  void setRotation(uint8_t r);
  uint8_t getRotation(void);

  
  /*
   * Processing-like graphics primitives
   */
  
  /// transforms a color in 16-bit form given the RGB components.
  /// The default implementation makes a 5-bit red, a 6-bit
  /// green and a 5-bit blue (MSB to LSB). Devices that use
  /// different scheme should override this. 
  virtual uint16_t newColor(uint8_t red, uint8_t green, uint8_t blue);
  
  
  // http://processing.org/reference/background_.html
  void background(uint8_t red, uint8_t green, uint8_t blue);
  void background(color c);

  // http://processing.org/reference/fill_.html
  void fill(uint8_t red, uint8_t green, uint8_t blue);
  void fill(color c);

  // http://processing.org/reference/noFill_.html
  void noFill();

  // http://processing.org/reference/stroke_.html
  void stroke(uint8_t red, uint8_t green, uint8_t blue);
  void stroke(color c);

  // http://processing.org/reference/noStroke_.html
  void noStroke();
  
  void text    (const char * text, int16_t x, int16_t y);
  void textWrap(const char * text, int16_t x, int16_t y);

  void textSize(uint8_t size);
  
  // similar to ellipse() in Processing, but with
  // a single radius.
  // http://processing.org/reference/ellipse_.html
  void circle(int16_t x, int16_t y, int16_t r);
  
  void point(int16_t x, int16_t y);
  
  void line(int16_t x1, int16_t y1, int16_t x2, int16_t y2);
  
  void quad(int16_t x1, int16_t y1, int16_t x2, int16_t y2, int16_t x3, int16_t y3, int16_t x4, int16_t y4);
  
  void rect(int16_t x, int16_t y, int16_t width, int16_t height);

  void rect(int16_t x, int16_t y, int16_t width, int16_t height, int16_t radius);
  
  void triangle(int16_t x1, int16_t y1, int16_t x2, int16_t y2, int16_t x3, int16_t y3);
  
  /* TODO
  void rectMode(RectMode mode);
  
  void pushStyle();
  void popStyle();
  */

#if defined(__SD_H__)  // Arduino SD library
  PImage loadImage(const char * fileName) { return PImage::loadImage(fileName); }
  
  void image(PImage & img, uint16_t x, uint16_t y);
#endif
  
 protected:
  int16_t  WIDTH, HEIGHT;   // this is the 'raw' display w/h - never changes
  int16_t  _width, _height; // dependent on rotation
  int16_t  cursor_x, cursor_y;
  uint16_t textcolor, textbgcolor;
  uint8_t  textsize;
  uint8_t  rotation;
  boolean  wrap; // If set, 'wrap' text at right edge of display
  
  /*
   * Processing-style graphics state
   */
  
  color strokeColor;
  bool useStroke;
  color fillColor;
  bool useFill;
};

#if defined(__SD_H__)  // Arduino SD library

#define BUFFPIXEL 20

void Adafruit_GFX::image(PImage & img, uint16_t x, uint16_t y) {
  int      w, h, row, col;
  uint8_t  r, g, b;
  uint32_t pos = 0;
  uint8_t  sdbuffer[3*BUFFPIXEL]; // pixel buffer (R+G+B per pixel)
  uint8_t  buffidx = sizeof(sdbuffer); // Current position in sdbuffer

  // Crop area to be loaded
  w = img._bmpWidth;
  h = img._bmpHeight;
  if((x+w-1) >= width())  w = width()  - x;
  if((y+h-1) >= height()) h = height() - y;

  /*
  // Set TFT address window to clipped image bounds
  setAddrWindow(x, y, x+w-1, y+h-1);
  */
  
  for (row=0; row<h; row++) { // For each scanline...
    // Seek to start of scan line.  It might seem labor-
    // intensive to be doing this on every line, but this
    // method covers a lot of gritty details like cropping
    // and scanline padding.  Also, the seek only takes
    // place if the file position actually needs to change
    // (avoids a lot of cluster math in SD library).
    if(img._flip) // Bitmap is stored bottom-to-top order (normal BMP)
      pos = img._bmpImageoffset + (img._bmpHeight - 1 - row) * img._rowSize;
    else     // Bitmap is stored top-to-bottom
      pos = img._bmpImageoffset + row * img._rowSize;
    if(img._bmpFile.position() != pos) { // Need seek?
      img._bmpFile.seek(pos);
      buffidx = sizeof(sdbuffer); // Force buffer reload
    }

    for (col=0; col<w; col++) { // For each pixel...
      // Time to read more pixel data?
      if (buffidx >= sizeof(sdbuffer)) { // Indeed
        img._bmpFile.read(sdbuffer, sizeof(sdbuffer));
        buffidx = 0; // Set index to beginning
      }

      // Convert pixel from BMP to TFT format, push to display
      b = sdbuffer[buffidx++];
      g = sdbuffer[buffidx++];
      r = sdbuffer[buffidx++];
      //pushColor(tft.Color565(r,g,b));
      drawPixel(x + col, y + row, newColor(r, g, b));
      
    } // end pixel
  } // end scanline

}




// These read 16- and 32-bit types from the SD card file.
// BMP data is stored little-endian, Arduino is little-endian too.
// May need to reverse subscript order if porting elsewhere.

uint16_t PImage::read16(File f) {
  uint16_t result;
  ((uint8_t *)&result)[0] = f.read(); // LSB
  ((uint8_t *)&result)[1] = f.read(); // MSB
  return result;
}

uint32_t PImage::read32(File f) {
  uint32_t result;
  ((uint8_t *)&result)[0] = f.read(); // LSB
  ((uint8_t *)&result)[1] = f.read();
  ((uint8_t *)&result)[2] = f.read();
  ((uint8_t *)&result)[3] = f.read(); // MSB
  return result;
}


PImage PImage::loadImage(const char * fileName) {
  File     bmpFile;
  int      bmpWidth, bmpHeight;   // W+H in pixels
  uint8_t  bmpDepth;              // Bit depth (currently must be 24)
  uint32_t bmpImageoffset;        // Start of image data in file
  uint32_t rowSize;               // Not always = bmpWidth; may have padding
  bool     flip    = true;        // BMP is stored bottom-to-top


  // Open requested file on SD card
  if ((bmpFile = SD.open(fileName)) == NULL) {
    Serial.print("loadImage: file not found: ");
    Serial.println(fileName);
    return PImage(); // load error
  }
  
  
  
  // Parse BMP header
  if(read16(bmpFile) != 0x4D42) { // BMP signature
    Serial.println("loadImage: file doesn't look like a BMP");
    return PImage();
  }
  
  Serial.print("File size: "); Serial.println(read32(bmpFile));
  (void)read32(bmpFile); // Read & ignore creator bytes
  bmpImageoffset = read32(bmpFile); // Start of image data
  Serial.print("Image Offset: "); Serial.println(bmpImageoffset, DEC);
  // Read DIB header
  Serial.print("Header size: "); Serial.println(read32(bmpFile));
  bmpWidth  = read32(bmpFile);
  bmpHeight = read32(bmpFile);
  if(read16(bmpFile) != 1) { // # planes -- must be '1'
    Serial.println("loadImage: invalid n. of planes");
    return PImage();
  }
  
  bmpDepth = read16(bmpFile); // bits per pixel
  Serial.print("Bit Depth: "); Serial.println(bmpDepth);
  if((bmpDepth != 24) || (read32(bmpFile) != 0)) { // 0 = uncompressed {
    Serial.println("loadImage: invalid pixel format");
    return PImage();
  }

  Serial.print("Image size: ");
  Serial.print(bmpWidth);
  Serial.print('x');
  Serial.println(bmpHeight);

  // BMP rows are padded (if needed) to 4-byte boundary
  rowSize = (bmpWidth * 3 + 3) & ~3;

  // If bmpHeight is negative, image is in top-down order.
  // This is not canon but has been observed in the wild.
  if(bmpHeight < 0) {
    bmpHeight = -bmpHeight;
    flip      = false;
  }
  
  return PImage(bmpFile, bmpWidth, bmpHeight, bmpDepth, bmpImageoffset, rowSize, flip);
}

#endif



#endif
