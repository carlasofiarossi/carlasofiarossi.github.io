const API_URL = 'http://localhost:3000'; // Cambia esto a la URL de tu API

async function showUser() {
    const userId = document.getElementById("input-busqueda").value.trim(); // Obtener el ID del usuario
  
    if (!userId) {
      alert("Por favor, ingresa un ID.");
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/login/${userId}`); // Hacer la solicitud a la API del servidor
  
      if (!response.ok) {
        if (response.status === 404) {
          alert("ERROR: El usuario buscado no existe.");
          return;
        } else {
          throw new Error(await response.text());
        }
      }
  
      const user = await response.json(); // Obtener el usuario de la respuesta JSON
      const tableBody = document.querySelector("#table-usuarios tbody");
      tableBody.innerHTML = ""; // Limpiar la tabla
  
      // Crear la fila con la información del usuario
      const row = document.createElement("tr");
      row.innerHTML = 
       `
                <td>${user.ID_Login}</td>
                <td>${user.Nombre}</td>
                <td>${user.Apellido}</td>
                <td>${user.Provincia}</td>
                <td>${user.Pronombre}</td>
                <td>${user.Celular}</td>
                <td>${user.Mail}</td>
                <td>*****</td>
               <img src="/uploads/${user.Imagen}" alt="Img" width="50" class="user-image" data-image="/uploads/${user.Imagen}">>
                <td>
                    <button class="btn-edit" 
    onclick="editUser(${user.ID_Login}, 
                     '${user.Nombre}', 
                     '${user.Apellido}', 
                     '${user.FK_Provincia}', 
                     '${user.FK_Pronombre}', 
                     '${user.Celular}', 
                     '${user.Mail}', 
                     '',  // No enviar la contraseña hasheada
                     '${user.Imagen}')">

                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="btn-delete" onclick="destroyUser(${user.ID_Login})" title="Eliminar Usuario">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
      tableBody.appendChild(row);
  
    } catch (error) {
      console.error("Error:", error);
      alert("Error al buscar el usuario: " + error.message);
    }
  
    document.getElementById("input-busqueda").value = ""; // Limpiar el campo de búsqueda después de la consulta
  }

// Llamada a la API para obtener todos los usuarios
async function allUsers() {
    try {
        const response = await fetch(`${API_URL}/login`); // Asegúrate de que esta URL esté correcta
        if (!response.ok) throw new Error("No se pudieron cargar los usuarios.");

        const users = await response.json();
        const tableBody = document.querySelector("#table-usuarios tbody");
        tableBody.innerHTML = ""; // Limpiar la tabla antes de agregar los nuevos datos

        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.ID_Login}</td>
                <td>${user.Nombre}</td>
                <td>${user.Apellido}</td>
                <td>${user.Provincia}</td>
                <td>${user.Pronombre}</td>
                <td>${user.Celular}</td>
                <td>${user.Mail}</td>
                <td>*****</td>
               <img src="/uploads/${user.Imagen}" alt="Img" width="50" class="user-image" data-image="/uploads/${user.Imagen}">>
                <td>
                    <button class="btn-edit" 
    onclick="editUser(${user.ID_Login}, 
                     '${user.Nombre}', 
                     '${user.Apellido}', 
                     '${user.FK_Provincia}', 
                     '${user.FK_Pronombre}', 
                     '${user.Celular}', 
                     '${user.Mail}', 
                     '',  // No enviar la contraseña hasheada
                     '${user.Imagen}')">

                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="btn-delete" onclick="destroyUser(${user.ID_Login})" title="Eliminar Usuario">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error:", error);
        // alert(error.message); // Puedes mostrar un mensaje de error si lo deseas
    }
}
// Función para ocultar el botón de actualizar al inicio
function hideUpdateButton() {
    document.getElementById("btnActualizar").style.display = "none"; // Ocultar el botón
}

// Función para mostrar el botón de actualizar cuando se edita un usuario
function showUpdateButton() {
    document.getElementById("btnActualizar").style.display = "inline-block"; // Mostrar el botón
}

// Función para verificar que la imagen esté cargada antes de actualizar
function checkImageBeforeUpdate() {
    const imagenInput = document.getElementById("image");
    if (imagenInput.files.length === 0) {
        Swal.fire({
            title: "Error",
            text: "La imagen es obligatoria.",
            icon: "error"
        });
        return false; // No permitir la actualización sin imagen
    }
    return true; // Permitir la actualización si la imagen está cargada
}



async function updateUser(event) {
    if (event) event.preventDefault(); // Evita la recarga de la página

    // Obtener valores de los campos y eliminar espacios en blanco
    const id = document.getElementById("userID").value.trim();
    const nombre = document.getElementById("userName").value.trim();
    const apellido = document.getElementById("userSurame").value.trim();
    const provincia = document.getElementById("userProvince").value.trim();
    const pronombre = document.getElementById("userPronoun").value.trim();
    const celular = document.getElementById("userCellphone").value.trim();
    const mail = document.getElementById("userMail").value.trim();
    const password = document.getElementById("userPassword").value.trim();
    const imagenInput = document.getElementById("image");

    // Validaciones...
    if (nombre === "" || apellido === "" || provincia === "" || pronombre === "" || celular === "" || mail === "" || password === "") {
        Swal.fire({
            title: "Error",
            text: "Todos los campos son obligatorios, incluyendo la contraseña.",
            icon: "error"
        });
        return;
    }

    if (password.length < 6) {
        Swal.fire({
            title: "Error",
            text: "La contraseña debe tener al menos 6 caracteres.",
            icon: "error"
        });
        return;
    }

    // Si la imagen es obligatoria, verifica si se ha seleccionado
    if (!checkImageBeforeUpdate()) {
        return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("apellido", apellido);
    formData.append("fk_provincia", provincia);
    formData.append("fk_pronombre", pronombre);
    formData.append("celular", celular);
    formData.append("mail", mail);
    formData.append("password", password); // La contraseña SIEMPRE se envía

    if (imagenInput.files.length > 0) {
        formData.append("imagen", imagenInput.files[0]);
    }

    try {
        const response = await fetch(`http://localhost:3000/login/${id}`, {
            method: "PUT",
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            alert("¡Usuario actualizado! Los datos fueron modificados correctamente.");
            allUsers(); // Recargar la lista de usuarios sin refrescar la página
            hideUpdateButton();
        
        } else {
            Swal.fire({
                title: "Error",
                text: result.error || "Hubo un problema al actualizar.",
                icon: "error"
            });
        }
    } catch (error) {
        console.error("Error al actualizar:", error);
        Swal.fire({
            title: "Error",
            text: "No se pudo conectar con el servidor.",
            icon: "error"
        });
    }
}


async function destroyUser(id) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_URL}/login/${id}`, {
                    method: "DELETE"
                });

                const result = await response.json();

                if (response.ok) {
                    Swal.fire({
                        title: "Eliminado",
                        text: "El usuario ha sido eliminado correctamente.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    });

                    allUsers(); // Recargar la tabla de usuarios
                } else {
                    Swal.fire({
                        title: "Error",
                        text: result.error || "No se pudo eliminar el usuario.",
                        icon: "error"
                    });
                }
            } catch (error) {
                console.error("Error al eliminar:", error);
                Swal.fire({
                    title: "Error",
                    text: "No se pudo conectar con el servidor.",
                    icon: "error"
                });
            }
        }
    });
}

// Función para habilitar los campos y mostrar el botón de actualizar al editar un usuario
function editUser(id, nombre, apellido, provincia, pronombre, celular, mail, password, imagen) {
    console.log("ID:", id);
    console.log("Nombre:", nombre);
    console.log("Apellido:", apellido);
    console.log("Provincia:", provincia);
    console.log("Pronombre:", pronombre);
    console.log("Celular:", celular);  // ✅ Verifica que llega el celular
    console.log("Mail:", mail);        // ✅ Verifica que no sea la contraseña
    console.log("Contraseña:", password.length > 0 ? "Ingresada" : "No ingresada");
    console.log("Imagen:", imagen);

    // Habilitar los campos de edición
    document.querySelectorAll("input, select, button").forEach(el => el.disabled = false);

    // Llenar los campos del formulario
    document.getElementById("userID").value = id || "";
    document.getElementById("userName").value = nombre || "";
    document.getElementById("userSurame").value = apellido || "";
    document.getElementById("userProvince").value = provincia || "";
    document.getElementById("userPronoun").value = pronombre || "";
    document.getElementById("userCellphone").value = celular || ""; // ✅ Celular corregido
    document.getElementById("userMail").value = mail || ""; // ✅ Asegura que sea el mail correcto
    document.getElementById("userPassword").value = "";  // ❌ No mostrar contraseña hasheada

    // Mostrar la imagen actual si existe
    

    // Mostrar el botón de actualizar
    showUpdateButton();
}

// Al cargar la página, ocultar el botón y deshabilitar los campos
document.addEventListener("DOMContentLoaded", function () {
    hideUpdateButton(); // Ocultar el botón de actualización al inicio
    disableForm(); // Deshabilitar todos los campos
});
function cargarPronombres() {
    fetch("http://localhost:3000/pronombres")
      .then(response => response.json())
      .then(data => {
        const pronombreSelect = document.getElementById("userPronoun"); // Aquí debe coincidir el ID
        pronombreSelect.innerHTML = '<option value="">Seleccione un pronombre</option>'; // Asegúrate de limpiar las opciones antes de agregar nuevas opciones
    
        data.forEach(pronombre => {
          const option = document.createElement("option");
          option.value = pronombre.ID_Pronombre; // Asumiendo que el campo de ID es "ID_Pronombre"
          option.textContent = pronombre.Nombre; // Asumiendo que el campo de Nombre es "Nombre"
          pronombreSelect.appendChild(option); // Agrega cada opción al select
        });
      })
      .catch(error => console.error("Error al cargar los pronombres:", error));
  }

  function cargarProvincias() {
    fetch("http://localhost:3000/provincias")
      .then(response => response.json())
      .then(data => {
        const provinciaSelect = document.getElementById("userProvince"); // Aquí debe coincidir el ID
        provinciaSelect.innerHTML = '<option value="">Seleccione una provincia</option>'; // Asegúrate de limpiar las opciones antes de agregar nuevas opciones
    
        data.forEach(provincia => {
          const option = document.createElement("option");
          option.value = provincia.ID_Provincia; // Asumiendo que el campo de ID es "ID_Provincia"
          option.textContent = provincia.Nombre; // Asumiendo que el campo de Nombre es "Nombre"
          provinciaSelect.appendChild(option); // Agrega cada opción al select
        });
      })
      .catch(error => console.error("Error al cargar las provincia:", error));
  }
  
 
  


// Modal para ver la imagen en grande
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const captionText = document.getElementById("caption");
const closeModal = document.getElementById("closeModal");

// Abre el modal y muestra la imagen en grande cuando se hace clic en la imagen
document.addEventListener("click", function(event) {
    if (event.target && event.target.classList.contains("user-image")) {
        const imageUrl = event.target.getAttribute("data-image");
        modal.style.display = "block";
        modalImg.src = imageUrl;
        captionText.innerHTML = "Imagen de perfil";
    }
});

// Cierra el modal al hacer clic en el botón de cierre
closeModal.addEventListener("click", function() {
    modal.style.display = "none";
});

document.getElementById("btnActualizar").addEventListener("click", updateUser);

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("buscarElemento").addEventListener("click", showUser); // Asociamos el evento de clic con la función showArticle
    // Deshabilitar todos los campos y botones inicialmente
    disableForm();

    // Evento para activar la edición de un usuario
    document.getElementById("btnEditar").addEventListener("click", function () {
        enableForm();  // Habilitar los campos para editar
    });

    // También puedes usar una función para deshabilitar los campos cuando se termine la edición si lo deseas.
    document.getElementById("btnActualizar").addEventListener("click", function () {
        disableForm();  // Deshabilitar los campos después de actualizar
    });
});

// Función para deshabilitar todos los campos
function disableForm() {
    const inputs = document.querySelectorAll("input, select, button");
    inputs.forEach(input => {
        // Evitar deshabilitar los elementos de búsqueda
        if (!input.closest(".right-column")) {
            input.disabled = true;
        }
    });
}
// Función para habilitar todos los campos
function enableForm() {
    const inputs = document.querySelectorAll("input, select, button");
    inputs.forEach(input => {
        input.disabled = false;
    });
}

document.addEventListener("DOMContentLoaded", function () {
    allUsers(); // Llamar a la función para cargar todos los usuarios al cargar la página
    document.getElementById("btn-mostrarElemento").addEventListener("click", allUsers);
        cargarProvincias();  // Cargar provincias
        cargarPronombres();  // Cargar pronombres
     

});
