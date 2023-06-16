"use strict";
$(document).ready(function () {
    function updateClock() {
        const clock = document.querySelector("#clock");
        if (!clock) {
            console.log("elemento de reloj no encontrado");
            return;
        }
        const date = new Date();
        const days = date.getDate().toString().padStart(2, "0");
        const months = (date.getMonth() + 1).toString().padStart(2, "0");
        const years = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        clock.innerHTML = `${hours}:${minutes}:${seconds} <br> ${days}/${months}/${years}`;
        setTimeout(updateClock, 1000);
    }
    updateClock();
});
