import fs from 'fs';
import path from 'path';

function recorrerCarpeta(dirActual, listaArchivos, dirBase) {
    if (!fs.existsSync(dirActual)) return;

    const items = fs.readdirSync(dirActual, { withFileTypes: true });

    for (const item of items) {
        const rutaAbsoluta = path.join(dirActual, item.name);

        if (item.isDirectory()) {
            recorrerCarpeta(rutaAbsoluta, listaArchivos, dirBase);
        } else {
            const ext = path.extname(item.name).toLowerCase();
            if (['.mp3', '.wav', '.ogg'].includes(ext)) {
                // Generar la ruta relativa comenzando por Musica/
                const rutaRelativa = path.relative(dirBase, rutaAbsoluta).replace(/\\/g, '/');
                const nombreSinExt = path.basename(item.name, ext);

                listaArchivos.push({
                    titulo: nombreSinExt,
                    archivo: `Musica/${rutaRelativa}`,
                    album: 'Carpeta local'
                });
            }
        }
    }
}

export default function handler(req, res) {
    try {
        const carpetaMusica = path.join(process.cwd(), 'Musica');
        const canciones = [];

        recorrerCarpeta(carpetaMusica, canciones, carpetaMusica);

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
        return res.status(200).json(canciones);
    } catch (error) {
        console.error('Error al leer la carpeta Musica:', error);
        return res.status(500).json({ error: 'Error al leer la biblioteca de música' });
    }
}
