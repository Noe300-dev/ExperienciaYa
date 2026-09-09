document.addEventListener("DOMContentLoaded", () => {
    cargarTarjetasProductos();
    poblarSelectExperiencias();

    // Eventos de cambio para actualizar precio y límite de cupos
    const selectExp = document.getElementById("reservaExperiencia");
    const inputPersonas = document.getElementById("reservaCantidadPersonas");

    if (selectExp) {
        selectExp.addEventListener("change", actualizarDetallesReserva);
    }
    if (inputPersonas) {
        inputPersonas.addEventListener("input", actualizarDetallesReserva);
    }
});

// 1. Obtener productos cargados por el Admin desde localStorage
function obtenerProductosLocalStorage() {
    try {
        return JSON.parse(localStorage.getItem("productos")) || [];
    } catch (e) {
        console.error("Error al leer productos:", e);
        return [];
    }
}

// 2. Renderizar Tarjetas de Experiencias en la Tienda
function cargarTarjetasProductos() {
    const contenedor = document.getElementById("contenedorTarjetasProductos");
    if (!contenedor) return;

    const productos = obtenerProductosLocalStorage();
    contenedor.innerHTML = "";

    if (productos.length === 0) {
        contenedor.innerHTML = `<div class="col-12 text-center text-muted py-5">No hay experiencias disponibles por el momento.</div>`;
        return;
    }

    productos.forEach(p => {
        const agotado = p.stock <= 0;
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";

        col.innerHTML = `
            <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                <img src="${p.imagen || 'img/ceramica.jpg'}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${p.nombre}">
                <div class="card-body d-flex flex-column p-4">
                    <span class="badge bg-primary-subtle text-primary fw-bold mb-2 align-self-start px-3 py-2 rounded-pill">${p.categoria}</span>
                    <h5 class="card-title text-dark fw-bold">${p.nombre}</h5>
                    <p class="card-text text-muted small flex-grow-1">${p.descripcion || 'Sin descripción disponible.'}</p>
                    
                    <div class="d-flex align-items-center gap-2 text-muted small mb-2">
                        <i class="bi bi-tag"></i> <span>Código: <strong>${p.codigo}</strong></span>
                    </div>
                    <div class="d-flex align-items-center gap-2 text-muted small mb-3">
                        <i class="bi bi-people"></i> <span>Cupos / Stock: <strong>${p.stock}</strong></span>
                    </div>

                    <div class="d-flex align-items-center justify-content-between mt-auto">
                        <span class="fs-4 fw-bold text-primary">$${Number(p.precio).toLocaleString("es-CL")}</span>
                        <button class="btn btn-primary px-4 rounded-pill ${agotado ? 'disabled' : ''}" 
                                onclick="irAReservar('${p.codigo}')">
                            ${agotado ? 'Agotado' : 'Reservar'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(col);
    });
}

// 3. Poblar el <select> del Formulario de Reserva
function poblarSelectExperiencias() {
    const select = document.getElementById("reservaExperiencia");
    if (!select) return;

    const productos = obtenerProductosLocalStorage();
    select.innerHTML = `<option value="">Selecciona una experiencia...</option>`;

    productos.forEach(p => {
        const option = document.createElement("option");
        option.value = p.codigo;
        option.textContent = `${p.nombre} ${p.stock <= 0 ? '(Agotado)' : ''}`;
        if (p.stock <= 0) option.disabled = true;
        select.appendChild(option);
    });
}

// 4. Seleccionar un producto automáticamente al presionar "Reservar" en una tarjeta
function irAReservar(codigoProducto) {
    const select = document.getElementById("reservaExperiencia");
    const seccionFormulario = document.getElementById("seccionFormularioReserva");

    if (select) {
        select.value = codigoProducto;
        actualizarDetallesReserva();
    }

    if (seccionFormulario) {
        seccionFormulario.scrollIntoView({ behavior: "smooth" });
    }
}

// 5. Actualizar Precio por Persona, Máximo de Cupos y Total en el Formulario
function actualizarDetallesReserva() {
    const selectExp = document.getElementById("reservaExperiencia");
    const inputPersonas = document.getElementById("reservaCantidadPersonas");
    const txtPrecioPersona = document.getElementById("reservaPrecioPersona");
    const txtStockDisponible = document.getElementById("reservaStockDisponible");

    if (!selectExp || !selectExp.value) {
        if (txtPrecioPersona) txtPrecioPersona.innerText = "$0";
        if (txtStockDisponible) txtStockDisponible.innerText = "";
        return;
    }

    const productos = obtenerProductosLocalStorage();
    const prod = productos.find(p => String(p.codigo).toLowerCase() === String(selectExp.value).toLowerCase());

    if (prod) {
        if (txtPrecioPersona) {
            txtPrecioPersona.innerText = `$${Number(prod.precio).toLocaleString("es-CL")}`;
        }
        if (txtStockDisponible) {
            txtStockDisponible.innerText = `(Cupos disponibles: ${prod.stock})`;
        }
        if (inputPersonas) {
            inputPersonas.max = prod.stock;
            if (parseInt(inputPersonas.value) > prod.stock) {
                inputPersonas.value = prod.stock;
            }
        }
    }
}

// 6. Confirmar Reserva y Descontar Stock en LocalStorage
function confirmarReserva(e) {
    if (e) e.preventDefault();

    const selectExp = document.getElementById("reservaExperiencia");
    const inputFecha = document.getElementById("reservaFecha");
    const inputHora = document.getElementById("reservaHora");
    const inputPersonas = document.getElementById("reservaCantidadPersonas");

    if (!selectExp.value || !inputFecha.value || !inputHora.value || !inputPersonas.value) {
        alert("Por favor completa todos los campos para realizar la reserva.");
        return;
    }

    const personas = parseInt(inputPersonas.value, 10);
    if (isNaN(personas) || personas <= 0) {
        alert("Ingresa una cantidad válida de personas.");
        return;
    }

    let productos = obtenerProductosLocalStorage();
    const index = productos.findIndex(p => String(p.codigo).toLowerCase() === String(selectExp.value).toLowerCase());

    if (index === -1) {
        alert("El producto seleccionado no existe.");
        return;
    }

    if (productos[index].stock < personas) {
        alert(`No hay suficientes cupos. Solo quedan ${productos[index].stock} disponibles.`);
        return;
    }

    // Descontar cupos en tiempo real
    productos[index].stock -= personas;
    localStorage.setItem("productos", JSON.stringify(productos));

    alert(`¡Reserva confirmada con éxito para "${productos[index].nombre}"!`);

    // Resetear formulario y refrescar interfaz
    document.getElementById("formReserva").reset();
    cargarTarjetasProductos();
    poblarSelectExperiencias();
    actualizarDetallesReserva();
}