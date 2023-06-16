<?php
// Verificar que la solicitud sea de tipo POST.
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        // Obtener los datos JSON de la solicitud POST.
        $jsonData = file_get_contents("php://input");
        $data = json_decode($jsonData);
        // Obtener los datos del JSON
        $errorType = $data->errorType;
        $fileName = $data->fileName;
        $currentTime = $data->currentTime;
        // Formatear el mensaje de error
        $errorLog = "Tipo de error: " . $errorType . PHP_EOL;
        $errorLog .= "Archivo: $fileName" . PHP_EOL;
        $errorLog .= "Fecha y hora: $currentTime" . PHP_EOL;
        $errorLog .= "____________________________________________________________________________________________________" . PHP_EOL;
        // Ruta del archivo de registro de errores
        $errorLogFile = "./log/log.txt";
        // Escribir el mensaje de error en el archivo de texto
        file_put_contents($errorLogFile, $errorLog, FILE_APPEND);
        // Preparar la respuesta en formato JSON
        $response = [
            "success" => true,
        ];
        echo json_encode($response);
    } catch (Exception $e) {
        // Preparar la respuesta en formato JSON
        $response = [
            "success" => false,
            "message" => $e->getMessage(),
        ];
        echo json_encode($response);
    }
}