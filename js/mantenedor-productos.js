document.addEventListener("DOMContentLoaded", () => {
    inicializarProductosSemilla();
    cargarProductosTabla();
    const formProducto = document.getElementById("formProducto");
    if (formProducto) {
        formProducto.addEventListener("submit", guardarProducto);
    }
});
function actualizarPreviewImagen(ruta) {
    const preview = document.getElementById("modalImgPreview");
    if (preview) {
        preview.src = ruta || "img/ceramica.jpg";
    }
}
function abrirModalNuevo() {
    const form = document.getElementById("formProducto");
    if (form) form.reset();
    document.getElementById("esEdicion").value = "false";
    document.getElementById("prodCodigoOriginal").value = "";
    document.getElementById("prodCodigo").disabled = false;
    document.getElementById("modalProductoLabel").innerText = "Nuevo Producto";
    // Valores predeterminados
    document.getElementById("prodImagen").value = "img/ceramica.jpg";
    document.getElementById("prodFechas").value = "2026-10-15, 2026-10-20, 2026-11-01";
    document.getElementById("prodHorarios").value = "10:00, 12:30, 16:00";
    document.getElementById("prodMinPersonas").value = "1";
    document.getElementById("prodMaxPersonas").value = "10";
    actualizarPreviewImagen("img/ceramica.jpg");
    const modalEl = document.getElementById("modalProducto");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
}
function editarProducto(codigo) {
    const productos = obtenerProductos();
    const prod = productos.find(p => String(p.codigo).toLowerCase() === String(codigo).toLowerCase());
    if (!prod) return;
    document.getElementById("esEdicion").value = "true";
    document.getElementById("prodCodigoOriginal").value = prod.codigo;
    document.getElementById("prodCodigo").value = prod.codigo;
    document.getElementById("prodCodigo").disabled = true;
    document.getElementById("prodNombre").value = prod.nombre;
    document.getElementById("prodCategoria").value = prod.categoria;
    document.getElementById("prodPrecio").value = prod.precio;
    document.getElementById("prodStock").value = prod.stock;
    document.getElementById("prodStockCritico").value = prod.stockCritico || "";
    document.getElementById("prodDescripcion").value = prod.descripcion || "";
    // Carga de fechas, horarios y personas
    document.getElementById("prodFechas").value = prod.fechas || "2026-10-15, 2026-10-20";
    document.getElementById("prodHorarios").value = prod.horarios || "10:00, 12:00, 16:00";
    document.getElementById("prodMinPersonas").value = prod.minPersonas || 1;
    document.getElementById("prodMaxPersonas").value = prod.maxPersonas || 10;
    const rutaImagen = prod.imagen || "img/ceramica.jpg";
    document.getElementById("prodImagen").value = rutaImagen;
    actualizarPreviewImagen(rutaImagen);
    document.getElementById("modalProductoLabel").innerText = `Editar Producto: ${prod.nombre}`;
    const modalEl = document.getElementById("modalProducto");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
}
function guardarProducto(e) {
    e.preventDefault();
    const esEdicion = document.getElementById("esEdicion").value === "true";
    const codigoOriginal = document.getElementById("prodCodigoOriginal").value;
    const productoGuardar = {
        codigo: document.getElementById("prodCodigo").value.trim(),
        nombre: document.getElementById("prodNombre").value.trim(),
        categoria: document.getElementById("prodCategoria").value,
        precio: parseFloat(document.getElementById("prodPrecio").value) || 0,
        stock: parseInt(document.getElementById("prodStock").value, 10) || 0,
        stockCritico: document.getElementById("prodStockCritico").value
            ? parseInt(document.getElementById("prodStockCritico").value, 10)
            : 0,
        fechas: document.getElementById("prodFechas").value.trim(),
        horarios: document.getElementById("prodHorarios").value.trim(),
        minPersonas: parseInt(document.getElementById("prodMinPersonas").value, 10) || 1,
        maxPersonas: parseInt(document.getElementById("prodMaxPersonas").value, 10) || 10,
        imagen: document.getElementById("prodImagen").value,
        descripcion: document.getElementById("prodDescripcion").value.trim()
    };
    let productos = obtenerProductos();
    if (esEdicion) {
        const index = productos.findIndex(
            p => String(p.codigo).toLowerCase() === String(codigoOriginal).toLowerCase()
        );

        if (index !== -1) {
            productos[index] = productoGuardar;
        }
    } else {
        if (
            productos.some(
                p => String(p.codigo).toLowerCase() === productoGuardar.codigo.toLowerCase()
            )
        ) {
            alert("El código del producto ya existe.");
            return;
        }
        productos.push(productoGuardar);
    }
    localStorage.setItem("productos", JSON.stringify(productos));
    cargarProductosTabla();
    const modalEl = document.getElementById("modalProducto");
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
    alert(
        esEdicion
            ? "Producto actualizado correctamente."
            : "Producto registrado exitosamente."
    );
}
function obtenerProductos() {
    return JSON.parse(localStorage.getItem("productos")) || [];
}
function inicializarProductosSemilla() {
    if (!localStorage.getItem("productos")) {
        const semilla = [
            {
                codigo: "EXP-001",
                nombre: "Rafting en el Cajón del Maipo",
                categoria: "Aventura",
                precio: 35000,
                stock: 15,
                stockCritico: 3,
                fechas: "2026-10-15, 2026-10-22, 2026-11-05",
                horarios: "10:00, 14:00, 17:00",
                minPersonas: 1,
                maxPersonas: 8,
                imagen: "img/kayak.jpg",
                descripcion: "Descenso guiado por el río Maipo, ideal para disfrutar de la aventura y los paisajes cordilleranos."
            },
            {
                codigo: "EXP-002",
                nombre: "Cata de Vinos en Valle de Colchagua",
                categoria: "Gastronomía",
                precio: 45000,
                stock: 5,
                stockCritico: 2,
                fechas: "2026-10-18, 2026-10-25, 2026-11-08",
                horarios: "11:00, 16:00",
                minPersonas: 2,
                maxPersonas: 6,
                imagen: "img/fondo2.jpg",
                descripcion: "Degustación de vinos seleccionados y recorrido por una tradicional viña del Valle de Colchagua."
            },
            {
                codigo: "EXP-003",
                nombre: "Trekking en Parque Nacional Torres del Paine",
                categoria: "Naturaleza",
                precio: 65000,
                stock: 10,
                stockCritico: 3,
                fechas: "2026-10-20, 2026-10-27, 2026-11-10",
                horarios: "08:00, 09:30",
                minPersonas: 1,
                maxPersonas: 10,
                imagen: "img/torres-paine.jpg",
                descripcion: "Caminata guiada por senderos naturales con increíbles vistas de la Patagonia chilena."
            },
            {
                codigo: "EXP-004",
                nombre: "Tour Cultural por Valparaíso",
                categoria: "Cultura",
                precio: 30000,
                stock: 12,
                stockCritico: 3,
                fechas: "2026-10-16, 2026-10-23, 2026-11-06",
                horarios: "10:00, 14:30, 17:00",
                minPersonas: 1,
                maxPersonas: 12,
                imagen: "img/valparaiso.jpg",
                descripcion: "Recorrido por los cerros, miradores, ascensores y principales atractivos culturales de Valparaíso."
            },
            {
                codigo: "EXP-005",
                nombre: "Kayak y Naturaleza en Pucón",
                categoria: "Aventura",
                precio: 55000,
                stock: 8,
                stockCritico: 2,
                fechas: "2026-10-19, 2026-10-26, 2026-11-09",
                horarios: "09:00, 13:00, 16:00",
                minPersonas: 1,
                maxPersonas: 8,
                imagen: "img/kayak-pucon.jpg",
                descripcion: "Experiencia de kayak rodeada de naturaleza, lagos y paisajes de la zona de Pucón."
            }
        ];
        localStorage.setItem("productos", JSON.stringify(semilla));
    }
}
function cargarProductosTabla() {
    const productos = obtenerProductos();
    const tbody = document.getElementById("tablaProductosBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    if (productos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted py-4">
                    No hay productos registrados.
                </td>
            </tr>
        `;
        return;
    }
    productos.forEach(p => {
        const esCritico = p.stock <= (p.stockCritico || 0);
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${p.codigo}</strong></td>
            <td>
                <img 
                    src="${p.imagen || 'img/ceramica.jpg'}" 
                    class="img-preview-tabla" 
                    alt="${p.nombre}"
                >
            </td>
            <td>${p.nombre}</td>
            <td>
                <span class="badge bg-info text-dark">
                    ${p.categoria}
                </span>
            </td>
            <td>
                $${Number(p.precio).toLocaleString("es-CL")}
            </td>
            <td>${p.stock}</td>
            <td>
                ${
                    esCritico
                        ? `<span class="badge-critico">Alerta (${p.stockCritico})</span>`
                        : (p.stockCritico || '-')
                }
            </td>
            <td class="text-end">
                <button 
                    type="button" 
                    class="btn btn-sm btn-outline-primary me-1" 
                    onclick="editarProducto('${p.codigo}')"
                >
                    <i class="bi bi-pencil"></i>
                </button>

                <button 
                    type="button" 
                    class="btn btn-sm btn-outline-danger" 
                    onclick="eliminarProducto('${p.codigo}')"
                >
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}
function eliminarProducto(codigo) {
    if (confirm(`¿Eliminar producto con código ${codigo}?`)) {
        let productos = obtenerProductos();

        productos = productos.filter(
            p => String(p.codigo).toLowerCase() !== String(codigo).toLowerCase()
        );
        localStorage.setItem("productos", JSON.stringify(productos));
        cargarProductosTabla();
    }
}
