async function cargarDescripcion() {
    try {
        // Obtener categorías y marcas desde la API
        const categoriasResponse = await fetch('http://localhost:3000/categorias');
        const marcasResponse = await fetch('http://localhost:3000/marcas');

        const categorias = await categoriasResponse.json();
        const marcas = await marcasResponse.json();

        // Generar la descripción dinámica
        const descripcion = `Mekumi, tu tienda especializada en productos de belleza.
Nos dedicamos a ofrecerte lo mejor en maquillaje y fragancias, con una cuidada selección de marcas reconocidas en el mercado.
Explora nuestra amplia gama de categorías, que incluyen: ${categorias.map(c => c.Nombre).join(", ")}.
Trabajamos con marcas de prestigio como ${marcas.map(m => m.Nombre).join(", ")}, asegurando calidad y variedad en cada producto que ofrecemos.`;

        // Insertar la descripción en el HTML
        document.getElementById("descripcion").textContent = descripcion;

    } catch (error) {
        console.error("Error al cargar la descripción:", error);
    }
}

// Llamar a la función cuando cargue la página
document.addEventListener("DOMContentLoaded", cargarDescripcion);