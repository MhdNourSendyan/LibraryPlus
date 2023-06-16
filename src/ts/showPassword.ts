// La función se ejecuta cuando el documento está listo.
$(document).ready(function () {
  // Se establecen constantes para el tipo de imagen, la fuente del icono de ojo abierto y la fuente del icono de ojo cerrado.
  const IMAGE_TYPE: string = "image/svg+xml";
  const OPEN_EYE_SRC: string = "./assets/images/openEye.svg";
  const CLOSE_EYE_SRC: string = "./assets/images/closeEye.svg";
  // Función que cambia el tipo de entrada de una lista de elementos de entrada.
  function changeInputType(inputs: NodeListOf<HTMLInputElement>, type: string) {
    inputs.forEach(function (input) {
      input.type = type;
    });
  }
  // Se obtienen los elementos HTML de los campos de contraseña y el botón de mostrar/ocultar contraseña.
  const passwordInputs: NodeListOf<HTMLInputElement> =
    document.querySelectorAll(
      "input[type=password]"
    ) as NodeListOf<HTMLInputElement>;
  const showPassword: HTMLImageElement = document.querySelector(
    ".showPassword"
  ) as HTMLImageElement;
  // Se añade un event listener al botón de mostrar/ocultar contraseña.
  showPassword.addEventListener("click", function () {
    // Se cambia el tipo de entrada de los campos de contraseña y se actualiza el icono de mostrar/ocultar contraseña según corresponda.
    const type: string =
      passwordInputs[0].type == "password" ? "text" : "password";
    changeInputType(passwordInputs, type);
    showPassword.src = type == "password" ? CLOSE_EYE_SRC : OPEN_EYE_SRC;
  });
});
