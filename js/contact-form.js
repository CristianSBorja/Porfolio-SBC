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

    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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

        // Quitamos espacios y preparamos el enlace de Gmail para todos los casos
        const recipients = RECIPIENT_EMAIL.replace(/\s+/g, '');
        const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipients}&su=${subject}&body=${body}`;

        if (isMobile()) {
            // En móviles usamos location.href para intentar forzar la apertura de la App de Gmail (App Links)
            window.location.href = gmailLink;
            estado.textContent = "Abriendo Gmail...";
        } else {
            const newWindow = window.open(gmailLink, '_blank');
            if (!newWindow) window.location.href = gmailLink;
            estado.textContent = "Abriendo Gmail para enviar el mensaje... ¡Recuerda pulsar Enviar!";
        }

        estado.className = `ok ${baseClasses}`;

        formulario.reset();
    }

    formulario.addEventListener("submit", mandoElFormulario);
});