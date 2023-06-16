// Se agrega un listener para el evento de carga completa del documento.
$(document).ready(function () {
  function updateClock(): void {
    // Se selecciona el elemento con el id "clock".
    const clock = document.querySelector("#clock");
    // Se si el elemento no existe, muestra un mensaje de error en la consola y detiene la función.
    if (!clock) {
      console.log("elemento de reloj no encontrado");
      return;
    }
    // Se crea un objeto "date".
    const date = new Date();
    // Se obtiene el día del mes, lo convierte en una cadena, se rellena con un cero si es necesario y se guarda en la variable "days".
    const days = date.getDate().toString().padStart(2, "0");
    // Se obtiene el mes (empezando en cero), lo incrementa en uno, lo convierte en una cadena, se rellena con un cero si es necesario y se guarda en la variable "months".
    const months = (date.getMonth() + 1).toString().padStart(2, "0");
    // Se obtiene el año y se guarda en la variable "years".
    const years = date.getFullYear();
    // Se obtiene la hora, se convierte en una cadena, se rellena con un cero si es necesario y se guarda en la variable "hours".
    const hours = date.getHours().toString().padStart(2, "0");
    // Se obtienen los minutos, se convierten en una cadena, se rellenan con un cero si es necesario y se guardan en la variable "minutes".
    const minutes = date.getMinutes().toString().padStart(2, "0");
    // Se obtienen los segundos, se convierten en una cadena, se rellenan con un cero si es necesario y se guardan en la variable "seconds".
    const seconds = date.getSeconds().toString().padStart(2, "0");
    // Se asigna la cadena de texto con la hora y fecha al contenido html del elemento "clock".
    clock.innerHTML = `${hours}:${minutes}:${seconds} <br> ${days}/${months}/${years}`;
    // Se se espera un segundo (1000 milisegundos) y se llama de nuevo a la función updateclock().
    setTimeout(updateClock, 1000);
  }
  // Se se llama por primera vez a la función updateclock() para iniciar el reloj.
  updateClock();
});
