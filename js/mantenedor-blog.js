document.addEventListener("DOMContentLoaded", () => {
    inicializarBlogsSemilla();
    cargarBlogsTabla();

    const formBlog = document.getElementById("formBlog");
    if (formBlog) {
        formBlog.addEventListener("submit", guardarBlog);
    }
});

function obtenerBlogs() {
    try {
        return JSON.parse(localStorage.getItem("blogs")) || [];
    } catch (e) {
        return [];
    }
}

function guardarBlogsStorage(blogs) {
    localStorage.setItem("blogs", JSON.stringify(blogs));
}

function actualizarPreviewImagenBlog(ruta) {
    const preview = document.getElementById("blogImgPreview");
    if (preview) {
        preview.src = ruta || "img/trekking.jpg";
    }
}

function abrirModalNuevoBlog() {
    const form = document.getElementById("formBlog");
    if (form) form.reset();

    document.getElementById("blogEsEdicion").value = "false";
    document.getElementById("blogIdOriginal").value = "";
    document.getElementById("modalBlogLabel").innerText = "Nuevo Artículo de Blog";

    // Valores por defecto
    document.getElementById("blogAutor").value = "Admin";
    document.getElementById("blogFecha").value = new Date().toISOString().split("T")[0];
    document.getElementById("blogImagen").value = "img/trekking.jpg";
    actualizarPreviewImagenBlog("img/trekking.jpg");

    const modalEl = document.getElementById("modalBlog");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
}

function editarBlog(id) {
    const blogs = obtenerBlogs();
    const blog = blogs.find(b => String(b.id) === String(id));

    if (!blog) return;

    document.getElementById("blogEsEdicion").value = "true";
    document.getElementById("blogIdOriginal").value = blog.id;

    document.getElementById("blogTitulo").value = blog.titulo;
    document.getElementById("blogCategoria").value = blog.categoria;
    document.getElementById("blogAutor").value = blog.autor;
    document.getElementById("blogFecha").value = blog.fecha;
    document.getElementById("blogEstado").value = blog.estado;
    document.getElementById("blogResumen").value = blog.resumen;
    document.getElementById("blogContenido").value = blog.contenido;

    const rutaImagen = blog.imagen || "img/trekking.jpg";
    document.getElementById("blogImagen").value = rutaImagen;
    actualizarPreviewImagenBlog(rutaImagen);

    document.getElementById("modalBlogLabel").innerText = `Editar Artículo: ${blog.titulo}`;

    const modalEl = document.getElementById("modalBlog");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
}

function guardarBlog(e) {
    e.preventDefault();

    const esEdicion = document.getElementById("blogEsEdicion").value === "true";
    const idOriginal = document.getElementById("blogIdOriginal").value;

    const blogObj = {
        id: esEdicion ? idOriginal : "BLOG-" + Date.now(),
        titulo: document.getElementById("blogTitulo").value.trim(),
        categoria: document.getElementById("blogCategoria").value,
        autor: document.getElementById("blogAutor").value.trim(),
        fecha: document.getElementById("blogFecha").value,
        estado: document.getElementById("blogEstado").value,
        imagen: document.getElementById("blogImagen").value,
        resumen: document.getElementById("blogResumen").value.trim(),
        contenido: document.getElementById("blogContenido").value.trim()
    };

    let blogs = obtenerBlogs();

    if (esEdicion) {
        const idx = blogs.findIndex(b => String(b.id) === String(idOriginal));
        if (idx !== -1) blogs[idx] = blogObj;
    } else {
        blogs.unshift(blogObj);
    }

    guardarBlogsStorage(blogs);
    cargarBlogsTabla();

    const modalEl = document.getElementById("modalBlog");
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    alert(esEdicion ? "Artículo actualizado correctamente." : "Artículo publicado con éxito.");
}

function cargarBlogsTabla() {
    const blogs = obtenerBlogs();
    const tbody = document.getElementById("tablaBlogsBody");
    if (!tbody) return;

    tbody.innerHTML = "";
    if (blogs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No hay artículos registrados en el blog.</td></tr>`;
        return;
    }

    blogs.forEach(b => {
        const esPublicado = b.estado === "Publicado";
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><img src="${b.imagen || 'img/trekking.jpg'}" style="width: 50px; height: 35px; object-fit: cover; border-radius: 4px;" alt="${b.titulo}"></td>
            <td class="fw-bold">${b.titulo}</td>
            <td><span class="badge bg-secondary">${b.categoria}</span></td>
            <td>${b.autor}</td>
            <td>${b.fecha}</td>
            <td><span class="badge ${esPublicado ? 'bg-success' : 'bg-warning text-dark'}">${b.estado}</span></td>
            <td class="text-end">
                <button type="button" class="btn btn-sm btn-outline-primary me-1" onclick="editarBlog('${b.id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="eliminarBlog('${b.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function eliminarBlog(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este artículo de blog?")) {
        let blogs = obtenerBlogs();
        blogs = blogs.filter(b => String(b.id) !== String(id));
        guardarBlogsStorage(blogs);
        cargarBlogsTabla();
    }
}

function inicializarBlogsSemilla() {
    if (!localStorage.getItem("blogs")) {
        const semilla = [
            {
                id: "BLOG-001",
                titulo: "Los 5 mejores lugares para hacer Kayak en la zona central",
                categoria: "Aventura",
                autor: "Equipo ExperienciaYa",
                fecha: "2026-08-10",
                estado: "Publicado",
                imagen: "img/kayak.jpg",
                resumen: "Descubre las rutas acuáticas más impresionantes cerca de Santiago para disfrutar un fin de semana épico.",
                contenido: "El kayak es una de las actividades más apasionantes para reconectar con la naturaleza..."
            },
            {
                id: "BLOG-002",
                titulo: "Guía de maridaje: Vinos y gastronomía local",
                categoria: "Gastronomía",
                autor: "Sommelier Invitado",
                fecha: "2026-08-25",
                estado: "Publicado",
                imagen: "img/fondo2.jpg",
                resumen: "Aprende los secretos básicos para combinar cepas tintas y blancas con platillos tradicionales.",
                contenido: "El maridaje no tiene por qué ser complicado. En este artículo te enseñamos las reglas de oro..."
            }
        ];
        guardarBlogsStorage(semilla);
    }
}