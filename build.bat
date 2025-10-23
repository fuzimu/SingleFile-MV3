@echo off
setlocal enabledelayedexpansion
pushd "%~dp0"

echo Building with Rollup...
npx --yes rollup -c rollup.config.js
if errorlevel 1 (
  echo Rollup build failed.
  popd
  exit /b 1
)

echo Bundling lib\single-file-frames.bundle.js
type lib\chrome-browser-polyfill.js lib\single-file-frames.js lib\single-file-extension-frames.js > lib\single-file-frames.bundle.js
if errorlevel 1 (
  echo Failed to create frames bundle.
  popd
  exit /b 1
)

echo Bundling lib\single-file-bootstrap.bundle.js
type lib\chrome-browser-polyfill.js lib\single-file-bootstrap.js lib\single-file-extension-bootstrap.js lib\single-file-infobar.js > lib\single-file-bootstrap.bundle.js
if errorlevel 1 (
  echo Failed to create bootstrap bundle.
  popd
  exit /b 1
)

echo Done.
popd
endlocal
