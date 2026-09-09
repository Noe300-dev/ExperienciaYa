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

// Inicialización de datos por defecto si localStorage está vacío
function inicializarUsuariosSemilla() {
    if (!localStorage.getItem("usuarios")) {
        const usuariosSemilla = [
            {
                rut: "11111111-1",
                nombre: "Admin",
                apellido: "Sistema",
                email: "admin@experienciaya.cl",
                telefono: "+56 9 8765 4321",
                rol: "Administrador",
                fechaRegistro: new Date().toLocaleDateString("es-CL")
            },
            {
                rut: "22222222-2",
                nombre: "María",
                apellido: "González",
                email: "maria.gonzalez@gmail.com",
                telefono: "+56 9 1234 5678",
                rol: "Cliente",
                fechaRegistro: new Date().toLocaleDateString("es-CL")
            }
        ];
        localStorage.setItem("usuarios", JSON.stringify(usuariosSemilla));
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

// Cargar la tabla con datos dinámicos
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
        const badgeRol = u.rol === "Administrador" 
            ? `<span class="badge bg-primary">Administrador</span>` 
            : `<span class="badge bg-secondary">Cliente</span>`;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${u.rut}</strong></td>
            <td>${u.nombre} ${u.apellido}</td>
            <td>${u.email}</td>
            <td>${u.telefono || "-"}</td>
            <td>${badgeRol}</td>
            <td>${u.fechaRegistro || "-"}</td>
            <td class="text-end">
                <button type="button" class="btn btn-sm btn-outline-primary me-1" onclick="editarUsuario('${u.rut}')" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="eliminarUsuario('${u.rut}')" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Abrir Modal para Crear
function abrirModalNuevoUsuario() {
    limpiarFormulario();
    document.getElementById("esEdicionUsuario").value = "false";
    document.getElementById("userIdOriginal").value = "";
    document.getElementById("userRut").disabled = false;
    document.getElementById("modalUsuarioLabel").innerText = "Nuevo Usuario";
    
    mostrarModal();
}

// Abrir Modal para Editar
function editarUsuario(rut) {
    const usuarios = obtenerUsuarios();
    const usuario = usuarios.find(u => String(u.rut).trim().toLowerCase() === String(rut).trim().toLowerCase());

    if (!usuario) {
        alert("No se encontró la información del usuario.");
        return;
    }

    limpiarFormulario();
    document.getElementById("esEdicionUsuario").value = "true";
    document.getElementById("userIdOriginal").value = usuario.rut;

    document.getElementById("userRut").value = usuario.rut;
    document.getElementById("userRut").disabled = true; // El RUT no se edita por ser ID único
    document.getElementById("userNombre").value = usuario.nombre || "";
    document.getElementById("userApellido").value = usuario.apellido || "";
    document.getElementById("userEmail").value = usuario.email || "";
    document.getElementById("userTelefono").value = usuario.telefono || "";
    document.getElementById("userRol").value = usuario.rol || "Cliente";

    document.getElementById("modalUsuarioLabel").innerText = `Editar Usuario: ${usuario.nombre} ${usuario.apellido}`;
    
    mostrarModal();
}

// Función Principal: Guardar / Editar
function guardarUsuario(e) {
    if (e) e.preventDefault();

    const esEdicion = document.getElementById("esEdicionUsuario").value === "true";
    const rutOriginal = document.getElementById("userIdOriginal").value.trim();

    const rut = document.getElementById("userRut").value.trim();
    const nombre = document.getElementById("userNombre").value.trim();
    const apellido = document.getElementById("userApellido").value.trim();
    const email = document.getElementById("userEmail").value.trim();
    const telefono = document.getElementById("userTelefono").value.trim();
    const rol = document.getElementById("userRol").value;

    // Validación de campos obligatorios
    if (!rut || !nombre || !apellido || !email) {
        alert("Por favor completa todos los campos obligatorios (*).");
        return;
    }

    let usuarios = obtenerUsuarios();

    if (esEdicion) {
        // Buscar el usuario por su RUT original
        const index = usuarios.findIndex(u => String(u.rut).trim().toLowerCase() === String(rutOriginal).trim().toLowerCase());
        
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
        // Validar unicidad en nuevos registros
        const rutExiste = usuarios.some(u => String(u.rut).trim().toLowerCase() === String(rut).trim().toLowerCase());
        const emailExiste = usuarios.some(u => String(u.email).trim().toLowerCase() === String(email).trim().toLowerCase());

        if (rutExiste) {
            alert("El RUT / ID ingresado ya se encuentra registrado.");
            return;
        }
        if (emailExiste) {
            alert("El Correo Electrónico ingresado ya se encuentra registrado.");
            return;
        }

        usuarios.push({
            rut,
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
function eliminarUsuario(rut) {
    if (confirm(`¿Estás seguro de que deseas eliminar al usuario con RUT ${rut}?`)) {
        let usuarios = obtenerUsuarios();
        usuarios = usuarios.filter(u => String(u.rut).trim().toLowerCase() !== String(rut).trim().toLowerCase());
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

    // Respaldo de cierre forzado si falla el objeto Bootstrap
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