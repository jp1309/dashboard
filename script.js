﻿document.addEventListener('DOMContentLoaded', async () => {
    const countryListEl = document.getElementById('countryList');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const selectAllBtn = document.getElementById('selectAllBtn');
    const deselectAllBtn = document.getElementById('deselectAllBtn');
    const ctx = document.getElementById('riskChart').getContext('2d');
    const viewTimeSeriesBtn = document.getElementById('viewTimeSeriesBtn');
    const viewRankingBtn = document.getElementById('viewRankingBtn');
    const viewHeatmapBtn = document.getElementById('viewHeatmapBtn');
    const timeSeriesControls = document.getElementById('timeSeriesControls');
    const rankingControls = document.getElementById('rankingControls');
    const heatmapControls = document.getElementById('heatmapControls');
    const countriesControlGroup = document.getElementById('countriesControlGroup');
    const rankingDateInput = document.getElementById('rankingDate');
    const heatmapCountrySelect = document.getElementById('heatmapCountry');

    let rawData = [];
    let chart;
    let allCountries = [];
    let selectedCountries = new Set();
    let currentView = 'timeseries';
    let countryColors = {};

    const sourceTextPlugin = {
        id: 'sourceText',
        afterDraw: (chart) => {
            const ctx = chart.ctx;
            const chartArea = chart.chartArea;
            ctx.save();
            ctx.font = '10px Inter, sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            const text = 'Fuente: Banco Central de la República Dominicana';
            const x = chartArea.left;
            const y = chart.height - 5;
            ctx.fillText(text, x, y);
            ctx.restore();
        }
    };

    const flagColors = {
        'Ecuador': '#0047AB', 'Argentina': '#92C5DE', 'Bolivia': '#1E5631',
        'Brasil': '#4CC552', 'Chile': '#D32F2F', 'Colombia': '#FCD116',
        'Costa Rica': '#E91E63', 'El Salvador': '#3F51B5', 'Guatemala': '#00BCD4',
        'Honduras': '#00E5FF', 'México': '#009688', 'Panamá': '#FF5722',
        'Paraguay': '#880E4F', 'Perú': '#F44336', 'Rep. Dom.': '#9C27B0',
        'Uruguay': '#607D8B', 'Venezuela': '#795548', 'Turquía': '#A52A2A',
        'Sudáfrica': '#FF9800', 'Egipto': '#FFC107', 'Nigeria': '#4CAF50',
        'Angola': '#B71C1C',
    };

    const fallbackColors = ['#38bdf8', '#fbbf24', '#f87171', '#4ade80', '#a78bfa',
        '#f472b6', '#22d3ee', '#fb923c', '#9ca3af', '#e879f9'];

    try {
        const response = await fetch('data.json');
        rawData = await response.json();
        initDashboard();
    } catch (error) {
        console.error("Error loading data:", error);
        alert("Error cargando los datos.");
    }

    function initDashboard() {
        if (rawData.length === 0) return;
        const firstRow = rawData[0];
        const excludedCountries = ['Venezuela', 'LATINO', 'Global', 'RD-LATINO'];
        allCountries = Object.keys(firstRow).filter(key =>
            key !== 'Fecha' && !key.startsWith('Unnamed') && key !== 'null' && !excludedCountries.includes(key)
        );
        allCountries.forEach((country, index) => {
            countryColors[country] = flagColors[country] || fallbackColors[index % fallbackColors.length];
        });
        rawData.sort((a, b) => new Date(a.Fecha) - new Date(b.Fecha));
        const minDate = rawData[0].Fecha;
        const maxDate = rawData[rawData.length - 1].Fecha;
        const minDateObj = new Date(minDate + 'T00:00:00Z');
        const maxDateObj = new Date(maxDate + 'T00:00:00Z');
        const defaultStartObj = new Date(maxDateObj);
        defaultStartObj.setUTCDate(defaultStartObj.getUTCDate() - 60);
        if (defaultStartObj < minDateObj) defaultStartObj.setTime(minDateObj.getTime());
        const defaultStartDate = defaultStartObj.toISOString().slice(0, 10);
        startDateInput.value = defaultStartDate;
        endDateInput.value = maxDate;
        startDateInput.min = minDate;
        startDateInput.max = maxDate;
        endDateInput.min = minDate;
        endDateInput.max = maxDate;
        rankingDateInput.value = maxDate;
        rankingDateInput.min = minDate;
        rankingDateInput.max = maxDate;
        renderCountryList();
        populateHeatmapCountrySelect();
        const defaultCountries = ['Ecuador', 'Argentina'];
        defaultCountries.forEach(c => {
            if (allCountries.includes(c)) selectedCountries.add(c);
        });
        updateCheckboxes();
        updateView();
    }

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
                if (e.target.checked) selectedCountries.add(country);
                else selectedCountries.delete(country);
                if (currentView === 'timeseries') updateChart();
            });
            const label = document.createElement('label');
            label.htmlFor = `chk-${country}`;
            label.textContent = country;
            label.style.color = countryColors[country];
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

    function updateView() {
        if (chart) chart.destroy();
        if (currentView === 'timeseries') renderTimeSeriesChart();
        else if (currentView === 'ranking') renderRankingChart();
        else if (currentView === 'heatmap') renderHeatmapChart();
    }

    function getFilteredTimeSeriesData() {
        const start = new Date(startDateInput.value);
        const end = new Date(endDateInput.value);
        return rawData.filter(d => {
            const date = new Date(d.Fecha);
            return date >= start && date <= end;
        });
    }

    function renderTimeSeriesChart() {
        Chart.defaults.color = '#1e293b';
        Chart.defaults.borderColor = '#e2e8f0';
        const filteredData = getFilteredTimeSeriesData();
        const datasets = Array.from(selectedCountries).map((country) => {
            return {
                label: country,
                data: filteredData.map(row => ({ x: row.Fecha, y: row[country] })),
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
                layout: { padding: { right: 40, bottom: 30 } },
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { position: 'top', align: 'end', labels: { color: '#1e293b', usePointStyle: true, pointStyle: 'circle' } },
                    title: {
                        display: true,
                        text: (() => {
                            if (!rawData || rawData.length === 0) return '';
                            const lastDate = new Date(rawData[rawData.length - 1].Fecha);
                            return `Riesgo País (último dato: ${String(lastDate.getUTCDate()).padStart(2, '0')}/${String(lastDate.getUTCMonth() + 1).padStart(2, '0')}/${lastDate.getUTCFullYear()})`;
                        })(),
                        align: 'start',
                        color: '#1e293b',
                        font: { size: 16, weight: 'bold' },
                        padding: { bottom: 20 }
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
                                return `${String(date.getUTCDate()).padStart(2, '0')}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCFullYear()).slice(-2)}`;
                            }
                        }
                    },
                    datalabels: { display: false }
                },
                scales: {
                    x: { type: 'time', time: { unit: 'month', displayFormats: { month: 'MMM yyyy' } }, grid: { color: '#e2e8f0' }, ticks: { color: '#64748b' } },
                    y: { grid: { color: '#e2e8f0' }, ticks: { color: '#64748b' }, title: { display: true, text: 'Spread (bps)', color: '#475569' } }
                }
            },
            plugins: [ChartDataLabels, sourceTextPlugin]
        });
    }

    function updateChart() {
        if (chart && currentView === 'timeseries') {
            const filteredData = getFilteredTimeSeriesData();
            const datasets = Array.from(selectedCountries).map((country) => {
                return {
                    label: country,
                    data: filteredData.map(row => ({ x: row.Fecha, y: row[country] })),
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

    function renderRankingChart() {
        const selectedDateStr = rankingDateInput.value;
        const row = rawData.find(d => d.Fecha === selectedDateStr);
        if (!row) {
            chart = new Chart(ctx, {
                type: 'bar',
                data: { labels: [], datasets: [] },
                options: { plugins: { title: { display: true, text: 'No hay datos para esta fecha' } } }
            });
            return;
        }

        // Format date for subtitle
        const parts = selectedDateStr.split('-');
        const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;

        let rankingData = [];
        allCountries.forEach(country => {
            const val = row[country];
            if (val !== null && val !== undefined) rankingData.push({ country, value: val });
        });
        rankingData.sort((a, b) => b.value - a.value);
        const labels = rankingData.map(d => d.country);
        const dataValues = rankingData.map(d => d.value);
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
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                layout: { padding: { bottom: 30 } },
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Riesgo País',
                        align: 'start',
                        color: '#1e293b',
                        font: { size: 16, weight: 'bold' },
                        padding: { bottom: 5 }
                    },
                    subtitle: {
                        display: true,
                        text: `Fecha: ${formattedDate}`,
                        align: 'start',
                        color: '#475569',
                        font: { size: 14 },
                        padding: { bottom: 20 }
                    },
                    tooltip: { backgroundColor: '#ffffff', titleColor: '#0f172a', bodyColor: '#334155', borderColor: '#e2e8f0', borderWidth: 1 },
                    datalabels: { color: '#334155', anchor: 'end', align: 'end', offset: 4, font: { weight: 'bold' }, formatter: Math.round }
                },
                scales: {
                    x: { grid: { color: '#e2e8f0' }, ticks: { color: '#64748b' }, grace: '10%' },
                    y: { grid: { display: false }, ticks: { color: '#1e293b', font: { weight: 'bold', size: 10 } } }
                }
            },
            plugins: [ChartDataLabels, sourceTextPlugin]
        });
    }

    function getHeatmapData(country) {
        // 1. Parse all available data for the country
        const countryData = rawData.map(row => {
            const parts = row.Fecha.split('-');
            return {
                // Force UTC midnight
                date: new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))),
                value: row[country]
            };
        }).filter(d => d.value !== null && d.value !== undefined)
            .sort((a, b) => a.date - b.date);

        if (countryData.length === 0) return [];

        // 2. Create a continuous timeline map with forward fill
        const dataMap = new Map();
        let lastValue = null;

        // Start from the very first available date to ensure we have a carry-over value
        const firstDate = countryData[0].date;
        const lastAvailableDate = countryData[countryData.length - 1].date;

        // We need to cover up to the last date
        const currentDate = new Date(firstDate);

        // Helper to format date key for map lookup/storage if needed, 
        // but we can just iterate and fill.
        // Actually, let's just iterate day by day from firstDate to lastAvailableDate

        let dataIndex = 0;

        while (currentDate <= lastAvailableDate) {
            // Check if we have a new value for this date
            // Since countryData is sorted, we check the next item
            if (dataIndex < countryData.length && countryData[dataIndex].date.getTime() === currentDate.getTime()) {
                lastValue = countryData[dataIndex].value;
                dataIndex++;
            }

            // Store the value for this date (timestamp key)
            if (lastValue !== null) {
                dataMap.set(currentDate.getTime(), lastValue);
            }

            // Next day
            currentDate.setUTCDate(currentDate.getUTCDate() + 1);
        }

        // 3. Generate Heatmap Matrix for 2008 onwards
        const heatmapMatrix = [];
        const startYear = 2008;
        const endYear = lastAvailableDate.getUTCFullYear();

        for (let year = startYear; year <= endYear; year++) {
            for (let day = 1; day <= 365; day++) {
                // Construct date for this day of year
                const date = new Date(Date.UTC(year, 0, 1));
                date.setUTCDate(day); // This handles day 1..365 correctly

                // Stop if we go beyond available data
                if (date > lastAvailableDate) break;

                const val = dataMap.get(date.getTime());

                // If it's a leap year, day 366 (Dec 31) might be missed by the loop 1-365.
                // But for visual consistency on a 1-365 grid, we usually accept this or map 366 to 365.
                // However, the user issue is GAPS.
                // If val exists, push it.
                if (val !== undefined) {
                    heatmapMatrix.push({ x: year.toString(), y: day, v: val });
                }
            }

            // Handle Leap Year Dec 31 (Day 366) if we want to be precise, 
            // but Chart axis is 1-365. 
            // Let's check if year is leap and we have data for Dec 31
            const isLeap = new Date(Date.UTC(year, 1, 29)).getUTCMonth() === 1;
            if (isLeap) {
                const date366 = new Date(Date.UTC(year, 11, 31));
                if (date366 <= lastAvailableDate) {
                    const val366 = dataMap.get(date366.getTime());
                    if (val366 !== undefined) {
                        // Overwrite day 365 or just ignore? 
                        // To avoid a gap at the very end of a leap year, we can set it to y: 365
                        // effectively showing the last day's risk for the last pixel.
                        heatmapMatrix.push({ x: year.toString(), y: 365, v: val366 });
                    }
                }
            }
        }

        return heatmapMatrix;
    }

    function renderHeatmapChart() {
        const selectedCountry = heatmapCountrySelect.value;
        const data = getHeatmapData(selectedCountry);
        if (!data || data.length === 0) {
            chart = new Chart(ctx, {
                type: 'bar',
                data: { labels: [], datasets: [] },
                options: { plugins: { title: { display: true, text: 'No hay datos disponibles' } } }
            });
            return;
        }
        const years = [...new Set(data.map(d => d.x))].sort();
        const colorScale = {
            veryLow: '#006400',
            low: '#90EE90',
            medium: '#FFD700',
            high: '#FF8C00',
            veryHigh: '#B22222'
        };
        const getColor = (value) => {
            if (value < 300) return colorScale.veryLow;
            if (value < 600) return colorScale.low;
            if (value < 1000) return colorScale.medium;
            if (value < 1500) return colorScale.high;
            return colorScale.veryHigh;
        };
        chart = new Chart(ctx, {
            type: 'matrix',
            data: {
                datasets: [{
                    label: `Riesgo País - ${selectedCountry}`,
                    data: data,
                    backgroundColor(context) {
                        return getColor(context.dataset.data[context.dataIndex].v);
                    },
                    hoverBackgroundColor(context) {
                        return getColor(context.dataset.data[context.dataIndex].v);
                    },
                    borderWidth: 0,
                    width: ({ chart }) => (chart.chartArea || {}).width / years.length + 1,
                    height: ({ chart }) => (chart.chartArea || {}).height / 365 + 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: { padding: { bottom: 20 } },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            generateLabels: function () {
                                return [
                                    { text: 'Muy Bajo (0-300)', fillStyle: colorScale.veryLow, strokeStyle: '#ffffff', lineWidth: 1 },
                                    { text: 'Bajo (300-600)', fillStyle: colorScale.low, strokeStyle: '#ffffff', lineWidth: 1 },
                                    { text: 'Medio (600-1000)', fillStyle: colorScale.medium, strokeStyle: '#ffffff', lineWidth: 1 },
                                    { text: 'Alto (1000-1500)', fillStyle: colorScale.high, strokeStyle: '#ffffff', lineWidth: 1 },
                                    { text: 'Muy Alto (>1500)', fillStyle: colorScale.veryHigh, strokeStyle: '#ffffff', lineWidth: 1 }
                                ];
                            },
                            color: '#1e293b',
                            font: { size: 11 },
                            padding: 15,
                            boxWidth: 20,
                            boxHeight: 15
                        }
                    },
                    title: {
                        display: true,
                        text: (() => {
                            if (!rawData || rawData.length === 0) return '';
                            const lastDate = new Date(rawData[rawData.length - 1].Fecha);
                            return `Riesgo País (último dato: ${String(lastDate.getUTCDate()).padStart(2, '0')}/${String(lastDate.getUTCMonth() + 1).padStart(2, '0')}/${lastDate.getUTCFullYear()})`;
                        })(),
                        align: 'start',
                        color: '#1e293b',
                        font: { size: 16, weight: 'bold' },
                        padding: { bottom: 5 }
                    },
                    subtitle: {
                        display: true,
                        text: `País: ${selectedCountry}`,
                        align: 'start',
                        color: '#475569',
                        font: { size: 13 },
                        padding: { bottom: 15 }
                    },
                    tooltip: {
                        backgroundColor: '#ffffff',
                        titleColor: '#0f172a',
                        bodyColor: '#334155',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        callbacks: {
                            title() { return ''; },
                            label(context) {
                                const v = context.dataset.data[context.dataIndex];
                                const date = new Date(Date.UTC(parseInt(v.x), 0, 1));
                                date.setUTCDate(v.y); // Set day of year correctly
                                const value = Math.round(v.v);
                                let level = '';
                                if (value < 300) level = 'Muy Bajo';
                                else if (value < 600) level = 'Bajo';
                                else if (value < 1000) level = 'Medio';
                                else if (value < 1500) level = 'Alto';
                                else level = 'Muy Alto';
                                return `${String(date.getUTCDate()).padStart(2, '0')}/${String(date.getUTCMonth() + 1).padStart(2, '0')}/${date.getUTCFullYear()}: ${value} bps (${level})`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'category',
                        labels: years,
                        offset: true,
                        position: 'top',
                        ticks: { color: '#64748b', font: { size: 11, weight: 'bold' } },
                        grid: { display: false }
                    },
                    y: {
                        type: 'linear',
                        min: 0.5,
                        max: 365.5,
                        offset: false,
                        reverse: true,
                        ticks: {
                            stepSize: 30,
                            color: '#64748b',
                            font: { weight: 'bold' },
                            callback: function (value) {
                                const months = [
                                    { day: 1, label: 'Ene' }, { day: 32, label: 'Feb' }, { day: 60, label: 'Mar' },
                                    { day: 91, label: 'Abr' }, { day: 121, label: 'May' }, { day: 152, label: 'Jun' },
                                    { day: 182, label: 'Jul' }, { day: 213, label: 'Ago' }, { day: 244, label: 'Sep' },
                                    { day: 274, label: 'Oct' }, { day: 305, label: 'Nov' }, { day: 335, label: 'Dic' }
                                ];
                                const month = months.find(m => Math.abs(m.day - value) < 15);
                                return month ? month.label : '';
                            }
                        },
                        grid: { color: '#f1f5f9', lineWidth: 0.5 }
                    }
                }
            },
            plugins: [sourceTextPlugin]
        });
    }

    viewTimeSeriesBtn.addEventListener('click', () => switchView('timeseries'));
    viewRankingBtn.addEventListener('click', () => switchView('ranking'));
    viewHeatmapBtn.addEventListener('click', () => switchView('heatmap'));
    startDateInput.addEventListener('change', updateChart);
    endDateInput.addEventListener('change', updateChart);
    rankingDateInput.addEventListener('change', () => { if (currentView === 'ranking') updateView(); });
    heatmapCountrySelect.addEventListener('change', () => { if (currentView === 'heatmap') updateView(); });
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
