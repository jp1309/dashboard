@echo off
echo ============================================
echo  Preparando archivos para GitHub Pages
echo ============================================
echo.

echo [1/3] Verificando que data.json existe...
if not exist "data.json" (
    echo ERROR: data.json no existe. Ejecutando convert_data.py...
    python convert_data.py
    if errorlevel 1 (
        echo ERROR: No se pudo generar data.json
        pause
        exit /b 1
    )
)
echo ✓ data.json encontrado (listo para subir)
echo.

echo [2/3] Archivos que se subiran a GitHub:
echo ✓ index.html
echo ✓ style.css
echo ✓ script.js
echo ✓ data.json
echo ✓ convert_data.py
echo ✓ README.md
echo ✓ .gitignore
echo ✓ .github/workflows/update-data.yml
echo.

echo [3/3] Siguiente paso:
echo.
echo Abre GitHub Desktop y veras los cambios pendientes.
echo.
echo Pasos en GitHub Desktop:
echo 1. Revisa los archivos en la lista de cambios
echo 2. En "Summary" escribe: Preparar para GitHub Pages
echo 3. Click en "Commit to main"
echo 4. Click en "Push origin" (boton azul arriba)
echo.
echo Despues de hacer Push, continua con el Paso 2 (activar GitHub Pages)
echo.
pause
