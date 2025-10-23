@echo off
setlocal enabledelayedexpansion
pushd "%~dp0"

echo Checking for required tools...

REM Using PowerShell's built-in compression instead of external zip
echo Using PowerShell compression...

REM Using PowerShell for JSON manipulation instead of jq
echo Using PowerShell for JSON processing...

echo Installing/updating npm packages...
call npm install
if errorlevel 1 (
    echo npm install failed.
    popd
    exit /b 1
)

call npm update
if errorlevel 1 (
    echo npm update failed.
    popd
    exit /b 1
)

echo Running build.sh...
call build.bat
if errorlevel 1 (
    echo Build failed.
    popd
    exit /b 1
)

echo Cleaning up old zip files...
if exist singlefile-extension-chromium.zip del singlefile-extension-chromium.zip
if exist singlefile-extension-edge.zip del singlefile-extension-edge.zip

echo Creating Chromium extension zip...
powershell -Command "Compress-Archive -Path manifest.json,lib,_locales,src -DestinationPath singlefile-extension-chromium.zip -Force"
if errorlevel 1 (
    echo Failed to create Chromium extension zip.
    popd
    exit /b 1
)

echo Preparing Edge extension...
REM Backup original files
copy src\core\bg\config.js config.copy.js
copy manifest.json manifest.copy.json

REM Remove oauth2 from manifest for Edge using PowerShell
powershell -Command "$manifest = Get-Content manifest.json | ConvertFrom-Json; $manifest.PSObject.Properties.Remove('oauth2'); $manifest | ConvertTo-Json -Depth 10 | Set-Content manifest.json"
if errorlevel 1 (
    echo Failed to modify manifest.json
    popd
    exit /b 1
)

REM Modify config.js for Edge (forceWebAuthFlow: true and remove avif)
powershell -Command "(Get-Content src\core\bg\config.js) -replace 'forceWebAuthFlow: false', 'forceWebAuthFlow: true' -replace 'image/avif,', '' | Set-Content src\core\bg\config.js"

echo Creating Edge extension zip...
powershell -Command "Compress-Archive -Path manifest.json,lib,_locales,src -DestinationPath singlefile-extension-edge.zip -Force"
if errorlevel 1 (
    echo Failed to create Edge extension zip.
    REM Restore original files
    move config.copy.js src\core\bg\config.js
    move manifest.copy.json manifest.json
    popd
    exit /b 1
)

echo Restoring original files...
move config.copy.js src\core\bg\config.js
move manifest.copy.json manifest.json

echo Done. Extension packages created:
echo - singlefile-extension-chromium.zip
echo - singlefile-extension-edge.zip

popd
endlocal
