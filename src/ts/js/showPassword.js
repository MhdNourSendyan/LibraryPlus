"use strict";
$(document).ready(function () {
    const IMAGE_TYPE = "image/svg+xml";
    const OPEN_EYE_SRC = "./assets/images/openEye.svg";
    const CLOSE_EYE_SRC = "./assets/images/closeEye.svg";
    function changeInputType(inputs, type) {
        inputs.forEach(function (input) {
            input.type = type;
        });
    }
    const passwordInputs = document.querySelectorAll("input[type=password]");
    const showPassword = document.querySelector(".showPassword");
    showPassword.addEventListener("click", function () {
        const type = passwordInputs[0].type == "password" ? "text" : "password";
        changeInputType(passwordInputs, type);
        showPassword.src = type == "password" ? CLOSE_EYE_SRC : OPEN_EYE_SRC;
    });
});
