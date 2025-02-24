const API_URL = 'http://localhost:3000'; // Cambia esto a la URL de tu API

async function allArticles() {
    try {
        const response = await fetch(`${API_URL}/articulos`);
        if (!response.ok) throw new Error("No se pudieron cargar los artículos.");

        const responseText = await response.text();  
        console.log(responseText);  
        const articles = JSON.parse(responseText);  

        articles.sort((a, b) => a.ID_Articulo - b.ID_Articulo);
        const tableBody = document.querySelector("#table-usuarios tbody");
        tableBody.innerHTML = ""; // Limpiar tabla

        articles.forEach(article => {
            const row = document.createElement("tr");
            row.innerHTML = `
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
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error:", error);
        alert("Error al cargar los artículos: " + error.message);
    }
}

// Llamar a la función cuando la página cargue
document.addEventListener("DOMContentLoaded", allArticles);
