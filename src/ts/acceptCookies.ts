// Se agrega un listener para el evento de carga completa del documento.
$(document).ready(function () {
  // Se asigna el elemento con id "container" a una variable llamada "container".
  const container = $("#container");
  // Se verifica si la cookie "cookiesaccepted" incluye el valor "true" y asigna el resultado a una variable llamada "cookiesaccepted".
  const cookiesAccepted = document.cookie.includes("cookiesAccepted=true");
  // Se verifica si "cookiesaccepted" es falso.
  if (!cookiesAccepted) {
    // Función que devuelve el valor de una cookie con el nombre especificado.
    function getCookie(name: string) {
      const cookieValue = document.cookie.match(
        `(^|;)\\s*${name}\\s*=\\s*([^;]+)`
      );
      return cookieValue ? cookieValue.pop() : "";
    }
    // Se obtiene el valor de la cookie "lang" y se muestra en la consola del navegador.
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
    // Se crea un elemento "div" con id "cookiebanner" y lo asigna a una variable llamada "div".
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
    // Se agrega el elemento "div" al final del cuerpo del documento.
    $("body").append(div);
    // Se agrega la clase "blurbackground" al elemento "container".
    container.addClass("blurBackground");
    // Se agrega un listener para el evento de hacer clic en el elemento con id "acceptcookiesbutton" y llama a la función "acceptcookies" cuando se hace clic.
    $("#acceptCookiesButton").on("click", acceptCookies);
  } else {
    // Se agrega la clase "d-none" al elemento con id "cookiebanner".
    $("#cookieBanner").addClass("d-none");
    // Se elimina la clase "blurbackground" del elemento "container".
    container.removeClass("blurBackground");
  }
  // Se define la función "acceptcookies".
  function acceptCookies() {
    // Se crea una fecha de expiración para la cookie que es 30 días después de la fecha actual y la asigna a una variable llamada "expirationdate".
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    // Se establece la cookie "cookiesaccepted" con el valor "true", la fecha de expiración y la ruta "/", lo que significa que la cookie es válida en todo el sitio web.
    document.cookie =
      "cookiesAccepted=true; expires=" +
      expirationDate.toUTCString() +
      "; path=/";
    // Se agrega la clase "d-none" al elemento con id "cookiebanner".
    $("#cookieBanner").addClass("d-none");
    // Se elimina la clase "blurbackground" del elemento "container".
    container.removeClass("blurBackground");
  }
});
