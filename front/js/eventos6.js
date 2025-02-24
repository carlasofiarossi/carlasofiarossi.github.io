// ========================== 
// 🔹 1. Constantes y Variables Globales
// ==========================
const API_URL = "http://localhost:3000/categorias"; // URL del backend API

const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const inputID = document.getElementById("categoryID"); // Input para ID
const inputCategory = document.getElementById("categoryName");

let selectedCategoryId = null; // Variable para almacenar el ID de la categoria seleccionada

// ==========================
// 🔹 2. Funciones Principales
// ==========================

// 🔍 Obtener el próximo ID disponible
async function getNextCategoryID() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("No se pudieron obtener las categorias.");

    const categories = await response.json();
    inputID.value = categories.length === 0 ? "1" : Math.max(...categories.map(c => c.ID_Categoria)) + 1;
  } catch (error) {
    console.error("Error al obtener el próximo ID:", error);
    inputID.value = "Error";
  }
}

// 💼 Guardar o actualizar una categoria
async function storeCategory() {
  const categoryName = inputCategory.value.trim();
  if (!categoryName) {
    alert("El nombre de la categoria es obligatorio.");
    return;
  }

  try {
    const requestMethod = selectedCategoryId ? "PUT" : "POST";
    const url = selectedCategoryId ? `${API_URL}/${selectedCategoryId}` : API_URL;
    const bodyData = { ID_Categoria: Number(inputID.value), nombre: categoryName };

    const response = await fetch(url, {
      method: requestMethod,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) throw new Error(await response.text());

    alert(selectedCategoryId ? "Categoria actualizada correctamente." : "Categoria guardada correctamente.");
    cancelEdit();
    allCategories();
  } catch (error) {
    console.error("Error:", error);
    alert("Error al guardar la categoria: " + error.message);
  }
}

// 🌐 Obtener todas las categorias
async function allCategories() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("No se pudieron cargar las categorias.");

    const categories = await response.json();
    const tableBody = document.querySelector("#table-usuarios tbody");
    tableBody.innerHTML = "";

    categories.forEach((category) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${category.ID_Categoria}</td>
        <td>${category.Nombre}</td>
        <td>
          <button class="btn-edit" onclick="editCategory(${category.ID_Categoria}, '${category.Nombre}')" title="Editar Categoria">
            <i class="fas fa-pencil-alt"></i>
          </button>
          <button class="btn-delete" onclick="destroyCategory(${category.ID_Categoria})" title="Eliminar Categoria">
            <i class="fas fa-trash"></i>
          </button>
        </td>`;
      tableBody.appendChild(row);
    });

    getNextCategoryID();
  } catch (error) {
   // console.error("Error:", error);
    //alert(error.message);
  }
}

// ✏️ Editar categoria
function editCategory(id, nombre) {
  inputID.value = id;
  inputCategory.value = nombre;
  selectedCategoryId = id;

  btnGuardar.textContent = "Actualizar Categoria";
  btnCancelar.style.display = "inline-block";
}

// ❌ Cancelar edición
function cancelEdit() {
  inputID.value = "";
  inputCategory.value = "";
  selectedCategoryId = null;

  btnGuardar.textContent = "Guardar Categoria";
  btnCancelar.style.display = "none";
  getNextCategoryID();
}

async function destroyCategory(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta categoria?")) return;
  
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("No se pudo eliminar la categoria.");
  
      alert("Categoria eliminada correctamente.");
      allCategories();
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  }

// 📊 Buscar categoria por ID
async function showCategory() {
  const categoryId = document.getElementById("input-busqueda").value.trim();
  if (!categoryId) {
    alert("Por favor, ingresa un ID.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${categoryId}`);
    if (!response.ok) {
      if (response.status === 404) {
        alert("ERROR: La categoria buscada no existe.");
        return;
      } else {
        throw new Error(await response.text());
      }
    }

    const category = await response.json();
    const tableBody = document.querySelector("#table-usuarios tbody");
    tableBody.innerHTML = "";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${category.ID_Categoria}</td>
      <td>${category.Nombre}</td>
      <td>
        <button class="btn-edit" onclick="editCategory(${category.ID_Categoria}, '${category.Nombre}')" title="Editar categoria">
          <i class="fas fa-pencil-alt"></i>
        </button>
        <button class="btn-delete" onclick="destroyCategory(${category.ID_Categoria})" title="Eliminar categoria">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  } catch (error) {
    console.error("Error:", error);
    alert("Error al buscar la categoria: " + error.message);
  }
  document.getElementById("input-busqueda").value = "";
}

// ==========================
// 🔹 3. Eventos del DOM
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  if (btnGuardar) btnGuardar.addEventListener("click", (e) => { e.preventDefault(); storeCategory(); });
  if (btnCancelar) btnCancelar.addEventListener("click", (e) => { e.preventDefault(); cancelEdit(); });
  if (document.getElementById("btn-mostrarElemento")) document.getElementById("btn-mostrarElemento").addEventListener("click", (e) => { e.preventDefault(); allCategories(); });
  if (document.getElementById("buscarElemento")) document.getElementById("buscarElemento").addEventListener("click", (e) => { e.preventDefault(); showCategory(); });

  btnCancelar.style.display = "none";
  allCategories();
});
