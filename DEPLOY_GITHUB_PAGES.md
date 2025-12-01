# 🌐 Publicar Dashboard en la Web (GitHub Pages)

## ✅ Pasos para Publicar

### Paso 1: Subir data.json

1. Abre **GitHub Desktop**
2. Verás cambios en `.gitignore` y `.github/workflows/update-data.yml`
3. También necesitas agregar `data.json`:
   - Ve a la carpeta del proyecto
   - Asegúrate de que `data.json` existe
   - Si no existe, ejecuta: `python convert_data.py`
4. En GitHub Desktop:
   - Summary: `Preparar para GitHub Pages`
   - Click **"Commit to main"**
   - Click **"Push origin"**

### Paso 2: Activar GitHub Pages

1. Ve a tu repositorio en GitHub:
   ```
   https://github.com/jp1309/dashboard-embi-riesgo-pais
   ```

2. Click en **"Settings"** (⚙️)

3. En el menú izquierdo, click en **"Pages"**

4. En **"Source"**:
   - Branch: Selecciona **"main"**
   - Folder: Selecciona **"/ (root)"**
   - Click **"Save"**

5. ¡Espera 1-2 minutos!

6. Refresca la página y verás:
   ```
   ✅ Your site is live at https://jp1309.github.io/dashboard-embi-riesgo-pais/
   ```

### Paso 3: Compartir con tus Colegas

Tu dashboard estará disponible en:
```
https://jp1309.github.io/dashboard-embi-riesgo-pais/
```

¡Comparte este link con quien quieras!

---

## 🔄 Actualización Automática de Datos

El archivo `.github/workflows/update-data.yml` que creamos:
- Descarga datos nuevos automáticamente cada día
- No necesitas hacer nada manualmente
- Los datos siempre estarán actualizados

Para activarlo:
1. Ve a tu repositorio → **"Actions"**
2. Click en **"I understand my workflows, go ahead and enable them"**

---

## 🐛 Solución de Problemas

### El sitio no carga
- Espera 2-3 minutos después de activar Pages
- Verifica que `data.json` esté en el repositorio
- Refresca con Ctrl + Shift + R

### Error 404
- Verifica que el repositorio sea público
- Asegúrate de que `index.html` esté en la raíz

### Los datos no se actualizan
- Ve a Actions y verifica que el workflow esté habilitado
- Ejecuta manualmente: Actions → Update EMBI Data → Run workflow

---

## 📱 Compartir

Puedes compartir el link directamente:
```
https://jp1309.github.io/dashboard-embi-riesgo-pais/
```

O crear un QR code en: https://www.qr-code-generator.com/

---

## ✨ Ventajas

✅ Gratis para siempre
✅ HTTPS seguro
✅ Actualización automática
✅ Sin límites de visitantes
✅ Funciona en móviles
✅ No necesitas servidor

---

¡Tu dashboard estará en línea en menos de 5 minutos!
