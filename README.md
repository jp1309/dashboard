# Dashboard de Análisis de Riesgo País (EMBI)

Plataforma interactiva de visualización de datos financieros diseñada para el monitoreo y análisis histórico del índice EMBI (Emerging Markets Bond Index) en mercados emergentes.

## 📋 Descripción General

Este proyecto proporciona una interfaz web analítica para explorar la evolución del riesgo país a través de múltiples dimensiones temporales y comparativas. Utiliza datos de series temporales para generar visualizaciones dinámicas que facilitan la toma de decisiones y el análisis económico.

## 🚀 Funcionalidades Principales

### 1. Visualización de Series Temporales
- Gráficos de línea interactivos para el seguimiento histórico del spread (bps).
- Capacidad de comparación simultánea entre múltiples países.
- Filtros de rango de fechas personalizados.

### 2. Ranking Comparativo
- Gráfico de barras horizontal para la comparación transversal de riesgo en fechas específicas.
- Ordenamiento automático de mayor a menor riesgo.

### 3. Mapa de Calor (Heatmap)
- Visualización matricial de intensidad de riesgo (Año vs. Día del año).
- Escala de color de 5 niveles para identificación rápida de patrones estacionales y tendencias estructurales.
- Algoritmo de relleno de datos (forward-fill) para continuidad visual en series incompletas.

## 🛠️ Stack Tecnológico

- **Frontend:** HTML5, CSS3 (Diseño Responsive), JavaScript (ES6+).
- **Visualización:** Chart.js, chartjs-chart-matrix.
- **Procesamiento de Datos:** Python (Pandas) para la transformación de Excel a JSON.
- **Automatización:** GitHub Actions para la actualización diaria de datos.
- **Despliegue:** GitHub Pages.

## 📂 Estructura del Repositorio

```
dashboard/
├── index.html              # Punto de entrada de la aplicación
├── script.js               # Lógica de negocio y renderizado de gráficos
├── style.css               # Definiciones de estilos y diseño visual
├── data.json               # Fuente de datos estructurada (generada automáticamente)
├── convert_data.py         # Script ETL (Extract, Transform, Load)
├── .github/workflows/      # Configuraciones CI/CD
└── README.md               # Documentación técnica
```

## 🔄 Flujo de Datos

1. **Ingesta:** Los datos brutos se procesan desde archivos Excel (`.xlsx`).
2. **Transformación:** El script `convert_data.py` limpia, normaliza y exporta los datos a formato JSON optimizado para web.
3. **Visualización:** El cliente web consume `data.json` y renderiza los gráficos en el navegador del usuario.

## 💻 Instalación y Despliegue Local

Para ejecutar este proyecto en un entorno local:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/TU-USUARIO/dashboard-embi.git
   cd dashboard-embi
   ```

2. **Servir la aplicación:**
   Puede utilizar cualquier servidor HTTP estático. Ejemplo con Python:
   ```bash
   python -m http.server 8000
   ```

3. **Acceder:**
   Abra su navegador en `http://localhost:8000`.

## 📄 Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulte el archivo `LICENSE` para más detalles.
