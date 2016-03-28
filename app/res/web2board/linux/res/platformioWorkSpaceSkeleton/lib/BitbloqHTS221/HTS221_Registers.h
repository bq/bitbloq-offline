#ifndef HTS221_REGISTERS_H
#define HTS221_REGISTERS_H
/**
 * FILE: HTS221_Registers.h
 * AUTHOR: Raul de Pablos
 * PURPOSE: library for ST HTS221 sensor
 * VERSION: 0.0.1
 * HW VERSION: 0.0
 *     URL: http://www.bq.com
 *
 */

/* 8 bit addressing */
#define HTS221_ADDR_W	0xBE
#define HTS221_ADDR_R	0xBF

/* 7 bit addressing */
#define HTS221_ADDR		0x5F
 
/**
 * Register definitions
 */
#define	HTS221_WHO_AM_I	0x0F
#define	HTS221_WAI_DFLT	0xBC

#define HTS221_AV_CONF		0x10
#define	HTS221_AVGT2	0x20
#define HTS221_AVGT1	0x10
#define HTS221_AVGT0	0x08
#define HTS221_AVGH2	0x04
#define HTS221_AVGH1	0x02
#define HTS221_AVGH0	0x01

#define HTS221_CTRL_REG1	0x20
#define HTS221_PD		0x80
#define HTS221_BDU		0x04
#define HTS221_ODR1		0x02
#define HTS221_ODR0		0x01

#define HTS221_CTRL_REG2	0x21
#define HTS221_BOOT		0x80
#define HTS221_HEATER	0x02
#define HTS221_ONE_SHOT	0x01

#define HTS221_CTRL_REG3	0x22
#define HTS221_DRDY_H_L	0x80
#define	HTS221_PP_OD	0x40
#define	HTS221_DRDY		0x04

#define HTS221_STATUS_REG	0x27
#define HTS221_H_DA		0x02
#define HTS221_T_DA		0x01

#define HTS221_HUMIDITY_OUT_L	0x28
#define HTS221_HOUT7		0x80
#define HTS221_HOUT6		0x40
#define HTS221_HOUT5		0x20
#define HTS221_HOUT4		0x10
#define HTS221_HOUT3		0x08
#define HTS221_HOUT2		0x04
#define HTS221_HOUT1		0x02
#define HTS221_HOUT0		0x01

#define HTS221_HUMIDITY_OUT_H	0x29
#define HTS221_HOUT15		0x80
#define HTS221_HOUT14		0x40
#define HTS221_HOUT13		0x20
#define HTS221_HOUT12		0x10
#define HTS221_HOUT11		0x08
#define HTS221_HOUT10		0x04
#define HTS221_HOUT9		0x02
#define HTS221_HOUT8		0x01

#define HTS221_TEMP_OUT_L	0x2A
#define HTS221_TOUT7	0x80
#define HTS221_TOUT6	0x40
#define HTS221_TOUT5	0x20
#define HTS221_TOUT4	0x10
#define HTS221_TOUT3	0x08
#define HTS221_TOUT2	0x04
#define HTS221_TOUT1	0x02
#define HTS221_TOUT0	0x01

#define HTS221_TEMP_OUT_H	0x2B
#define HTS221_TOUT15	0x80
#define HTS221_TOUT14	0x40
#define HTS221_TOUT13	0x20
#define HTS221_TOUT12	0x10
#define HTS221_TOUT11	0x08
#define HTS221_TOUT10	0x04
#define HTS221_TOUT9	0x02
#define HTS221_TOUT8	0x01

#define HTS221_H0_RH_X2		0x30
#define HTS221_H1_RH_X2		0x31

#define HTS221_T0_DEGC_X8	0x32
#define HTS221_T1_DEGC_X8	0x33
#define HTS221_T1T0_MSB		0x35

#define HTS221_H0_T0_OUT_L	0x36
#define HTS221_H0_T0_OUT_H	0x37
#define HTS221_H1_T0_OUT_L	0x3A
#define HTS221_H1_T0_OUT_H	0x3B

#define HTS221_T0_OUT_L		0x3C
#define HTS221_T0_OUT_H		0x3D
#define HTS221_T1_OUT_L		0x3E
#define HTS221_T1_OUT_H		0x3F




/**
 * Useful definitions
 */
 
 // HTS221 Humidity resolution
#define HTS221_H_RES_AVG_4		0x00
#define HTS221_H_RES_AVG_8		0x01
#define HTS221_H_RES_AVG_16		0x02
#define HTS221_H_RES_AVG_32		0x03
#define HTS221_H_RES_AVG_64		0x04
#define HTS221_H_RES_AVG_128	0x05
#define HTS221_H_RES_AVG_256	0x06
#define HTS221_H_RES_AVG_512	0x07

#define HTS221_H_RES_MASK		0x07


// HTS221 Temperature resolution
#define HTS221_T_RES_AVG_2		0x00
#define HTS221_T_RES_AVG_4		0x08
#define HTS221_T_RES_AVG_8		0x10
#define HTS221_T_RES_AVG_16		0x18
#define HTS221_T_RES_AVG_32		0x20
#define HTS221_T_RES_AVG_64		0x28
#define HTS221_T_RES_AVG_128	0x30
#define HTS221_T_RES_AVG_256	0x38

#define HTS221_T_RES_MASK		0x38

#define HTS221_BDU_ENABLED		1
#define HTS221_BDU_DISABLED		0

#define HTS221_ODR_ONE_SHOT		0
#define HTS221_ODR_1HZ			1
#define HTS221_ODR_7HZ			2
#define HTS221_ODR_12_5HZ		3

#define HTS221_ODR_MASK			0x03

#endif
// END OF FILE
