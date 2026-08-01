import os
import json

def listar_archivos(dir, base=''):
    resultados = []
    for item in os.listdir(dir):
        full = os.path.join(dir, item)
        if os.path.isdir(full):
            # Recursivo: la subcarpeta se usa como "álbum"
            resultados += listar_archivos(full, os.path.join(base, item))
        else:
            ext = os.path.splitext(item)[1].lower()
            if ext in ['.mp3', '.wav', '.ogg']:
                # El álbum es el nombre de la subcarpeta (última parte de base)
                album = os.path.basename(base) if base else 'Raíz'
                resultados.append({
                    'titulo': os.path.splitext(item)[0],
                    'archivo': os.path.join(base, item).replace('\\', '/'),
                    'album': album
                })
    return resultados

# Cambia "Musica" por el nombre exacto de tu carpeta raíz (sin acento o con él)
canciones = listar_archivos('Musica')

# Guarda el JSON
with open('lista.json', 'w', encoding='utf-8') as f:
    json.dump(canciones, f, indent=2, ensure_ascii=False)

print(f'✅ lista.json generado con {len(canciones)} canciones.')