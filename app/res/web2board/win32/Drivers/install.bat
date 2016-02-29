#!/usr/bin/env bash

IF EXIST "%PROGRAMFILES(X86)%" (
bqZowi_x64.exe /lm
) ELSE  (
bqZowi_x86.exe /lm
)

IF EXIST "%PROGRAMFILES(X86)%" (
CP210xVCPInstaller_x64.exe /lm
) ELSE  (
CP210xVCPInstaller_x86.exe /lm
)

IF EXIST "%PROGRAMFILES(X86)%" (
dpinst64.exe /lm
) ELSE  (
dpinst32.exe /lm
)

"CDM v2.10.00 WHQL Certified.exe"
