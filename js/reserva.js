document.addEventListener("DOMContentLoaded", () => {
    cargarExperienciasSelect();

    const form = document.getElementById("formularioReserva");
    const selectExp = document.getElementById("experiencia");
    const inputPersonas = document.getElementById("personas");

    if (selectExp) {
        selectExp.addEventListener("change", actualizarInformacionExperiencia);
    }

    if (inputPersonas) {
        inputPersonas.addEventListener("input", calcularTotalReserva);
    }

    if (form) {
        form.addEventListener("submit", procesarReserva);
    }
});

// Función para limpiar precios y evitar NaN
function limpiarPrecio(valor) {
    if (typeof valor === 'number') return isNaN(valor) ? 0 : valor;
    if (!valor) return 0;
    const limpio = String(valor).replace(/[^0-9]/g, '');
    return parseInt(limpio, 10) || 0;
}

function obtenerProductos() {
    try {
        return JSON.parse(localStorage.getItem("productos")) || [];
    } catch (e) {
        return [];
    }
}

function cargarExperienciasSelect() {
    const selectExp = document.getElementById("experiencia");
    if (!selectExp) return;

    const productos = obtenerProductos();
    selectExp.innerHTML = `<option value="">-- Selecciona una experiencia --</option>`;

    productos.forEach(prod => {
        const option = document.createElement("option");
        option.value = prod.codigo;
        option.textContent = `${prod.nombre} ${prod.stock <= 0 ? '- [AGOTADO]' : ''}`;
        if (prod.stock <= 0) option.disabled = true;
        selectExp.appendChild(option);
    });

    actualizarInformacionExperiencia();
}

function actualizarInformacionExperiencia() {
    const selectExp = document.getElementById("experiencia");
    const selectFecha = document.getElementById("fecha");
    const selectHora = document.getElementById("hora");
    const inputPersonas = document.getElementById("personas");

    if (!selectExp || !selectExp.value) {
        limpiarFormularioAuxiliar();
        return;
    }

    const productos = obtenerProductos();
    const prod = productos.find(p => String(p.codigo).toLowerCase() === String(selectExp.value).toLowerCase());

    if (!prod) return;

    if (selectFecha) {
        selectFecha.innerHTML = `<option value="">-- Selecciona una fecha --</option>`;
        const listaFechas = prod.fechas ? prod.fechas.split(",").map(f => f.trim()) : ["2026-10-15", "2026-10-20"];
        listaFechas.forEach(fStr => {
            if (fStr) {
                const opt = document.createElement("option");
                opt.value = fStr;
                opt.textContent = fStr;
                selectFecha.appendChild(opt);
            }
        });
    }

    if (selectHora) {
        selectHora.innerHTML = `<option value="">-- Selecciona una hora --</option>`;
        const listaHorarios = prod.horarios ? prod.horarios.split(",").map(h => h.trim()) : ["10:00", "12:00", "16:00"];
        listaHorarios.forEach(hStr => {
            if (hStr) {
                const opt = document.createElement("option");
                opt.value = hStr;
                opt.textContent = hStr;
                selectHora.appendChild(opt);
            }
        });
    }

    if (inputPersonas) {
        const minVal = prod.minPersonas || 1;
        const maxVal = Math.min(prod.maxPersonas || 10, prod.stock);

        inputPersonas.min = minVal;
        inputPersonas.max = maxVal;
        inputPersonas.value = minVal;
    }

    calcularTotalReserva();
}

function calcularTotalReserva() {
    const selectExp = document.getElementById("experiencia");
    const inputPersonas = document.getElementById("personas");
    const divInfo = document.getElementById("infoPrecio");

    if (!selectExp || !selectExp.value || !divInfo) return;

    const productos = obtenerProductos();
    const prod = productos.find(p => String(p.codigo).toLowerCase() === String(selectExp.value).toLowerCase());

    if (!prod) return;

    const minVal = prod.minPersonas || 1;
    const maxVal = prod.maxPersonas || 10;
    let cantidad = parseInt(inputPersonas.value, 10) || minVal;

    const precioUnitario = limpiarPrecio(prod.precio);
    const total = precioUnitario * cantidad;

    divInfo.innerHTML = `
        <div class="p-3 border rounded-3 bg-light mb-2">
            <small class="d-block text-muted">Mínimo de personas: <strong>${minVal}</strong> | Máximo: <strong>${maxVal}</strong></small>
            <small class="d-block text-muted">Stock / Cupos restantes: <strong>${prod.stock}</strong></small>
            <div class="mt-2 text-primary fw-bold">Precio Unitario: $${precioUnitario.toLocaleString("es-CL")}</div>
            <div class="fs-4 text-primary fw-bold mt-1">Total: $${total.toLocaleString("es-CL")}</div>
        </div>
    `;
}

function limpiarFormularioAuxiliar() {
    const divInfo = document.getElementById("infoPrecio");
    const selectFecha = document.getElementById("fecha");
    const selectHora = document.getElementById("hora");

    if (divInfo) divInfo.innerHTML = "";
    if (selectFecha) selectFecha.innerHTML = `<option value="">-- Selecciona fecha --</option>`;
    if (selectHora) selectHora.innerHTML = `<option value="">-- Selecciona hora --</option>`;
}

function procesarReserva(e) {
    e.preventDefault();

    const selectExp = document.getElementById("experiencia");
    const selectFecha = document.getElementById("fecha");
    const selectHora = document.getElementById("hora");
    const inputPersonas = document.getElementById("personas");

    const codigo = selectExp.value;
    const fecha = selectFecha.value;
    const hora = selectHora.value;
    const personas = parseInt(inputPersonas.value, 10) || 1;

    if (!codigo || !fecha || !hora) {
        mostrarMensaje("Por favor selecciona experiencia, fecha y hora.", "danger");
        return;
    }

    let productos = obtenerProductos();
    const prod = productos.find(p => String(p.codigo).toLowerCase() === String(codigo).toLowerCase());

    if (!prod) {
        mostrarMensaje("La experiencia no existe.", "danger");
        return;
    }

    if (personas < (prod.minPersonas || 1)) {
        mostrarMensaje(`El mínimo requerido es de ${prod.minPersonas || 1} persona(s).`, "warning");
        return;
    }

    if (personas > (prod.maxPersonas || 10)) {
        mostrarMensaje(`El máximo permitido es de ${prod.maxPersonas || 10} persona(s).`, "warning");
        return;
    }

    if (prod.stock < personas) {
        mostrarMensaje(`No hay suficientes cupos disponibles. Restantes: ${prod.stock}.`, "danger");
        return;
    }

    const precioUnitario = limpiarPrecio(prod.precio);
    const subtotal = precioUnitario * personas;

    const itemCarrito = {
        id: Date.now(),
        codigo: prod.codigo,
        nombre: prod.nombre,
        imagen: prod.imagen || 'img/ceramica.jpg',
        precio: precioUnitario,
        fecha: fecha,
        hora: hora,
        personas: personas,
        subtotal: subtotal
    };

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push(itemCarrito);
    localStorage.setItem("carrito", JSON.stringify(carrito));

    window.location.href = "carrito.html";
}

function mostrarMensaje(texto, tipo) {
    const divMensaje = document.getElementById("mensajeReserva");
    if (divMensaje) {
        divMensaje.innerHTML = `<div class="alert alert-${tipo} rounded-3" role="alert">${texto}</div>`;
    }
}