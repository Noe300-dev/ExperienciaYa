document.addEventListener("DOMContentLoaded", function () {
 const formularioRegistro = document.getElementById("formularioRegistro");
    if (formularioRegistro) {
        formularioRegistro.addEventListener("submit", function (event) {
            event.preventDefault();
            const password = document.getElementById("password").value;
            const confirmarPassword = document.getElementById("confirmarPassword").value;
            const mensaje = document.getElementById("mensajeRegistro");

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
            mensaje.textContent = "Registro realizado correctamente.";
            mensaje.style.color = "green";
            setTimeout(function () {
                window.location.href = "usuario.html";
            }, 1000);
        });
    }

    const formularioReserva =
        document.getElementById("formularioReserva");
    if (formularioReserva) {
        const parametros =
            new URLSearchParams(window.location.search);
        const experienciaURL =
            parametros.get("experiencia");
        if (experienciaURL) {
            document.getElementById("experiencia").value =
                experienciaURL;
        }
        formularioReserva.addEventListener("submit", function (event) {
            event.preventDefault();
            const experiencia =
                document.getElementById("experiencia").value;
            const fecha =
                document.getElementById("fecha").value;
            const hora =
                document.getElementById("hora").value;
            const personas =
                document.getElementById("personas").value;
            const mensaje =
                document.getElementById("mensajeReserva");
            if (experiencia === "") {
                mensaje.textContent = "Selecciona una experiencia.";
                mensaje.style.color = "red";
                return;
            }
            if (fecha === "") {
                mensaje.textContent = "Selecciona una fecha.";
                mensaje.style.color = "red";
                return;
            }
            if (hora === "") {
                mensaje.textContent = "Selecciona una hora.";
                mensaje.style.color = "red";
                return;
            }
            if (personas < 1) {
                mensaje.textContent = "La cantidad de personas debe ser válida.";
                mensaje.style.color = "red";
                return;
            }
            mensaje.innerHTML = `
                <div class="confirmacion-reserva">
                    <div class="icono-confirmacion">
                        ✓
                    </div>
                    <h3>
                        ¡Reserva realizada correctamente!
                    </h3>
                    <p>
                        Tu reserva para
                        <strong>${experiencia}</strong>
                        ha sido registrada.
                    </p>
                    <p>
                        <strong>Fecha:</strong>
                        ${fecha}
                    </p>
                    <p>
                        <strong>Hora:</strong>
                        ${hora}
                    </p>
                    <p>
                        <strong>Personas:</strong>
                        ${personas}
                    </p>
                    <p>
                        ¡Esperamos que disfrutes tu experiencia!
                    </p>
                </div>
            `;
            mensaje.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            formularioReserva.reset();
        });
    }
    const formularioContacto =
        document.getElementById("formularioContacto");
    if (formularioContacto) {
        formularioContacto.addEventListener("submit", function (event) {
            event.preventDefault();
            const resultado =
                document.getElementById("resultadoContacto");
            resultado.textContent =  "Mensaje enviado correctamente. Gracias por contactarnos.";
            resultado.style.color = "green";
            formularioContacto.reset();
        });
    }
    let carrito =
        JSON.parse(localStorage.getItem("carrito")) || [];
    const botonesCarrito =
        document.querySelectorAll(".boton-carrito");
    botonesCarrito.forEach(function (boton) {
        boton.addEventListener("click", function () {
            const experiencia = {
                nombre: boton.dataset.nombre,
                precio: Number(boton.dataset.precio),
                categoria: boton.dataset.categoria,
                imagen: boton.dataset.imagen
            };
            carrito.push(experiencia);
            localStorage.setItem(
                "carrito",
                JSON.stringify(carrito)
            );
            alert(
                experiencia.nombre +
                " fue agregada al carrito."
            );
        });
    });
    const listaCarrito =
        document.getElementById("listaCarrito");
    const totalCarrito =
        document.getElementById("totalCarrito");
    if (listaCarrito) {
        mostrarCarrito();
    }
    function mostrarCarrito() {
        listaCarrito.innerHTML = "";
        if (carrito.length === 0) {
            listaCarrito.innerHTML = `
                <div class="carrito-vacio">
                    <h3>
                        Tu carrito está vacío
                    </h3>
                    <p>
                        Agrega una experiencia para comenzar.
                    </p>
                    <a
                        href="usuario.html"
                        class="boton boton-principal">
                        Ver experiencias
                    </a>
                </div>
            `;
            totalCarrito.textContent = "$0";
            return;
        }
        let total = 0;
        carrito.forEach(function (experiencia, index) {
            total += experiencia.precio;
            listaCarrito.innerHTML += `
                <article class="tarjeta-carrito">
                    <img
                        src="${experiencia.imagen}"
                        alt="${experiencia.nombre}">
                    <div class="contenido-carrito">
                        <span class="etiqueta">
                            ${experiencia.categoria}
                        </span>
                        <h3>
                            ${experiencia.nombre}
                        </h3>
                        <p class="precio-experiencia">
                            $${experiencia.precio.toLocaleString("es-CL")}
                        </p>
                        <button
                            class="boton boton-secundario"
                            onclick="eliminarDelCarrito(${index})">
                            Eliminar
                        </button>
                    </div>
                </article>
            `;

        });
        totalCarrito.textContent =
            "$" + total.toLocaleString("es-CL");
    }
    window.eliminarDelCarrito = function (index) {
        carrito.splice(index, 1);
        localStorage.setItem(
            "carrito",
            JSON.stringify(carrito)
        );
        mostrarCarrito();
    };
    window.vaciarCarrito = function () {
        carrito = [];
        localStorage.setItem(
            "carrito",
            JSON.stringify(carrito)
        );
        mostrarCarrito();
    };
});