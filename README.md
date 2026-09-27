# Riesgo país (EMBI)

Dashboard interactivo para explorar la evolución del riesgo país y comparar los spreads de deuda soberana de distintos países, expresados en puntos básicos (bps).

### [Abrir el dashboard](https://jp1309.github.io/dashboard/)

El sitio está publicado en GitHub Pages y se puede consultar directamente desde el navegador.

## Qué puedes explorar

| Vista | Qué muestra |
| --- | --- |
| **Serie de tiempo** | Evolución de uno o varios países en el rango de fechas que elijas. |
| **Ranking por fecha** | Comparación de países para un día seleccionado. |
| **Mapa de calor** | Evolución diaria de un país, organizada por año y día del año. |

## Datos y actualización

La fuente es la [serie histórica del spread del EMBI del Banco Central de la República Dominicana](https://cdn.bancentral.gov.do/documents/entorno-internacional/documents/Serie_Historica_Spread_del_EMBI.xlsx). El script [`convert_data.py`](convert_data.py) descarga el Excel, transforma los valores a puntos básicos y genera [`data.json`](data.json), que utiliza el dashboard.

El [flujo de GitHub Actions](.github/workflows/update-data.yml) intenta actualizar los datos cada día y publica cambios cuando el archivo generado es diferente. La fecha más reciente disponible depende de la publicación de la fuente.

## Archivos principales

| Archivo | Función |
| --- | --- |
| [`index.html`](index.html), [`style.css`](style.css) y [`script.js`](script.js) | Interfaz y gráficos del dashboard. |
| [`data.json`](data.json) | Datos que carga la página. |
| [`convert_data.py`](convert_data.py) | Descarga y conversión de la serie original. |
| [`.github/workflows/update-data.yml`](.github/workflows/update-data.yml) | Actualización automática de datos. |
