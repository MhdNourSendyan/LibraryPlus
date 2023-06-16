// Se agrega el elemento "div" al final del cuerpo del documento.
const div = `<span id="loader"></span>`;
$("body").append(div);
// Se agrega un listener para el evento "load" y llama a la función "hideLoader" cuando la página haya terminado de cargar.
window.addEventListener("load", hideLoader);
// Función para ocultar el loader.
function hideLoader() {
  // Se selecciona el contenedor del loader.
  const loaderContainer = document.querySelector("#loader");
  // Se agrega la clase "d-none" al contenedor del loader para ocultarlo.
  loaderContainer?.classList.add("d-none");
}
