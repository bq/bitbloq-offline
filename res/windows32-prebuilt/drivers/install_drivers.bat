#!/usr/bin/env bash
IF EXIST "%PROGRAMFILES(X86)%" (
"data/bqZowi_x64.exe" /lm
) ELSE  (
"data/bqZowi_x86.exe" /lm
)
IF EXIST "%PROGRAMFILES(X86)%" (
"data/CP210xVCPInstaller_x64.exe" /lm
) ELSE  (
"data/CP210xVCPInstaller_x86.exe" /lm
)
IF EXIST "%PROGRAMFILES(X86)%" (
"data/dpinst64.exe" /lm
) ELSE  (
"data/dpinst32.exe" /lm
)
"data/CDM21216_Setup.exe" /lm