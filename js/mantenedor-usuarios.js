document.addEventListener("DOMContentLoaded", () => {
    inicializarUsuariosSemilla();
    cargarUsuariosTabla();

    const formUsuario = document.getElementById("formUsuario");
    if (formUsuario) {
        formUsuario.addEventListener("submit", guardarUsuario);
    }

    // Sincronización en tiempo real si se registra un cliente en otra pestaña
    window.addEventListener("storage", (e) => {
        if (e.key === "usuarios") {
            cargarUsuariosTabla();
        }
    });
});

// Generador de ID autoincrementable administrado por el sistema
function generarNuevoIdUsuario() {
    const usuarios = obtenerUsuarios();
    if (usuarios.length === 0) return "USR-001";

    const numeros = usuarios.map(u => {
        const val = u.id || u.rut || "";
        const num = parseInt(String(val).replace(/\D/g, ""), 10);
        return isNaN(num) ? 0 : num;
    });

    const maxNumero = Math.max(...numeros, 0);
    return `USR-${String(maxNumero + 1).padStart(3, '0')}`;
}

// Inicialización de datos por defecto y limpieza de "undefined" en localStorage
function inicializarUsuariosSemilla() {
    let usuarios = obtenerUsuarios();

    if (!usuarios || usuarios.length === 0) {
        const fechaActual = new Date().toLocaleDateString("es-CL");
        const usuariosSemilla = [
            {
                id: "USR-001",
                rut: "USR-001",
                nombre: "Admin",
                apellido: "Sistema",
                email: "admin@experienciaya.cl",
                telefono: "+56 9 8765 4321",
                rol: "Administrador",
                fechaRegistro: fechaActual
            },
            {
                id: "USR-002",
                rut: "USR-002",
                nombre: "María",
                apellido: "González",
                email: "maria.gonzalez@gmail.com",
                telefono: "+56 9 1234 5678",
                rol: "Cliente",
                fechaRegistro: fechaActual
            }
        ];
        localStorage.setItem("usuarios", JSON.stringify(usuariosSemilla));
    } else {
        // Reparación automática de registros antiguos con "undefined" o sin ID
        let modificado = false;
        usuarios = usuarios.map((u, index) => {
            let copia = { ...u };

            // Asegurar ID único
            if (!copia.id || copia.id === "undefined" || copia.id === "null") {
                copia.id = (copia.rut && copia.rut !== "undefined" && copia.rut !== "null")
                    ? copia.rut
                    : `USR-${String(index + 1).padStart(3, '0')}`;
                copia.rut = copia.id;
                modificado = true;
            }

            // Limpiar "undefined" de textos
            if (!copia.nombre || copia.nombre === "undefined" || copia.nombre === "null") {
                copia.nombre = "Usuario";
                modificado = true;
            }
            if (!copia.apellido || copia.apellido === "undefined" || copia.apellido === "null") {
                copia.apellido = "";
                modificado = true;
            }
            if (copia.email === "undefined" || copia.email === "null") {
                copia.email = "";
                modificado = true;
            }
            if (copia.telefono === "undefined" || copia.telefono === "null") {
                copia.telefono = "";
                modificado = true;
            }

            return copia;
        });

        if (modificado) {
            guardarUsuariosStorage(usuarios);
        }
    }
}

function obtenerUsuarios() {
    try {
        return JSON.parse(localStorage.getItem("usuarios")) || [];
    } catch (e) {
        console.error("Error al leer usuarios:", e);
        return [];
    }
}

function guardarUsuariosStorage(usuarios) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Cargar la tabla con datos dinámicos (7 Columnas alineadas)
function cargarUsuariosTabla() {
    const usuarios = obtenerUsuarios();
    const tbody = document.getElementById("tablaUsuariosBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (usuarios.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No hay usuarios registrados.</td></tr>`;
        return;
    }

    usuarios.forEach(u => {
        const idMostrar = (u.id && u.id !== "undefined") 
            ? u.id 
            : ((u.rut && u.rut !== "undefined") ? u.rut : "USR-000");

        const nombre = (u.nombre && u.nombre !== "undefined") ? u.nombre.trim() : "";
        const apellido = (u.apellido && u.apellido !== "undefined") ? u.apellido.trim() : "";
        const nombreCompleto = `${nombre} ${apellido}`.trim() || "Usuario sin nombre";

        const email = (u.email && u.email !== "undefined" && u.email !== "") ? u.email : "—";
        const telefono = (u.telefono && u.telefono !== "undefined" && u.telefono !== "") ? u.telefono : "—";
        const fecha = (u.fechaRegistro && u.fechaRegistro !== "undefined") ? u.fechaRegistro : "—";

        const badgeRol = u.rol === "Administrador" 
            ? `<span class="badge bg-primary">Administrador</span>` 
            : `<span class="badge bg-secondary">Cliente</span>`;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="align-middle"><strong>${idMostrar}</strong></td>
            <td class="align-middle">${nombreCompleto}</td>
            <td class="align-middle">${email}</td>
            <td class="align-middle">${telefono}</td>
            <td class="align-middle">${badgeRol}</td>
            <td class="align-middle">${fecha}</td>
            <td class="text-end align-middle">
                <button type="button" class="btn btn-sm btn-outline-primary me-1" onclick="editarUsuario('${idMostrar}')" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="eliminarUsuario('${idMostrar}')" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Abrir Modal para Crear (ID asignado por sistema)
function abrirModalNuevoUsuario() {
    limpiarFormulario();
    document.getElementById("esEdicionUsuario").value = "false";
    document.getElementById("userIdOriginal").value = "";

    const inputRut = document.getElementById("userRut");
    if (inputRut) {
        inputRut.value = generarNuevoIdUsuario();
        inputRut.disabled = true; // El sistema lo asigna automáticamente
    }

    document.getElementById("modalUsuarioLabel").innerText = "Nuevo Usuario";
    mostrarModal();
}

// Abrir Modal para Editar
function editarUsuario(id) {
    const usuarios = obtenerUsuarios();
    const usuario = usuarios.find(u => String(u.id || u.rut).trim().toLowerCase() === String(id).trim().toLowerCase());

    if (!usuario) {
        alert("No se encontró la información del usuario.");
        return;
    }

    limpiarFormulario();
    const idUsuario = usuario.id || usuario.rut;

    document.getElementById("esEdicionUsuario").value = "true";
    document.getElementById("userIdOriginal").value = idUsuario;

    const inputRut = document.getElementById("userRut");
    if (inputRut) {
        inputRut.value = idUsuario;
        inputRut.disabled = true; // ID único no editable
    }

    if (document.getElementById("userNombre")) document.getElementById("userNombre").value = usuario.nombre || "";
    if (document.getElementById("userApellido")) document.getElementById("userApellido").value = usuario.apellido || "";
    if (document.getElementById("userEmail")) document.getElementById("userEmail").value = usuario.email || "";
    if (document.getElementById("userTelefono")) document.getElementById("userTelefono").value = usuario.telefono || "";
    if (document.getElementById("userRol")) document.getElementById("userRol").value = usuario.rol || "Cliente";

    const nombreCompleto = `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim();
    document.getElementById("modalUsuarioLabel").innerText = `Editar Usuario: ${nombreCompleto || idUsuario}`;
    
    mostrarModal();
}

// Función Principal: Guardar / Editar
function guardarUsuario(e) {
    if (e) e.preventDefault();

    const esEdicion = document.getElementById("esEdicionUsuario").value === "true";
    const idOriginal = document.getElementById("userIdOriginal").value.trim();

    const nombre = document.getElementById("userNombre")?.value.trim() || "";
    const apellido = document.getElementById("userApellido")?.value.trim() || "";
    const email = document.getElementById("userEmail")?.value.trim() || "";
    const telefono = document.getElementById("userTelefono")?.value.trim() || "";
    const rol = document.getElementById("userRol")?.value || "Cliente";

    // Validación de campos obligatorios
    if (!nombre || !email) {
        alert("Por favor completa los campos obligatorios (*) Nombre y Correo.");
        return;
    }

    let usuarios = obtenerUsuarios();

    if (esEdicion) {
        const index = usuarios.findIndex(u => String(u.id || u.rut).trim().toLowerCase() === String(idOriginal).trim().toLowerCase());
        
        if (index !== -1) {
            usuarios[index] = {
                ...usuarios[index],
                nombre,
                apellido,
                email,
                telefono,
                rol
            };
        } else {
            alert("Error al actualizar: No se encontró el usuario original.");
            return;
        }
    } else {
        // Validar correo duplicado
        const emailExiste = usuarios.some(u => String(u.email).trim().toLowerCase() === String(email).trim().toLowerCase());
        if (emailExiste) {
            alert("El Correo Electrónico ingresado ya se encuentra registrado.");
            return;
        }

        // Asignación automática de ID por el sistema
        const nuevoId = generarNuevoIdUsuario();

        usuarios.push({
            id: nuevoId,
            rut: nuevoId,
            nombre,
            apellido,
            email,
            telefono,
            rol,
            fechaRegistro: new Date().toLocaleDateString("es-CL")
        });
    }

    // Persistencia de datos
    guardarUsuariosStorage(usuarios);
    cargarUsuariosTabla();
    cerrarModal();

    alert(esEdicion ? "¡Usuario actualizado exitosamente!" : "¡Usuario guardado exitosamente!");
}

// Eliminar Usuario
function eliminarUsuario(id) {
    if (confirm(`¿Estás seguro de que deseas eliminar al usuario ${id}?`)) {
        let usuarios = obtenerUsuarios();
        usuarios = usuarios.filter(u => String(u.id || u.rut).trim().toLowerCase() !== String(id).trim().toLowerCase());
        guardarUsuariosStorage(usuarios);
        cargarUsuariosTabla();
    }
}

// Funciones de control Modal
function mostrarModal() {
    const modalEl = document.getElementById("modalUsuario");
    if (!modalEl) return;
    try {
        const modalObj = bootstrap.Modal.getOrCreateInstance(modalEl);
        modalObj.show();
    } catch (e) {
        console.error("Error Bootstrap Modal Show:", e);
    }
}

function cerrarModal() {
    const modalEl = document.getElementById("modalUsuario");
    if (!modalEl) return;
    
    try {
        const modalObj = bootstrap.Modal.getInstance(modalEl);
        if (modalObj) modalObj.hide();
    } catch (e) {
        console.error("Error Bootstrap Modal Hide:", e);
    }

    const btnClose = modalEl.querySelector(".btn-close");
    if (btnClose) btnClose.click();

    document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("padding-right");
}

function limpiarFormulario() {
    const form = document.getElementById("formUsuario");
    if (form) form.reset();
    const inputs = document.querySelectorAll("#formUsuario .form-control, #formUsuario .form-select");
    inputs.forEach(i => i.classList.remove("is-invalid"));
}