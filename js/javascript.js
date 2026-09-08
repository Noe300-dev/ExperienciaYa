document.addEventListener("DOMContentLoaded", function () {

    // 1. BASE DE DATOS 
    const experienciasData = {
        "Kayak en Santiago": {
            precio: 25000,
            categoria: "Aventura",
            imagen: "img/kayak.jpg",
            min: 1, max: 10,
            fechas: ["2026-10-15", "2026-10-20"],
            horas: ["10:00", "15:00"]
        },
        "Taller de ceramica": {
            precio: 18000,
            categoria: "Arte",
            imagen: "img/ceramica.jpg",
            min: 1, max: 8,
            fechas: ["2026-10-12", "2026-10-19"],
            horas: ["11:00", "16:00"]
        },
        "Clase de cocina": {
            precio: 30000,
            categoria: "Gastronomía",
            imagen: "img/cocina.jpg",
            min: 1, max: 12,
            fechas: ["2026-10-14", "2026-10-21"],
            horas: ["12:00", "19:00"]
        },
        "Experiencia de trekking": {
            precio: 15000,
            categoria: "Deporte",
            imagen: "img/trekking.jpg",
            min: 1, max: 15,
            fechas: ["2026-10-10", "2026-10-24"],
            horas: ["08:00", "09:30"]
        },
        "Vuelo en Globo": {
            precio: 45000,
            categoria: "Aventura",
            imagen: "img/fondoindex.jpg",
            min: 1, max: 6,
            fechas: ["2026-10-11", "2026-10-25"],
            horas: ["06:00", "07:00"]
        }
    };

    // GESTIÓN DE CLAVES Y SESIÓN DE CARRITO
    function obtenerClaveCarrito() {
        try {
            const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
            if (usuarioActual && usuarioActual.correo) {
                return "carrito_" + usuarioActual.correo.trim().toLowerCase();
            }
        } catch (e) {
            console.error("Error al leer el usuario actual", e);
        }
        return null; 
    }

    function obtenerCarritoLocal() {
        const clave = obtenerClaveCarrito();
        if (!clave) return []; 
        
        try {
            const stored = localStorage.getItem(clave);
            const parsed = stored ? JSON.parse(stored) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    }

    function guardarCarritoLocal(carrito) {
        const clave = obtenerClaveCarrito();
        if (clave) {
            localStorage.setItem(clave, JSON.stringify(carrito));
        }
    }

    // 2. REGISTRO DE USUARIOS
    const formularioRegistro = document.getElementById("formularioRegistro");
    if (formularioRegistro) {
        formularioRegistro.addEventListener("submit", function (event) {
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
            } catch (error) {
                usuarios = [];
            }
            
            if (usuarios.some(usuario => usuario.correo === correo)) {
                mensaje.textContent = "Este correo ya está registrado.";
                mensaje.style.color = "red";
                return;
            }
            
            const nuevoUsuario = { nombre, correo, telefono, password };
            usuarios.push(nuevoUsuario);
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
            localStorage.setItem("usuarioActual", JSON.stringify(nuevoUsuario));
            
            mensaje.textContent = "Registro realizado correctamente.";
            mensaje.style.color = "green";
            setTimeout(() => { window.location.href = "usuario.html"; }, 1000);
        });
    }

    
    // 3. FORMULARIO DE RESERVA (DINÁMICO)
    
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

        if (config) {
            if (inputPersonas) {
                inputPersonas.setAttribute("min", config.min);
                inputPersonas.setAttribute("max", config.max);
                inputPersonas.value = config.min;
            }
            if (infoPrecio) {
                infoPrecio.textContent = `Precio por persona: $${config.precio.toLocaleString("es-CL")}`;
                infoPrecio.style.color = "#0056b3"; 
                infoPrecio.style.fontWeight = "bold";
            }
            if (selectFecha) {
                selectFecha.innerHTML = "";
                config.fechas.forEach(fecha => {
                    selectFecha.innerHTML += `<option value="${fecha}">${fecha}</option>`;
                });
                selectFecha.value = config.fechas[0];
            }
            if (selectHora) {
                selectHora.innerHTML = "";
                config.horas.forEach(hora => {
                    selectHora.innerHTML += `<option value="${hora}">${hora}</option>`;
                });
                selectHora.value = config.horas[0];
            }
        }
    }

    if (selectExperiencia) {
        selectExperiencia.addEventListener("change", actualizarFormularioReserva);
        const experienciaSeleccionada = localStorage.getItem("experienciaSeleccionada");
        if (experienciaSeleccionada) {
            selectExperiencia.value = experienciaSeleccionada;
            actualizarFormularioReserva();
        } else {
            actualizarFormularioReserva();
        }
    }

    if (formularioReserva) {
        const usuarioActual = localStorage.getItem("usuarioActual");
        const botonSubmit = formularioReserva.querySelector("button[type='submit']");
        
        if (!usuarioActual && botonSubmit) {
            botonSubmit.type = "button";
            botonSubmit.textContent = "Regístrate para reservar";
            botonSubmit.style.backgroundColor = "#cccccc59";
            botonSubmit.style.color = "#a11212";
            botonSubmit.style.cursor = "not-allowed";
            botonSubmit.addEventListener("click", function() {
                alert("Para poder realizar una reserva, primero debes registrarte.");
                window.location.href = "registro.html";
            });
        }

        if (!formularioReserva.dataset.listenerAgregado) {
            formularioReserva.dataset.listenerAgregado = "true";

            formularioReserva.addEventListener("submit", function (event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                const mensaje = document.getElementById("mensajeReserva");
                
                if (!localStorage.getItem("usuarioActual")) {
                    if(mensaje) { mensaje.textContent = "Debes estar registrado para reservar."; mensaje.style.color = "red"; }
                    return;
                }
                
                const experiencia = selectExperiencia ? selectExperiencia.options[selectExperiencia.selectedIndex].value : "";
                const fecha = selectFecha ? selectFecha.value : "";
                const hora = selectHora ? selectHora.value : "";
                const personas = inputPersonas ? Number(inputPersonas.value) : 1;
                const comentario = document.getElementById("comentario")?.value || "";
                
                if (!experiencia || !experienciasData[experiencia]) return;
                
                const datosExp = experienciasData[experiencia];
                const reserva = {
                    nombre: experiencia,
                    precio: datosExp.precio,
                    categoria: datosExp.categoria,
                    imagen: datosExp.imagen,
                    fecha: fecha,
                    hora: hora || "Por definir",
                    personas: personas,
                    comentario: comentario,
                    tipo: "reserva"
                };
                
                let carrito = obtenerCarritoLocal();
                carrito.push(reserva);
                guardarCarritoLocal(carrito);
                
                if (mensaje) {
                    mensaje.innerHTML = `
                        <div class="confirmacion-reserva p-3 border rounded bg-light mt-3">
                            <div class="text-success fw-bold">✓ ¡Reserva realizada correctamente!</div>
                            <p class="mb-1">Tu reserva para <strong>${experiencia}</strong> ha sido registrada.</p>
                            <p class="mb-1"><strong>Fecha:</strong> ${fecha} | <strong>Hora:</strong> ${hora || 'Por definir'}</p>
                            <p class="mb-1"><strong>Personas:</strong> ${personas}</p>
                            <p class="mb-2"><strong>Total:</strong> $${(datosExp.precio * personas).toLocaleString("es-CL")}</p>
                            <a href="carrito.html" class="btn btn-primary btn-sm">Ver carrito</a>
                        </div>
                    `;
                    mensaje.scrollIntoView({ behavior: "smooth", block: "center" });
                } else {
                    window.location.href = "carrito.html";
                }
            }, { once: true });
        }
    }

    // 4. CARRITO Y RESUMEN GENERAL
    const listaCarrito = document.getElementById("listaCarrito");

    function mostrarCarrito() {
        if (!listaCarrito) return;

        let carrito = obtenerCarritoLocal();
        listaCarrito.innerHTML = "";

        if (carrito.length === 0) {
            listaCarrito.innerHTML = `
                <div class="carrito-vacio text-center p-5">
                    <h3>Tu carrito está vacío</h3>
                    <p>Agrega una experiencia para comenzar.</p>
                    <a href="reserva.html" class="btn btn-primary mt-2">Reservar experiencia</a>
                </div>
            `;
            
            document.getElementById("resumenEventos").textContent = "0";
            document.getElementById("resumenPersonas").textContent = "0";
            document.getElementById("resumenFechas").textContent = "-";
            document.getElementById("resumenHorarios").textContent = "-";
            document.getElementById("resumenTotal").textContent = "$0";
            return;
        }

        let totalPrecio = 0;
        let totalPersonas = 0;
        let fechasUnicas = new Set();
        let horasUnicas = new Set();

        const boletaDiv = document.createElement("div");
        boletaDiv.className = "d-flex flex-column gap-3 w-100";

        carrito.forEach(function (experiencia, index) {
            const numPersonas = Number(experiencia.personas) || 1;
            const precioUnitario = Number(experiencia.precio) || 0;
            const subtotal = precioUnitario * numPersonas;
            
            totalPrecio += subtotal;
            totalPersonas += numPersonas;
            
            if (experiencia.fecha) fechasUnicas.add(experiencia.fecha);
            if (experiencia.hora) horasUnicas.add(experiencia.hora);

            const tarjetaItem = document.createElement("div");
            tarjetaItem.className = "tarjeta-carrito d-flex flex-column flex-md-row align-items-center justify-content-between p-3 border rounded shadow-sm bg-white gap-3";
            tarjetaItem.innerHTML = `
                <div class="d-flex align-items-center gap-3 w-100">
                    <img src="${experiencia.imagen}" alt="${experiencia.nombre}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                    <div class="flex-grow-1">
                        ${experiencia.categoria ? `<span class="badge bg-secondary mb-1">${experiencia.categoria}</span>` : ""}
                        <h5 class="mb-1">${experiencia.nombre}</h5>
                        <p class="mb-1 text-muted small"><strong>Fecha:</strong> ${experiencia.fecha || "Por definir"} | <strong>Hora:</strong> ${experiencia.hora || "Por definir"}</p>
                        <p class="mb-1 text-muted small"><strong>Personas:</strong> ${numPersonas} | <strong>Subtotal:</strong> $${subtotal.toLocaleString("es-CL")}</p>
                        ${experiencia.comentario ? `<p class="mb-0 text-muted small"><em>Comentario:</em> ${experiencia.comentario}</p>` : ""}
                    </div>
                </div>
                <button class="btn btn-outline-danger btn-sm text-nowrap" onclick="window.eliminarDelCarrito(${index})">Eliminar</button>
            `;
            boletaDiv.appendChild(tarjetaItem);
        });

        listaCarrito.appendChild(boletaDiv);

        document.getElementById("resumenEventos").textContent = carrito.length;
        document.getElementById("resumenPersonas").textContent = totalPersonas;
        document.getElementById("resumenFechas").textContent = Array.from(fechasUnicas).join(", ") || "-";
        document.getElementById("resumenHorarios").textContent = Array.from(horasUnicas).join(", ") || "-";
        document.getElementById("resumenTotal").textContent = "$" + totalPrecio.toLocaleString("es-CL");

        const btnPagar = document.getElementById("btnPagarCarrito");
        if (btnPagar) {
            btnPagar.onclick = function () {
                const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
                const correoDestino = usuarioActual ? usuarioActual.correo : "usuario@experienciaya.cl";

                let detalleCompra = carrito.map(item => 
                    `- ${item.nombre} | Fecha: ${item.fecha} | Hora: ${item.hora} | Personas: ${item.personas} | Subtotal: $${(item.precio * item.personas).toLocaleString("es-CL")}`
                ).join("\n");

                alert(`¡Pago realizado con éxito!\n\nSe ha enviado un correo a: ${correoDestino}\n\nResumen:\n${detalleCompra}\n\nMonto Total: $${totalPrecio.toLocaleString("es-CL")}`);

                guardarCarritoLocal([]);
                mostrarCarrito();
            };
        }
    }

    if (listaCarrito) {
        mostrarCarrito();
    }

    window.eliminarDelCarrito = function (index) {
        let carrito = obtenerCarritoLocal();
        carrito.splice(index, 1);
        guardarCarritoLocal(carrito);
        mostrarCarrito();
    };

    window.vaciarCarrito = function () {
        if (confirm("¿Estás seguro de que deseas eliminar todas las experiencias?")) {
            guardarCarritoLocal([]); 
            mostrarCarrito();
        }
    };

    // 5. CERRAR SESIÓN Y LOGIN
    document.addEventListener("click", function(e) {
        const target = e.target.closest("#cerrarSesion, .btn-cerrar-sesion, [href*='logout']");
        if (target) {
            e.preventDefault();
            localStorage.removeItem("usuarioActual");
            window.location.href = "registro.html";
        }
    });

    const formularioLogin = document.getElementById("formularioLogin");
    if (formularioLogin) {
        formularioLogin.addEventListener("submit", function (event) {
            event.preventDefault();
            const correo = document.getElementById("loginCorreo").value.trim().toLowerCase();
            const password = document.getElementById("loginPassword").value;
            const mensaje = document.getElementById("mensajeLogin");

            let usuarios = [];
            try {
                const stored = localStorage.getItem("usuarios");
                usuarios = stored ? JSON.parse(stored) : [];
            } catch (error) {
                usuarios = [];
            }

            const usuarioEncontrado = usuarios.find(u => u.correo === correo && u.password === password);

            if (usuarioEncontrado) {
                localStorage.setItem("usuarioActual", JSON.stringify(usuarioEncontrado));
                mensaje.textContent = "¡Inicio de sesión exitoso! Redirigiendo...";
                mensaje.style.color = "green";
                setTimeout(() => {
                    window.location.href = "usuario.html";
                }, 1000);
            } else {
                mensaje.textContent = "Correo o contraseña incorrectos.";
                mensaje.style.color = "red";
            }
        });
    }

    try {
        const storedUser = localStorage.getItem("usuarioActual");
        const elNombre = document.getElementById("nombre");
        const elCorreo = document.getElementById("correo");
        const elTelefono = document.getElementById("telefono");

        if (storedUser) {
            const usuario = JSON.parse(storedUser);
            if (elNombre) elNombre.textContent = usuario.nombre || "";
            if (elCorreo) elCorreo.textContent = usuario.correo || "";
            if (elTelefono) elTelefono.textContent = usuario.telefono || "";
        } else {
            if (elNombre) elNombre.textContent = "";
            if (elCorreo) elCorreo.textContent = "";
            if (elTelefono) elTelefono.textContent = "";
        }
    } catch (error) {
        console.error("Error al cargar los datos del usuario", error);
    }
});