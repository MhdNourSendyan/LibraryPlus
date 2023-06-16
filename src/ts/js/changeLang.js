"use strict";
$(document).ready(function () {
    $(".langButton").click(function () {
        const lang = $(this).attr("id");
        if (lang) {
            setCookie("lang", lang, 365);
        }
    });
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = `; expires=${date.toUTCString()}`;
        }
        document.cookie = `${name}=${value}${expires}; path=/`;
        location.reload();
    }
});
