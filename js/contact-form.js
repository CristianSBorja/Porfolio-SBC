document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById("formularioDeContacto");
    const estado = document.getElementById("estado");
    const baseClasses = "text-center font-medium min-h-[1.5rem] mt-2"; 
    
    // >>> CONFIGURACIÓN: Reemplace por su dirección real si hace falta
    const RECIPIENT_EMAIL = "alexxe@fi.unju.edu.ar, diciembre93@gmail.com, Lobo.23ag.18@gmail.com";
    
    if (!formulario || !estado) {
        console.warn("ADVERTENCIA: Formulario de contacto o elemento de estado no encontrado. La función de contacto no se inicializó.");
        return;
    }

    function mandoElFormulario(event) {
        event.preventDefault();

        const name = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim();
        const mensaje = document.getElementById("message").value.trim();
        const elEmailEsValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        estado.textContent = "";
        estado.className = baseClasses;

        if (!name || !email || !mensaje) {
            estado.textContent = "Por favor, complete todos los campos";
            estado.className = `error ${baseClasses}`;
            return;
        }
        if (!elEmailEsValido.test(email)) {
            estado.textContent = "Email inválido. Verifique el formato.";
            estado.className = `error ${baseClasses}`;
            return;
        }

        const subject = encodeURIComponent(`Nuevo Mensaje de Contacto de: ${name}`);
        const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${mensaje}`);

        const mailtoLink = `mailto:${RECIPIENT_EMAIL}?subject=${subject}&body=${body}`;

        window.location.href = mailtoLink;

        estado.textContent = "Abriendo tu cliente de correo para enviar el mensaje... ¡Recuerda pulsar Enviar!";
        estado.className = `ok ${baseClasses}`;

        formulario.reset();
    }

    formulario.addEventListener("submit", mandoElFormulario);
});