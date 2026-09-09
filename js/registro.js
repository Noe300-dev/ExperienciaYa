function registrarUsuarioCliente(e) {
    e.preventDefault();

    const rut = document.getElementById("regRut").value.trim();
    const nombre = document.getElementById("regNombre").value.trim();
    const apellido = document.getElementById("regApellido").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const telefono = document.getElementById("regTelefono") ? document.getElementById("regTelefono").value.trim() : "";

    // Leer la lista global de usuarios
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Validar si el correo o RUT ya existen
    if (usuarios.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        alert("El correo electrónico ya se encuentra registrado.");
        return;
    }

    // Agregar nuevo usuario con rol 'Cliente'
    const nuevoUsuario = {
        rut,
        nombre,
        apellido,
        email,
        telefono,
        rol: "Cliente",
        fechaRegistro: new Date().toLocaleDateString("es-CL")
    };

    usuarios.push(nuevoUsuario);

    // Guardar en localStorage para que el administrador lo vea inmediatamente
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("¡Registro exitoso! Ya puedes iniciar sesión.");
    window.location.href = "login.html";
}