# 🌐 Guía Completa: Publicar Dashboard GRATIS en la Web

## 📋 Lo que necesitas (todo gratis):
1. ✅ Cuenta de GitHub (si no tienes, créala en https://github.com)
2. ✅ GitHub Desktop (descarga en https://desktop.github.com)

---

## 🚀 PASOS PARA PUBLICAR (5-10 minutos)

### **Paso 1: Instalar GitHub Desktop** (si no lo tienes)

1. Ve a https://desktop.github.com
2. Descarga e instala
3. Inicia sesión con tu cuenta de GitHub

---

### **Paso 2: Crear Repositorio en GitHub**

1. Ve a https://github.com
2. Click en el botón **"+"** (arriba a la derecha) → **"New repository"**
3. Configura así:
   - **Repository name**: `dashboard-embi` (o el nombre que prefieras)
   - **Description**: `Dashboard interactivo de riesgo país EMBI`
   - **Public** ✅ (debe ser público para GitHub Pages gratis)
   - ❌ NO marques "Add a README file"
   - Click **"Create repository"**

4. **¡IMPORTANTE!** Copia la URL que aparece, será algo como:
   ```
   https://github.com/TU-USUARIO/dashboard-embi.git
   ```

---

### **Paso 3: Subir tu Dashboard**

#### Opción A: Usando GitHub Desktop (Más Fácil)

1. Abre **GitHub Desktop**
2. Click en **"File"** → **"Add local repository"**
3. Click en **"Choose..."** y selecciona la carpeta:
   ```
   c:\Users\HP\Downloads\dashboard
   ```
4. Si dice que no es un repositorio, click en **"create a repository"**
5. Click en **"Publish repository"**
6. Asegúrate de que:
   - ✅ **"Keep this code private"** esté DESMARCADO (debe ser público)
   - El nombre sea el mismo que creaste
7. Click **"Publish repository"**

#### Opción B: Usando la Web (Alternativa)

1. Ve a tu repositorio recién creado en GitHub
2. Click en **"uploading an existing file"**
3. Arrastra TODOS estos archivos desde `c:\Users\HP\Downloads\dashboard`:
   - `index.html`
   - `script.js`
   - `style.css`
   - `data.json`
   - `.gitignore`
   - `.github` (carpeta completa)
   - `convert_data.py`
   - `Serie_Historica_Spread_del_EMBI.xlsx`
4. Escribe en "Commit changes": `Publicar dashboard`
5. Click **"Commit changes"**

---

### **Paso 4: Activar GitHub Pages** ⭐

1. En tu repositorio de GitHub, click en **"Settings"** (⚙️)
2. En el menú izquierdo, busca y click en **"Pages"**
3. En **"Branch"**:
   - Selecciona: **main** (o master)
   - Folder: **/ (root)**
   - Click **"Save"**
4. **¡Espera 1-2 minutos!** ⏱️
5. Refresca la página
6. Verás un mensaje verde:
   ```
   ✅ Your site is live at https://TU-USUARIO.github.io/dashboard-embi/
   ```

---

### **Paso 5: ¡Visita tu Dashboard!** 🎉

Tu dashboard ya está publicado en:
```
https://TU-USUARIO.github.io/dashboard-embi/
```

**¡Comparte este link con quien quieras!** 📱💻

---

## 🔄 Actualizar Datos Automáticamente (Opcional pero Recomendado)

El dashboard incluye un sistema de actualización automática:

1. Ve a tu repositorio → **"Actions"**
2. Si aparece un botón, click en **"I understand my workflows, go ahead and enable them"**
3. ¡Listo! Los datos se actualizarán automáticamente cada día a las 8 AM

Para actualizar manualmente:
1. Ve a **"Actions"** → **"Update EMBI Data"**
2. Click en **"Run workflow"** → **"Run workflow"**

---

## 🔧 Actualizar el Dashboard (después de publicado)

Cuando hagas cambios al código:

### Con GitHub Desktop:
1. Abre GitHub Desktop
2. Verás los archivos modificados
3. Escribe un mensaje en "Summary" (ej: "Mejorar diseño")
4. Click **"Commit to main"**
5. Click **"Push origin"**
6. Espera 1-2 minutos y refresca tu sitio web

### Desde la Web:
1. Ve a tu repositorio
2. Click en el archivo que quieres editar
3. Click en el ícono de lápiz (✏️)
4. Haz los cambios
5. Click **"Commit changes"**

---

## 🐛 Solución de Problemas

### ❌ El sitio muestra "404 - Not Found"
- Verifica que el repositorio sea **público**
- Asegúrate de que `index.html` esté en la raíz (no en una subcarpeta)
- Espera 2-3 minutos más

### ❌ El dashboard no carga datos
- Verifica que `data.json` esté en el repositorio
- Abre la consola del navegador (F12) y busca errores
- Refresca con Ctrl + Shift + R (limpia caché)

### ❌ Los gráficos no se ven
- Verifica que `script.js` y `style.css` estén en el repositorio
- Revisa la consola del navegador (F12)

### ❌ "Repository not found"
- Verifica que el repositorio sea público
- Revisa que el nombre del repositorio sea correcto en la URL

---

## 🎁 Ventajas de GitHub Pages

✅ **Gratis para siempre** - Sin costos ocultos
✅ **HTTPS seguro** - Certificado SSL incluido
✅ **Rápido** - CDN global de GitHub
✅ **Sin límites** - Visitantes ilimitados
✅ **Responsive** - Funciona en móviles y tablets
✅ **Sin servidor** - No necesitas mantener nada
✅ **Dominio personalizado** - Puedes usar tu propio dominio (opcional)

---

## 📱 Compartir tu Dashboard

### Link directo:
```
https://TU-USUARIO.github.io/dashboard-embi/
```

### Crear QR Code:
1. Ve a https://www.qr-code-generator.com/
2. Pega tu URL
3. Descarga el QR
4. ¡Comparte en presentaciones o documentos!

### Acortar URL:
- https://bit.ly
- https://tinyurl.com

---

## 🌟 Mejoras Futuras (Opcionales)

### Dominio Personalizado
Puedes usar tu propio dominio (ej: `dashboard.tuempresa.com`):
1. Compra un dominio en Namecheap, GoDaddy, etc.
2. En GitHub Pages Settings, agrega tu dominio personalizado
3. Configura los DNS según las instrucciones de GitHub

### Analytics
Agrega Google Analytics para ver cuántas personas visitan:
1. Crea cuenta en https://analytics.google.com
2. Agrega el código de tracking a `index.html`

---

## 📞 ¿Necesitas Ayuda?

Si algo no funciona:
1. Revisa la sección "Solución de Problemas" arriba
2. Verifica que seguiste todos los pasos
3. Revisa la consola del navegador (F12) para ver errores

---

## ✨ ¡Felicidades!

Tu dashboard profesional ya está en línea y accesible desde cualquier parte del mundo. 🌍

**Tiempo total**: 5-10 minutos
**Costo**: $0 (gratis para siempre)
**Resultado**: Dashboard profesional en la web ✨
