"use strict";
const div = `<span id="loader"></span>`;
$("body").append(div);
window.addEventListener("load", hideLoader);
function hideLoader() {
    const loaderContainer = document.querySelector("#loader");
    loaderContainer === null || loaderContainer === void 0 ? void 0 : loaderContainer.classList.add("d-none");
}
