document.addEventListener("DOMContentLoaded", () => {
    cargarBlogsPublicos();
});

function obtenerBlogs() {
    try {
        return JSON.parse(localStorage.getItem("blogs")) || [];
    } catch (e) {
        return [];
    }
}

function cargarBlogsPublicos() {
    const contenedor = document.getElementById("contenedorBlogsPublico");
    if (!contenedor) return;

    const blogs = obtenerBlogs().filter(b => b.estado === "Publicado");

    if (blogs.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center py-5">
                <h4 class="text-muted">No hay publicaciones disponibles por el momento.</h4>
            </div>
        `;
        return;
    }

    let html = "";
    blogs.forEach(blog => {
        html += `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                    <img src="${blog.imagen || 'img/trekking.jpg'}" class="card-img-top" alt="${blog.titulo}" style="height: 200px; object-fit: cover;">
                    <div class="card-body d-flex flex-column p-4">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge bg-primary-subtle text-primary fw-semibold">${blog.categoria}</span>
                            <small class="text-muted"><i class="bi bi-calendar3 me-1"></i>${blog.fecha}</small>
                        </div>
                        <h5 class="card-title fw-bold mb-2">${blog.titulo}</h5>
                        <p class="card-text text-muted small flex-grow-1">${blog.resumen}</p>
                        <div class="pt-3 border-top d-flex justify-content-between align-items-center mt-3">
                            <small class="text-muted">Por: <strong>${blog.autor}</strong></small>
                            <button class="btn btn-sm text-white rounded-3 px-3" style="background-color: #8da9f2;" onclick="verBlogDetalle('${blog.id}')">
                                Leer más
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = html;
}

function verBlogDetalle(id) {
    const blogs = obtenerBlogs();
    const blog = blogs.find(b => String(b.id) === String(id));

    if (!blog) return;

    document.getElementById("modalBlogCategoria").textContent = blog.categoria || "General";
    document.getElementById("modalBlogFecha").textContent = blog.fecha || "";
    document.getElementById("modalBlogTitulo").textContent = blog.titulo || "";
    document.getElementById("modalBlogAutor").textContent = blog.autor || "Redacción";
    document.getElementById("modalBlogImagen").src = blog.imagen || "img/trekking.jpg";
    document.getElementById("modalBlogResumen").textContent = blog.resumen || "";
    document.getElementById("modalBlogContenido").textContent = blog.contenido || "";

    const modalEl = document.getElementById("modalVerBlog");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
}