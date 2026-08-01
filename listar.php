<?php
function listarArchivos($dir) {
    $result = [];
    $files = scandir($dir);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;
        $path = $dir . '/' . $file;
        if (is_dir($path)) {
            $result = array_merge($result, listarArchivos($path));
        } else {
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (in_array($ext, ['mp3', 'wav', 'ogg'])) {
                $result[] = [
                    'titulo' => pathinfo($file, PATHINFO_FILENAME),
                    'archivo' => $path,
                    'album' => 'Carpeta local'
                ];
            }
        }
    }
    return $result;
}

header('Content-Type: application/json');
$canciones = listarArchivos('Musica'); // Cambia si se llama 'Música'
echo json_encode($canciones);
?>