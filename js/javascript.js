document.addEventListener("DOMContentLoaded", function () {
// REGISTRO
const formularioRegistro = document.getElementById("formularioRegistro");
if (formularioRegistro) {
    formularioRegistro.addEventListener("submit", function (event) {
        event.preventDefault();
        const nombre =document.getElementById("nombre").value.trim();
        const correo =document.getElementById("correo").value.trim().toLowerCase();
        const telefono = document.getElementById("telefono").value.trim();
        const password =document.getElementById("password").value;
        const confirmarPassword = document.getElementById("confirmarPassword").value;
        const mensaje = document.getElementById("mensajeRegistro");
        // VALIDAR CORREO
        const correosPermitidos = [
            "@gmail.com",
            "@duocuc.cl",
            "@profesor.cl"
        ];
        const correoValido =correosPermitidos.some(function (dominio) {
                return correo.endsWith(dominio);
            });

        if (!correoValido) {
            mensaje.textContent = "Correo no válido. Solo se permiten correos @gmail.com, @duocuc.cl o @profesor.cl.";
            mensaje.style.color = "red";
            return;
        }
        // VALIDAR CONTRASEÑA
        if (password.length < 6) {
            mensaje.textContent = "La contraseña debe tener al menos 6 caracteres.";
            mensaje.style.color = "red";
            return;
        }
        // VALIDAR CONFIRMACIÓN
        if (password !== confirmarPassword) {
            mensaje.textContent = "Las contraseñas no coinciden.";
            mensaje.style.color = "red";
            return;
        }
        // OBTENER USUARIOS
        let usuarios = [];
        try {
            usuarios =JSON.parse(localStorage.getItem("usuarios")) || [];
        } catch (error) {
            usuarios = [];
        }
        // COMPROBAR CORREO EXISTENTE
        const correoExiste =  usuarios.some(function (usuario) {
                return usuario.correo === correo;
            });
        if (correoExiste) {
            mensaje.textContent = "Este correo ya está registrado.";
            mensaje.style.color = "red";
            return;
        }
        // CREAR USUARIO
        const nuevoUsuario = {
            nombre: nombre,
            correo: correo,
            telefono: telefono,
            password: password

        };
        // GUARDAR USUARIO
        usuarios.push(nuevoUsuario);
        localStorage.setItem( "usuarios", JSON.stringify(usuarios));
        // GUARDAR SESIÓN
        localStorage.setItem( "usuarioActual", JSON.stringify(nuevoUsuario));
        // MENSAJE
        mensaje.textContent =  "Registro realizado correctamente.";
        mensaje.style.color = "green";
        // IR AL PERFIL
        setTimeout(function () {
            window.location.href = "usuario.html";
        }, 1000);
    });

}

// BOTONES RESERVAR DESDE EXPERIENCIAS
const botonesReservar = document.querySelectorAll(".boton-reservar");
botonesReservar.forEach(function (boton) {
    boton.addEventListener("click", function (event) {
        // COMPROBAR REGISTRO
        const usuarioActual = localStorage.getItem("usuarioActual");
        if (!usuarioActual) {
            event.preventDefault();
            const mensajeCarrito =document.getElementById("mensajeCarrito");
            if (mensajeCarrito) {
                mensajeCarrito.textContent = "Debes estar registrado para reservar una experiencia.";
                mensajeCarrito.style.color = "red";
                mensajeCarrito.style.fontWeight = "bold";
                mensajeCarrito.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
            return;
        }
        // GUARDAR EXPERIENCIA SELECCIONADA
        const experienciaSeleccionada = boton.dataset.experiencia;
        localStorage.setItem( "experienciaSeleccionada", experienciaSeleccionada );
    });
});
// CARGAR EXPERIENCIA SELECCIONADA EN RESERVA
const selectExperiencia =  document.getElementById("experiencia");
if (selectExperiencia) {
    const experienciaSeleccionada = localStorage.getItem("experienciaSeleccionada");
    if (experienciaSeleccionada) {
        selectExperiencia.value =  experienciaSeleccionada;
    }
}
// RESERVA
const formularioReserva = document.getElementById("formularioReserva");
if (formularioReserva) {
    formularioReserva.addEventListener("submit", function (event) {
        event.preventDefault();
        const mensaje = document.getElementById("mensajeReserva");
        // COMPROBAR SI ESTÁ REGISTRADO
        const usuarioActual = localStorage.getItem("usuarioActual");
        if (!usuarioActual) {
            mensaje.textContent = "Debes estar registrado para reservar una experiencia.";
            mensaje.style.color = "red";
            mensaje.style.fontWeight = "bold";
            mensaje.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            return;
        }
        // OBTENER DATOS
        const experiencia = document.getElementById("experiencia").value;
        const fecha = document.getElementById("fecha").value;
        const hora = document.getElementById("hora").value;
        const personas =Number(document.getElementById("personas").value );
        const comentarioElemento = document.getElementById("comentario");
        const comentario = comentarioElemento ? comentarioElemento.value : "";
        // VALIDACIONES
        if (experiencia === "") {
            mensaje.textContent ="Selecciona una experiencia.";
            mensaje.style.color = "red";
            return;
        }
        if (fecha === "") {
            mensaje.textContent ="Selecciona una fecha.";
            mensaje.style.color = "red";
            return;
        }
        if (hora === "") {
            mensaje.textContent = "Selecciona una hora.";
            mensaje.style.color = "red";
            return;
        }
        if (personas < 1 || personas > 10) {
            mensaje.textContent = "La cantidad de personas debe ser entre 1 y 10.";
            mensaje.style.color = "red";
            return;
        }
        // PRECIOS
        let precio = 0;
        if (experiencia === "Kayak en Santiago") {
            precio = 25000;
        } else if (experiencia === "Taller de ceramica") {
            precio = 18000;
        } else if (experiencia === "Clase de cocina") {
            precio = 30000;
        } else if (experiencia === "Experiencia de trekking") {
            precio = 15000;
        }
        // CATEGORÍA
        let categoria = "";
        if (experiencia === "Kayak en Santiago") {
            categoria = "Aventura";
        } else if (experiencia === "Taller de ceramica") {
            categoria = "Arte";
        } else if (experiencia === "Clase de cocina") {
            categoria = "Gastronomía";
        } else if (experiencia === "Experiencia de trekking") {
            categoria = "Deporte";
        }
        // IMAGEN
        let imagen = "";
        if (experiencia === "Kayak en Santiago") {
            imagen = "img/kayak.jpg";
        } else if (experiencia === "Taller de ceramica") {
            imagen = "img/ceramica.jpg";
        } else if (experiencia === "Clase de cocina") {
            imagen = "img/cocina.jpg";
        } else if (experiencia === "Experiencia de trekking") {
            imagen = "img/trekking.jpg";
        }
        // CREAR RESERVA
        const reserva = {
            nombre: experiencia,
            precio: precio,
            categoria: categoria,
            imagen: imagen,
            fecha: fecha,
            hora: hora,
            personas: personas,
            comentario: comentario,
            tipo: "reserva"
        };
        // OBTENER CARRITO
        let carrito = [];
        try {
            carrito = JSON.parse(  localStorage.getItem("carrito")) || [];
        } catch (error) {
            carrito = [];
        }
        // AGREGAR RESERVA
        carrito.push(reserva);
        // GUARDAR CARRITO
        localStorage.setItem("carrito", JSON.stringify(carrito)
        );
        // BORRAR EXPERIENCIA SELECCIONADA
        localStorage.removeItem( "experienciaSeleccionada"
        );
        // MENSAJE DE CONFIRMACIÓN
        mensaje.innerHTML = `
            <div class="confirmacion-reserva">
                <div class="icono-confirmacion">✓</div>
                <h3>¡Reserva realizada correctamente!</h3>
                <p> Tu reserva para<strong>${experiencia}</strong> ha sido registrada.</p>
                <p><strong>Fecha:</strong>${fecha}</p>
                <p> <strong>Hora:</strong>${hora}</p>
                <p> <strong>Personas:</strong>${personas}</p>
                <p><strong>Total:</strong>$${(precio * personas).toLocaleString("es-CL")}</p>
                <br>
                <a  href="carrito.html"  class="boton boton-principal"> Ver carrito</a>
            </div>
        `;
        mensaje.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });
}
// CARRITO
let carrito = [];
try {
    carrito = JSON.parse(  localStorage.getItem("carrito") ) || [];
} catch (error) {
    carrito = [];
}
// BOTONES AGREGAR AL CARRITO
const botonesCarrito =document.querySelectorAll(".boton-carrito");
botonesCarrito.forEach(function (boton) {
    boton.addEventListener("click", function (event) {
        const usuarioActual =localStorage.getItem("usuarioActual");
        if (!usuarioActual) {
            event.preventDefault();
            alert( "Debes estar registrado para agregar experiencias al carrito.");
            window.location.href ="registro.html";
            return;
        }
        const experiencia = {
            nombre:  boton.dataset.nombre,
            precio:Number(boton.dataset.precio ),
            categoria: boton.dataset.categoria,
            imagen:boton.dataset.imagen,
            tipo:"experiencia"
        };
        carrito.push(experiencia);
        localStorage.setItem("carrito",JSON.stringify(carrito));
        alert( experiencia.nombre +  " fue agregada al carrito.");
    });
});
// MOSTRAR CARRITO
const listaCarrito = document.getElementById("listaCarrito");
const totalCarrito = document.getElementById("totalCarrito");
if (listaCarrito) {
    mostrarCarrito();

}
// FUNCIÓN MOSTRAR CARRITO
function mostrarCarrito() {
    const contenidoCarrusel = document.getElementById("contenidoCarrusel");
    // Si tu HTML todavía usa listaCarrito, buscamos ambos
    const contenedor = contenidoCarrusel || listaCarrito;
    if (!contenedor) {
        return;
    }
    contenedor.innerHTML = "";
    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="carousel-item active">
                <div class="carrito-vacio text-center p-5">
                    <h3>Tu carrito está vacío</h3>
                    <p>Agrega una experiencia para comenzar.</p>
                    <a href="reserva.html" class="boton boton-principal">
                        Reservar experiencia
                    </a>
                </div>
            </div>
        `;
        if (totalCarrito) {
            totalCarrito.textContent = "$0";
        }
        const cantidadCarrito = document.getElementById("cantidadCarrito");
        if (cantidadCarrito) {
            cantidadCarrito.textContent = "0";
        }

        return;
    }

    let total = 0;

    carrito.forEach(function (experiencia, index) {
        let contenido = "";
        // RESERVA
        if (experiencia.tipo === "reserva") {
            const subtotal = experiencia.precio * experiencia.personas;
            total += subtotal;
            contenido = `
                <article class="tarjeta-carrito">
                    <img src="${experiencia.imagen}" alt="${experiencia.nombre}">
                    <div class="contenido-carrito">
                        <span class="etiqueta">${experiencia.categoria}</span>
                        <h3>${experiencia.nombre}</h3>
                        <p><strong>Fecha:</strong> ${experiencia.fecha}</p>
                        <p><strong>Hora:</strong>${experiencia.hora}</p>
                        <p><strong>Personas:</strong>${experiencia.personas}</p>
                        <p><strong>Precio por persona:</strong>$${experiencia.precio.toLocaleString("es-CL")}</p>
                        <p class="precio-experiencia"><strong>Total:</strong>$${subtotal.toLocaleString("es-CL")}</p>
                        ${ experiencia.comentario ? `
                            <p><strong>Comentario:</strong>${experiencia.comentario}</p>
                            `
                            :
                            ""
                        }
                        <button class="boton boton-secundario" onclick="eliminarDelCarrito(${index})"> Eliminar</button>
                    </div>
                </article>
            `;
        }
        // EXPERIENCIA NORMAL
        else {
            total += Number(experiencia.precio);
            contenido = `
                <article class="tarjeta-carrito">
                    <img src="${experiencia.imagen}" alt="${experiencia.nombre}">
                    <div class="contenido-carrito">
                        <span class="etiqueta"> ${experiencia.categoria}</span>
                        <h3>${experiencia.nombre}</h3>
                        <p class="precio-experiencia">
                            $${Number(experiencia.precio).toLocaleString("es-CL")}
                        </p>
                        <button class="boton boton-secundario"onclick="eliminarDelCarrito(${index})">Eliminar</button>
                    </div>
                </article>
            `;
        }
        // CREAR ITEM DEL CARRUSEL
        const itemCarrusel = document.createElement("div");
        itemCarrusel.className = "carousel-item" + (index === 0 ? " active" : "");
        itemCarrusel.innerHTML = `
            <div class="d-flex justify-content-center">
                ${contenido}
            </div>
        `;
        contenedor.appendChild(itemCarrusel);
    });
    // TOTAL
    if (totalCarrito) {
        totalCarrito.textContent =
            "$" + total.toLocaleString("es-CL");
    }
    // CANTIDAD
    const cantidadCarrito =
        document.getElementById("cantidadCarrito");
    if (cantidadCarrito) {
        cantidadCarrito.textContent = carrito.length;
    }
}
// VACIAR CARRITO
window.vaciarCarrito = function () {
        carrito = [];
        localStorage.setItem( "carrito", JSON.stringify(carrito));
        mostrarCarrito();
    };
// MOSTRAR DATOS DEL USUARIO
const nombreUsuario =  document.getElementById("nombreUsuario");
const correoUsuario = document.getElementById("correoUsuario");
const telefonoUsuario = document.getElementById("telefonoUsuario");
if (nombreUsuario) {
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
    if (!usuarioActual) {
        alert("Debes iniciar sesión.");
        window.location.href = "login.html";
    } else {
        nombreUsuario.textContent = usuarioActual.nombre || "";
        correoUsuario.textContent = usuarioActual.correo || "";
        telefonoUsuario.textContent = usuarioActual.telefono || "";
    }
}
// CERRAR SESIÓN
const btnCerrarSesion = document.getElementById("btnCerrarSesion");
if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener( "click", function () {
            localStorage.removeItem( "usuarioActual");
            alert( "Sesión cerrada correctamente.");
            window.location.href =  "index.html";
        }
    );
}
// FORMULARIO DE CONTACTO
const formularioContacto = document.getElementById("formularioContacto");
if (formularioContacto) {
    formularioContacto.addEventListener("submit", async function (event) {
        event.preventDefault();
        const mensaje = document.getElementById("resultadoContacto");
        const boton = formularioContacto.querySelector("button[type='submit']");
        boton.disabled = true;
        boton.textContent = "Enviando...";
        mensaje.textContent = "Enviando mensaje...";
        mensaje.style.color = "black";
        const datosFormulario = new FormData(formularioContacto);
        try {
            const respuesta = await fetch("https://formsubmit.co/ajax/admin.experienciaya@gmail.com",
                {
                    method: "POST",
                    headers: {
                        "Accept": "application/json"
                    },
                    body: datosFormulario
                }
            );
            const textoRespuesta = await respuesta.text();
            console.log("Código HTTP:", respuesta.status);
            console.log("Respuesta FormSubmit:", textoRespuesta);
            let resultado;
            try {
                resultado = JSON.parse(textoRespuesta);
            } catch (error) {
                resultado = null;
            }
            if (respuesta.ok && resultado && resultado.success === "true") {
                mensaje.textContent = "¡Mensaje enviado correctamente! Nos pondremos en contacto contigo.";
                mensaje.style.color = "green";
                formularioContacto.reset();
            } else {
                mensaje.textContent = "Error de FormSubmit: " + (resultado?.message || textoRespuesta || "No se pudo enviar el formulario.");
                mensaje.style.color = "red";
            }
        } catch (error) {
            console.error("Error al enviar:", error);
            mensaje.textContent =
                "No se pudo conectar con FormSubmit.";
            mensaje.style.color = "red";
        }
        boton.disabled = false;
        boton.textContent = "Enviar mensaje";
    });
}
});
