function toggleForms() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const modal = document.getElementById("loginModal");

  if (loginForm.style.display === "none") {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    modal.classList.remove("register-mode"); // Se usa el padding de login
  } else {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    modal.classList.add("register-mode"); // Se usa el padding de registro
  }
}


document.addEventListener("DOMContentLoaded", function () {

  const toggleButton = document.getElementById("toggle-search");
  const containerSearch = document.querySelector(".container-search");

let isMinimized = false;

toggleButton.addEventListener("click", function () {
  isMinimized = !isMinimized;

  if (isMinimized) {
    containerSearch.classList.add("minimized");
    toggleButton.textContent = "+";
  } else {
    containerSearch.classList.remove("minimized");
    toggleButton.textContent = "─";
  }
});
});

  const navbarHTML = `
      <nav class="navbar">
          <div class="menu-toggle" id="menu-toggle">
              <span></span>
              <span></span>
              <span></span>
          </div>
          <div class="container">
              <ul class="menu-items" id="menu-items">
                  <div class="logo">
                      <a href="index.html"><img src="imagenes/logo3.png" alt="MIGURI"></a>
                  </div>
                  <li><a href="index.html">Inicio</a></li>
                  <li class="dropdown" id="listasDropdown" style="display:none;">
                      <a href="#">Gestión</a>
                      <ul class="dropdown-content">
                          <li><a href="lista_articulos.html">Artículos</a></li>
                          <li><a href="lista_categorias.html">Categorias</a></li>
                          <li><a href="lista_marcas.html">Marcas</a></li>
                          <li><a href="lista_paises.html">Paises</a></li>
                          <li><a href="lista_pronombres.html">Pronombres</a></li>
                          <li><a href="lista_provincias.html">Provincias</a></li>
                          <li><a href="lista_subcategorias.html">Subcategorias</a></li>
                          <li><a href="lista_tipos.html">Tipos</a></li>
                          <li><a href="lista_usuarios.html">Usuarios</a></li>
                      </ul>
                  </li>
                  <li><a href="acerca_de.html">Nosotros</a></li>
                  <li><a href="contacto.html">Contacto</a></li>
                   <li><a href="nuestros_articulos.html">Articulos</a></li>
              </ul>
              <div class="right-container">
                 
              
                  <div class="login-register">
                      <a href="javascript:void(0)" onclick="toggleDropdown()">Hola <span id="userName"></span></a>
                      <div id="dropdownMenu" class="dropdown-content" style="display: none;">
                          <a href="javascript:void(0);" onclick="logout()">Cerrar sesión</a>
                      </div>
                  </div>
                  <div id="loginModal" class="modal">
                      <div class="modal-content">
                          <span class="close" onclick="closeModal()">&times;</span>
                         
                          <!-- Formulario de Login -->
                          <form id="loginForm">
                         <center>  <h6>Iniciar sesion</h6></center> <br>
                              <label for="email">Mail:</label>
                              <input type="email" id="email" name="email" required>
                              <br>
                              <label for="password">Clave:</label>
                              <input type="password" id="password" name="password" required><br>
                              <button type="submit" class="form__button">Login</button><br>
                              <p>¿No tienes cuenta? <a href="javascript:void(0);" onclick="toggleForms()">Regístrate</a></p>
                          </form>
                         <!-- Formulario de Registro -->
<div id="registerForm" style="display:none;">
 <h6><center>Registrarse</center></h6>
    <form id="registerFormId" enctype="multipart/form-data" onsubmit="registerUser(event)">
    <label for="newNombre">Nombre:</label>
    <input type="text" id="newNombre" name="nombre" required>

    <label for="newApellido">Apellido:</label>
    <input type="text" id="newApellido" name="apellido">

  <label for="newProvincia">Provincia:</label>
<select id="newProvincia" name="fk_provincia" required>
    <option value="">Seleccione una provincia</option>
</select>


   <label for="newPronombre">Pronombre:</label>
<select id="newPronombre" name="fk_pronombre" required>
    <option value="">Seleccione un pronombre</option>
</select>


    <label for="newCelular">Celular:</label>
    <input type="number" id="newCelular" name="celular">

    <label for="newMail">Mail:</label>
    <input type="email" id="newMail" name="mail" required>

<label for="newPassword">Password:</label>
<div class="password-container">
    <input type="password" id="newPassword" name="password" required>
    <span class="toggle-password" onclick="togglePassword()">
        👁️
    </span>

</div>
<br>
<label for="imagen">Imagen de Perfil:</label> 
<input type="file" id="imagen" name="imagen" accept="image/*" onchange="previewImage(event)">
<br><br>

<!-- Vista previa de la imagen -->
<img id="preview" src="" alt="Vista previa de la imagen" style="display:none; max-width: 150px; border-radius: 10px; margin-top: 10px;">

    <button type="submit" class="form__button">Registrarse</button><br>
    <p>¿Tienes cuenta? <a href="javascript:void(0);" onclick="toggleForms()">Inicia sesión</a></p>
    </form>
</div>

                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </nav>
    `;

 

    const protectedPages = ['lista_articulos.html', 'lista_usuarios.html', 'lista_marcas.html', 'lista_categorias.html','lista_paises.html','lista_pronombres.html','lista_provincias.html','lista_subcategorias.html','lista_tipos.html']; // Aquí pones las páginas que necesitas proteger
    const currentPage = window.location.pathname.split('/').pop(); // Obtén el nombre de la página actual
  
    if (protectedPages.includes(currentPage)) {
      const storedToken = localStorage.getItem("token");
  
      if (!storedToken) {
        // Si no hay token, mostrar mensaje de acceso denegado
        const container = document.querySelector('body');
        container.innerHTML = `
          <div style="display: flex; justify-content: center; align-items: center; height: 100vh; text-align: center;">
            <div style="border: 2px solid #ff0000; padding: 20px; background-color: #fff; color: #ff0000; border-radius: 10px;">
              <h2>Acceso Denegado</h2>
              <p>No tienes permisos para acceder a esta página.</p>
              <a href="index.html" style="color: #007bff; text-decoration: none;">Ir al la página principal</a>
            </div>
          </div>
        `;
      }
    }
  
    const navbarContainer = document.getElementById("navbar-container");
    if (navbarContainer) {
      navbarContainer.innerHTML = navbarHTML;
    }
  const loginButton = document.querySelector(".login-register a");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const userName = document.getElementById("userName");
  const listasDropdown = document.getElementById("listasDropdown");

  // Verificar si el usuario ya está autenticado
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const user = JSON.parse(storedUser);
    const nombreUsuario = user.Nombre || "Usuario";
    const apellidoUsuario = user.Apellido || "";
    
    loginButton.textContent = "Hola " + nombreUsuario + " " + apellidoUsuario;
    userName.textContent = nombreUsuario + " " + apellidoUsuario;
    loginButton.onclick = toggleDropdown;

    // Mostrar el menú "Listas" solo si el usuario está logeado
    listasDropdown.style.display = "block";  // Mostrar el menú "Listas"
  } else {
    loginButton.textContent = "Login/Register";
    loginButton.onclick = openModal;
    listasDropdown.style.display = "none";  // Ocultar el menú "Listas"
  }

  // Alternar entre Login y Register
  function toggleDropdown() {
    dropdownMenu.style.display = dropdownMenu.style.display === "none" ? "block" : "none";
  }

  
  function togglePassword() {
    const passwordInput = document.getElementById("newPassword");
    passwordInput.type = (passwordInput.type === "password") ? "text" : "password";
}

  // Función para abrir el modal
  function openModal() {
    var modal = document.getElementById("loginModal");
    modal.style.display = "block";
  }

  window.closeModal = function() {
    var modal = document.getElementById("loginModal");
    modal.style.display = "none";
  };

  // Manejo del login
  document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const mail = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!mail || !password) {
      alert("Por favor, ingrese ambos campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mail: mail, password: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        Swal.fire({
          title: "Error",
          text: data.message || "Error en el login.",
          icon: "error",
          confirmButtonText: "Aceptar"
        });
        return;
      }

      if (data.auth) {
        localStorage.setItem("token", data.token);
    
        const user = {
          Nombre: data.Nombre,
          Apellido: data.Apellido
        };
        localStorage.setItem("user", JSON.stringify(user));

        // Actualizar el texto del botón con el nombre del usuario
        loginButton.textContent = "Hola " + data.Nombre + " " + data.Apellido;
        userName.textContent = data.Nombre + " " + data.Apellido;
    
        Swal.fire({
          title: "¡Login exitoso!",
          text: "Serás redirigido en 2 segundos.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          window.location.href = "/front/index.html"; // Redirección
        });

        // Mostrar el menú "Listas"
        listasDropdown.style.display = "block";
      } else {
        alert("Credenciales incorrectas.");
      }
    } catch (error) {
      console.error("Error durante el login:", error);
      alert("Mail o clave incorrectos.");
    }
  });

  


  // Función para cerrar sesión
  window.logout = function() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    loginButton.textContent = "Login/Register";
    userName.textContent = "";
    loginButton.onclick = openModal;
    dropdownMenu.style.display = "none";
    listasDropdown.style.display = "none";
    window.toggleForms = toggleForms;
    window.location.href = "index.html";  // Redirección a index.html
  }

