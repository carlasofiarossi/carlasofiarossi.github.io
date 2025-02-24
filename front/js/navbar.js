document.addEventListener("DOMContentLoaded", function () {
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
                      <a href="#">Listas</a>
                      <ul class="dropdown-content">
                          <li><a href="lista_articulos.html">Artículos</a></li>
                          <li><a href="lista_categorias.html">Categorias</a></li>
                          <li><a href="lista_marcas.html">Marcas</a></li>
                          <li><a href="lista_paises.html">Paises</a></li>
                          <li><a href="lista_pronombres.html">Pronombres</a></li>
                          <li><a href="lista_provincias.html">Provincias</a></li>
                          <li><a href="lista_subcategorias.html">Subcategorias</a></li>
                          <li><a href="lista_tipos.html">Tipos</a></li>
                      </ul>
                  </li>
                  <li><a href="acerca_de.html">Nosotros</a></li>
                  <li><a href="contacto.html">Contacto</a></li>
              </ul>
              <div class="right-container">
                  <div class="search-bar">
                      <input type="search" placeholder="Buscar..." />
                  </div>
                  <div class="login-register">
                      <a href="javascript:void(0)" onclick="toggleDropdown()">Hola <span id="userName"></span></a>
                      <div id="dropdownMenu" class="dropdown-content" style="display: none;">
                          <a href="javascript:void(0);" onclick="logout()">Cerrar sesión</a>
                      </div>
                  </div>
                  <div id="loginModal" class="modal">
                      <div class="modal-content">
                          <span class="close" onclick="closeModal()">&times;</span>
                          <h2>Login/Register</h2>
                          <!-- Formulario de Login -->
                          <form id="loginForm">
                              <label for="email">Mail:</label>
                              <input type="email" id="email" name="email" required>
                              <br>
                              <label for="password">Password:</label>
                              <input type="password" id="password" name="password" required>
                              <button type="submit" class="form__button">Login</button>
                              <p>¿No tienes cuenta? <a href="javascript:void(0);" onclick="toggleForms()">Regístrate</a></p>
                          </form>
                          <!-- Formulario de Registro -->
                          <div id="registerForm" style="display:none;">
                              <form id="registerFormId" method="post">
                                  <label for="newUsername">Username:</label>
                                  <input type="text" id="newUsername" name="newUsername" required>
                                  <label for="newPassword">Password:</label>
                                  <input type="password" id="newPassword" name="newPassword" required>
                                  <button type="submit" class="form__button">Register</button>
                                  <p>¿Tienes cuenta? <a href="javascript:void(0);" onclick="toggleForms()">Inicia sesión</a></p>
                              </form>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </nav>
    `;
  
    // Insertar la barra de navegación en el contenedor con id "navbar-container"
    const navbarContainer = document.getElementById("navbar-container");
    if (navbarContainer) {
      navbarContainer.innerHTML = navbarHTML;
    }
  });
  