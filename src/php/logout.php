<?php
// Inicia la sesión.
session_start();
// Verifica si la sesión no está activa.
if (session_status() !== PHP_SESSION_ACTIVE) {
    // Redireccionar al archivo ../index.php (puede ser otro archivo de inicio de sesión).
    header("Location: ../index.php");
    // Finaliza la ejecución del script.
    exit();
} else {
    // Elimina todas las variables de sesión.
    session_unset();
    // Destruye la sesión actual.
    session_destroy();
    // Regenera el ID de sesión con seguridad.
    session_regenerate_id(true);
    // Redireccionar al archivo ../index.php (puede ser otro archivo de inicio de sesión).
    header("Location: ../index.php");
    // Finaliza la ejecución del script.
    exit();
}