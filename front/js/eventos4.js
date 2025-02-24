// ==========================
// 🔹 1. Constantes y Variables Globales
// ==========================
const API_URL = "http://localhost:3000/pronombres"; // URL del backend API

const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const inputID = document.getElementById("pronounID"); // Input para ID
const inputPronoun = document.getElementById("pronounName");

let selectedPronounId = null; // Variable para almacenar el ID del pronombre seleccionado

// ==========================
// 🔹 2. Funciones Principales
// ==========================

// 🔍 Obtener el próximo ID disponible
async function getNextPronounID() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("No se pudieron obtener los pronombres.");

    const pronouns = await response.json();
    inputID.value = pronouns.length === 0 ? "1" : Math.max(...pronouns.map(p => p.ID_Pronombre)) + 1;
  } catch (error) {
    console.error("Error al obtener el próximo ID:", error);
    inputID.value = "Error";
  }
}

// 💼 Guardar o actualizar un pronombre
async function storePronoun() {
  const pronounName = inputPronoun.value.trim();
  if (!pronounName) {
    alert("El nombre del pronombre es obligatorio.");
    return;
  }

  try {
    const requestMethod = selectedPronounId ? "PUT" : "POST";
    const url = selectedPronounId ? `${API_URL}/${selectedPronounId}` : API_URL;
    const bodyData = { ID_Pronombre: Number(inputID.value), nombre: pronounName };

    const response = await fetch(url, {
      method: requestMethod,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) throw new Error(await response.text());

    alert(selectedPronounId ? "Pronombre actualizado correctamente." : "Pronombre guardado correctamente.");
    cancelEdit();
    allPronouns();
  } catch (error) {
    console.error("Error:", error);
    alert("Error al guardar el pronombre: " + error.message);
  }
}

// 🌐 Obtener todos los pronombres
async function allPronouns() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("No se pudieron cargar los pronombres.");

    const pronouns = await response.json();
    const tableBody = document.querySelector("#table-usuarios tbody");
    tableBody.innerHTML = "";

    pronouns.forEach((pronombre) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${pronombre.ID_Pronombre}</td>
        <td>${pronombre.Nombre}</td>
        <td>
          <button class="btn-edit" onclick="editPronoun(${pronombre.ID_Pronombre}, '${pronombre.Nombre}')" title="Editar Pronombre">
            <i class="fas fa-pencil-alt"></i>
          </button>
          <button class="btn-delete" onclick="destroyPronoun(${pronombre.ID_Pronombre})" title="Eliminar Pronombre">
            <i class="fas fa-trash"></i>
          </button>
        </td>`;
      tableBody.appendChild(row);
    });

    getNextPronounID();
  } catch (error) {
   // console.error("Error:", error);
    //alert(error.message);
  }
}

// ✏️ Editar pronombre
function editPronoun(id, nombre) {
  inputID.value = id;
  inputPronoun.value = nombre;
  selectedPronounId = id;

  btnGuardar.textContent = "Actualizar Pronombre";
  btnCancelar.style.display = "inline-block";
}

// ❌ Cancelar edición
function cancelEdit() {
  inputID.value = "";
  inputPronoun.value = "";
  selectedPronounId = null;

  btnGuardar.textContent = "Guardar Pronombre";
  btnCancelar.style.display = "none";
  getNextPronounID();
}

async function destroyPronoun(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar este pronombre?")) return;
  
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("No se pudo eliminar el pronombre.");
  
      alert("Pronombre eliminado correctamente.");
      allPronouns();
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  }

// 📊 Buscar pronombre por ID
async function showPronoun() {
  const pronounId = document.getElementById("input-busqueda").value.trim();
  if (!pronounId) {
    alert("Por favor, ingresa un ID.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${pronounId}`);
    if (!response.ok) {
      if (response.status === 404) {
        alert("ERROR: El pronombre buscado no existe.");
        return;
      } else {
        throw new Error(await response.text());
      }
    }

    const pronoun = await response.json();
    const tableBody = document.querySelector("#table-usuarios tbody");
    tableBody.innerHTML = "";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${pronoun.ID_Pronombre}</td>
      <td>${pronoun.Nombre}</td>
      <td>
        <button class="btn-edit" onclick="editPronoun(${pronoun.ID_Pronombre}, '${pronoun.Nombre}')" title="Editar pronombre">
          <i class="fas fa-pencil-alt"></i>
        </button>
        <button class="btn-delete" onclick="destroyPronoun(${pronoun.ID_Pronombre})" title="Eliminar pronombre">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  } catch (error) {
    console.error("Error:", error);
    alert("Error al buscar el pronombre: " + error.message);
  }
  document.getElementById("input-busqueda").value = "";
}

// ==========================
// 🔹 3. Eventos del DOM
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  if (btnGuardar) btnGuardar.addEventListener("click", (e) => { e.preventDefault(); storePronoun(); });
  if (btnCancelar) btnCancelar.addEventListener("click", (e) => { e.preventDefault(); cancelEdit(); });
  if (document.getElementById("btn-mostrarElemento")) document.getElementById("btn-mostrarElemento").addEventListener("click", (e) => { e.preventDefault(); allPronouns(); });
  if (document.getElementById("buscarElemento")) document.getElementById("buscarElemento").addEventListener("click", (e) => { e.preventDefault(); showPronoun(); });

  btnCancelar.style.display = "none";
  allPronouns();
});
