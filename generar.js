const fs = require('fs');
const path = require('path');

function listarArchivos(dir, base = '') {
    let resultados = [];
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            resultados = resultados.concat(listarArchivos(fullPath, path.join(base, item)));
        } else {
            const ext = path.extname(item).toLowerCase();
            if (['.mp3', '.wav', '.ogg'].includes(ext)) {
                resultados.push({
                    titulo: path.basename(item, ext),
                    archivo: path.join(base, item).replace(/\\/g, '/'),
                    album: 'Carpeta local'
                });
            }
        }
    }
    return resultados;
}

const canciones = listarArchivos('Musica'); // Cambia si es 'Música'
fs.writeFileSync('lista.json', JSON.stringify(canciones, null, 2));
console.log(`✅ lista.json generado con ${canciones.length} canciones.`);