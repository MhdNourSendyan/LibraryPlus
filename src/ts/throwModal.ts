// Función para lanzar modal.
function throwModal(
  alertType: string,
  confirmMessage: string,
  text: string,
  buttonText: string
): void {
  // Crear el elemento del modal.
  let modal: HTMLElement = document.createElement("div");
  modal.classList.add("modal", "fade");
  modal.setAttribute("id", "throwModal");
  modal.setAttribute("data-bs-backdrop", "static");
  modal.setAttribute("data-bs-keyboard", "false");
  modal.setAttribute("tabindex", "-1");
  modal.setAttribute("aria-labelledby", "staticBackdropLabel");
  modal.setAttribute("aria-hidden", "true");
  // Crear el diálogo del modal.
  let dialog: HTMLElement = document.createElement("div");
  dialog.classList.add("modal-dialog");
  // Crear el contenido del diálogo del modal.
  let content: HTMLElement = document.createElement("div");
  content.classList.add("modal-content");
  // Crear el header del diálogo del modal.
  let header: HTMLElement = document.createElement("div");
  header.classList.add("modal-header");
  let title: HTMLElement = document.createElement("h1");
  title.classList.add("modal-title", "fs-5");
  title.setAttribute("id", "staticBackdropLabel");
  title.innerText = confirmMessage;
  let closeButton: HTMLElement = document.createElement("button");
  closeButton.classList.add("closeModalButton");
  closeButton.classList.add("btn-close");
  closeButton.setAttribute("type", "button");
  closeButton.setAttribute("data-bs-dismiss", "modal");
  closeButton.setAttribute("aria-label", "Close");
  header.appendChild(title);
  header.appendChild(closeButton);
  // Crear el cuerpo del modal con el texto que se le pasó como parámetro.
  let body: HTMLElement = document.createElement("div");
  body.classList.add("modal-body");
  // Crear el elemento h5.
  let divAlert: HTMLElement = document.createElement("div");
  divAlert.classList.add("alert");
  divAlert.classList.add("alert-" + alertType);
  divAlert.classList.add("m-0");
  divAlert.setAttribute("role", "alert");
  divAlert.innerText = text;
  // Agregar el elemento al cuerpo del documento.
  body.appendChild(divAlert);
  // Crear el footer del modal.
  let footer: HTMLElement = document.createElement("div");
  footer.classList.add("modal-footer");
  let closeButton2: HTMLElement = document.createElement("button");
  closeButton2.classList.add("closeModalButton");
  closeButton2.classList.add("btn", "btn-dark");
  closeButton2.classList.add("buttonStyle");
  closeButton2.setAttribute("type", "button");
  closeButton2.setAttribute("data-bs-dismiss", "modal");
  closeButton2.innerText = buttonText;
  footer.appendChild(closeButton2);
  // Añadir todo al contenido del modal.
  content.appendChild(header);
  content.appendChild(body);
  content.appendChild(footer);
  // Añadir el contenido al diálogo del modal.
  dialog.appendChild(content);
  // Añadir el diálogo al modal.
  modal.appendChild(dialog);
  // Mostrar el modal.
  $(document).ready(function () {
    $(modal).modal("show");
  });
  // Agregar el event listener al modal.
  modal.addEventListener("keydown", function (event) {
    if (event.key == "Escape") {
      $(closeButton2).click();
    }
  });
}
