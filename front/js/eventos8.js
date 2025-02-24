// ==========================  
// 🔹 1. Constantes y Variables Globales
// ==========================
const API_URL = "http://localhost:3000/tipos"; // URL del backend API
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const inputID = document.getElementById("typeID"); // Input para ID
const inputType = document.getElementById("typeName");
let selectedTypeId = null; // Variable para almacenar el ID del tipo seleccionado

// ==========================
// 🔹 2. Funciones Principales
// ==========================

// 👉 Obtener el próximo ID disponible
async function getNextTypeID() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("No se pudieron obtener los tipos.");

    const types = await response.json();
    inputID.value = types.length === 0 ? "1" : Math.max(...types.map(p => p.ID_Tipo)) + 1;
  } catch (error) {
    console.error("Error al obtener el próximo ID:", error);
    inputID.value = "Error";
  }
}

// 👉 Guardar o actualizar un tipo
async function storeType() {
  const typeName = inputType.value.trim();
  const subcategoryID = parseInt(document.getElementById("subcategoria").value);

  if (!typeName || !subcategoryID) {
    alert("El nombre del tipo y la subcategoría son obligatorios.");
    return;
  }

  try {
    const bodyData = { nombre: typeName, fk_subcategoria: subcategoryID };
    const requestMethod = selectedTypeId ? "PUT" : "POST";
    const url = selectedTypeId ? `${API_URL}/${selectedTypeId}` : API_URL;

    const response = await fetch(url, {
      method: requestMethod,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) throw new Error(await response.text());

    alert(selectedTypeId ? "Tipo actualizado correctamente." : "Tipo guardado correctamente.");
    cancelEdit();
    allTypes();
  } catch (error) {
    console.error("Error:", error);
    alert("Error al guardar el tipo: " + error.message);
  }
}

// 👉 Obtener todos los tipos
async function allTypes() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("No se pudieron cargar los tipos.");

    const types = await response.json();
    const tableBody = document.querySelector("#table-usuarios tbody");
    tableBody.innerHTML = ""; // Limpiar tabla

    types.forEach(type => {
      const row = document.createElement("tr");
      row.innerHTML = 
        `<td>${type.ID_Tipo}</td>
        <td>${type.Nombre}</td>
        <td>${type.Subcategoria}</td>
        <td>
          <button class="btn-edit" onclick="editType(${type.ID_Tipo}, '${type.Nombre}', '${type.Subcategoria}')" title="Editar Tipo">
            <i class="fas fa-pencil-alt"></i>
          </button>
          <button class="btn-delete" onclick="destroyType(${type.ID_Tipo})" title="Eliminar Tipo">
            <i class="fas fa-trash"></i>
          </button>
        </td>`;
      tableBody.appendChild(row);
    });

    getNextTypeID();
  } catch (error) {
   // console.error("Error:", error);
   // alert(error.message);
  }
}

function editType(id, nombre, subcategoriaId) {
  inputID.value = id;
  inputType.value = nombre;
  selectedTypeId = id;

  btnGuardar.textContent = "Actualizar Tipo";
  btnCancelar.style.display = "inline-block";

  // Limpiar el select antes de cargar las subcategorías
  const subcategoriaSelect = document.getElementById("subcategoria");
  subcategoriaSelect.innerHTML = '<option value="">Seleccione una opción</option>';

  // Cargar subcategorías
  fetch("http://localhost:3000/subcategorias")
    .then(response => response.json())
    .then(data => {
      // Añadir las subcategorías al select
      data.forEach(subcategoria => {
        const option = document.createElement("option");
        option.value = subcategoria.ID_Sub; // Valor del option será el ID_Sub
        option.textContent = subcategoria.Nombre; // Texto será el nombre de la subcategoría
        subcategoriaSelect.appendChild(option);
      });

      // Seleccionar la subcategoría correcta por su ID
      subcategoriaSelect.value = subcategoriaId; // Esto selecciona el ID_Sub en el select
    })
    .catch(error => console.error("Error al cargar las subcategorías:", error));
}
// 👉 Cancelar edición
function cancelEdit() {
  inputID.value = "";
  inputType.value = "";
  selectedTypeId = null;

  btnGuardar.textContent = "Guardar Tipo";
  btnCancelar.style.display = "none";
  getNextTypeID();
}

// 👉 Eliminar un tipo
async function destroyType(id) {
  if (!confirm("¿Estás seguro de que deseas eliminar este tipo?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("No se pudo eliminar el tipo.");

    alert("Tipo eliminado correctamente.");
    allTypes();
  } catch (error) {
    console.error("Error:", error);
    alert(error.message);
  }
}

// 👉 Buscar un tipo específico
async function showType() {
  const typeId = document.getElementById("input-busqueda").value.trim();

  if (!typeId) {
    alert("Por favor, ingresa un ID.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${typeId}`);

    if (!response.ok) {
      if (response.status === 404) {
        alert("ERROR: El tipo buscado no existe.");
        return;
      } else {
        throw new Error(await response.text());
      }
    }

    const type = await response.json();
    const tableBody = document.querySelector("#table-usuarios tbody");
    tableBody.innerHTML = ""; // Limpiar tabla

    const row = document.createElement("tr");
    row.innerHTML = 
      `<td>${type.ID_Tipo}</td>
      <td>${type.Nombre}</td>
      <td>${type.Subcategoria}</td>
      <td>
        <button class="btn-edit" onclick="editType(${type.ID_Tipo}, '${type.Nombre}', '${type.Subcategoria}')" title="Editar Tipo">
          <i class="fas fa-pencil-alt"></i>
        </button>
        <button class="btn-delete" onclick="destroyType(${type.ID_Tipo})" title="Eliminar Tipo">
          <i class="fas fa-trash"></i>
        </button>
      </td>`;
    tableBody.appendChild(row);

  } catch (error) {
    console.error("Error:", error);
    alert("Error al buscar el tipo: " + error.message);
  }
  document.getElementById("input-busqueda").value = "";
}

// ==========================
// 🔹 3. Carga de Datos Inicial
// ==========================

// 👉 Cargar subcategorías dinámicamente
// 👉 Cargar subcategorías dinámicamente (esto debe ejecutarse al cargar la página)
function cargarSubcategorias() {
  fetch("http://localhost:3000/subcategorias")
    .then(response => response.json())
    .then(data => {
      const subcategoriaSelect = document.getElementById("subcategoria");
      subcategoriaSelect.innerHTML = '<option value="">Seleccione una opción</option>';

      data.forEach(subcategoria => {
        const option = document.createElement("option");
        option.value = subcategoria.ID_Sub;
        option.textContent = subcategoria.Nombre;
        subcategoriaSelect.appendChild(option);
      });
    })
    .catch(error => console.error("Error al cargar las subcategorías:", error));
}

// ==========================
// 🔹 4. Eventos del DOM
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  if (btnGuardar) btnGuardar.addEventListener("click", (e) => { e.preventDefault(); storeType(); });
  if (btnCancelar) btnCancelar.addEventListener("click", (e) => { e.preventDefault(); cancelEdit(); btnCancelar.style.display = "none"; });
  if (document.getElementById("btn-mostrarElemento")) document.getElementById("btn-mostrarElemento").addEventListener("click", (e) => { e.preventDefault(); allTypes(); });
  if (document.getElementById("buscarElemento")) document.getElementById("buscarElemento").addEventListener("click", (e) => { e.preventDefault(); showType(); });

  btnCancelar.style.display = "none";
  allTypes();
  cargarSubcategorias();
});
