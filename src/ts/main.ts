// La función se ejecuta cuando el documento está listo.
$(document).ready(function () {
  //___________________________________________________AJAX___________________________________________________//
  // Definimos una función para hacer la petición AJAX para cargar los libros de la base de datos con la paginación.
  function loadBooks(bookPage: number, searchTerm: string) {
    $.ajax({
      // URL a la que se envía la petición.
      url: "./php/server/loadBooks.php",
      // El método de envió.
      method: "POST",
      // Convertir los datos a un objeto JSON.
      data: JSON.stringify({
        bookPage: bookPage,
        searchTerm: searchTerm,
      }),
      // Tipo de contenido que se está enviando.
      contentType: "application/json",
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      // Función que se ejecuta cuando la petición es exitosa.
      success: function (response) {
        if (response.success) {
          $("#booksPagination").html(response.pagination);
          $("#booksTable tbody").html(response.tbody);
          $("#totalBooks").html(response.totalBooks);
        } else {
          let alert = `
          <tr>
              <td colspan='5'>
                  <div class='alert alert-${response.alertType} text-center m-0' role='alert'>
                    ${response.text}
                  </div>
              </td>
          </tr>
          `;
          $("#booksTable tbody").html(alert);
          reportError(response.exceptionMessage, "loadBooks.php");
        }
      },
      // Función que se ejecuta si la petición falla.
      error: function (jqXHR, textStatus, errorThrown) {
        reportError(
          "jqXHR: " +
            jqXHR.responseText +
            ", textStatus: " +
            textStatus +
            ", errorThrown: " +
            errorThrown,
          "loadBooks.php"
        );
      },
    })
      // Función que se ejecuta después de que la promesa se resuelve exitosamente.
      .then(function () {
        validateEditBooksForm();
      });
  }
  // Primera carga de libros al inicio de la página.
  loadBooks(1, "");
  // Manejador de evento para el elemento de Paginación de libros.
  $(document).on("click", ".bookPageItem", function () {
    // Obtención del número de página del atributo ID del elemento HTML seleccionado.
    const bookPage = parseInt($(this).attr("id") as string);
    // Obtención del término de búsqueda actual en el campo de búsqueda correspondiente.
    const searchTerm = $("#searchBookInput").val() as string;
    // Llamar a la función de "loadBooks" con los valores obtenidos.
    loadBooks(bookPage, searchTerm);
  });
  // Manejador de evento para cuando se escribe sobre el campo de búsqueda de dispositivos.
  $(document).on("input", "#searchBookInput", function () {
    // Obtener el término de búsqueda actual.
    const searchTerm = $(this).val() as string;
    // Reiniciar el número de página a mostrar.
    const bookPage = 1;
    // Llamar a la función de "loadBooks" con los valore obtenidos.
    loadBooks(bookPage as number, searchTerm as string);
  });
  // Definimos una función para hacer la petición AJAX para añadir Libros.
  function addNewBook(
    newBookIdentifier: string,
    newBookName: string,
    newBookAuthor: string,
    newBookEditorial: string,
    newBookQuantity: number
  ) {
    $.ajax({
      // URL a la que se envía la petición.
      url: "./php/server/addNewBook.php",
      // El método de envió.
      method: "POST",
      // Convertir los datos a un objeto JSON.
      data: JSON.stringify({
        newBookIdentifier: newBookIdentifier,
        newBookName: newBookName,
        newBookAuthor: newBookAuthor,
        newBookEditorial: newBookEditorial,
        newBookQuantity: newBookQuantity,
      }),
      // Tipo de contenido que se está enviando.
      contentType: "application/json",
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      // Función que se ejecuta cuando la petición es exitosa.
      success: function (response) {
        if (response.success) {
          $("#resetBookButton").click();
          $("#resetBooksCSVFileButton").click();
          $("#addBookCollapseButton").click();
          loadBooks(1, "");
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
        } else {
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          reportError(response.exceptionMessage, "addNewBook.php");
        }
      },
      // Función que se ejecuta si la petición falla.
      error: function (jqXHR, textStatus, errorThrown) {
        reportError(
          "jqXHR: " +
            jqXHR.responseText +
            ", textStatus: " +
            textStatus +
            ", errorThrown: " +
            errorThrown,
          "mainAjax.php"
        );
      },
    });
  }
  // Manejador de evento para el botón de añadir libros.
  $(document).on("click", "#addBookButton", function (e) {
    // Prevenir que se ejecute el comportamiento por defecto del botón.
    e.preventDefault();
    // Obtener los valores de los campos.
    const newBookIdentifier = $(this)
      .closest("#newBookForm")
      .find("#newBookIdentifier")
      .val();
    const newBookName = $(this)
      .closest("#newBookForm")
      .find("#newBookName")
      .val();
    const newBookAuthor = $(this)
      .closest("#newBookForm")
      .find("#newBookAuthor")
      .val();
    const newBookEditorial = $(this)
      .closest("#newBookForm")
      .find("#newBookEditorial")
      .val();
    const newBookQuantity = $(this)
      .closest("#newBookForm")
      .find("#newBookQuantity")
      .val();
    // Llamar a la función "addNewBook" con los valores obtenidos.
    addNewBook(
      newBookIdentifier as string,
      newBookName as string,
      newBookAuthor as string,
      newBookEditorial as string,
      newBookQuantity as number
    );
  });
  // Definimos una función para hacer la petición AJAX para añadir Libros de un fichero CSV.
  function addNewBooksFromCsvFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    $.ajax({
      // URL a la que se envía la petición.
      url: "./php/server/addNewBooksFromCsvFile.php",
      // El método de envío.
      method: "POST",
      // Los datos que se envían (en este caso, el archivo).
      data: formData,
      // No procesar el archivo en un objeto JSON.
      processData: false,
      // No especificar el tipo de contenido.
      contentType: false,
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      // Función que se ejecuta cuando la petición es exitosa.
      success: function (response) {
        if (response.success) {
          $("#resetBooksCSVFileButton").click();
          $("#resetBookButton").click();
          $("#addBookCollapseButton").click();
          loadBooks(1, "");
          throwModal(
            response.alertType,
            response.confirmMessage,
            response.text,
            response.buttonText
          );
        } else {
          throwModal(
            response.alertType,
            response.confirmMessage,
            response.text,
            response.buttonText
          );
          reportError(response.exceptionMessage, "addNewBooksFromCsvFile.php");
        }
      },
      // Función que se ejecuta si la petición falla.
      error: function (jqXHR, textStatus, errorThrown) {
        // console.log(jqXHR, textStatus, errorThrown);
        reportError(
          "jqXHR: " +
            jqXHR.responseText +
            ", textStatus: " +
            textStatus +
            ", errorThrown: " +
            errorThrown,
          "addNewBooksFromCsvFile.php"
        );
      },
    });
  }
  // Manejador de evento para el botón de añadir libros.
  $(document).on("click", "#addBooksCSVFileButton", function (e) {
    // Prevenir que se ejecute el comportamiento por defecto del botón.
    e.preventDefault();
    // Obtener los valores de los campos.
    const fileInput = document.getElementById(
      "newBooksCSVFile"
    ) as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      // Llama a la función "addNewBooksFromCsvFile".
      addNewBooksFromCsvFile(file as File);
    }
  });
  // Definimos una función para hacer la petición AJAX para editar libros.
  function editBook(
    editBookIdentifier: string,
    editBookName: string,
    editBookAuthor: string,
    editBookEditorial: string,
    editBookQuantity: number,
    hiddenBookId: number
  ) {
    $.ajax({
      // URL a la que se envía la petición.
      url: "./php/server/editBook.php",
      // El método de envió.
      method: "POST",
      // Convertir los datos a un objeto JSON.
      data: JSON.stringify({
        editBookIdentifier: editBookIdentifier,
        editBookName: editBookName,
        editBookAuthor: editBookAuthor,
        editBookEditorial: editBookEditorial,
        editBookQuantity: editBookQuantity,
        hiddenBookId: hiddenBookId,
      }),
      // Tipo de contenido que se está enviando.
      contentType: "application/json",
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      // Función que se ejecuta cuando la petición es exitosa.
      success: function (response) {
        if (response.success) {
          $("#editBookModal" + hiddenBookId).modal("hide");
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          $(document).on("click", ".closeModalButton", function () {
            loadBooks(1, "");
          });
        } else {
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          reportError(response.exceptionMessage, "editBook.php");
        }
      },
      // Función que se ejecuta si la petición falla.
      error: function (jqXHR, textStatus, errorThrown) {
        reportError(
          "jqXHR: " +
            jqXHR.responseText +
            ", textStatus: " +
            textStatus +
            ", errorThrown: " +
            errorThrown,
          "editBook.php"
        );
      },
    });
  }
  // Manejador de evento para el botón de editar libros.
  $(document).on("click", ".editBookButton", function (e) {
    // Prevenir que se ejecute el comportamiento por defecto del botón.
    e.preventDefault();
    // Obtener los valores de los campos.
    const editBookIdentifier = $(this)
      .closest("tr")
      .find(".editBookIdentifier")
      .val();
    const editBookName = $(this).closest("tr").find(".editBookName").val();
    const editBookAuthor = $(this).closest("tr").find(".editBookAuthor").val();
    const editBookEditorial = $(this)
      .closest("tr")
      .find(".editBookEditorial")
      .val();
    const editBookQuantity = $(this)
      .closest("tr")
      .find(".editBookQuantity")
      .val();
    const hiddenBookId = $(this).closest("tr").find(".hiddenBookId").val();
    // Llama a la función "editBook".
    editBook(
      editBookIdentifier as string,
      editBookName as string,
      editBookAuthor as string,
      editBookEditorial as string,
      editBookQuantity as number,
      hiddenBookId as number
    );
  });
  // Definimos una función para hacer la petición AJAX para eliminar libros.
  function deleteBook(hiddenBookId: number) {
    $.ajax({
      // URL a la que se envía la petición.
      url: "./php/server/deleteBook.php",
      // El método de envió.
      method: "POST",
      // Convertir los datos a un objeto JSON.
      data: JSON.stringify({
        hiddenBookId: hiddenBookId,
      }),
      // Tipo de contenido que se está enviando.
      contentType: "application/json",
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      // Función que se ejecuta cuando la petición es exitosa.
      success: function (response) {
        if (response.success) {
          $("#editBookModal" + hiddenBookId).modal("hide");
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          $(document).on("click", ".closeModalButton", function () {
            loadBooks(1, "");
          });
        } else {
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          reportError(response.exceptionMessage, "deleteBook.php");
        }
      },
      // Función que se ejecuta cuando la petición es exitosa.
      error: function (jqXHR, textStatus, errorThrown) {
        reportError(
          "jqXHR: " +
            jqXHR.responseText +
            ", textStatus: " +
            textStatus +
            ", errorThrown: " +
            errorThrown,
          "deleteBook.php"
        );
      },
    });
  }
  // Manejador de evento para el botón de eliminar libros.
  $(document).on("click", ".deleteBookButton", function (e) {
    // Prevenir que se ejecute el comportamiento por defecto del botón.
    e.preventDefault();
    // Obtener los valores de los campos.
    const hiddenBookId = $(this).closest("tr").find(".hiddenBookId").val();
    // Llamar a la función de "deleteBook" con los valores obtenidos.
    deleteBook(hiddenBookId as number);
  });
  // Definimos una función para hacer la petición AJAX para cargar los dispositivos de la base de datos con la paginación.
  function loadDevices(devicePage: number, searchTerm: string) {
    $.ajax({
      // URL a la que se envía la petición.
      url: "./php/server/loadDevices.php",
      // El método de envió.
      method: "POST",
      // Convertir los datos a un objeto JSON.
      data: JSON.stringify({
        devicePage: devicePage,
        searchTerm: searchTerm,
      }),
      // Tipo de contenido que se está enviando.
      contentType: "application/json",
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      success: function (response) {
        // Función que se ejecuta cuando la petición es exitosa.
        if (response.success) {
          $("#devicesPagination").html(response.pagination);
          $("#devicesTable tbody").html(response.tbody);
          $("#totalDevices").html(response.totalDevices);
        } else {
          const alert = `
          <tr>
                <td colspan='5'>
                    <div class='alert alert-${response.alertType} text-center m-0' role='alert'>
                      ${response.text}
                    </div>
                </td>
            </tr>
          >`;
          $("#devicesTable tbody").html(alert);
          reportError(response.exceptionMessage, "loadDevices.php");
        }
      },
      // Función que se ejecuta si la petición falla.
      error: function (jqXHR, textStatus, errorThrown) {
        reportError(
          "jqXHR: " +
            jqXHR.responseText +
            ", textStatus: " +
            textStatus +
            ", errorThrown: " +
            errorThrown,
          "loadDevices.php"
        );
      },
    })
      // Función que se ejecuta después de que la promesa se resuelve exitosamente.
      .then(function () {
        validateEditDevicesForm();
      });
  }
  // Primera carga de dispositivos al inicio de la página.
  loadDevices(1, "");
  // Manejador de evento para el elemento de paginación de dispositivos.
  $(document).on("click", ".devicePageItem", function () {
    // Obtención del número de página del atributo ID del elemento HTML seleccionado.
    const devicePage = parseInt($(this).attr("id") as string);
    // Obtención del término de búsqueda actual en el campo de búsqueda correspondiente.
    const searchTerm = $("#searchDeviceInput").val() as string;
    // Llamar a la función de "loadDevices" con los valores obtenidos.
    loadDevices(devicePage, searchTerm);
  });
  // Manejador de evento para cuando se escribe sobre el campo de búsqueda de dispositivos.
  $(document).on("input", "#searchDeviceInput", function () {
    // Obtener el término de búsqueda actual.
    const searchTerm = $(this).val() as string;
    // Reiniciar el número de página a mostrar.
    const devicePage = 1;
    // Llamar a la función de "loadDevices" con los valore obtenidos.
    loadDevices(devicePage, searchTerm);
  });
  // Definimos una función para hacer la petición AJAX para añadir dispositivos.
  function addNewDevice(
    newDeviceIdentifier: string,
    newDeviceName: string,
    newDeviceDescription: string,
    newDeviceQuantity: number
  ) {
    $.ajax({
      // URL a la que se envía la petición.
      url: "./php/server/addNewDevice.php",
      // El método de envió.
      method: "POST",
      // Convertir los datos a un objeto JSON.
      data: JSON.stringify({
        newDeviceIdentifier: newDeviceIdentifier,
        newDeviceName: newDeviceName,
        newDeviceDescription: newDeviceDescription,
        newDeviceQuantity: newDeviceQuantity,
      }),
      // Tipo de contenido que se está enviando.
      contentType: "application/json",
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      // Función que se ejecuta cuando la petición es exitosa.
      success: function (response) {
        if (response.success) {
          $("#resetDeviceButton").click();
          $("#resetDevicesCSVFileButton").click();
          $("#addDeviceCollapseButton").click();
          loadDevices(1, "");
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
        } else {
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          reportError(response.exceptionMessage, "addNewDevice.php");
        }
      },
      // Función que se ejecuta si la petición falla.
      error: function (jqXHR, textStatus, errorThrown) {
        reportError(
          "jqXHR: " +
            jqXHR.responseText +
            ", textStatus: " +
            textStatus +
            ", errorThrown: " +
            errorThrown,
          "addNewDevice.php"
        );
      },
    });
  }
  // Manejador de evento para el botón de añadir dispositivos.
  $(document).on("click", "#addDeviceButton", function (e) {
    e.preventDefault(); // Prevenir que se ejecute el comportamiento por defecto del botón.
    // Obtener los valores de los campos.
    const newDeviceIdentifier = $(this)
      .closest("#newDeviceForm")
      .find("#newDeviceIdentifier")
      .val();
    const newDeviceName = $(this)
      .closest("#newDeviceForm")
      .find("#newDeviceName")
      .val();
    const newDeviceDescription = $(this)
      .closest("#newDeviceForm")
      .find("#newDeviceDescription")
      .val();
    const newDeviceQuantity = $(this)
      .closest("#newDeviceForm")
      .find("#newDeviceQuantity")
      .val();
    // Llamar a la función "addNewDevice" con los valores obtenidos.
    addNewDevice(
      newDeviceIdentifier as string,
      newDeviceName as string,
      newDeviceDescription as string,
      newDeviceQuantity as number
    );
  });
  // Definimos una función para hacer la petición AJAX para añadir dispositivos de un fichero CSV.
  function addNewDevicesFromCsvFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    $.ajax({
      // URL a la que se envía la petición.
      url: "./php/server/addNewDevicesFromCsvFile.php",
      // El método de envío.
      method: "POST",
      // Los datos que se envían (en este caso, el archivo).
      data: formData,
      // No procesar el archivo en un objeto JSON.
      processData: false,
      // No especificar el tipo de contenido.
      contentType: false,
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      // Función que se ejecuta cuando la petición es exitosa.
      success: function (response) {
        if (response.success) {
          $("#resetDevicesCSVFileButton").click();
          $("#resetDeviceButton").click();
          $("#addDeviceCollapseButton").click();
          loadDevices(1, "");
          throwModal(
            response.alertType,
            response.confirmMessage,
            response.text,
            response.buttonText
          );
        } else {
          throwModal(
            response.alertType,
            response.confirmMessage,
            response.text,
            response.buttonText
          );
          reportError(
            response.exceptionMessage,
            "addNewDevicesFromCsvFile.php"
          );
        }
      },
      // Función que se ejecuta si la petición falla.
      error: function (jqXHR, textStatus, errorThrown) {
        // console.log(jqXHR, textStatus, errorThrown);
        reportError(
          "jqXHR: " +
            jqXHR.responseText +
            ", textStatus: " +
            textStatus +
            ", errorThrown: " +
            errorThrown,
          "addNewDevicesFromCsvFile.php"
        );
      },
    });
  }
  // Manejador de evento para el botón de añadir dispositivos.
  $(document).on("click", "#addDevicesCSVFileButton", function (e) {
    // Prevenir que se ejecute el comportamiento por defecto del botón.
    e.preventDefault();
    // Obtener los valores de los campos.
    const fileInput = document.getElementById(
      "newDevicesCSVFile"
    ) as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      // Llama a la función "addNewDevicesFromCsvFile".
      addNewDevicesFromCsvFile(file as File);
    }
  });
  // Definimos una función para hacer la petición AJAX para editar dispositivos.
  function editDevice(
    editDeviceIdentifier: string,
    editDeviceName: string,
    editDeviceDescription: string,
    editDeviceQuantity: number,
    hiddenDeviceId: number
  ) {
    $.ajax({
      // URL a la que se envía la petición.
      url: "./php/server/editDevice.php",
      // El método de envió.
      method: "POST",
      // Convertir los datos a un objeto JSON.
      data: JSON.stringify({
        editDeviceIdentifier: editDeviceIdentifier,
        editDeviceName: editDeviceName,
        editDeviceDescription: editDeviceDescription,
        editDeviceQuantity: editDeviceQuantity,
        hiddenDeviceId: hiddenDeviceId,
      }),
      // Tipo de contenido que se está enviando.
      contentType: "application/json",
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      // Función que se ejecuta cuando la petición es exitosa.
      success: function (response) {
        if (response.success) {
          $("#editDeviceModal" + hiddenDeviceId).modal("hide");
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          $(document).on("click", ".closeModalButton", function () {
            loadDevices(1, "");
          });
        } else {
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          reportError(response.exceptionMessage, "editDevice.php");
        }
      },
      // Función que se ejecuta si la petición falla.
      error: function (jqXHR, textStatus, errorThrown) {
        reportError(
          "jqXHR: " +
            jqXHR.responseText +
            ", textStatus: " +
            textStatus +
            ", errorThrown: " +
            errorThrown,
          "editDevice.php"
        );
      },
    });
  }
  // Manejador de evento para el botón de editar dispositivos.
  $(document).on("click", ".editDeviceButton", function (e) {
    // Prevenir que se ejecute el comportamiento por defecto del botón.
    e.preventDefault();
    // Obtener los valores de los campos.
    const editDeviceIdentifier = $(this)
      .closest("tr")
      .find(".editDeviceIdentifier")
      .val();
    const editDeviceName = $(this).closest("tr").find(".editDeviceName").val();
    const editDeviceDescription = $(this)
      .closest("tr")
      .find(".editDeviceDescription")
      .val();
    const editDeviceQuantity = $(this)
      .closest("tr")
      .find(".editDeviceQuantity")
      .val();
    const hiddenDeviceId = $(this).closest("tr").find(".hiddenDeviceId").val();

    // Llamar a la función "editDevice" con los valores obtenidos.
    editDevice(
      editDeviceIdentifier as string,
      editDeviceName as string,
      editDeviceDescription as string,
      editDeviceQuantity as number,
      hiddenDeviceId as number
    );
  });
  // Definimos una función para hacer la petición AJAX para eliminar dispositivos.
  function deleteDevice(hiddenDeviceId: number) {
    $.ajax({
      // URL a la que se envía la petición.
      url: "./php/server/deleteDevice.php",
      // El método de envió.
      method: "POST",
      // Convertir los datos a un objeto JSON.
      data: JSON.stringify({
        hiddenDeviceId: hiddenDeviceId,
      }),
      // Tipo de contenido que se está enviando.
      contentType: "application/json",
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      // Función que se ejecuta cuando la petición es exitosa.
      success: function (response) {
        if (response.success) {
          $("#editDeviceModal" + hiddenDeviceId).modal("hide");
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          $(document).on("click", ".closeModalButton", function () {
            loadDevices(1, "");
          });
        } else {
          throwModal(
            `${response.alertType}`,
            `${response.confirmMessage}`,
            `${response.text}`,
            `${response.buttonText}`
          );
          reportError(response.exceptionMessage, "deleteDevice.php");
        }
      },
      // Función que se ejecuta si la petición falla.
      error: function (jqXHR, textStatus, errorThrown) {
        reportError(
          "jqXHR: " +
            jqXHR.responseText +
            ", textStatus: " +
            textStatus +
            ", errorThrown: " +
            errorThrown,
          "deleteDevice.php"
        );
      },
    });
  }
  // Manejador de evento para el botón de eliminar dispositivos.
  $(document).on("click", ".deleteDeviceButton", function (e) {
    // Prevenir que se ejecute el comportamiento por defecto del botón.
    e.preventDefault();
    // Obtener los valores de los campos.
    const hiddenDeviceId = $(this).closest("tr").find(".hiddenDeviceId").val();
    // Llamar a la función "deleteDevice" con los valores obtenidos.
    deleteDevice(hiddenDeviceId as number);
  });
  //___________________________________________________VALIDAR FORMULARIOS___________________________________________________//
  // Definimos una función para validar el campo.
  const validateField = (
    expression: RegExp,
    input: HTMLInputElement | HTMLTextAreaElement,
    errorObject: { [key: string]: boolean }
  ): void => {
    // Comprobamos que el campo no esté vacío y que cumpla con la expresión regular.
    const isValid =
      input.value.trim().length !== 0 && expression.test(input.value);
    // Agregamos la clase "is-valid" o "is-invalid" dependiendo de si es válido o no.
    input.classList.toggle("is-valid", isValid);
    input.classList.toggle("is-invalid", !isValid);
    // Agregamos la información del campo al objeto de errores correspondiente.
    errorObject[input.name] = !isValid;
    // Cambiamos el estado del botón de submit dependiendo de los errores encontrados.
    submitControler(errorObject);
  };
  // Definimos una función para controlar el botón submit.
  const submitControler = (errorObject: { [key: string]: boolean }): void => {
    switch (errorObject) {
      case booksErrors:
        addBookButton.disabled =
          Object.values(errorObject).filter((value) => value == true).length >
          0;
        break;
      case editBooksErrors:
        const editBooksButtons = document.querySelectorAll(
          ".editBookButton"
        ) as NodeListOf<HTMLButtonElement>;
        editBooksButtons.forEach((button) => {
          button.disabled =
            Object.values(errorObject).filter((value) => value == true).length >
            0;
        });
        break;
      case deviceErrors:
        addDeviceButton.disabled =
          Object.values(errorObject).filter((value) => value == true).length >
          0;
        break;
      case editDevicesErrors:
        const editDevicesButtons = document.querySelectorAll(
          ".editDeviceButton"
        ) as NodeListOf<HTMLButtonElement>;
        editDevicesButtons.forEach((button) => {
          button.disabled =
            Object.values(errorObject).filter((value) => value == true).length >
            0;
        });
        break;
      default:
        throw new Error("Error object not found");
    }
  };
  // Definimos una función para añadir listeners de eventos a los campos de los formularios.
  const addFormListeners = (
    formInputs: NodeListOf<HTMLInputElement | HTMLTextAreaElement>,
    expressions: { [key: string]: RegExp },
    errorObject: { [key: string]: boolean }
  ): void => {
    formInputs.forEach((input: HTMLInputElement | HTMLTextAreaElement) => {
      const expression = expressions[input.name];
      // Agregamos un listener para el evento "input".
      input.addEventListener("input", (e: Event) =>
        validateField(expression, input, errorObject)
      );
      // Agregamos un listener para el evento "blur".
      input.addEventListener("blur", (e: Event) =>
        validateField(expression, input, errorObject)
      );
    });
  };
  // Formulario de añadir libros.
  // Definimos una interfaz para tipar los objetos de expresiones regulares.
  interface booksRegExp {
    bookIdentifier: RegExp;
    bookName: RegExp;
    bookAuthor: RegExp;
    bookEditorial: RegExp;
    bookQuantity: RegExp;
    [key: string]: RegExp;
  }
  // Inicializamos la interfaz booksRegExp para tipar el objeto de expresiones regulares de los libros.
  const booksRegExp = {
    bookIdentifier: /^[A-Z]+-\d+$/, // Expresión regular para validar el identificador del libro (por ejemplo, "AB-123")
    bookName: /.+/, // Expresión regular para validar el nombre del libro (cualquier cadena de al menos un carácter)
    bookAuthor: /.+/, // Expresión regular para validar el autor del libro (cualquier cadena de al menos un carácter)
    bookEditorial: /.+/, // Expresión regular para validar la editorial del libro (cualquier cadena de al menos un carácter)
    bookQuantity: /^[0-9]+$|^0$/, // Expresión regular para validar la cantidad de libros (solo dígitos positivos o 0)
  };
  // Definimos los objetos de errores para cada formulario y los inicializamos a true.
  const booksErrors: { [key: string]: boolean } = {
    newBookIdentifier: true,
    newBookName: true,
    newBookAuthor: true,
    newBookEditorial: true,
    newBookQuantity: true,
  };
  // Obtenemos los botones de submit y los desactivamos hasta que no haya errores.
  const addBookButton = document.querySelector(
    "#addBookButton"
  ) as HTMLButtonElement;
  if (addBookButton !== null) {
    addBookButton.disabled = true;
  }
  // Obtenemos los inputs de los formularios correspondientes y las expresiones regulares correspondientes.
  const newBookFormInputs = document.querySelectorAll(
    "#newBookForm .form-control"
  ) as NodeListOf<HTMLInputElement | HTMLTextAreaElement>;
  const booksExpressions = {
    newBookIdentifier: booksRegExp.bookIdentifier,
    newBookName: booksRegExp.bookName,
    newBookAuthor: booksRegExp.bookAuthor,
    newBookEditorial: booksRegExp.bookEditorial,
    newBookQuantity: booksRegExp.bookQuantity,
  };
  // Agregamos los listeners a los inputs correspondientes.
  addFormListeners(newBookFormInputs, booksExpressions, booksErrors);
  // Obtenemos los botones para resetear los formularios.
  const resetBookButton = document.querySelector(
    "#resetBookButton"
  ) as HTMLButtonElement;
  if (resetBookButton !== null) {
    resetBookButton.addEventListener("click", (_: MouseEvent) => {
      // Reseteamos los inputs del formulario y los errores correspondientes.
      addBookButton.disabled = true;
      $(newBookFormInputs).removeClass("is-valid is-invalid");
      Object.keys(booksErrors).forEach((key) => (booksErrors[key] = true));
      $(newBookFormInputs).closest("form").trigger("reset");
    });
  }
  // Formulario de editar libros.
  // Definimos los objetos de errores para cada formulario.
  const editBooksErrors: { [key: string]: boolean } = {};
  // Función que se ejecuta cuando se cargan los libros correctamente.
  function validateEditBooksForm() {
    // Obtener los elementos de input con la clase "editBookIdentifier"
    const editBookIdentifierInputs = document.querySelectorAll(
      ".editBookIdentifier"
    ) as NodeListOf<HTMLInputElement>;
    // Aplicar la función de convertir a mayúsculas a cada input
    editBookIdentifierInputs.forEach((input) => {
      convertToUpperCase(input);
    });
    // Obtenemos los botones de submit y los desactivamos hasta que no haya errores.
    const editBooksButtons = document.querySelectorAll(
      ".editBookButton"
    ) as NodeListOf<HTMLButtonElement>;
    // Obtenemos los inputs de los formularios correspondientes y las expresiones regulares correspondientes.
    const editBooksFormInputs = document.querySelectorAll(
      ".editBookForm .form-control"
    ) as NodeListOf<HTMLInputElement>;
    const editBooksExpressions = {
      editBookIdentifier: booksRegExp.bookIdentifier,
      editBookName: booksRegExp.bookName,
      editBookAuthor: booksRegExp.bookAuthor,
      editBookEditorial: booksRegExp.bookEditorial,
      editBookQuantity: booksRegExp.bookQuantity,
    };
    // Agregamos los listeners a los inputs correspondientes.
    addFormListeners(
      editBooksFormInputs,
      editBooksExpressions,
      editBooksErrors
    );
    // Al pulsar el botón de cerrar el modal se restear el formulario.
    const closeModalButtons = document.querySelectorAll(
      ".closeEBModalButton"
    ) as NodeListOf<HTMLButtonElement>;
    if (closeModalButtons !== null) {
      closeModalButtons.forEach((button) => {
        button.addEventListener("click", (_: MouseEvent) => {
          // Reseteamos los inputs del formulario.
          $(editBooksFormInputs).removeClass("is-valid is-invalid");
          Object.keys(editBooksErrors).forEach(
            (key) => (editBooksErrors[key] = false)
          );
          if (editBooksButtons) {
            editBooksButtons.forEach((button) => {
              button.disabled = false;
            });
          }
          const editBooksForm = document.querySelectorAll(
            ".editBookForm"
          ) as NodeListOf<HTMLFormElement>;
          editBooksForm.forEach((form) => {
            form.reset();
          });
        });
      });
    }
  }
  // Formulario de dispositivos.
  // Definimos una interfaz para tipar los objetos de expresiones regulares.
  interface devicesRegExp {
    deviceIdentifier: RegExp;
    deviceName: RegExp;
    deviceDescription: RegExp;
    deviceQuantity: RegExp;
    [key: string]: RegExp;
  }
  // Inicializamos la interfaz devicesRegExp para tipar el objeto de expresiones regulares de los dispositivos.
  const devicesRegExp = {
    deviceIdentifier: /^[A-Z]+-\d+$/, // Expresión regular para validar el identificador del dispositivo (por ejemplo, "AB-123")
    deviceName: /.+/, // Expresión regular para validar el nombre del dispositivo (cualquier cadena de al menos un carácter)
    deviceDescription: /.+/, // Expresión regular para validar la descripción del dispositivo (cualquier cadena de al menos un carácter)
    deviceQuantity: /^[0-9]+$|^0$/, // Expresión regular para validar la cantidad de dispositivos (solo dígitos positivos o 0)
  };
  // Definimos los objetos de errores para cada formulario y los inicializamos a true.
  const deviceErrors: { [key: string]: boolean } = {
    newDeviceIdentifier: true,
    newDeviceName: true,
    newDeviceDescription: true,
    newDeviceQuantity: true,
  };
  // Obtenemos los botones de submit y los desactivamos hasta que no haya errores.
  const addDeviceButton = document.querySelector(
    "#addDeviceButton"
  ) as HTMLButtonElement;
  if (addDeviceButton !== null) {
    addDeviceButton.disabled = true;
  }
  // Obtenemos los inputs de los formularios correspondientes y las expresiones regulares correspondientes.
  const newDeviceFormInputs = document.querySelectorAll(
    "#newDeviceForm .form-control"
  ) as NodeListOf<HTMLInputElement | HTMLTextAreaElement>;
  const deviceExpressions = {
    newDeviceIdentifier: devicesRegExp.deviceIdentifier,
    newDeviceName: devicesRegExp.deviceName,
    newDeviceDescription: devicesRegExp.deviceDescription,
    newDeviceQuantity: devicesRegExp.deviceQuantity,
  };
  // Agregamos los listeners a los inputs correspondientes.
  addFormListeners(newDeviceFormInputs, deviceExpressions, deviceErrors);
  // Obtenemos los botones para resetear los formularios.
  const resetDeviceButton = document.querySelector(
    "#resetDeviceButton"
  ) as HTMLButtonElement;
  if (resetDeviceButton !== null) {
    resetDeviceButton.addEventListener("click", (_: MouseEvent) => {
      // Reseteamos los inputs del formulario y los errores correspondientes.
      addDeviceButton.disabled = true;
      $(newDeviceFormInputs).removeClass("is-valid is-invalid");
      Object.keys(deviceErrors).forEach((key) => (deviceErrors[key] = true));
      $(newDeviceFormInputs).closest("form").trigger("reset");
    });
  }
  // Formulario de editar dispositivos.
  // Definimos los objetos de errores para cada formulario.
  const editDevicesErrors: { [key: string]: boolean } = {};
  // Función que se ejecuta cuando se cargan los libros correctamente.
  function validateEditDevicesForm() {
    // Obtener los elementos de input con la clase "editDeviceIdentifier"
    const editDeviceIdentifierInputs = document.querySelectorAll(
      ".editDeviceIdentifier"
    ) as NodeListOf<HTMLInputElement>;
    // Aplicar la función de convertir a mayúsculas a cada input
    editDeviceIdentifierInputs.forEach((input) => {
      convertToUpperCase(input);
    });
    // Obtenemos los botones de submit y los desactivamos hasta que no haya errores.
    const editDevicesButtons = document.querySelectorAll(
      ".editDeviceButton"
    ) as NodeListOf<HTMLButtonElement>;
    // Obtenemos los inputs de los formularios correspondientes y las expresiones regulares correspondientes.
    const editDevicesFormInputs = document.querySelectorAll(
      ".editDeviceForm .form-control"
    ) as NodeListOf<HTMLInputElement>;
    const editDevicesExpressions = {
      editDeviceIdentifier: devicesRegExp.deviceIdentifier,
      editDeviceName: devicesRegExp.deviceName,
      editDeviceDescription: devicesRegExp.deviceDescription,
      editDeviceQuantity: devicesRegExp.deviceQuantity,
    };
    // Agregamos los listeners a los inputs correspondientes.
    addFormListeners(
      editDevicesFormInputs,
      editDevicesExpressions,
      editDevicesErrors
    );
    // Al pulsar el botón de cerrar el modal se restear el formulario.
    const closeModalButtons = document.querySelectorAll(
      ".closeEDModalButton"
    ) as NodeListOf<HTMLButtonElement>;
    if (closeModalButtons !== null) {
      closeModalButtons.forEach((button) => {
        button.addEventListener("click", (_: MouseEvent) => {
          // Reseteamos los inputs del formulario.
          $(editDevicesFormInputs).removeClass("is-valid is-invalid");
          Object.keys(editDevicesErrors).forEach(
            (key) => (editDevicesErrors[key] = false)
          );
          if (editDevicesButtons) {
            editDevicesButtons.forEach((button) => {
              button.disabled = false;
            });
          }
          const editDeviceForm = document.querySelectorAll(
            ".editDeviceForm"
          ) as NodeListOf<HTMLFormElement>;
          editDeviceForm.forEach((form) => {
            form.reset();
          });
        });
      });
    }
  }
  //___________________________________________________FUNCIONES___________________________________________________//
  // Definición de la función para convertir a mayúsculas
  function convertToUpperCase(input: HTMLInputElement): void {
    if (input) {
      input.addEventListener("keyup", () => {
        // Obtener el valor actual del input
        const currentValue = input.value;
        // Convertir el valor a mayúsculas
        const upperCaseValue = currentValue.toUpperCase();
        // Asignar el valor convertido al input
        input.value = upperCaseValue;
      });
    }
  }
  // Obtener el elemento de input con el id "newBooksAndDevices"
  const newBookIdentifierInput = document.querySelector(
    "#newBookIdentifier"
  ) as HTMLInputElement;
  // Aplicar la función de convertir a mayúsculas al input
  convertToUpperCase(newBookIdentifierInput);
  // Obtener el elemento de input con el id "newDevicesAndDevices"
  const newDeviceIdentifierInput = document.querySelector(
    "#newDeviceIdentifier"
  ) as HTMLInputElement;
  // Aplicar la función de convertir a mayúsculas al input
  convertToUpperCase(newDeviceIdentifierInput);
  // Definimos una función para hacer la petición AJAX para reportar un error.
  function reportError(errorType: string, fileName: string) {
    $.ajax({
      // URL a la que se envía la petición.
      url: "./php/error_handler.php",
      // El método de envió.
      method: "POST",
      // Convertir los datos a un objeto JSON.
      data: JSON.stringify({
        errorType: errorType,
        fileName: fileName,
        currentTime: new Date().toLocaleString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }),
      // Tipo de contenido que se está enviando.
      contentType: "application/json",
      // Tipo de datos que se espera recibir como respuesta.
      dataType: "json",
      // Función que se ejecuta cuando la petición es exitosa.
      success: function (response) {
        if (response.success) {
          console.log("Error reportado");
        } else {
          console.log("Error no reportado\n" + `${response.message}`);
        }
      },
      // Función que se ejecuta si la petición falla.
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(
          "Error no reportado\n" +
            "jqXHR: " +
            jqXHR.responseText +
            ", textStatus: " +
            textStatus +
            ", errorThrown: " +
            errorThrown
        );
      },
    });
  }
});
