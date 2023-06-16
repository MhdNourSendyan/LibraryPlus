"use strict";
function throwModal(alertType, confirmMessage, text, buttonText) {
    let modal = document.createElement("div");
    modal.classList.add("modal", "fade");
    modal.setAttribute("id", "throwModal");
    modal.setAttribute("data-bs-backdrop", "static");
    modal.setAttribute("data-bs-keyboard", "false");
    modal.setAttribute("tabindex", "-1");
    modal.setAttribute("aria-labelledby", "staticBackdropLabel");
    modal.setAttribute("aria-hidden", "true");
    let dialog = document.createElement("div");
    dialog.classList.add("modal-dialog");
    let content = document.createElement("div");
    content.classList.add("modal-content");
    let header = document.createElement("div");
    header.classList.add("modal-header");
    let title = document.createElement("h1");
    title.classList.add("modal-title", "fs-5");
    title.setAttribute("id", "staticBackdropLabel");
    title.innerText = confirmMessage;
    let closeButton = document.createElement("button");
    closeButton.classList.add("closeModalButton");
    closeButton.classList.add("btn-close");
    closeButton.setAttribute("type", "button");
    closeButton.setAttribute("data-bs-dismiss", "modal");
    closeButton.setAttribute("aria-label", "Close");
    header.appendChild(title);
    header.appendChild(closeButton);
    let body = document.createElement("div");
    body.classList.add("modal-body");
    let divAlert = document.createElement("div");
    divAlert.classList.add("alert");
    divAlert.classList.add("alert-" + alertType);
    divAlert.classList.add("m-0");
    divAlert.setAttribute("role", "alert");
    divAlert.innerText = text;
    body.appendChild(divAlert);
    let footer = document.createElement("div");
    footer.classList.add("modal-footer");
    let closeButton2 = document.createElement("button");
    closeButton2.classList.add("closeModalButton");
    closeButton2.classList.add("btn", "btn-dark");
    closeButton2.classList.add("buttonStyle");
    closeButton2.setAttribute("type", "button");
    closeButton2.setAttribute("data-bs-dismiss", "modal");
    closeButton2.innerText = buttonText;
    footer.appendChild(closeButton2);
    content.appendChild(header);
    content.appendChild(body);
    content.appendChild(footer);
    dialog.appendChild(content);
    modal.appendChild(dialog);
    $(document).ready(function () {
        $(modal).modal("show");
    });
    modal.addEventListener("keydown", function (event) {
        if (event.key == "Escape") {
            $(closeButton2).click();
        }
    });
}
