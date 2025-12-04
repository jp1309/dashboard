document.addEventListener('DOMContentLoaded', async () => {
    // Elements
    const countryListEl = document.getElementById('countryList');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const selectAllBtn = document.getElementById('selectAllBtn');
    const deselectAllBtn = document.getElementById('deselectAllBtn');
    const ctx = document.getElementById('riskChart').getContext('2d');

    // View Switcher Elements
    const viewTimeSeriesBtn = document.getElementById('viewTimeSeriesBtn');
    const viewRankingBtn = document.getElementById('viewRankingBtn');
    const timeSeriesControls = document.getElementById('timeSeriesControls');
    const rankingControls = document.getElementById('rankingControls');
    const countriesControlGroup = document.getElementById('countriesControlGroup');
    const rankingDateInput = document.getElementById('rankingDate');

    // State
    let rawData = [];
    let chart;
    let allCountries = [];
    let selectedCountries = new Set();
    let currentView = 'timeseries'; // 'timeseries' or 'ranking'
    let countryColors = {};

    // Premium colors
    // Flag Colors Mapping - Optimized for distinction
    const flagColors = {
        'Ecuador': '#0047AB', // Azul solicitado (Fuerte)
        'Argentina': '#92C5DE', // Celeste Pálido
        'Bolivia': '#1E5631', // Verde Oscuro
        'Brasil': '#4CC552', // Verde Lima Brillante
        'Chile': '#D32F2F', // Rojo Intenso
        'Colombia': '#FCD116', // Amarillo
        'Costa Rica': '#E91E63', // Rosa Fuerte (Distinción)
        'El Salvador': '#3F51B5', // Índigo/Morado
        'Guatemala': '#00BCD4', // Cian
        'Honduras': '#00E5FF', // Turquesa Neón
        'México': '#009688', // Verde Azulado (Teal)
        'Panamá': '#FF5722', // Naranja Intenso
        'Paraguay': '#880E4F', // Vino Tinto
        'Perú': '#F44336', // Rojo Coral
        'Rep. Dom.': '#9C27B0', // Púrpura (Distinción)
        'Uruguay': '#607D8B', // Azul Acero
        'Venezuela': '#795548', // Marrón
        'Turquía': '#A52A2A', // Marrón Rojizo
        'Sudáfrica': '#FF9800', // Naranja
        'Egipto': '#FFC107', // Ámbar
        'Nigeria': '#4CAF50', // Verde Medio
        'Angola': '#B71C1C', // Rojo Oscuro
    };

    // Fallback colors for other countries
    const fallbackColors = [
        '#38bdf8', '#fbbf24', '#f87171', '#4ade80', '#a78bfa',
        '#f472b6', '#22d3ee', '#fb923c', '#9ca3af', '#e879f9'
    ];

    // Fetch Data
    try {
        const response = await fetch('data.json');
        rawData = await response.json();
        initDashboard();
    } catch (error) {
        console.error("Error loading data:", error);
        alert("Error cargando los datos. Asegúrate de que data.json está en la misma carpeta.");
    }

    function initDashboard() {
        if (rawData.length === 0) return;

        // Extract countries
        const firstRow = rawData[0];
        const excludedCountries = ['Venezuela', 'LATINO', 'Global', 'RD-LATINO'];
        allCountries = Object.keys(firstRow).filter(key =>
            key !== 'Fecha' &&
            !key.startsWith('Unnamed') &&
            key !== 'null' &&
            !excludedCountries.includes(key)
        );

        // Assign colors based on flags or fallback
        allCountries.forEach((country, index) => {
            if (flagColors[country]) {
                countryColors[country] = flagColors[country];
            } else {
                countryColors[country] = fallbackColors[index % fallbackColors.length];
            }
        });

        // Sort data by date
        rawData.sort((a, b) => new Date(a.Fecha) - new Date(b.Fecha));

        const minDate = rawData[0].Fecha;
        const maxDate = rawData[rawData.length - 1].Fecha;

        // Init Time Series Inputs
        const defaultStartDate = '2025-09-01';
        startDateInput.value = defaultStartDate;
        endDateInput.value = maxDate;
        startDateInput.min = minDate;
        startDateInput.max = maxDate;
        endDateInput.min = minDate;
        endDateInput.max = maxDate;

        // Init Ranking Input
        rankingDateInput.value = maxDate;
        rankingDateInput.min = minDate;
        rankingDateInput.max = maxDate;

        // Populate Country List
        renderCountryList();

        // Select Ecuador and Argentina by default
        const defaultCountries = ['Ecuador', 'Argentina'];
        defaultCountries.forEach(c => {
            if (allCountries.includes(c)) {
                selectedCountries.add(c);
            }
        });
        updateCheckboxes();

        // Init Chart
        updateView();
    }

    function renderCountryList() {
        countryListEl.innerHTML = '';
        allCountries.forEach(country => {
            const div = document.createElement('div');
            div.className = 'country-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `chk-${country}`;
            checkbox.value = country;
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    selectedCountries.add(country);
                } else {
                    selectedCountries.delete(country);
                }
                if (currentView === 'timeseries') {
                    updateChart();
                }
            });

            const label = document.createElement('label');
            label.htmlFor = `chk-${country}`;
            label.textContent = country;
            label.style.color = countryColors[country]; // Optional: color code the list too

            div.appendChild(checkbox);
            div.appendChild(label);
            countryListEl.appendChild(div);
        });
    }

    function updateCheckboxes() {
        const checkboxes = countryListEl.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = selectedCountries.has(cb.value);
        });
    }

    function switchView(view) {
        currentView = view;

        // Update UI classes
        if (view === 'timeseries') {
            viewTimeSeriesBtn.classList.add('active');
            viewRankingBtn.classList.remove('active');
            timeSeriesControls.style.display = 'block';
            countriesControlGroup.style.display = 'block';
            rankingControls.style.display = 'none';
        } else {
            viewTimeSeriesBtn.classList.remove('active');
            viewRankingBtn.classList.add('active');
            timeSeriesControls.style.display = 'none';
            countriesControlGroup.style.display = 'none';
            rankingControls.style.display = 'block';
        }

        updateView();
    }

    function updateView() {
        if (chart) {
            chart.destroy();
        }

        if (currentView === 'timeseries') {
            renderTimeSeriesChart();
        } else {
            renderRankingChart();
        }
    }

    // --- Time Series Logic ---

    function getFilteredTimeSeriesData() {
        const start = new Date(startDateInput.value);
        const end = new Date(endDateInput.value);

        return rawData.filter(d => {
            const date = new Date(d.Fecha);
            return date >= start && date <= end;
        });
    }

    function renderTimeSeriesChart() {
        Chart.defaults.color = '#1e293b'; // Dark text
        Chart.defaults.borderColor = '#e2e8f0'; // Light gray border

        const filteredData = getFilteredTimeSeriesData();

        const datasets = Array.from(selectedCountries).map((country) => {
            return {
                label: country,
                data: filteredData.map(row => ({
                    x: row.Fecha,
                    y: row[country]
                })),
                borderColor: countryColors[country],
                backgroundColor: countryColors[country],
                borderWidth: 2,
                pointRadius: (ctx) => ctx.dataIndex === ctx.dataset.data.length - 1 ? 5 : 0,
                pointHoverRadius: 6,
                tension: 0.1,
                datalabels: {
                    display: (ctx) => ctx.dataIndex === ctx.dataset.data.length - 1,
                    align: 'right',
                    anchor: 'end',
                    color: countryColors[country],
                    font: { weight: 'bold' },
                    formatter: (value) => Math.round(value.y)
                }
            };
        });

        chart = new Chart(ctx, {
            type: 'line',
            data: { datasets },
            options: {
                layout: {
                    padding: { right: 40 }
                },
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end', // Move legend to the right to not overlap with title
                        labels: { color: '#1e293b', usePointStyle: true, pointStyle: 'circle' }
                    },
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
                    subtitle: {
                        display: true,
                        text: 'Fuente: Banco Central de la República Dominicana',
                        align: 'start',
                        color: '#64748b',
                        font: { size: 10 },
                        padding: { top: 10 }
                    },
                    tooltip: {
                        backgroundColor: '#ffffff',
                        titleColor: '#0f172a',
                        bodyColor: '#334155',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        callbacks: {
                            title: function (context) {
                                const date = new Date(context[0].parsed.x);
                                const day = String(date.getUTCDate()).padStart(2, '0');
                                const month = String(date.getUTCMonth() + 1).padStart(2, '0');
                                const year = String(date.getUTCFullYear()).slice(-2);
                                return `${day}-${month}-${year}`;
                            }
                        }
                    },
                    datalabels: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: { unit: 'month', displayFormats: { month: 'MMM yyyy' } },
                        grid: { color: '#e2e8f0' },
                        ticks: { color: '#64748b' }
                    },
                    y: {
                        grid: { color: '#e2e8f0' },
                        ticks: { color: '#64748b' },
                        title: { display: true, text: 'Spread (bps)', color: '#475569' }
                    }
                }
            },
            plugins: [ChartDataLabels] // Register plugin locally if needed, but CDN usually registers globally. Safe to include if defined.
        });
    }

    function updateChart() {
        // Only update data if chart exists and is time series
        if (chart && currentView === 'timeseries') {
            const filteredData = getFilteredTimeSeriesData();
            const datasets = Array.from(selectedCountries).map((country) => {
                return {
                    label: country,
                    data: filteredData.map(row => ({
                        x: row.Fecha,
                        y: row[country]
                    })),
                    borderColor: countryColors[country],
                    backgroundColor: countryColors[country],
                    borderWidth: 2,
                    pointRadius: (ctx) => ctx.dataIndex === ctx.dataset.data.length - 1 ? 5 : 0,
                    pointHoverRadius: 6,
                    tension: 0.1,
                    datalabels: {
                        display: (ctx) => ctx.dataIndex === ctx.dataset.data.length - 1,
                        align: 'right',
                        anchor: 'end',
                        color: countryColors[country],
                        font: { weight: 'bold' },
                        formatter: (value) => Math.round(value.y)
                    }
                };
            });
            chart.data.datasets = datasets;
            chart.update();
        }
    }

    // --- Ranking Logic ---

    function renderRankingChart() {
        const selectedDateStr = rankingDateInput.value;

        // Find data for this date
        const row = rawData.find(d => d.Fecha === selectedDateStr);

        if (!row) {
            // Handle no data case
            chart = new Chart(ctx, {
                type: 'bar',
                data: { labels: [], datasets: [] },
                options: {
                    plugins: {
                        title: { display: true, text: 'No hay datos para esta fecha' }
                    }
                }
            });
            return;
        }

        // Prepare data: [ {country, value}, ... ]
        let rankingData = [];
        allCountries.forEach(country => {
            const val = row[country];
            if (val !== null && val !== undefined) {
                rankingData.push({ country, value: val });
            }
        });

        // Sort descending
        rankingData.sort((a, b) => b.value - a.value);

        const labels = rankingData.map(d => d.country);
        const dataValues = rankingData.map(d => d.value);

        // Use consistent colors
        const barColors = labels.map(c => countryColors[c]);

        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Riesgo País (bps)',
                    data: dataValues,
                    backgroundColor: barColors,
                    borderColor: barColors,
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y', // Horizontal bar chart
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
                    subtitle: {
                        display: true,
                        text: 'Fuente: Banco Central de la República Dominicana',
                        align: 'start',
                        color: '#64748b',
                        font: { size: 10 },
                        padding: { top: 10 }
                    },
                    tooltip: {
                        backgroundColor: '#ffffff',
                        titleColor: '#0f172a',
                        bodyColor: '#334155',
                        borderColor: '#e2e8f0',
                        borderWidth: 1
                    },
                    datalabels: {
                        color: '#334155',
                        anchor: 'end',
                        align: 'end',
                        offset: 4,
                        font: {
                            weight: 'bold'
                        },
                        formatter: Math.round
                    }
                },
                scales: {
                    x: {
                        grid: { color: '#e2e8f0' },
                        ticks: { color: '#64748b' },
                        grace: '10%' // Add some space for labels
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: '#1e293b', font: { weight: 'bold' } }
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    }

    // Event Listeners
    viewTimeSeriesBtn.addEventListener('click', () => switchView('timeseries'));
    viewRankingBtn.addEventListener('click', () => switchView('ranking'));

    startDateInput.addEventListener('change', updateChart);
    endDateInput.addEventListener('change', updateChart);
    rankingDateInput.addEventListener('change', () => {
        if (currentView === 'ranking') updateView();
    });

    selectAllBtn.addEventListener('click', () => {
        allCountries.forEach(c => selectedCountries.add(c));
        updateCheckboxes();
        if (currentView === 'timeseries') updateChart();
    });

    deselectAllBtn.addEventListener('click', () => {
        selectedCountries.clear();
        updateCheckboxes();
        if (currentView === 'timeseries') updateChart();
    });
});
