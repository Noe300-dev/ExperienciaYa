document.addEventListener("DOMContentLoaded", () => {
    renderizarExperiencias();

    // Sincronización en tiempo real entre pestañas (Admin y Cliente)
    window.addEventListener("storage", (e) => {
        if (e.key === "productos") {
            renderizarExperiencias();
        }
    });
});

function renderizarExperiencias() {
    const contenedorSlides = document.getElementById("carouselInner");
    const contenedorIndicadores = document.getElementById("carouselIndicators");

    if (!contenedorSlides || !contenedorIndicadores) return;

    // Obtener experiencias guardadas por el mantenedor
    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    // Limpiar contenido previo
    contenedorSlides.innerHTML = "";
    contenedorIndicadores.innerHTML = "";

    // Si la base de datos está vacía
    if (productos.length === 0) {
        contenedorSlides.innerHTML = `
            <div class="carousel-item active">
                <div class="text-center text-white py-5">
                    <h3>No hay experiencias disponibles en este momento.</h3>
                    <p>Pronto agregaremos nuevas actividades.</p>
                </div>
            </div>`;
        return;
    }
    // Generar slides e indicadores dinámicamente
    productos.forEach((prod, index) => {
        const esActivo = index === 0;
        // 1. Indicador del Carrusel
        const indicador = document.createElement("button");
        indicador.type = "button";
        indicador.dataset.bsTarget = "#carouselExampleCaptions";
        indicador.dataset.bsSlideTo = index;
        indicador.ariaLabel = `Slide ${index + 1}`;
        if (esActivo) {
            indicador.classList.add("active");
            indicador.ariaCurrent = "true";
        }
        contenedorIndicadores.appendChild(indicador);
        // Formato de precio y datos opcionales
        const precioTexto = Number(prod.precio) === 0 ? "GRATIS" : `$${Number(prod.precio).toLocaleString("es-CL")}`;
        const imagenRuta = prod.imagen && prod.imagen.trim() !== "" ? prod.imagen : "img/fondoindex.jpg";
        // 2. Slide del Carrusel
        const slide = document.createElement("div");
        slide.className = `carousel-item ${esActivo ? "active" : ""}`;
        slide.innerHTML = `
            <div class="d-flex justify-content-center">
                <article class="tarjeta-experiencia-slide">
                    <img src="${imagenRuta}" alt="${prod.nombre}" class="imagen-experiencia" onerror="this.src='img/fondoindex.jpg'">
                    <div class="contenido-tarjeta">
                        <span class="etiqueta">${prod.categoria || "Aventura"}</span>
                        <h3>${prod.nombre}</h3>
                        <p>${prod.descripcion || "Disfruta de esta experiencia única e inolvidable."}</p>
                        
                        <ul class="detalles-experiencia">
                            <li><i class="bi bi-tag"></i> Código: <strong>${prod.codigo}</strong></li>
                            <li><i class="bi bi-people"></i> Cupos / Stock: <strong>${prod.stock}</strong></li>
                        </ul>

                        <p class="precio-experiencia">${precioTexto}</p>
                        <a href="reserva.html?codigo=${encodeURIComponent(prod.codigo)}" 
                           class="boton boton-principal boton-reservar" 
                           data-experiencia="${prod.nombre}" 
                           data-precio="${prod.precio}" 
                           data-max="${prod.stock}">
                           Reservar
                        </a>
                    </div>
                </article>
            </div>
        `;

        contenedorSlides.appendChild(slide);
    });
}