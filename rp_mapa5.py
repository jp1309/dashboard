import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
import os

# Ruta del archivo CSV
file_path = r"C:\Users\JUANER\PycharmProjects\PythonProject\pruebas_varias\riesgo-pas.csv"

# Carpeta donde está el archivo (para guardar el PNG ahí mismo)
output_folder = os.path.dirname(file_path)
output_png = os.path.join(output_folder, "heatmap_riesgo_pais.png")

# 1. Cargar datos
df = pd.read_csv(file_path)
df['Período'] = pd.to_datetime(df['Período'])

# 2. Último valor de 2004 para usar al inicio de 2005
mask_2004 = df['Período'].dt.year == 2004
last_2004_value = (
    df.loc[mask_2004]
      .sort_values('Período')
      .iloc[-1]['Riesgo País en Puntos Básicos']
)

# 3. Datos desde 2005 en adelante
df_2005plus = df[df['Período'].dt.year >= 2005].copy()

# 4. Crear rango diario completo solo hasta la ÚLTIMA fecha disponible
last_date = df_2005plus['Período'].max()
full_range = pd.date_range(
    start='2005-01-01',
    end=last_date,
    freq='D'
)
full_df = pd.DataFrame({'Período': full_range})

# 5. Unir y rellenar solo hacia adelante dentro del rango existente
merged = full_df.merge(
    df_2005plus[['Período', 'Riesgo País en Puntos Básicos']],
    on='Período', how='left'
)
merged['Riesgo País en Puntos Básicos'] = (
    merged['Riesgo País en Puntos Básicos']
    .ffill()
    .fillna(last_2004_value)
)

# 6. Año y día del año
merged['Year'] = merged['Período'].dt.year
merged['DayOfYear'] = merged['Período'].dt.dayofyear
merged = merged[merged['DayOfYear'] <= 365]

# 7. Matriz día vs año
years = list(range(2005, 2026))   # 2005 a 2025
days = list(range(1, 366))        # 1..365
heat = pd.DataFrame(index=days, columns=years, dtype=float)

for year in years:
    temp = (
        merged.loc[merged['Year'] == year]
        .set_index('DayOfYear')['Riesgo País en Puntos Básicos']
    )
    # Reindexar SIN rellenar más allá de los días que existen
    # Los días sin dato (por ejemplo después de la última fecha del último año) quedarán en NaN
    heat[year] = temp.reindex(days)

# 8. Preparar colores
cmap = mcolors.ListedColormap(['green', 'orange', 'red'])
bounds = [0, 600, 1000, 10000]
norm = mcolors.BoundaryNorm(bounds, cmap.N)

# Para que los NaN se vean blancos
cmap.set_bad(color='white')
data = np.ma.masked_invalid(heat.values)

# 9. Graficar heatmap
fig, ax = plt.subplots(figsize=(14, 10))

ax.set_yscale('linear')

im = ax.imshow(
    data,
    aspect='auto',
    cmap=cmap,
    norm=norm,
    origin='upper',
    interpolation='nearest'   # colores nítidos, sin suavizado
)

# Barra de color
cbar = fig.colorbar(im, ax=ax, boundaries=bounds)
cbar.set_label('Riesgo País (pbs)')

# Título
ax.set_title('ECUADOR: Heatmap Riesgo País', fontsize=14, pad=20)

# Eje X: años arriba
ax.set_xticks(np.arange(len(years)))
ax.set_xticklabels(years, rotation=90)
ax.xaxis.tick_top()
ax.xaxis.set_label_position('top')

# Eje Y: meses
month_starts = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335]
month_labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

y_positions = [d - 1 for d in month_starts]  # día 1 → índice 0, etc.

ax.set_yticks(y_positions)
ax.set_yticklabels(month_labels)
ax.set_ylabel('Mes')

fig.subplots_adjust(top=0.88)
plt.tight_layout(rect=[0, 0, 1, 0.96])

# 10. Guardar PNG (600 dpi)
plt.savefig(output_png, dpi=600)
plt.show()

print(f"Imagen guardada en: {output_png}")


