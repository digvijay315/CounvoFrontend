@echo off
REM Redux Persist Installation Script for Windows
REM Run this script to install redux-persist if not already installed

echo ================================================
echo  Redux Persist Installation
echo ================================================
echo.

REM Check if package.json exists
if not exist "package.json" (
    echo [ERROR] package.json not found!
    echo Please run this script from the counvo_frontend directory
    pause
    exit /b 1
)

echo Installing redux-persist...
echo.

REM Install redux-persist
call npm install redux-persist

REM Check if installation was successful
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo  Installation Successful!
    echo ================================================
    echo.
    echo Next steps:
    echo 1. The code is already updated to use redux-persist
    echo 2. Just run: npm start
    echo 3. Test login/logout functionality
    echo 4. Check browser localStorage for 'persist:root' key
    echo.
    echo Documentation:
    echo - REDUX_PERSIST_SETUP.md
    echo - redux/MIGRATION_GUIDE_REDUX_PERSIST.md
    echo.
) else (
    echo.
    echo [ERROR] Installation failed!
    echo Please try manually: npm install redux-persist
    pause
    exit /b 1
)

pause

