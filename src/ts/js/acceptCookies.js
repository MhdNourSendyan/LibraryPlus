"use strict";
$(document).ready(function () {
    const container = $("#container");
    const cookiesAccepted = document.cookie.includes("cookiesAccepted=true");
    if (!cookiesAccepted) {
        function getCookie(name) {
            const cookieValue = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
            return cookieValue ? cookieValue.pop() : "";
        }
        const lang = getCookie("lang");
        let text, buttonText;
        switch (lang) {
            case "en":
                text =
                    "We use cookies on our website to enhance your experience. By continuing to browse, you agree to our Privacy Policy.";
                buttonText = "Accept";
                break;
            case "fr":
                text =
                    "Nous utilisons des cookies sur notre site Web pour améliorer votre expérience. En continuant à naviguer, vous acceptez notre politique de confidentialité.";
                buttonText = "Accepter";
                break;
            case "it":
                text =
                    "Utilizziamo i cookie sul nostro sito web per migliorare la tua esperienza. Continuando a navigare, accetti la nostra Politica sulla privacy.";
                buttonText = "Accetta";
                break;
            case "ar":
                text =
                    "نستخدم ملفات تعريف الارتباط على موقعنا الإلكتروني لتحسين تجربتك. باستمرارك في التصفح ، فإنك توافق على سياسة الخصوصية الخاصة بنا.";
                buttonText = "قبول";
                break;
            case "es":
            default:
                text =
                    "Utilizamos cookies en nuestro sitio web para mejorar tu experiencia. Al continuar navegando, aceptas nuestra Política de privacidad.";
                buttonText = "Aceptar";
                break;
        }
        const div = `
    <div id="cookieBanner" class="d-flex justify-content-center align-items-center min-vh-100">
      <div class="bg-white p-5 rounded-4 shadow-lg text-center" style="width: 50rem">
        <img src="./assets/images/cookie.svg" alt="" width="50" class="mb-3">
        <p>${text}</p>
        <button id="acceptCookiesButton" type="button" class="buttonStyle btn btn-danger btn-sm">${buttonText}</button>
        <hr>
        <div class="row d-flex justify-content-center">
            <div id="langButtons" class="col-auto">
                <div class="hstack mt-1">
                    <button class="langButton btn p-1" id="es">
                        <img src="./assets/images/es.svg" alt="Es Icon" class="langIcon" width="25">
                    </button>
                    <button class="langButton btn p-1" id="en">
                        <img src="./assets/images/uk.svg" alt="Uk Icon" class="langIcon" width="25">
                    </button>
                    <button class="langButton btn p-1" id="fr">
                        <img src="./assets/images/fr.svg" alt="Fr Icon" class="langIcon" width="25">
                    </button>
                    <button class="langButton btn p-1" id="it">
                        <img src="./assets/images/it.svg" alt="It Icon" class="langIcon" width="25">
                    </button>
                    <button class="langButton btn p-1" id="ar">
                        <img src="./assets/images/sy.svg" alt="Sy Icon" class="langIcon" width="25">
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
    `;
        $("body").append(div);
        container.addClass("blurBackground");
        $("#acceptCookiesButton").on("click", acceptCookies);
    }
    else {
        $("#cookieBanner").addClass("d-none");
        container.removeClass("blurBackground");
    }
    function acceptCookies() {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        document.cookie =
            "cookiesAccepted=true; expires=" +
                expirationDate.toUTCString() +
                "; path=/";
        $("#cookieBanner").addClass("d-none");
        container.removeClass("blurBackground");
    }
});
