// ========================== 
// 🔹 1. Constantes y Variables Globales
// ==========================
const API_URL = "http://localhost:3000/subcategorias"; // URL del backend API
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const inputID = document.getElementById("subcategoryID"); // Input para ID
const inputSubcategory = document.getElementById("subcategoryName");
let selectedSubcategoryId = null; // Variable para almacenar el ID de la subcategoría seleccionada

// ==========================
// 🔹 2. Funciones Principales
// ==========================

// 👉 Obtener el próximo ID disponible
async function getNextSubcategoryID() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("No se pudieron obtener las subcategorías.");

    const subcategories = await response.json();
    inputID.value = subcategories.length === 0 ? "1" : Math.max(...subcategories.map(p => p.ID_Sub)) + 1;
  } catch (error) {
    console.error("Error al obtener el próximo ID:", error);
    inputID.value = "Error";
  }
}

// 👉 Guardar o actualizar una subcategoría
async function storeSubcategory() {
  const subcategoryName = inputSubcategory.value.trim();
  const categoryID = parseInt(document.getElementById("categoria").value);

  if (!subcategoryName || !categoryID) {
    alert("El nombre de la subcategoría y la categoría son obligatorios.");
    return;
  }

  try {
    const bodyData = { nombre: subcategoryName, fk_categoria: categoryID };
    const requestMethod = selectedSubcategoryId ? "PUT" : "POST";
    const url = selectedSubcategoryId ? `${API_URL}/${selectedSubcategoryId}` : API_URL;

    const response = await fetch(url, {
      method: requestMethod,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) throw new Error(await response.text());

    alert(selectedSubcategoryId ? "Subcategoría actualizada correctamente." : "Subcategoría guardada correctamente.");
    cancelEdit();
    allSubcategories();
  } catch (error) {
    console.error("Error:", error);
    alert("Error al guardar la subcategoría: " + error.message);
  }
}

// 👉 Obtener todas las subcategorías
async function allSubcategories() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("No se pudieron cargar las subcategorías.");

    const subcategories = await response.json();
    const tableBody = document.querySelector("#table-usuarios tbody");
    tableBody.innerHTML = ""; // Limpiar tabla

    subcategories.forEach(subcategory => {
      const row = document.createElement("tr");
      row.innerHTML = 
        `<td>${subcategory.ID_Sub}</td>
        <td>${subcategory.Nombre}</td>
        <td>${subcategory.Categoria}</td>
        <td>
          <button class="btn-edit" onclick="editSubcategory(${subcategory.ID_Sub}, '${subcategory.Nombre}', '${subcategory.Categoria}')" title="Editar Subcategoría">
            <i class="fas fa-pencil-alt"></i>
          </button>
          <button class="btn-delete" onclick="destroySubcategory(${subcategory.ID_Sub})" title="Eliminar Subcategoría">
            <i class="fas fa-trash"></i>
          </button>
        </td>`;
      tableBody.appendChild(row);
    });

    getNextSubcategoryID();
  } catch (error) {
  //  console.error("Error:", error);
   // alert(error.message);
  }
}

// 👉 Editar subcategoría
function editSubcategory(id, nombre, categoria) {
  inputID.value = id;
  inputSubcategory.value = nombre;
  selectedSubcategoryId = id;

  btnGuardar.textContent = "Actualizar Subcategoría";
  btnCancelar.style.display = "inline-block";
}

// 👉 Cancelar edición
function cancelEdit() {
  inputID.value = "";
  inputSubcategory.value = "";
  selectedSubcategoryId = null;

  btnGuardar.textContent = "Guardar Subcategoría";
  btnCancelar.style.display = "none";
  getNextSubcategoryID();
}

// 👉 Eliminar una subcategoría
async function destroySubcategory(id) {
  if (!confirm("¿Estás seguro de que deseas eliminar esta subcategoría?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("No se pudo eliminar la subcategoría.");

    alert("Subcategoría eliminada correctamente.");
    allSubcategories();
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
}

// 👉 Buscar una subcategoría específica
async function showSubcategory() {
  const subcategoryId = document.getElementById("input-busqueda").value.trim();

  if (!subcategoryId) {
    alert("Por favor, ingresa un ID.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${subcategoryId}`);

    if (!response.ok) {
      if (response.status === 404) {
        alert("ERROR: La subcategoría buscada no existe.");
        return;
      } else {
        throw new Error(await response.text());
      }
    }

    const subcategory = await response.json();
    const tableBody = document.querySelector("#table-usuarios tbody");
    tableBody.innerHTML = ""; // Limpiar tabla

    const row = document.createElement("tr");
    row.innerHTML = 
      `<td>${subcategory.ID_Sub}</td>
      <td>${subcategory.Nombre}</td>
      <td>${subcategory.Categoria}</td>
      <td>
        <button class="btn-edit" onclick="editSubcategory(${subcategory.ID_Sub}, '${subcategory.Nombre}', '${subcategory.Categoria}')" title="Editar Subcategoría">
          <i class="fas fa-pencil-alt"></i>
        </button>
        <button class="btn-delete" onclick="destroySubcategory(${subcategory.ID_Sub})" title="Eliminar Subcategoría">
          <i class="fas fa-trash"></i>
        </button>
      </td>`;
    tableBody.appendChild(row);

  } catch (error) {
    console.error("Error:", error);
    alert("Error al buscar la subcategoría: " + error.message);
  }
  document.getElementById("input-busqueda").value = "";
}

// ==========================
// 🔹 3. Carga de Datos Inicial
// ==========================

// 👉 Cargar categorías dinámicamente
function cargarCategorias() {
  fetch("http://localhost:3000/categorias")
    .then(response => response.json())
    .then(data => {
      const categoriaSelect = document.getElementById("categoria");
      categoriaSelect.innerHTML = '<option value="">Seleccione una opción</option>';

      data.forEach(categoria => {
        const option = document.createElement("option");
        option.value = categoria.ID_Categoria;
        option.textContent = categoria.Nombre;
        categoriaSelect.appendChild(option);
      });
    })
    .catch(error => console.error("Error al cargar las categorías:", error));
}

// ==========================
// 🔹 4. Eventos del DOM
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  if (btnGuardar) btnGuardar.addEventListener("click", (e) => { e.preventDefault(); storeSubcategory(); });
  if (btnCancelar) btnCancelar.addEventListener("click", (e) => { e.preventDefault(); cancelEdit(); btnCancelar.style.display = "none"; });
  if (document.getElementById("btn-mostrarElemento")) document.getElementById("btn-mostrarElemento").addEventListener("click", (e) => { e.preventDefault(); allSubcategories(); });
  if (document.getElementById("buscarElemento")) document.getElementById("buscarElemento").addEventListener("click", (e) => { e.preventDefault(); showSubcategory(); });

  btnCancelar.style.display = "none";
  allSubcategories();
  cargarCategorias();
});
