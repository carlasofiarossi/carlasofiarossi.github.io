// ==========================
// 🔹 1. Constantes y Variables Globales
// ==========================
const API_URL = "http://localhost:3000/paises"; // URL del backend API

const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const inputID = document.getElementById("countryID"); // Input para ID
const inputCountry = document.getElementById("countryName");

let selectedCountryId = null; // Variable para almacenar el ID del país seleccionado

// ==========================
// 🔹 2. Funciones Principales
// ==========================

// 🔍 Obtener el próximo ID disponible
async function getNextCountryID() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("No se pudieron obtener los países.");

    const countries = await response.json();
    inputID.value = countries.length === 0 ? "1" : Math.max(...countries.map(p => p.ID_Pais)) + 1;
  } catch (error) {
    console.error("Error al obtener el próximo ID:", error);
    inputID.value = "Error";
  }
}

// 💼 Guardar o actualizar un país
async function storeCountry() {
  const countryName = inputCountry.value.trim();
  if (!countryName) {
    alert("El nombre del país es obligatorio.");
    return;
  }

  try {
    const requestMethod = selectedCountryId ? "PUT" : "POST";
    const url = selectedCountryId ? `${API_URL}/${selectedCountryId}` : API_URL;
    const bodyData = { ID_Pais: Number(inputID.value), nombre: countryName };

    const response = await fetch(url, {
      method: requestMethod,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) throw new Error(await response.text());

    alert(selectedCountryId ? "País actualizado correctamente." : "País guardado correctamente.");
    cancelEdit();
    allCountries();
  } catch (error) {
    console.error("Error:", error);
    alert("Error al guardar el país: " + error.message);
  }
}

// 🌐 Obtener todos los países
async function allCountries() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("No se pudieron cargar los países.");

    const countries = await response.json();
    const tableBody = document.querySelector("#table-usuarios tbody");
    tableBody.innerHTML = "";

    countries.forEach((pais) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${pais.ID_Pais}</td>
        <td>${pais.Nombre}</td>
        <td>
          <button class="btn-edit" onclick="editCountry(${pais.ID_Pais}, '${pais.Nombre}')" title="Editar País">
            <i class="fas fa-pencil-alt"></i>
          </button>
          <button class="btn-delete" onclick="destroyCountry(${pais.ID_Pais})" title="Eliminar País">
            <i class="fas fa-trash"></i>
          </button>
        </td>`;
      tableBody.appendChild(row);
    });

    getNextCountryID();
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
}

// ✏️ Editar país
function editCountry(id, nombre) {
  inputID.value = id;
  inputCountry.value = nombre;
  selectedCountryId = id;

  btnGuardar.textContent = "Actualizar País";
  btnCancelar.style.display = "inline-block";
}

// ❌ Cancelar edición
function cancelEdit() {
  inputID.value = "";
  inputCountry.value = "";
  selectedCountryId = null;

  btnGuardar.textContent = "Guardar País";
  btnCancelar.style.display = "none";
  getNextCountryID();
}

// ⚠️ Eliminar país
async function destroyCountry(id) {
  if (!confirm("¿Estás seguro de que deseas eliminar este país?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("No se pudo eliminar el país.");

    alert("País eliminado correctamente.");
    allCountries();
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
}

// 📊 Buscar país por ID
async function showCountry() {
  const countryId = document.getElementById("input-busqueda").value.trim();
  if (!countryId) {
    alert("Por favor, ingresa un ID.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${countryId}`);
    if (!response.ok) {
      if (response.status === 404) {
        alert("ERROR: El país buscado no existe.");
        return;
      } else {
        throw new Error(await response.text());
      }
    }

    const country = await response.json();
    const tableBody = document.querySelector("#table-usuarios tbody");
    tableBody.innerHTML = "";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${country.ID_Pais}</td>
      <td>${country.Nombre}</td>
      <td>
        <button class="btn-edit" onclick="editCountry(${country.ID_Pais}, '${country.Nombre}')" title="Editar País">
          <i class="fas fa-pencil-alt"></i>
        </button>
        <button class="btn-delete" onclick="destroyCountry(${country.ID_Pais})" title="Eliminar País">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  } catch (error) {
    console.error("Error:", error);
    alert("Error al buscar el país: " + error.message);
  }
  document.getElementById("input-busqueda").value = "";
}

// ==========================
// 🔹 3. Eventos del DOM
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  if (btnGuardar) btnGuardar.addEventListener("click", (e) => { e.preventDefault(); storeCountry(); });
  if (btnCancelar) btnCancelar.addEventListener("click", (e) => { e.preventDefault(); cancelEdit(); });
  if (document.getElementById("btn-mostrarElemento")) document.getElementById("btn-mostrarElemento").addEventListener("click", (e) => { e.preventDefault(); allCountries(); });
  if (document.getElementById("buscarElemento")) document.getElementById("buscarElemento").addEventListener("click", (e) => { e.preventDefault(); showCountry(); });

  btnCancelar.style.display = "none";
  allCountries();
});
