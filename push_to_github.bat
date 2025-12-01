@echo off
echo ============================================
echo  Subiendo archivos a GitHub
echo ============================================
echo.

cd /d "%~dp0"

echo [1/5] Verificando Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git no esta instalado
    echo Descargalo desde: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo ✓ Git encontrado
echo.

echo [2/5] Agregando todos los archivos...
git add .
echo ✓ Archivos agregados
echo.

echo [3/5] Haciendo commit...
git commit -m "Preparar para GitHub Pages con data.json"
if errorlevel 1 (
    echo No hay cambios nuevos para subir
) else (
    echo ✓ Commit realizado
)
echo.

echo [4/5] Verificando conexion con GitHub...
git remote -v
echo.

echo [5/5] Subiendo a GitHub (Push)...
echo.
echo NOTA: Si te pide credenciales:
echo - Usuario: jp1309
echo - Password: Tu Personal Access Token
echo.
git push origin main
if errorlevel 1 (
    echo.
    echo ERROR: No se pudo subir a GitHub
    echo.
    echo Posibles causas:
    echo 1. No estas autenticado (necesitas Personal Access Token)
    echo 2. No hay conexion a internet
    echo 3. El remote no esta configurado
    echo.
    echo Intenta desde GitHub Desktop o verifica tu token
) else (
    echo.
    echo ============================================
    echo  ✓ ARCHIVOS SUBIDOS EXITOSAMENTE!
    echo ============================================
    echo.
    echo Verifica en: https://github.com/jp1309/dashboard-embi-riesgo-pais
    echo.
)
echo.
pause
