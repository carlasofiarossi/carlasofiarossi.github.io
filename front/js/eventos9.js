// URL de la API para los artículos
const API_URL = 'http://localhost:3000'; // Cambia esto a la URL de tu API

// Elementos del DOM
const inputArticle = document.getElementById("productName");
const inputDescription = document.getElementById("productDescripcion");
const inputPrice = document.getElementById("productPrecio");
const inputID = document.getElementById("articleID"); // Input para ID
const form = document.getElementById("formulario");
const btnGuardar = document.getElementById("btnGuardar");
let selectedArticleId = null;

// 👉 Obtener todos los artículos

async function getNextArticleID() {
    try {
        const response = await fetch(`${API_URL}/articulos`);
        if (!response.ok) throw new Error("No se pudieron obtener los artículos.");

        const articles = await response.json();
        inputID.value = articles.length === 0 ? "1" : Math.max(...articles.map(p => p.ID_Articulo)) + 1;
    } catch (error) {
        console.error("Error al obtener el próximo ID:", error);
        inputID.value = "Error";
    }
}

async function allArticles() {
    try {
        const response = await fetch(`${API_URL}/articulos`);
        if (!response.ok) throw new Error("No se pudieron cargar los artículos.");

        const responseText = await response.text();  // Obtener el texto de la respuesta
        console.log(responseText);  // Ver qué devuelve el servidor
        const articles = JSON.parse(responseText);  // Convertir manualmente si es necesario

        articles.sort((a, b) => a.ID_Articulo - b.ID_Articulo);
        const tableBody = document.querySelector("#table-usuarios tbody");
        tableBody.innerHTML = ""; // Limpiar tabla

        articles.forEach(article => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${article.ID_Articulo}</td>
                <td>${article.Nombre}</td>
                <td>${article.Categoria}</td>
                <td>${article.Subcategoria}</td>
                <td>${article.Tipo}</td>
                <td>${article.Marca}</td>
                <td class="small-text">${article.Descripcion}</td>
                <td>$${article.Precio}</td>
                <td>
                    <img src="${article.Imagen ? '/uploads/' + article.Imagen : 'default-image.jpg'}" style="width: 100px; height: auto;">
                </td>
                <td>
                    <button class="btn-edit" onclick="editArticle(${article.ID_Articulo}, '${article.Nombre}', '${article.Categoria}', '${article.Subcategoria}', '${article.Tipo}', '${article.Descripcion}', ${article.Precio})" title="Editar Artículo">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="btn-delete" onclick="destroyArticle(${article.ID_Articulo})" title="Eliminar Artículo">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        getNextArticleID();
    } catch (error) {
       // console.error("Error:", error);
       // alert("Error al cargar los artículos: " + error.message);
    }
}

async function cargarMarcas() {
    try {
        const response = await fetch(`${API_URL}/marcas`);
        if (!response.ok) throw new Error("No se pudieron cargar las marcas.");

        const marcas = await response.json();
        const marcaSelect = document.getElementById("marca");
        marcaSelect.innerHTML = "<option value=''>Seleccione una marca</option>";

        marcas.forEach(marca => {
            const option = document.createElement("option");
            option.value = marca.ID_Marca;
            option.textContent = marca.Nombre;
            marcaSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar marcas:", error);
        alert("No se pudieron cargar las marcas.");
    }
}


function editArticle(id, name, category, subcategory, type, description, price, brandId) {
    selectedArticleId = id;
    inputID.value = id;
    inputArticle.value = name;
    inputDescription.value = description;
    inputPrice.value = price;

    // Cargar opciones en los selects (categoría, subcategoría, tipo y marca)
    cargarDatos("categorias", "categoria");
    cargarDatos("subcategorias", "subcategoria");
    cargarDatos("tipos", "tipo");
    cargarDatos("marcas", "marca");

    // Asignar los valores seleccionados a los selects
    const categoriaSelect = document.getElementById("categoria");
    const subcategoriaSelect = document.getElementById("subcategoria");
    const tipoSelect = document.getElementById("tipo");
    const marcaSelect = document.getElementById("marca");

    // Asignar el valor a cada select después de cargar los datos
    categoriaSelect.value = category;
    subcategoriaSelect.value = subcategory;
    tipoSelect.value = type;
    marcaSelect.value = brandId;

    // Forzar actualización de selects (por si es necesario hacer algún ajuste)
    categoriaSelect.dispatchEvent(new Event('change'));
    subcategoriaSelect.dispatchEvent(new Event('change'));
    tipoSelect.dispatchEvent(new Event('change'));
    marcaSelect.dispatchEvent(new Event('change'));

    // Actualizar el texto del botón
    btnGuardar.textContent = "Actualizar Artículo";
    btnCancelar.style.display = "inline-block";
}


document.querySelector("#categoria").addEventListener("change", async function () {
    const categoriaId = this.value;
    
    const subcategoriaSelect = document.querySelector("#subcategoria");
    const tipoSelect = document.querySelector("#tipo");

    // Limpiar las opciones anteriores de subcategoría y tipo

  
    subcategoriaSelect.innerHTML = "<option value=''>Selecciona una opción</option>";
    tipoSelect.innerHTML = "<option value=''>Selecciona una opción</option>";
    
    // Deshabilitar los selects de subcategoría y tipo hasta obtener los datos
    subcategoriaSelect.disabled = tipoSelect.disabled = !categoriaId;

    if (categoriaId) {
        try {
            // Solicitud a la API para obtener las subcategorías por categoría
            const response = await fetch(`${API_URL}/articulos/subcategorias/${categoriaId}`);
            if (!response.ok) throw new Error("Error al cargar subcategorías.");
            
            const subcategorias = await response.json();

            // Agregar las subcategorías al select
            subcategorias.forEach(sub => {
                const option = document.createElement("option");
                option.value = sub.ID_Sub;
                option.textContent = sub.Nombre;
                subcategoriaSelect.appendChild(option);
            });

            // Habilitar el select de subcategorías
            subcategoriaSelect.disabled = false;
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudieron cargar las subcategorías.");
        }
    }
});

document.querySelector("#subcategoria").addEventListener("change", async function () {
    const subcategoriaId = this.value;  // Obtener el ID de la subcategoría seleccionada
    const tipoSelect = document.querySelector("#tipo");

    // Limpiar las opciones anteriores de tipos
    tipoSelect.innerHTML = "<option value=''>Selecciona una opción</option>";

    // Deshabilitar el select de tipos hasta obtener los datos
    tipoSelect.disabled = true;

    if (subcategoriaId) {
        try {
            // Solicitud a la API para obtener los tipos por subcategoría
            const response = await fetch(`${API_URL}/articulos/tipos/${subcategoriaId}`);
            if (!response.ok) throw new Error("Error al cargar tipos.");

            const tipos = await response.json();

            // Agregar los tipos al select
            tipos.forEach(tipo => {
                const option = document.createElement("option");
                option.value = tipo.ID_Tipo;
                option.textContent = tipo.Nombre;
                tipoSelect.appendChild(option);
            });

            // Habilitar el select de tipos
            tipoSelect.disabled = false;
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudieron cargar los tipos.");
        }
    }
});


async function showArticle() {
  const articleId = document.getElementById("input-busqueda").value.trim(); // Obtener el ID del artículo

  if (!articleId) {
    alert("Por favor, ingresa un ID.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/articulos/${articleId}`); // Hacer la solicitud a la API del servidor

    if (!response.ok) {
      if (response.status === 404) {
        alert("ERROR: El artículo buscado no existe.");
        return;
      } else {
        throw new Error(await response.text());
      }
    }

    const article = await response.json(); // Obtener el artículo de la respuesta JSON
    const tableBody = document.querySelector("#table-usuarios tbody");
    tableBody.innerHTML = ""; // Limpiar la tabla

    // Crear la fila con la información del artículo
    const row = document.createElement("tr");
    row.innerHTML = 
    `
                <td>${article.ID_Articulo}</td>
                <td>${article.Nombre}</td>
                <td>${article.Categoria}</td>
                <td>${article.Subcategoria}</td>
                <td>${article.Tipo}</td>
                <td>${article.Marca}</td>
                <td class="small-text">${article.Descripcion}</td>
              <td>$${article.Precio}</td>
                <td>
                    <img src="${article.Imagen ? '/uploads/' + article.Imagen : 'default-image.jpg'}" style="width: 100px; height: auto;">
                </td>
                <td>
                    <button class="btn-edit" onclick="editArticle(${article.ID_Articulo}, '${article.Nombre}', '${article.Categoria}', '${article.Subcategoria}', '${article.Tipo}', '${article.Descripcion}', ${article.Precio})" title="Editar Artículo">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="btn-delete" onclick="destroyArticle(${article.ID_Articulo})" title="Eliminar Artículo">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
    tableBody.appendChild(row);

  } catch (error) {
    console.error("Error:", error);
    alert("Error al buscar el artículo: " + error.message);
  }

  document.getElementById("input-busqueda").value = ""; // Limpiar el campo de búsqueda después de la consulta
}


// 👉 Cancelar la edición de un artículo
function cancelEdit() {
    selectedArticleId = null; // Resetear el ID seleccionado
    inputArticle.value = ""; // Limpiar el campo de nombre del artículo
    inputDescription.value = ""; // Limpiar el campo de descripción
    inputPrice.value = ""; // Limpiar el campo de precio
    document.getElementById("categoria").value = ""; // Limpiar la selección de categoría
    document.getElementById("subcategoria").value = ""; // Limpiar la selección de subcategoría
    document.getElementById("tipo").value = ""; // Limpiar la selección de tipo
    document.getElementById("marca").value = ""; // Limpiar la selección de marca
    document.getElementById("image").value = ""; // Limpiar el campo de imagen (si es necesario)
    
    btnGuardar.textContent = "Guardar Artículo"; // Volver a "Guardar Artículo"
    btnCancelar.style.display = "none"; // Ocultar el botón de cancelar

    // Actualizar el siguiente ID para el artículo
    getNextArticleID(); // Llamamos aquí para asegurar que el ID se actualice al cancelar
}


// 👉 Eliminar artículo
async function destroyArticle(id) {
    if (confirm("¿Estás seguro de que quieres eliminar este artículo?")) {
        try {
            const response = await fetch(`${API_URL}/articulos/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("No se pudo eliminar el artículo.");
            alert("Artículo eliminado correctamente.");
            allArticles();
        } catch (error) {
            console.error("Error al eliminar el artículo:", error);
            alert(error.message);
        }
    }
}

// 👉 Cargar datos en los selects
function cargarDatos(endpoint, selectId) {
    return new Promise((resolve, reject) => {
        fetch(`${API_URL}/${endpoint}`)
            .then(response => response.json())
            .then(data => {
                const select = document.getElementById(selectId);
                select.innerHTML = '<option value="">Seleccione una opción</option>';
                data.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item.ID_Categoria || item.ID_Sub || item.ID_Tipo || item.ID_Marca;
                    option.textContent = item.Nombre;
                    select.appendChild(option);
                });
                resolve(); // Resolvemos la promesa cuando se ha cargado la lista
            })
            .catch(error => {
                console.error(`Error al cargar ${endpoint}:`, error);
                reject(error); // Rechazamos la promesa si hay un error
            });
    });
} 
async function loadSubcategories() {
    const categoriaId = document.querySelector("#categoria").value;
    const subcategoriaSelect = document.querySelector("#subcategoria");
    const tipoSelect = document.querySelector("#tipo");

    // Limpiar opciones anteriores
    subcategoriaSelect.innerHTML = "<option value=''>Seleccione una opción</option>";
    tipoSelect.innerHTML = "<option value=''>Seleccione una opción</option>";

    // Deshabilitar selects hasta obtener datos
    subcategoriaSelect.disabled = true;
    tipoSelect.disabled = true;

    if (categoriaId) {
        try {
            // Hacer solicitud a la API para obtener las subcategorías
            const response = await fetch(`${API_URL}/subcategorias/${categoriaId}`);
            if (!response.ok) throw new Error("Error al cargar subcategorías.");

            // Obtener subcategorías de la respuesta
            const subcategorias = await response.json(); // Aquí se define la variable subcategorias

            console.log("Subcategorías recibidas:", subcategorias); // Verificar que la variable contiene los datos

            // Agregar opciones al select de subcategorías
            subcategorias.forEach(sub => {
                const option = document.createElement("option");
                option.value = sub.ID_Sub;
                option.textContent = sub.Nombre;
                subcategoriaSelect.appendChild(option);
            });

            // Habilitar el select de subcategorías
            subcategoriaSelect.disabled = false;
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudieron cargar las subcategorías.");
        }
    }
}


// 🔥 Cargar tipos cuando cambia la subcategoría
async function loadTypes(subcategoriaId) {
    const tipoSelect = document.querySelector("#tipo");
    tipoSelect.innerHTML = "<option value=''>Selecciona un tipo</option>";
    tipoSelect.disabled = true; // Deshabilitar select hasta obtener los datos

    if (subcategoriaId) {
        try {
            const response = await fetch(`${API_URL}/subcategorias/${subcategoriaId}/tipos`);
            if (!response.ok) throw new Error("Error al cargar tipos.");

            const tipos = await response.json();
            console.log("Tipos recibidos:", tipos); // Verificar qué datos están llegando

            tipos.forEach(tipo => {
                const option = document.createElement("option");
                option.value = tipo.ID_Tipo;
                option.textContent = tipo.Nombre;
                tipoSelect.appendChild(option);
            });

            tipoSelect.disabled = false; // Habilitar select de tipos después de cargar los tipos
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudieron cargar los tipos.");
        }
    } else {
        tipoSelect.disabled = true;  // Deshabilitar el select de tipos si no hay subcategoría seleccionada
    }
}


// 👉 Guardar o actualizar un artículo
async function storeArticle() {
    const articleName = inputArticle.value.trim();
    const articleDescription = inputDescription.value.trim();
    const articlePrice = parseFloat(inputPrice.value);
    const categoryID = parseInt(document.getElementById("categoria").value);
    const subcategoryID = parseInt(document.getElementById("subcategoria").value);
    const typeID = parseInt(document.getElementById("tipo").value);
    const brandID = parseInt(document.getElementById("marca").value);
    const imageFile = document.getElementById("image").files[0];  // Obtener el archivo de imagen

    if (!articleName || !articleDescription || isNaN(articlePrice) || articlePrice <= 0 || !categoryID || !subcategoryID || !typeID || !brandID) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    const formData = new FormData();
    formData.append("nombre", articleName);
    formData.append("descripcion", articleDescription);
    formData.append("precio", articlePrice);
    formData.append("fk_categoria", categoryID);
    formData.append("fk_subcategoria", subcategoryID);
    formData.append("fk_tipo", typeID);
    formData.append("fk_marca", brandID);

    // Verifica si hay una imagen y agrega al FormData
    if (imageFile) {
        formData.append("imagen", imageFile);
    }

    const requestMethod = selectedArticleId ? "PUT" : "POST";
    const url = selectedArticleId ? `${API_URL}/articulos/${selectedArticleId}` : `${API_URL}/articulos`;

    try {
        const response = await fetch(url, {
            method: requestMethod,
            body: formData  // Envía el FormData en lugar de JSON
        });

        if (!response.ok) {
            throw new Error('Error al enviar la solicitud: ' + response.statusText);
        }

        const data = await response.json();  // Asegúrate de que el servidor está enviando un JSON válido
        alert(selectedArticleId ? "Artículo actualizado correctamente." : "Artículo guardado correctamente.");
        cancelEdit();
        allArticles();
    } catch (error) {
        console.error("Error:", error);
        alert("Error al guardar el artículo: " + error.message);
    }
}



// 👉 Evento de envío del formulario
form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevenir que se recargue la página
    if (selectedArticleId) {
        updateArticle(); // Si estamos editando, llamamos a updateArticle
    } else {
        storeArticle(); // Si es un nuevo artículo, lo guardamos
    }
});
// 👉 Cargar datos al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    if (btnGuardar) btnGuardar.addEventListener("click", (e) => { e.preventDefault(); storeArticle(); });
    if (btnCancelar) btnCancelar.addEventListener("click", (e) => { e.preventDefault(); cancelEdit(); btnCancelar.style.display = "none"; });
    cargarDatos("categorias", "categoria");
    cargarDatos("subcategorias", "subcategoria");
    cargarDatos("marcas", "marca");
    cargarDatos("tipos", "tipo");
    allArticles();
    document.getElementById("buscarElemento").addEventListener("click", showArticle); // Asociamos el evento de clic con la función showArticle
    document.getElementById("btn-mostrarElemento").addEventListener("click", allArticles);
      // Verificar si el usuario está autenticado
 // const storedToken = localStorage.getItem("token");

 // if (!storedToken) {
    // Si no hay token (usuario no autenticado), redirigir al login
   // window.location.href = "/front/index.html";  // Redirige al login
 // }
});

