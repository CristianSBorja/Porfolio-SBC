// Importamos las funciones de Firebase desde el CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCfOtoBG9U3608rsXCJTMgzoTFIOMD3yy0",
  authDomain: "alpacadev-22e0a.firebaseapp.com",
  projectId: "alpacadev-22e0a",
  storageBucket: "alpacadev-22e0a.firebasestorage.app",
  messagingSenderId: "569499168798",
  appId: "1:569499168798:web:331a22f5c3d937364a7e0f",
  measurementId: "G-JTJS7GDDG7"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById("formularioDeContacto");
    const estado = document.getElementById("estado");
    const baseClasses = "text-center font-medium min-h-[1.5rem] mt-2"; 
    
    if (!formulario || !estado) {
        console.warn("ADVERTENCIA: Formulario de contacto o elemento de estado no encontrado. La función de contacto no se inicializó.");
        return;
    }

    async function mandoElFormulario(event) {
        event.preventDefault();

        const name = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim();
        const mensaje = document.getElementById("message").value.trim();
        const elEmailEsValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        estado.textContent = "Enviando...";
        estado.className = baseClasses;

        if (!name || !email || !mensaje) {
            estado.textContent = "Por favor, complete todos los campos";
            estado.className = `error ${baseClasses} text-red-500`;
            return;
        }
        if (!elEmailEsValido.test(email)) {
            estado.textContent = "Email inválido. Verifique el formato.";
            estado.className = `error ${baseClasses} text-red-500`;
            return;
        }

        try {
            // Guardar en la colección "mensajes" de Firestore
            await addDoc(collection(db, "mensajes"), {
                nombre: name,
                email: email,
                mensaje: mensaje,
                fecha: new Date()
            });

            estado.textContent = "¡Mensaje enviado con éxito! Gracias por contactarnos.";
            estado.className = `ok ${baseClasses} text-green-500`;
            formulario.reset();
        } catch (error) {
            console.error("Error al guardar en Firebase:", error);
            estado.textContent = "Hubo un error al enviar el mensaje. Intente nuevamente.";
            estado.className = `error ${baseClasses} text-red-500`;
        }
    }

    formulario.addEventListener("submit", mandoElFormulario);
});