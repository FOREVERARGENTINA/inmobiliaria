@echo off
echo ========================================
echo   Desplegando Reglas de Firebase
echo ========================================
echo.

echo [1/2] Desplegando reglas de Firestore...
firebase deploy --only firestore:rules

echo.
echo [2/2] Desplegando reglas de Storage...
firebase deploy --only storage

echo.
echo ========================================
echo   Reglas desplegadas exitosamente!
echo ========================================
echo.
pause
