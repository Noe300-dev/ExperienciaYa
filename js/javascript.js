document.addEventListener("DOMContentLoaded", function() {

const experienciasData = {
    "Kayak en Santiago": { precio: 25000, categoria: "Aventura", imagen: "img/kayak.jpg", min: 1, max: 10, fechas: ["2026-10-15", "2026-10-20"], horas: ["10:00", "15:00"] },
    "Taller de ceramica": { precio: 18000, categoria: "Arte", imagen: "img/ceramica.jpg", min: 1, max: 8, fechas: ["2026-10-12", "2026-10-19"], horas: ["11:00", "16:00"] },
    "Clase de cocina": { precio: 30000, categoria: "Gastronomía", imagen: "img/cocina.jpg", min: 1, max: 12, fechas: ["2026-10-14", "2026-10-21"], horas: ["12:00", "19:00"] },
    "Experiencia de trekking": { precio: 15000, categoria: "Deporte", imagen: "img/trekking.jpg", min: 1, max: 15, fechas: ["2026-10-10", "2026-10-24"], horas: ["08:00", "09:30"] },
    "Vuelo en Globo": { precio: 45000, categoria: "Aventura", imagen: "img/fondoindex.jpg", min: 1, max: 6, fechas: ["2026-10-11", "2026-10-25"], horas: ["06:00", "07:00"] }
};

// CARRITO POR USUARIO
function obtenerClaveCarrito() {
    let usuarioActual = null;
    try {
        usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
    } catch(error) {
        usuarioActual = null;
    }

    if (!usuarioActual || !usuarioActual.correo) {
        return null;
    }
    return "carrito_" + usuarioActual.correo;
}

function obtenerCarrito() {
    const claveCarrito = obtenerClaveCarrito();
    if (!claveCarrito) return [];
    try {
        return JSON.parse(localStorage.getItem(claveCarrito)) || [];
    } catch(error) {
        return [];
    }
}

function guardarCarrito(carrito) {
    const claveCarrito = obtenerClaveCarrito();
    if (!claveCarrito) return;
    localStorage.setItem(claveCarrito, JSON.stringify(carrito));
}

// REGISTRO
const formularioRegistro = document.getElementById("formularioRegistro");
if (formularioRegistro) {
    formularioRegistro.addEventListener("submit", function(event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim().toLowerCase();
        const telefono = document.getElementById("telefono").value.trim();
        const password = document.getElementById("password").value;
        const confirmarPassword = document.getElementById("confirmarPassword").value;
        const mensaje = document.getElementById("mensajeRegistro");

        const correosPermitidos = ["@gmail.com", "@duocuc.cl", "@profesor.cl"];
        const correoValido = correosPermitidos.some(dominio => correo.endsWith(dominio));

        if (!correoValido) {
            mensaje.textContent = "Correo no válido. Solo se permiten correos @gmail.com, @duocuc.cl o @profesor.cl.";
            mensaje.style.color = "red";
            return;
        }

        if (password.length < 6) {
            mensaje.textContent = "La contraseña debe tener al menos 6 caracteres.";
            mensaje.style.color = "red";
            return;
        }

        if (password !== confirmarPassword) {
            mensaje.textContent = "Las contraseñas no coinciden.";
            mensaje.style.color = "red";
            return;
        }

        let usuarios = [];
        try {
            usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        } catch(error) {
            usuarios = [];
        }

        if (usuarios.some(usuario => usuario.correo === correo)) {
            mensaje.textContent = "Este correo ya está registrado.";
            mensaje.style.color = "red";
            return;
        }

        const nuevoUsuario = {
            nombre: nombre,
            correo: correo,
            telefono: telefono,
            direccion: "",
            password: password
        };

        usuarios.push(nuevoUsuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        localStorage.setItem("usuarioActual", JSON.stringify(nuevoUsuario));

        mensaje.textContent = "Registro realizado correctamente.";
        mensaje.style.color = "green";

        setTimeout(function() {
            window.location.href = "usuario.html";
        }, 1000);
    });
}

// LOGIN
const formularioLogin = document.getElementById("formularioLogin");
if (formularioLogin) {
    formularioLogin.addEventListener("submit", function(event) {
        event.preventDefault();

        const correo = document.getElementById("loginCorreo").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;
        const mensaje = document.getElementById("mensajeLogin");

        let usuarios = [];
        try {
            usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        } catch(error) {
            usuarios = [];
        }

        const usuarioEncontrado = usuarios.find(usuario => usuario.correo === correo && usuario.password === password);

        if (usuarioEncontrado) {
            localStorage.setItem("usuarioActual", JSON.stringify(usuarioEncontrado));
            mensaje.textContent = "¡Inicio de sesión exitoso! Redirigiendo...";
            mensaje.style.color = "green";

            setTimeout(function() {
                window.location.href = "usuario.html";
            }, 1000);
        } else {
            mensaje.textContent = "Correo o contraseña incorrectos.";
            mensaje.style.color = "red";
        }
    });
}

// RESERVA
const formularioReserva = document.getElementById("formularioReserva");
const selectExperiencia = document.getElementById("experiencia");
const inputPersonas = document.getElementById("personas") || document.getElementById("cantidadPersonas");
const infoPrecio = document.getElementById("infoPrecio");
const selectFecha = document.getElementById("fecha") || document.getElementById("fechaHora");
const selectHora = document.getElementById("hora");

function actualizarFormularioReserva() {
    if (!selectExperiencia) return;

    const experiencia = selectExperiencia.value;
    const config = experienciasData[experiencia];
    if (!config) return;

    if (inputPersonas) {
        inputPersonas.min = config.min;
        inputPersonas.max = config.max;
        inputPersonas.value = config.min;
    }

    if (infoPrecio) {
        infoPrecio.textContent = `Precio por persona: $${config.precio.toLocaleString("es-CL")}`;
        infoPrecio.style.color = "#0056b3";
        infoPrecio.style.fontWeight = "bold";
    }

    if (selectFecha) {
        selectFecha.innerHTML = "";
        config.fechas.forEach(function(fecha) {
            const option = document.createElement("option");
            option.value = fecha;
            option.textContent = fecha;
            selectFecha.appendChild(option);
        });
        selectFecha.value = config.fechas[0];
    }

    if (selectHora) {
        selectHora.innerHTML = "";
        config.horas.forEach(function(hora) {
            const option = document.createElement("option");
            option.value = hora;
            option.textContent = hora;
            selectHora.appendChild(option);
        });
        selectHora.value = config.horas[0];
    }
}

if (selectExperiencia) {
    selectExperiencia.addEventListener("change", actualizarFormularioReserva);
    const experienciaSeleccionada = localStorage.getItem("experienciaSeleccionada");
    if (experienciaSeleccionada) {
        selectExperiencia.value = experienciaSeleccionada;
    }
    actualizarFormularioReserva();
}

if (formularioReserva) {
    formularioReserva.addEventListener("submit", function(event) {
        event.preventDefault();

        const usuarioActual = localStorage.getItem("usuarioActual");
        if (!usuarioActual) {
            alert("Para poder realizar una reserva, primero debes registrarte.");
            window.location.href = "registro.html";
            return;
        }

        const experiencia = selectExperiencia.value;
        const fecha = selectFecha.value;
        const hora = selectHora.value;
        const personas = Number(inputPersonas.value);
        const comentarioElemento = document.getElementById("comentario");
        const comentario = comentarioElemento ? comentarioElemento.value.trim() : "";
        const mensaje = document.getElementById("mensajeReserva");

        if (!experiencia || !fecha || !hora) {
            mensaje.textContent = "Por favor completa todos los campos requeridos.";
            mensaje.style.color = "red";
            return;
        }

        const config = experienciasData[experiencia];
        if (personas < config.min || personas > config.max) {
            mensaje.textContent = `La cantidad de personas debe ser entre ${config.min} y ${config.max}.`;
            mensaje.style.color = "red";
            return;
        }

        const reserva = {
            nombre: experiencia,
            precio: config.precio,
            categoria: config.categoria,
            imagen: config.imagen,
            fecha: fecha,
            hora: hora,
            personas: personas,
            comentario: comentario,
            tipo: "reserva"
        };

        let carrito = obtenerCarrito();
        carrito.push(reserva);
        guardarCarrito(carrito);

        mensaje.innerHTML = `<div class="confirmacion-reserva"><div class="icono-confirmacion">✓</div><h3>¡Reserva realizada correctamente!</h3><p>Tu reserva para <strong>${experiencia}</strong> ha sido registrada.</p><p><strong>Fecha:</strong> ${fecha}</p><p><strong>Hora:</strong> ${hora}</p><p><strong>Personas:</strong> ${personas}</p><p><strong>Total:</strong> $${(config.precio * personas).toLocaleString("es-CL")}</p><br><a href="carrito.html" class="boton boton-principal">Ver carrito</a></div>`;
        mensaje.scrollIntoView({ behavior: "smooth", block: "center" });
    });
}

// AGREGAR EXPERIENCIAS AL CARRITO
const listaCarrito = document.getElementById("listaCarrito");
const totalCarrito = document.getElementById("totalCarrito");
const botonesCarrito = document.querySelectorAll(".boton-carrito");

botonesCarrito.forEach(function(boton) {
    boton.addEventListener("click", function() {
        const usuarioActual = localStorage.getItem("usuarioActual");
        if (!usuarioActual) {
            alert("Para agregar una experiencia debes registrarte o iniciar sesión.");
            window.location.href = "registro.html";
            return;
        }
        const experiencia = {
            nombre: boton.dataset.nombre,
            precio: Number(boton.dataset.precio),
            categoria: boton.dataset.categoria,
            imagen: boton.dataset.imagen,
            tipo: "experiencia"
        };
        let carrito = obtenerCarrito();
        carrito.push(experiencia);
        guardarCarrito(carrito);
        alert(experiencia.nombre + " fue agregada al carrito.");
    });
});

// MOSTRAR CARRITO
function mostrarCarrito() {
    if (!listaCarrito) return;

    const carrito = obtenerCarrito();
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        listaCarrito.innerHTML = `<div class="carrito-vacio"><h3>Tu carrito está vacío</h3><p>Agrega una experiencia para comenzar.</p><a href="reserva.html" class="boton boton-principal">Reservar experiencia</a></div>`;
        if (totalCarrito) totalCarrito.textContent = "$0";
        return;
    }

    let total = 0;

    carrito.forEach(function(experiencia, index) {
        if (experiencia.tipo === "reserva") {
            const subtotal = Number(experiencia.precio) * Number(experiencia.personas);
            total += subtotal;
            listaCarrito.innerHTML += `<article class="tarjeta-carrito"><img src="${experiencia.imagen}" alt="${experiencia.nombre}"><div class="contenido-carrito"><span class="etiqueta">${experiencia.categoria}</span><h3>${experiencia.nombre}</h3><p><strong>Fecha:</strong> ${experiencia.fecha}</p><p><strong>Hora:</strong> ${experiencia.hora}</p><p><strong>Personas:</strong> ${experiencia.personas}</p><p><strong>Precio por persona:</strong> $${Number(experiencia.precio).toLocaleString("es-CL")}</p><p class="precio-experiencia"><strong>Total:</strong> $${subtotal.toLocaleString("es-CL")}</p>${experiencia.comentario ? `<p><strong>Comentario:</strong> ${experiencia.comentario}</p>` : ""}<button class="boton boton-secundario" onclick="eliminarDelCarrito(${index})">Eliminar</button></div></article>`;
        } else {
            total += Number(experiencia.precio);
            listaCarrito.innerHTML += `<article class="tarjeta-carrito"><img src="${experiencia.imagen}" alt="${experiencia.nombre}"><div class="contenido-carrito"><span class="etiqueta">${experiencia.categoria}</span><h3>${experiencia.nombre}</h3><p class="precio-experiencia">$${Number(experiencia.precio).toLocaleString("es-CL")}</p><button class="boton boton-secundario" onclick="eliminarDelCarrito(${index})">Eliminar</button></div></article>`;
        }
    });

    if (totalCarrito) totalCarrito.textContent = "$" + total.toLocaleString("es-CL");
}

if (listaCarrito) mostrarCarrito();

window.eliminarDelCarrito = function(index) {
    let carrito = obtenerCarrito();
    carrito.splice(index, 1);
    guardarCarrito(carrito);
    mostrarCarrito();
};

window.vaciarCarrito = function() {
    if (confirm("¿Estás seguro de que deseas eliminar todas las experiencias?")) {
        guardarCarrito([]);
        mostrarCarrito();
    }
};

// PAGAR CARRITO
const btnPagar = document.getElementById("btnPagarCarrito");
if (btnPagar) {
    btnPagar.addEventListener("click", function() {
        const carrito = obtenerCarrito();
        if (carrito.length === 0) {
            alert("Tu carrito está vacío.");
            return;
        }
        let usuarioActual = null;
        try {
            usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
        } catch(error) {
            usuarioActual = null;
        }
        if (!usuarioActual || !usuarioActual.correo) {
            alert("Debes iniciar sesión para realizar el pago.");
            window.location.href = "registro.html";
            return;
        }
        let total = 0;
        let detalleCompra = "";
        carrito.forEach(function(item) {
            let subtotal = item.tipo === "reserva" ? Number(item.precio) * Number(item.personas) : Number(item.precio);
            total += subtotal;
            detalleCompra += "Experiencia: " + item.nombre + "\n";
            if (item.fecha) detalleCompra += "Fecha: " + item.fecha + "\n";
            if (item.hora) detalleCompra += "Hora: " + item.hora + "\n";
            if (item.personas) detalleCompra += "Personas: " + item.personas + "\n";
            detalleCompra += "Subtotal: $" + subtotal.toLocaleString("es-CL") + "\n\n";
        });
        const datosCorreo = {
            _subject: "Nueva compra - ExperienciaYa",
            _captcha: "false",
            _template: "table",
            nombre: usuarioActual.nombre || "",
            email: usuarioActual.correo,
            telefono: usuarioActual.telefono || "",
            detalle: detalleCompra,
            total: "$" + total.toLocaleString("es-CL")
        };
        fetch("https://formsubmit.co/ajax/admin.experienciaya@gmail.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(datosCorreo)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("¡Pago realizado con éxito!\n\nLa confirmación fue enviada a:\nadmin.experienciaya@gmail.com\n\nTotal: $" + total.toLocaleString("es-CL"));
                guardarCarrito([]);
                mostrarCarrito();
            } else {
                alert("FormSubmit no pudo enviar el correo.");
            }
        })
        .catch(error => {
            console.error("Error enviando correo:", error);
            alert("No se pudo enviar el correo.");
        });
    });
}

// DATOS DEL USUARIO Y BOTÓN ADMIN
const perfilNombre = document.getElementById("perfilNombre");
const perfilEmail = document.getElementById("perfilEmail");
const perfilTelefono = document.getElementById("perfilTelefono");
const contenedorAdminDashboard = document.getElementById("contenedorAdminDashboard");

if (perfilNombre || perfilEmail) {
    let usuarioActual = null;
    try {
        usuarioActual = JSON.parse(localStorage.getItem("usuarioActual")) || JSON.parse(localStorage.getItem("usuarioActivo"));
    } catch(error) {
        usuarioActual = null;
    }

    if (!usuarioActual) {
        alert("Debes iniciar sesión.");
        window.location.href = "registro.html";
    } else {
        // Cargar datos en los Spans del HTML
        if (perfilNombre) perfilNombre.textContent = usuarioActual.nombre || "Usuario";
        if (perfilEmail) perfilEmail.textContent = usuarioActual.correo || usuarioActual.email || "";
        if (perfilTelefono) perfilTelefono.textContent = usuarioActual.telefono || "No especificado";

        // VALIDAR Y MOSTRAR BOTÓN DASHBOARD
        let usuarios = [];
        try {
            usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        } catch(e) {
            usuarios = [];
        }

        const correoActual = String(usuarioActual.correo || usuarioActual.email || "").trim().toLowerCase();
        const usuarioBD = usuarios.find(u => String(u.correo || u.email || "").trim().toLowerCase() === correoActual);

        const rolUsuario = String(usuarioBD?.rol || usuarioActual?.rol || "").trim().toLowerCase();
        const esAdmin = rolUsuario === "administrador" || rolUsuario === "admin" || correoActual === "joi.saavedra@duocuc.cl";

        if (esAdmin && contenedorAdminDashboard) {
            // Remueve la clase 'd-none' para visibilizar el contenedor del botón
            contenedorAdminDashboard.classList.remove("d-none");
        }
    }
}

// CERRAR SESIÓN
const botonCerrarSesion = document.getElementById("cerrarSesion");
if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener("click", function() {
        localStorage.removeItem("usuarioActual");
        alert("Sesión cerrada correctamente.");
        window.location.href = "index.html";
    });
}

// CONTACTO
const formularioContacto = document.getElementById("formularioContacto");
if (formularioContacto) {
    formularioContacto.addEventListener("submit", function(event) {
        event.preventDefault();

        const correo = document.getElementById("correoContacto").value.trim().toLowerCase();
        const resultado = document.getElementById("resultadoContacto");
        const dominiosPermitidos = ["@gmail.com", "@duocuc.cl", "@profesor.cl"];
        const correoValido = dominiosPermitidos.some(dominio => correo.endsWith(dominio));

        if (!correoValido) {
            resultado.textContent = "Correo no válido. Solo se permiten correos Gmail, Duoc UC (@duocuc.cl) y Profesor (@profesor.cl).";
            resultado.style.color = "red";
            return;
        }

        const datosFormulario = new FormData(formularioContacto);
        fetch("https://formsubmit.co/ajax/admin.experienciaya@gmail.com", {
            method: "POST",
            body: datosFormulario,
            headers: { "Accept": "application/json" }
        })
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (datos.success) {
                resultado.textContent = "¡Mensaje enviado correctamente!";
                resultado.style.color = "green";
                formularioContacto.reset();
            } else {
                resultado.textContent = "No se pudo enviar el mensaje.";
                resultado.style.color = "red";
            }
        })
        .catch(error => {
            console.error(error);
            resultado.textContent = "Ocurrió un error al enviar el mensaje.";
            resultado.style.color = "red";
        });
    });
}

});