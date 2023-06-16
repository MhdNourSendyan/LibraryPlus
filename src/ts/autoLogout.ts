// Se agrega un listener para el evento de carga completa del documento.
$(document).ready(function () {
  // Configuración.
  const INACTIVITY_TIME: number = 2 * 60 * 60 * 1000; // 2 horas en milisegundos.
  const LOGOUT_URL: string = "./php/logout.php"; // Ruta a logout.php.
  // Variables.
  let lastInteractionTime: number = new Date().getTime();
  // Función para verificar la inactividad.
  function checkInactivity(): void {
    const CURRENT_TIME: number = new Date().getTime();
    const INACTIVE_TIME: number = CURRENT_TIME - lastInteractionTime;
    if (INACTIVE_TIME >= INACTIVITY_TIME) {
      // Realizar el logout.
      window.location.href = LOGOUT_URL;
    } else {
      // Volver a verificar en tiempoInactividad milisegundos.
      setTimeout(checkInactivity, INACTIVITY_TIME);
    }
  }
  // Evento de interacción del usuario.
  document.addEventListener("mousemove", () => {
    lastInteractionTime = new Date().getTime();
  });
  // Comenzar la verificación de inactividad.
  setTimeout(checkInactivity, INACTIVITY_TIME);
});
