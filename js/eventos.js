 // Código JavaScript para manejar los eventos y la lógica de los productos

 let products = []; // Lista de productos
 let nextId = 1; // ID inicial para el autoincremento

 const form = document.querySelector(".form_task"); // Formulario
 const productName = document.querySelector("#productName"); // Input de nombre
 const productDescription = document.querySelector("#productDescription"); // Input de descripción
 const productBrand = document.querySelector("#productBrand"); // Input de marca
 const productList = document.querySelector("#taskList"); // Lista de productos

 // Función para renderizar los productos en el HTML
 const renderProducts = () => {
  productList.innerHTML = ""; // Borrar toda la información del ul
  products.forEach((product) => {
    const html = `
      <li data-id="${product.id}" class="tasks__item">
        <p>${product.id}</p>
        <p class="${product.completa ? 'done' : ''}">${product.name}</p>
        <p class="${product.completa ? 'done' : ''}">${product.description}</p>
        <p class="${product.completa ? 'done' : ''}">${product.brand}</p>
        <div>
          <i class="bx bx-check"></i>
          <i class="bx bx-trash"></i>
        </div>
      </li>
    `;
    productList.innerHTML += html;
  });
};

 form.addEventListener("submit", async (event) => {
   event.preventDefault();

   // Tomar los valores de los inputs
   const name = productName.value.trim();
   const description = productDescription.value.trim();
   const brand = productBrand.value.trim();

   let erroresValidacion = false;

   // Validaciones básicas
   if (name.length < 3 || description.length < 3 || brand.length < 3) {
     erroresValidacion = true;
     const error = document.querySelector(".error");
     error.textContent = "Todos los campos son obligatorios y la descripción debe tener al menos 5 caracteres.";

     setTimeout(() => {
       error.textContent = "";
     }, 4000); // 4.000 milisegundos
   }

   if (!erroresValidacion) {
     // Crear un nuevo objeto producto con ID autoincremental
     const product = {
       id: nextId++, // Incrementa el ID cada vez que se agrega un producto
       name: name,
       description: description,
       brand: brand,
       completa: false,
     };

     // Agregar el producto a la lista
     products.push(product);
     console.log(products);

     // Almacenar los productos en el localStorage
     localStorage.setItem("products", JSON.stringify(products));

     // Limpiar los campos de entrada
     productName.value = "";
     productDescription.value = "";
     productBrand.value = "";

     // Renderizar productos
     renderProducts();
   }
 });

 // Recuperar los productos almacenados en localStorage
 document.addEventListener("DOMContentLoaded", () => {
   products = JSON.parse(localStorage.getItem("products")) || [];
   // Si hay productos en localStorage, encontrar el ID más alto y ajustarlo para el próximo ID
   if (products.length > 0) {
     nextId = Math.max(...products.map((product) => product.id)) + 1;
   }
   renderProducts();
 });

 // Evento para marcar un producto como completo o eliminarlo
 productList.addEventListener("click", (event) => {
   if (event.target.classList.contains("bx-check")) {
     const id = event.target.closest("li").dataset.id;
     const product = products.find((product) => product.id == id);

     // Cambiar el estado de la tarea y actualizar la vista
     product.completa = !product.completa;

     renderProducts();
     localStorage.setItem("products", JSON.stringify(products));
   }

   if (event.target.classList.contains("bx-trash")) {
     const id = event.target.closest("li").dataset.id;
     const productIndex = products.findIndex((product) => product.id == id);

     products.splice(productIndex, 1);

     localStorage.setItem("products", JSON.stringify(products));
     event.target.closest("li").remove();
   }
 });