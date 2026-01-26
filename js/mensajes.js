// Importamos las funciones de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// --- CONFIGURACIÓN ---
// La misma configuración de tu contact-form.js
const firebaseConfig = {
  apiKey: "AIzaSyCfOtoBG9U3608rsXCJTMgzoTFIOMD3yy0",
  authDomain: "alpacadev-22e0a.firebaseapp.com",
  projectId: "alpacadev-22e0a",
  storageBucket: "alpacadev-22e0a.firebasestorage.app",
  messagingSenderId: "569499168798",
  appId: "1:569499168798:web:331a22f5c3d937364a7e0f",
  measurementId: "G-JTJS7GDDG7"
};

// Contraseña para acceder al buzón. ¡Cámbiala por una más segura!
const ACCESS_PASSWORD = "admindantitus"; // <-- CAMBIA ESTA CONTRASEÑA

// --- INICIALIZACIÓN ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- LÓGICA DE LA PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const messagesContainer = document.getElementById('messages-container');
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');
    const messagesList = document.getElementById('messages-list');

    // Enfocar el campo de contraseña al cargar
    if (passwordInput) passwordInput.focus();

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredPassword = passwordInput.value;

        if (enteredPassword === ACCESS_PASSWORD) {
            // Contraseña correcta
            loginContainer.classList.add('hidden');
            messagesContainer.classList.remove('hidden');
            loadMessages();
        } else {
            // Contraseña incorrecta
            loginError.textContent = 'Contraseña incorrecta.';
            passwordInput.value = '';
            passwordInput.focus();
        }
    });

    async function loadMessages() {
        messagesList.innerHTML = '<p class="text-center text-gray-400">Cargando mensajes...</p>';

        try {
            // Creamos una consulta para obtener los mensajes ordenados por fecha descendente
            const messagesQuery = query(collection(db, "mensajes"), orderBy("fecha", "desc"));
            const querySnapshot = await getDocs(messagesQuery);

            if (querySnapshot.empty) {
                messagesList.innerHTML = '<p class="text-center text-gray-400">No hay mensajes en el buzón.</p>';
                return;
            }

            // Limpiamos la lista antes de agregar los nuevos mensajes
            messagesList.innerHTML = '';

            querySnapshot.forEach(docSnapshot => {
                const message = docSnapshot.data();
                const messageId = docSnapshot.id;
                const isReplied = message.respondido === true;

                const messageElement = document.createElement('div');
                const borderClass = isReplied ? 'border-green-500/40' : 'border-gray-800';
                const bgClass = isReplied ? 'bg-green-900/10' : 'bg-gray-900/40';
                
                messageElement.className = `${bgClass} backdrop-blur-sm p-6 rounded-xl border ${borderClass} hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/5 group w-full max-w-full`;

                // Formatear la fecha
                const date = message.fecha.toDate();
                const formattedDate = date.toLocaleString('es-ES', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });

                messageElement.innerHTML = `
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                        <div class="flex items-center gap-4 w-full md:w-auto">
                            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center text-white font-bold text-xl shadow-inner shrink-0">
                                ${message.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div class="min-w-0 flex-1">
                                <h3 class="font-bold text-white text-lg leading-tight group-hover:text-blue-400 transition-colors truncate">${message.nombre}</h3>
                                <a href="mailto:${message.email}" class="text-sm text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1.5 mt-0.5 truncate">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                                    ${message.email}
                                </a>
                            </div>
                        </div>
                        
                        <div class="flex flex-row md:flex-col items-center md:items-end gap-3 w-full md:w-auto justify-between md:justify-start">
                            <div class="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-950/50 px-3 py-1.5 rounded-full border border-gray-800/50">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                ${formattedDate}
                            </div>
                            
                            <div class="flex gap-2">
                                <button class="btn-reply p-2 rounded-lg transition-colors ${isReplied ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}" title="${isReplied ? 'Marcar como no leído' : 'Marcar como respondido'}">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                                </button>
                                <button class="btn-delete p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Eliminar mensaje">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-950/30 p-4 rounded-lg border border-gray-800/30 text-gray-300 whitespace-pre-wrap break-words leading-relaxed text-sm md:text-base">
                        ${message.mensaje}
                    </div>
                `;

                // Eventos de los botones
                messageElement.querySelector('.btn-reply').addEventListener('click', () => toggleReply(messageId, isReplied));
                messageElement.querySelector('.btn-delete').addEventListener('click', () => deleteMessage(messageId));

                messagesList.appendChild(messageElement);
            });

        } catch (error) {
            console.error("Error al cargar los mensajes:", error);
            messagesList.innerHTML = '<p class="text-center text-red-500">Error al cargar los mensajes. Revisa la consola para más detalles.</p>';
        }
    }

    async function toggleReply(id, currentStatus) {
        try {
            const msgRef = doc(db, "mensajes", id);
            await updateDoc(msgRef, { respondido: !currentStatus });
            loadMessages(); // Recargar para ver cambios
        } catch (error) {
            console.error("Error al actualizar estado:", error);
        }
    }

    async function deleteMessage(id) {
        if (confirm("¿Estás seguro de que deseas eliminar este mensaje permanentemente?")) {
            try {
                await deleteDoc(doc(db, "mensajes", id));
                loadMessages(); // Recargar para ver cambios
            } catch (error) {
                console.error("Error al eliminar:", error);
            }
        }
    }
});