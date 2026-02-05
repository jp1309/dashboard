# Implementación del Heatmap - Plan de Cambios

## Cambios necesarios en script.js:

### 1. Agregar variables y elementos DOM (después de línea 16):
```javascript
const heatmapControls = document.getElementById('heatmapControls');
const heatmapCountrySelect = document.getElementById('heatmapCountry');
const viewHeatmapBtn = document.getElementById('viewHeatmapBtn');
```

### 2. Actualizar currentView para incluir 'heatmap'

### 3. Agregar función para popular selector de países del heatmap:
```javascript
function populateHeatmapCountrySelect() {
    heatmapCountrySelect.innerHTML = '';
    allCountries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        if (country === 'Ecuador') option.selected = true;
        heatmapCountrySelect.appendChild(option);
    });
}
```

### 4. Función para procesar datos del heatmap:
```javascript
function getHeatmapData(country) {
    // Filtrar datos del país seleccionado
    const countryData = rawData.map(row => ({
        date: new Date(row.Fecha),
        value: row[country]
    })).filter(d => d.value !== null && d.value !== undefined);

    // Obtener rango de años (desde 2005 hasta el último año disponible)
    const years = [...new Set(countryData.map(d => d.date.getFullYear()))].sort();
    const minYear = Math.max(2005, Math.min(...years));
    const maxYear = Math.max(...years);

    // Crear matriz de datos
    const heatmapMatrix = [];
    
    for (let year = minYear; year <= maxYear; year++) {
        const yearData = countryData.filter(d => d.date.getFullYear() === year);
        
        yearData.forEach(d => {
            const dayOfYear = getDayOfYear(d.date);
            heatmapMatrix.push({
                x: year.toString(),
                y: dayOfYear,
                v: d.value
            });
        });
    }

    return heatmapMatrix;
}

function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}
```

### 5. Función renderHeatmapChart():
```javascript
function renderHeatmapChart() {
    const selectedCountry = heatmapCountrySelect.value;
    const data = getHeatmapData(selectedCountry);

    chart = new Chart(ctx, {
        type: 'matrix',
        data: {
            datasets: [{
                label: `Riesgo País - ${selectedCountry}`,
                data: data,
                backgroundColor(context) {
                    const value = context.dataset.data[context.dataIndex].v;
                    if (value < 600) return 'rgba(34, 197, 94, 0.8)'; // Verde
                    if (value < 1000) return 'rgba(251, 191, 36, 0.8)'; // Amarillo
                    return 'rgba(239, 68, 68, 0.8)'; // Rojo
                },
                borderColor: '#e2e8f0',
                borderWidth: 1,
                width: ({chart}) => (chart.chartArea || {}).width / 21 - 1,
                height: ({chart}) => (chart.chartArea || {}).height / 365 - 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: (() => {
                        if (!rawData || rawData.length === 0) return '';
                        const lastDate = new Date(rawData[rawData.length - 1].Fecha);
                        const day = String(lastDate.getUTCDate()).padStart(2, '0');
                        const month = String(lastDate.getUTCMonth() + 1).padStart(2, '0');
                        const year = lastDate.getUTCFullYear();
                        return `Riesgo País (último dato: ${day}/${month}/${year})`;
                    })(),
                    align: 'start',
                    color: '#1e293b',
                    font: { size: 16, weight: 'bold' },
                    padding: { bottom: 20 }
                },
                tooltip: {
                    callbacks: {
                        title() {
                            return '';
                        },
                        label(context) {
                            const v = context.dataset.data[context.dataIndex];
                            const date = new Date(parseInt(v.x), 0, v.y);
                            return `${date.toLocaleDateString('es-ES')}: ${Math.round(v.v)} bps`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'category',
                    labels: data.map(d => d.x).filter((v, i, a) => a.indexOf(v) === i).sort(),
                    ticks: {
                        color: '#64748b'
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    type: 'linear',
                    min: 1,
                    max: 365,
                    ticks: {
                        color: '#64748b',
                        callback: function(value) {
                            const months = [
                                {day: 1, label: 'Ene'}, {day: 32, label: 'Feb'},
                                {day: 60, label: 'Mar'}, {day: 91, label: 'Abr'},
                                {day: 121, label: 'May'}, {day: 152, label: 'Jun'},
                                {day: 182, label: 'Jul'}, {day: 213, label: 'Ago'},
                                {day: 244, label: 'Sep'}, {day: 274, label: 'Oct'},
                                {day: 305, label: 'Nov'}, {day: 335, label: 'Dic'}
                            ];
                            const month = months.find(m => m.day === value);
                            return month ? month.label : '';
                        }
                    },
                    grid: {
                        color: '#e2e8f0'
                    }
                }
            }
        },
        plugins: [sourceTextPlugin]
    });
}
```

### 6. Actualizar switchView():
```javascript
function switchView(view) {
    currentView = view;

    // Update UI classes
    viewTimeSeriesBtn.classList.remove('active');
    viewRankingBtn.classList.remove('active');
    viewHeatmapBtn.classList.remove('active');

    if (view === 'timeseries') {
        viewTimeSeriesBtn.classList.add('active');
        timeSeriesControls.style.display = 'block';
        countriesControlGroup.style.display = 'block';
        rankingControls.style.display = 'none';
        heatmapControls.style.display = 'none';
    } else if (view === 'ranking') {
        viewRankingBtn.classList.add('active');
        timeSeriesControls.style.display = 'none';
        countriesControlGroup.style.display = 'none';
        rankingControls.style.display = 'block';
        heatmapControls.style.display = 'none';
    } else if (view === 'heatmap') {
        viewHeatmapBtn.classList.add('active');
        timeSeriesControls.style.display = 'none';
        countriesControlGroup.style.display = 'none';
        rankingControls.style.display = 'none';
        heatmapControls.style.display = 'block';
    }

    updateView();
}
```

### 7. Actualizar updateView():
```javascript
function updateView() {
    if (chart) {
        chart.destroy();
    }

    if (currentView === 'timeseries') {
        renderTimeSeriesChart();
    } else if (currentView === 'ranking') {
        renderRankingChart();
    } else if (currentView === 'heatmap') {
        renderHeatmapChart();
    }
}
```

### 8. Agregar event listeners:
```javascript
viewHeatmapBtn.addEventListener('click', () => switchView('heatmap'));
heatmapCountrySelect.addEventListener('change', () => {
    if (currentView === 'heatmap') updateView();
});
```

### 9. Llamar populateHeatmapCountrySelect() en initDashboard()
