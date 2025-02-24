async function registerUser(event) {
    event.preventDefault(); // Evita que la página se recargue

    const form = document.getElementById("registerFormId");
    const formData = new FormData(form); // Captura los datos del formulario, incluyendo la imagen

    // Validación antes de enviar la solicitud
    const fileInput = document.getElementById("imagen"); 
    if (!fileInput.files.length) {
        Swal.fire({
            title: "Error",
            text: "Debes subir una imagen.",
            icon: "error"
        });
        return; // Detiene la ejecución si no hay imagen
    }

    try {
        const response = await fetch("http://localhost:3000/auth/register", {
            method: "POST",
            body: formData, // Enviar como FormData para manejar archivos
        });

        const text = await response.text(); // Leer la respuesta como texto
        console.log("Respuesta del servidor:", text); // Depuración

        let data;
        try {
            data = JSON.parse(text); // Intentamos convertir el texto en JSON
        } catch (e) {
            console.error("No se pudo convertir la respuesta en JSON", e);
            data = null; // En caso de error, asignamos null para evitar fallos
        }

        if (response.ok) {
            console.log("Registro exitoso. Mostrando alerta...");
            alert("¡Registro exitoso! Ahora puedes iniciar sesión."); // Muestra la alerta estándar
            
            form.reset(); // Limpia los campos del formulario
          
        }
         else {
            console.warn("Error en el registro, código de estado:", response.status);
            Swal.fire({
                title: "Error",
                text: data?.message || `Hubo un problema con el registro. Código: ${response.status}`,
                icon: "error"
            });
        }
    } catch (error) {
        console.error("Error en el registro:", error);
        Swal.fire({
            title: "Error",
            text: "No se pudo conectar con el servidor.",
            icon: "error"
        });
    }
}


  
  function cargarPronombres() {
    fetch("http://localhost:3000/pronombres")
      .then(response => response.json())
      .then(data => {
        const pronombreSelect = document.getElementById("newPronombre"); // Aquí debe coincidir el ID
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
        const provinciaSelect = document.getElementById("newProvincia"); // Aquí debe coincidir el ID
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
  
  window.onload = function() {
    cargarProvincias();  // Cargar provincias
    cargarPronombres();  // Cargar pronombres
  };
  
  function previewImage(event) {
    const file = event.target.files[0]; // Obtiene el archivo seleccionado
    const preview = document.getElementById("preview");

    if (file) {
        const reader = new FileReader(); // Crea un lector de archivos

        reader.onload = function(e) {
            preview.src = e.target.result; // Asigna la imagen al src del <img>
            preview.style.display = "block"; // Muestra la imagen
        };

        reader.readAsDataURL(file); // Convierte la imagen a base64 para mostrarla
    } else {
        preview.style.display = "none"; // Oculta la vista previa si no hay imagen
    }
}
