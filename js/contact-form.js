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

        // Detectar si es un dispositivo móvil
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            // En celulares: Usamos mailto para abrir la App de correo (Gmail, Outlook, etc.)
            window.location.href = `mailto:${RECIPIENT_EMAIL}?subject=${subject}&body=${body}`;
            estado.textContent = "Abriendo tu aplicación de correo... ¡Recuerda pulsar Enviar!";
        } else {
            // En computadoras: Abrimos Gmail Web en una nueva pestaña
            const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${RECIPIENT_EMAIL}&su=${subject}&body=${body}`;
            window.open(gmailLink, '_blank');
            estado.textContent = "Abriendo Gmail para enviar el mensaje... ¡Recuerda pulsar Enviar!";
        }
        
        estado.className = `ok ${baseClasses}`;

        formulario.reset();
    }

    formulario.addEventListener("submit", mandoElFormulario);
});