// Se agrega un listener para el evento de carga completa del documento..
$(document).ready(function () {
  // Se asigna una función anónima al evento "click" de todos los elementos con la clase "langButton".
  $(".langButton").click(function () {
    // Se obtiene el atributo "id" del elemento que ha activado el evento.
    const lang = $(this).attr("id");
    if (lang) {
      // Se llama a la función "setCookie" para establecer la cookie "lang" con el valor obtenido del atributo "id" del botón pulsado.
      setCookie("lang", lang, 365);
    }
  });
  // Función que establece una cookie con el nombre, valor y duración especificados.
  function setCookie(name: string, value: string, days: number) {
    let expires = "";
    if (days) {
      // Si se ha especificado una duración para la cookie, se establece su fecha de caducidad.
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }
    // Se establece la cookie con el nombre, valor, fecha de caducidad y ruta especificados.
    document.cookie = `${name}=${value}${expires}; path=/`;
    // Se recarga la página para aplicar los cambios.
    location.reload();
  }
  // // Función que devuelve el valor de una cookie con el nombre especificado.
  // function getCookie(name: string) {
  //   const cookieValue = document.cookie.match(
  //     `(^|;)\\s*${name}\\s*=\\s*([^;]+)`
  //   );
  //   return cookieValue ? cookieValue.pop() : "";
  // }
  // // Se obtiene el valor de la cookie "lang" y se muestra en la consola del navegador.
  // const lang = getCookie("lang");
  // console.log(lang);
});
