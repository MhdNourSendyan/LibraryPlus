"use strict";
$(document).ready(function () {
    const INACTIVITY_TIME = 2 * 60 * 60 * 1000;
    const LOGOUT_URL = "./php/logout.php";
    let lastInteractionTime = new Date().getTime();
    function checkInactivity() {
        const CURRENT_TIME = new Date().getTime();
        const INACTIVE_TIME = CURRENT_TIME - lastInteractionTime;
        if (INACTIVE_TIME >= INACTIVITY_TIME) {
            window.location.href = LOGOUT_URL;
        }
        else {
            setTimeout(checkInactivity, INACTIVITY_TIME);
        }
    }
    document.addEventListener("mousemove", () => {
        lastInteractionTime = new Date().getTime();
    });
    setTimeout(checkInactivity, INACTIVITY_TIME);
});
