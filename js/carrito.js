document.addEventListener("DOMContentLoaded", () => {
    renderizarCarrito();

    const btnVaciar = document.getElementById("btnVaciarCarrito");
    if (btnVaciar) {
        btnVaciar.addEventListener("click", vaciarCarrito);
    }

    const btnPagar = document.getElementById("btnPagar");
    if (btnPagar) {
        btnPagar.addEventListener("click", procesarPago);
    }
});

function limpiarPrecio(valor) {
    if (typeof valor === 'number') return isNaN(valor) ? 0 : valor;
    if (!valor) return 0;
    const limpio = String(valor).replace(/[^0-9]/g, '');
    return parseInt(limpio, 10) || 0;
}

function obtenerCarrito() {
    try {
        return JSON.parse(localStorage.getItem("carrito")) || [];
    } catch (e) {
        return [];
    }
}

function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function renderizarCarrito() {
    const carrito = obtenerCarrito();
    const contenedorProductos = document.getElementById("columnaProductos");

    if (!contenedorProductos) return;

    if (carrito.length === 0) {
        contenedorProductos.innerHTML = `
            <div class="py-4">
                <h3 class="fw-bold text-secondary">Tu carrito está vacío</h3>
                <p class="text-muted">Agrega una experiencia para comenzar.</p>
                <a href="reserva.html" class="btn text-white fw-bold px-4 py-2 mt-2" style="background-color: #8da9f2; border: none;">
                    Reservar experiencia
                </a>
            </div>
        `;
        actualizarResumen([]);
        return;
    }

    let html = `<div class="d-flex flex-column gap-3">`;
    carrito.forEach((item, index) => {
        const personas = parseInt(item.personas, 10) || 1;
        const precioUnitario = limpiarPrecio(item.precio);
        const subtotal = limpiarPrecio(item.subtotal) || (precioUnitario * personas);

        html += `
            <div class="card border-0 shadow-sm rounded-4 p-3 d-flex flex-row align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-3">
                    <img src="${item.imagen || 'img/ceramica.jpg'}" alt="${item.nombre}" class="rounded-3" style="width: 80px; height: 80px; object-fit: cover;">
                    <div>
                        <h6 class="fw-bold mb-1">${item.nombre}</h6>
                        <small class="d-block text-muted"><i class="bi bi-calendar-event me-1"></i>Fecha: <strong>${item.fecha}</strong></small>
                        <small class="d-block text-muted"><i class="bi bi-clock me-1"></i>Hora: <strong>${item.hora}</strong></small>
                        <small class="d-block text-muted"><i class="bi bi-people me-1"></i>Asistentes: <strong>${personas}</strong></small>
                    </div>
                </div>
                <div class="text-end">
                    <div class="fw-bold text-primary fs-5 mb-2">$${subtotal.toLocaleString("es-CL")}</div>
                    <button class="btn btn-outline-danger btn-sm rounded-circle" onclick="eliminarDelCarrito(${index})" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    html += `</div>`;

    contenedorProductos.innerHTML = html;
    actualizarResumen(carrito);
}

function actualizarResumen(carrito) {
    const elTotalEventos = document.getElementById("resumenTotalEventos");
    const elTotalPersonas = document.getElementById("resumenTotalPersonas");
    const elFechas = document.getElementById("resumenFechas");
    const elHorarios = document.getElementById("resumenHorarios");
    const elTotalPagar = document.getElementById("resumenTotalPagar");
    const btnPagar = document.getElementById("btnPagar");

    if (carrito.length === 0) {
        if (elTotalEventos) elTotalEventos.textContent = "0";
        if (elTotalPersonas) elTotalPersonas.textContent = "0";
        if (elFechas) elFechas.textContent = "-";
        if (elHorarios) elHorarios.textContent = "-";
        if (elTotalPagar) elTotalPagar.textContent = "$0";
        if (btnPagar) btnPagar.disabled = true;
        return;
    }

    if (btnPagar) btnPagar.disabled = false;

    let totalEventos = carrito.length;
    let totalPersonas = 0;
    let totalMonto = 0;
    let fechasSet = new Set();
    let horariosSet = new Set();

    carrito.forEach(item => {
        const personas = parseInt(item.personas, 10) || 1;
        const precioUnitario = limpiarPrecio(item.precio);
        const subtotal = limpiarPrecio(item.subtotal) || (precioUnitario * personas);

        totalPersonas += personas;
        totalMonto += subtotal;

        if (item.fecha) fechasSet.add(item.fecha);
        if (item.hora) horariosSet.add(item.hora);
    });

    if (elTotalEventos) elTotalEventos.textContent = totalEventos;
    if (elTotalPersonas) elTotalPersonas.textContent = totalPersonas;
    if (elFechas) elFechas.textContent = Array.from(fechasSet).join(", ");
    if (elHorarios) elHorarios.textContent = Array.from(horariosSet).join(", ");
    if (elTotalPagar) elTotalPagar.textContent = `$${totalMonto.toLocaleString("es-CL")}`;
}

function eliminarDelCarrito(index) {
    let carrito = obtenerCarrito();
    carrito.splice(index, 1);
    guardarCarrito(carrito);
    renderizarCarrito();
}

function vaciarCarrito() {
    let carrito = obtenerCarrito();
    if (carrito.length === 0) return;

    if (confirm("¿Estás seguro de que deseas vaciar tu carrito?")) {
        localStorage.removeItem("carrito");
        renderizarCarrito();
    }
}

function procesarPago() {
    let carrito = obtenerCarrito();
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    carrito.forEach(itemCart => {
        const index = productos.findIndex(p => String(p.codigo).toLowerCase() === String(itemCart.codigo).toLowerCase());
        if (index !== -1) {
            productos[index].stock = Math.max(0, productos[index].stock - (parseInt(itemCart.personas, 10) || 1));
        }
    });

    localStorage.setItem("productos", JSON.stringify(productos));
    localStorage.removeItem("carrito");

    alert("¡Pago realizado con éxito! Se ha enviado el resumen de tu reserva a tu correo electrónico.");
    window.location.href = "index.html";
}