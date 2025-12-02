# 📊 Dashboard Interactivo - Riesgo País EMBI

Dashboard web interactivo para visualizar y analizar datos históricos del EMBI (Emerging Markets Bond Index) y riesgo país.

## 🌐 Ver Dashboard en Vivo

**[🚀 Acceder al Dashboard](https://TU-USUARIO.github.io/dashboard-embi/)**

*(Reemplaza TU-USUARIO con tu nombre de usuario de GitHub)*

---

## ✨ Características

- 📈 **Visualización Interactiva**: Gráficos dinámicos con Chart.js
- 🌍 **Múltiples Países**: Análisis comparativo de diferentes mercados emergentes
- 📅 **Datos Históricos**: Serie temporal completa del EMBI
- 🎨 **Diseño Moderno**: Interfaz responsive y atractiva
- 🔄 **Actualización Automática**: Los datos se actualizan diariamente
- 📱 **Responsive**: Funciona perfectamente en móviles y tablets
- 🎯 **Ranking Dinámico**: Visualización de países por nivel de riesgo

---

## 🎯 Vistas Disponibles

1. **📈 Vista Temporal**: Evolución del EMBI a lo largo del tiempo
2. **🏆 Vista Ranking**: Comparación de países por nivel de riesgo actual
3. **🔍 Filtros Interactivos**: Selección de países y períodos personalizados

---

## 🚀 Tecnologías Utilizadas

- **HTML5** - Estructura
- **CSS3** - Estilos modernos con gradientes y animaciones
- **JavaScript** - Lógica e interactividad
- **Chart.js** - Visualización de datos
- **Python** - Procesamiento de datos
- **GitHub Actions** - Actualización automática

---

## 📦 Estructura del Proyecto

```
dashboard/
├── index.html              # Página principal
├── script.js              # Lógica del dashboard
├── style.css              # Estilos
├── data.json              # Datos procesados
├── convert_data.py        # Script de procesamiento
├── .github/
│   └── workflows/
│       └── update-data.yml # Actualización automática
└── README.md              # Este archivo
```

---

## 🔄 Actualización de Datos

Los datos se actualizan automáticamente cada día a las 6 AM UTC mediante GitHub Actions.

### Actualización Manual:
1. Ve a la pestaña **Actions** en GitHub
2. Selecciona **"Update EMBI Data"**
3. Click en **"Run workflow"**

---

## 💻 Desarrollo Local

Para ejecutar el dashboard localmente:

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/TU-USUARIO/dashboard-embi.git
   cd dashboard-embi
   ```

2. **Abre con un servidor local**:
   - Opción 1: Doble click en `start_dashboard.bat` (Windows)
   - Opción 2: Usa Python:
     ```bash
     python -m http.server 8000
     ```
   - Opción 3: Usa la extensión "Live Server" de VS Code

3. **Abre en el navegador**:
   ```
   http://localhost:8000
   ```

---

## 🔧 Procesar Datos Nuevos

Si tienes un archivo Excel actualizado:

1. Coloca el archivo `Serie_Historica_Spread_del_EMBI.xlsx` en la carpeta raíz
2. Ejecuta:
   ```bash
   python convert_data.py
   ```
3. Se generará un nuevo `data.json`

---

## 📊 Fuente de Datos

Los datos provienen de la serie histórica del EMBI (Emerging Markets Bond Index), que mide el riesgo país de mercados emergentes.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Si encuentras algún error o tienes sugerencias:

1. Haz un Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 📧 Contacto

¿Preguntas o sugerencias? Abre un [Issue](https://github.com/TU-USUARIO/dashboard-embi/issues) en GitHub.

---

## 🌟 Agradecimientos

- Chart.js por la librería de visualización
- GitHub Pages por el hosting gratuito
- La comunidad de código abierto

---

**Hecho con ❤️ para análisis financiero**
