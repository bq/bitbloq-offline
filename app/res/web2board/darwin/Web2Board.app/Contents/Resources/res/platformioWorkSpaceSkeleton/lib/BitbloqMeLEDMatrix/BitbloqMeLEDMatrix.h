/*
 * BitbloqBitbloqMeLEDMatrix.h
 *
 * Copyright 2017 Alberto Valero <alberto.valero@bq.com>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 * DERIVED FROM

 * \par Copyright (C), 2012-2016, MakeBlock
 * \class   BitbloqMeLEDMatrix
 * \brief   Driver for Me LED Matrix module.
 * @file    BitbloqMeLEDMatrix.h
 * @author  MakeBlock
 * @version V1.0.3
 * @date    2016/01/29
 * @brief   Header for BitbloqMeLEDMatrix.cpp module
 *
 * \par Method List:
 *
 *    1.    void BitbloqMeLEDMatrix::clearScreen();
 *    2.    void BitbloqMeLEDMatrix::setBrightness(uint8_t Bright);
 *    3.    void BitbloqMeLEDMatrix::setColorIndex(bool Color_Number);
 *    4.    void BitbloqMeLEDMatrix::drawBitmap(int8_t x, int8_t y, uint8_t Bitmap_Width, uint8_t *Bitmap);
 *    5.    void BitbloqMeLEDMatrix::drawStr(int16_t X_position, int8_t Y_position, const char *str);
 *    6.    void BitbloqMeLEDMatrix::showClock(uint8_t hour, uint8_t minute, bool point_flag);
 *    7.    void BitbloqMeLEDMatrix::showNum(float value,uint8_t digits);
 *    8.    void BitbloqMeLEDMatrix::reset(uint8_t port);
 *
 * \par History:
 * <pre>
 * `<Author>`         `<Time>`        `<Version>`        `<Descr>`
 * forfish         2015/11/09     1.0.0            Add description
 * Mark Yan        2016/01/19     1.0.1            Add some new symbol
 * Mark Yan        2016/01/27     1.0.2            Add digital printing
 * Mark Yan        2016/01/29     1.0.3            Fix issue when show integer number
 * Alberto Valero  2017/05/14                      Adapting to Bitbloq
 * </pre>
 *
 */

#ifndef BITBLOQ_ME_LED_MATRIX_H_
#define BITBLOQ_ME_LED_MATRIX_H_

#include "MePort.h"
#define PointOn   1
#define PointOff  0


#define LED_BUFFER_SIZE   16
#define STRING_DISPLAY_BUFFER_SIZE 20


//Define Data Command Parameters
#define Mode_Address_Auto_Add_1  0x40     //0100 0000 B
#define Mode_Permanent_Address   0x44     //0100 0100 B


//Define Address Command Parameters
#define ADDRESS(addr)  (0xC0 | addr)


typedef enum
{
  Brightness_0 = 0,
  Brightness_1,
  Brightness_2,
  Brightness_3,
  Brightness_4,
  Brightness_5,
  Brightness_6,
  Brightness_7,
  Brightness_8
}LED_Matrix_Brightness_TypeDef;



/*           Me LED Matrix 8X16            */
/**
 * Class: BitbloqMeLEDMatrix
 * \par Description
 * Declaration of Class BitbloqMeLEDMatrix.
 */
class BitbloqMeLEDMatrix
{
public:

/**
 * Constructor which can call your own function to map to arduino port,
 * you can set any slot for the buzzer device.
 * \param[in]
 *   SCK_Pin - The SCk of LED Matrix.
 * \param[in]
 *   DIN_Pin - Put in parameter.
 */
  BitbloqMeLEDMatrix(uint8_t SCK_Pin, uint8_t DIN_Pin);

/**
 * Setup function
 */
 void setup();

/**
 * \par Function
 *    clearScreen
 * \par Description
 *    Clear the screen.
 * \param[in]
 *    None
 * \par Output
 *    None
 * \Return
 *    None.
 * \par Others
 *    None
 */
  void clearScreen();

/**
 * \par Function
 *    setBrightness
 * \par Description
 *    Set the brightness of LED Matrix.
 * \param[in]
 *    Bright - The brightness of LED Matrix.
 * \par Output
 *    None
 * \Return
 *    None.
 * \par Others
 *    None
 */
  void setBrightness(uint8_t Bright);

/**
 * \par Function
 *    setColorIndex
 * \par Description
 *    Set the color index for LED Matrix.
 * \param[in]
 *    Color_Number - The number of LED Matrix's color.
 * \par Output
 *    None
 * \Return
 *    None.
 * \par Others
 *    None
 */
  void setColorIndex(bool Color_Number);

/**
 * \par Function
 *    drawBitmap
 * \par Description
 *    Draw a bitmap.
 * \param[in]
 *    x - The x coordinate of bitmap.
 * \param[in]
 *    y - The y coordinate of bitmap.
 * \param[in]
 *    Bitmap_Width - The width of bitmap.
 * \param[in]
 *    Bitmap - A pointer to bitmap.
 * \par Output
 *    None
 * \Return
 *    None.
 * \par Others
 *    None
 */
  void drawBitmap(int8_t x, int8_t y, uint8_t Bitmap_Width, uint8_t *Bitmap);

/**
 * \par Function
 *    drawStr
 * \par Description
 *    Draw a string.
 * \param[in]
 *    x - The x coordinate for the beginning of string.
 * \param[in]
 *    y - The y coordinate for the beginning of string.
 * \param[in]
 *    str - A pointer to string.
 * \par Output
 *    None
 * \Return
 *    None.
 * \par Others
 *    None
 */
  void drawStr(int16_t X_position, int8_t Y_position, const char *str);
  void drawStr(int16_t X_position, int8_t Y_position, String str);

/**
 * \par Function
 *    showClock
 * \par Description
 *    Show the clock on LED Matrix.
 * \param[in]
 *    hour - The part of hour in clock.
 * \param[in]
 *    minute - The part of minute in clock.
 * \param[in]
 *    PointOn - Point on or not.
 * \par Output
 *    None
 * \Return
 *    None.
 * \par Others
 *    None
 */
  void showClock(uint8_t hour, uint8_t minute, bool = PointOn);

/**
 * \par Function
 *    showNum
 * \par Description
 *    Show the number on LED Matrix.
 * \param[in]
 *    value - The float data need show.
 * \param[in]
 *    digits - Number of digits to display.
 * \par Output
 *    None
 * \Return
 *    None.
 * \par Others
 *    None
 */
  void showNum(float value,uint8_t = 3);

  void draw(uint8_t pos0, uint8_t pos1, uint8_t pos2, uint8_t pos3, uint8_t pos4, uint8_t pos5, uint8_t pos6, uint8_t pos7, uint8_t pos8, uint8_t pos9, uint8_t pos10, uint8_t pos11, uint8_t pos12, uint8_t pos13, uint8_t pos14, uint8_t pos15);

  
  void drawLed(uint8_t x, uint8_t y, bool value);
  
  void drawRectangle(uint8_t x, uint8_t y, uint8_t lx, uint8_t ly);
  void drawLine(uint8_t x1, uint8_t y1, uint8_t x2, uint8_t y2);
  void drawCircumference(int xc, int yc, int r);
  
private:
  const uint8_t u8_SCKPin;
  const uint8_t u8_DINPin;

  bool b_Color_Index;
  bool b_Draw_Str_Flag;

  uint8_t u8_Display_Buffer[LED_BUFFER_SIZE];
  bool drawing[128];
  uint8_t pow2[8];

  int16_t i16_Str_Display_X_Position;
  int8_t i8_Str_Display_Y_Position;
  int16_t i16_Number_of_Character_of_Str;
  char i8_Str_Display_Buffer[STRING_DISPLAY_BUFFER_SIZE];
  
  

/**
 * \par Function
 *    writeByte
 * \par Description
 *    Write byte to LED Matrix.
 * \param[in]
 *    data - The data wrote to LED Matrix.
 * \par Output
 *    None
 * \Return
 *    None.
 * \par Others
 *    None
 */
  void writeByte(uint8_t data);

/**
 * \par Function
 *    writeBytesToAddress
 * \par Description
 *    Write byte to LED Matrix's address.
 * \param[in]
 *    Address - The address you want to write in LED Matrix.
 * \param[in]
 *    P_data - The pointer points to data.
 * \param[in]
 *    count_of_data - The length of data.
 * \par Output
 *    None
 * \Return
 *    None.
 * \par Others
 *    None
 */
  void writeBytesToAddress(uint8_t Address, const uint8_t *P_data, uint8_t count_of_data);

/**
 * \par Function
 *    showStr
 * \par Description
 *    Show the string in LED Matrix.
 * \par Output
 *    None
 * \Return
 *    None.
 * \par Others
 *    None
 */
  void showStr();
  
  void updateDrawing();

};

#endif
