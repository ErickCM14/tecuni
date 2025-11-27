
// Este objeto define el contenido que cambiará por cada carrera
const carreraData = {
    // Valor del atributo 'value' del <option>
    "presencial-administracion": {
        imageSrc: "/src/assets/img_presencial_administracion.png", 
        titleText: "<span class=\"highlight-text\">Administración</span> Presencial", 
        descriptionText: "Lidera empresas <span>estudiando en 3 años</span>, elige <span>semanal o sabatino</span>. Incluye <span>4 diplomados</span> con <span>validez SEP</span>. Sin gastos en libros ni uniformes. <span>Mensualidad congelada: $2,940.00 MXN</span>"
    },
    "presencial-derecho": {
        imageSrc: "/src/assets/img_presencial_derecho.png",
        titleText: "<span class=\"highlight-text\">Derecho</span> Presencial",     
        descriptionText: "Formate como <span>abogado</span> con casos prácticos. Asiste entre semana osábados. <span>Titulo SEP, 4 diplomados</span> y mensualidad fija de <span>$2,940.00 MXN</span> calidad académica accesible para ti."  
    },
    "presencial-mercadotecnia": {
        imageSrc: "/src/assets/img_presencial_mercadotecnica.png",
        titleText: "<span class=\"highlight-text\">Mercadotecnia y Publicidad</span> Presencial",
        descriptionText: "Crea campañas realies en clase. Modalidad <span>semanal o sabatina</span> con <span>Validez SEP</span>, suma <span> 4 diplomados a tu perfil, mensualidad fija de <span>$2,940.00 MXN</span> sin gastos extra."
    },
    "online-administracion": {
        imageSrc: "/src/assets/img_online_administracion.png", 
        titleText: "<span class=\"highlight-text\">Administración</span> Online", 
        descriptionText: "Lidera empresas <span>estudiando en 3 años</span>, elige <span>semanal o sabatino</span>. Incluye <span>4 diplomados</span> con <span>validez SEP</span>. Sin gastos en libros ni uniformes. <span>Mensualidad congelada: $2,940.00 MXN</span>"
    },
    "online-derecho": {
        imageSrc: "/src/assets/img_online_derecho.png",
        titleText: "<span class=\"highlight-text\">Derecho</span> Online",     
        descriptionText: "Formate como <span>abogado</span> con casos prácticos. Asiste entre semana osábados. <span>Titulo SEP, 4 diplomados</span> y mensualidad fija de <span>$2,940.00 MXN</span> calidad académica accesible para ti."  
    },
    "online-mercadotecnia": {
        imageSrc: "/src/assets/img_online_mercadotecnia.png",
        titleText: "<span class=\"highlight-text\">Mercadotecnia y Publicidad</span> Online",
        descriptionText: "Crea campañas realies en clase. Modalidad <span>semanal o sabatina</span> con <span>Validez SEP</span>, suma <span> 4 diplomados a tu perfil, mensualidad fija de <span>$2,940.00 MXN</span> sin gastos extra."
    },
    "online-produccion": {
        imageSrc: "/src/assets/img_online_produccion.png",
        titleText: "<span class=\"highlight-text\">Producción de TV y Plataformas Digitales</span> Online",
        descriptionText: "Domina producción audiovisual <span>en solo 3 años</span>. Asiste entre semana o sábados. <span>Titulo SEP y 4 diplomados</span>. todo por una mensualidad fija de <span>$2,940.00 MXN</span>."  
    },
    // Si se selecciona la opción deshabilitada (por defecto), puedes restaurar el estado inicial
    "default": {
        imageSrc: "src/assets/img_profesional.png",
        titleText: "Elige presencial u Online", 
        descriptionText: "Define tu camino en modalidad <span>online</span> o <span>presencial</span>. Nuestras licenciaturas ofrecen planes de estudio optimizados y evaluaciones prácticas, brindándote la calidad y flexibilidad necesarias para impulsar tu éxito profesional sin límites."
        
    }
};

const opcionesCarrera = {
    // Valores de 'value' del botón switch: "presencial" o "online"
    "presencial": [
        { value: "presencial-administracion", text: "Administración" },
        { value: "presencial-derecho", text: "Derecho" },
        { value: "presencial-mercadotecnia", text: "Mercadotecnia y Publicidad" },
        // ... Agrega aquí todas las carreras presenciales
    ],
    "online": [
        { value: "online-administracion", text: "Administración" },
        { value: "online-derecho", text: "Derecho" },
        { value: "online-mercadotecnia", text: "Mercadotecnia y Publicidad" },
        { value: "online-produccion", text: "Producción de TV y plataformas digitales" },
        // ... Agrega aquí todas las carreras online
    ]
};

document.addEventListener('DOMContentLoaded', function() {

    // -----------------------------------------------------------
    // 1. LÓGICA DEL BOTÓN SWITCH (Presencial/Online)
    // -----------------------------------------------------------
    const switchContainer = document.querySelector('.modo-switch');
    if (switchContainer) {
        const buttons = switchContainer.querySelectorAll('button');

        buttons.forEach(button => {
            button.addEventListener('click', function() {
                buttons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                    btn.style.backgroundColor = '#fff';
                    btn.style.color = 'var(--orange-accent)';
                });

                this.classList.add('active');
                this.setAttribute('aria-pressed', 'true');
                this.style.backgroundColor = 'var(--orange-accent)';
                this.style.color = '#fff';
            });
        });

        const initialActive = document.querySelector('.modo-switch button[aria-pressed="true"]');
        if (initialActive) {
            initialActive.classList.add('active');
            initialActive.style.backgroundColor = 'var(--orange-accent)';
            initialActive.style.color = '#fff';
        }
    }
    const carreraDropdown = document.getElementById('carrera'); 

    function updateCarreraOptions(mode) {
        if (!carreraDropdown) return;

        // 1. Limpiar las opciones existentes
        carreraDropdown.innerHTML = '';

        // 2. Crear la opción por defecto (Selecciona una carrera)
        const defaultOption = document.createElement('option');
        defaultOption.value = "default";
        defaultOption.textContent = "Selecciona una carrera";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        carreraDropdown.appendChild(defaultOption);

        // 3. Obtener las opciones de la modalidad seleccionada
        const options = opcionesCarrera[mode];

        if (options) {
            options.forEach(carrera => {
                const option = document.createElement('option');
                option.value = carrera.value;
                option.textContent = carrera.text;
                carreraDropdown.appendChild(option);
            });
        }
        
        // 4. Disparar el evento 'change' en el select si deseas restablecer la imagen/texto
        // Esto es útil si ya tenías implementada la lógica del select en un archivo separado
        carreraDropdown.dispatchEvent(new Event('change'));
    }

    if (switchContainer) {
        const buttons = switchContainer.querySelectorAll('button');

        buttons.forEach(button => {
            button.addEventListener('click', function() {
                // Lógica de estilos (lo que ya tenías)
                buttons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                    btn.style.backgroundColor = '#fff';
                    btn.style.color = 'var(--orange-accent)';
                });

                this.classList.add('active');
                this.setAttribute('aria-pressed', 'true');
                this.style.backgroundColor = 'var(--orange-accent)';
                this.style.color = '#fff';
                
                // 🚀 Llama la función para actualizar el SELECT
                const mode = this.getAttribute('data-mode'); // Asegúrate de tener data-mode en tus botones
                updateCarreraOptions(mode);
            });
        });

        // Inicialización: Establece el estado inicial al cargar la página
        const initialActive = document.querySelector('.modo-switch button[aria-pressed="true"]');
        if (initialActive) {
            // Aplica estilos
            initialActive.classList.add('active');
            initialActive.style.backgroundColor = 'var(--orange-accent)';
            initialActive.style.color = '#fff';
            
            // 🚀 Rellena el SELECT al cargar
            const initialMode = initialActive.getAttribute('data-mode');
            updateCarreraOptions(initialMode);
        }
    }

    // -----------------------------------------------------------
    // 2. FUNCIONALIDAD DE CARRUSEL ENCAPSULADA (REUTILIZABLE)
    // -----------------------------------------------------------
    function initCarousel(containerId, prevId, nextId, dotsId) {
        
        const carouselContainer = document.getElementById(containerId);
        const prevButton = document.getElementById(prevId);
        const nextButton = document.getElementById(nextId);
        const dotsContainer = document.getElementById(dotsId);
        
        // Si algún elemento clave falta, detenemos la inicialización
        if (!carouselContainer || !dotsContainer || !prevButton || !nextButton) return; 

        const dots = dotsContainer.querySelectorAll('.dot');
        const slideCount = dots.length;
        let slideWidth = carouselContainer.offsetWidth;
        let autoplayInterval; 
        const AUTOPLAY_TIME = 6000; // 6 segundos

        // Asignar el ancho correcto a los slides (Necesario para que el scroll funcione)
        const slides = carouselContainer.querySelectorAll('.slide');
        slides.forEach(slide => {
            slide.style.minWidth = `${slideWidth}px`;
        });
        
        // --- Core Logic ---

        function getVisualSlideIndex() {
            return Math.round(carouselContainer.scrollLeft / slideWidth);
        }
        
        function updateDotsBasedOnScroll() {
            const currentSlideIndex = getVisualSlideIndex();

            dots.forEach((dot, i) => {
                dot.classList.remove('active');
                if (i === currentSlideIndex) {
                    dot.classList.add('active');
                }
            });
        }

        function navigateToSlide(index) {
            let newIndex = index;
            // Lógica de loop (ir del último al primero, o viceversa)
            if (newIndex < 0) {
                newIndex = slideCount - 1; 
            } else if (newIndex >= slideCount) {
                newIndex = 0; 
            }

            const scrollPosition = newIndex * slideWidth;
            
            carouselContainer.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
        
        // --- Autoplay & Events ---

        function startAutoplay() {
            clearInterval(autoplayInterval); 
            autoplayInterval = setInterval(() => {
                const currentSlide = getVisualSlideIndex();
                navigateToSlide(currentSlide + 1);
            }, AUTOPLAY_TIME); 
        }

        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }

        // Navegación manual (reinicia el autoplay después de la interacción)
        prevButton.addEventListener('click', () => {
            stopAutoplay();
            navigateToSlide(getVisualSlideIndex() - 1);
            startAutoplay();
        });

        nextButton.addEventListener('click', () => {
            stopAutoplay();
            navigateToSlide(getVisualSlideIndex() + 1);
            startAutoplay();
        });

        // Navegación por puntos
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoplay();
                navigateToSlide(index);
                startAutoplay();
            });
        });

        // Detección de Scroll (manual o por script)
        carouselContainer.addEventListener('scroll', updateDotsBasedOnScroll);
        
        // Redimensionamiento
        window.addEventListener('resize', () => {
            slideWidth = carouselContainer.offsetWidth; 
            updateDotsBasedOnScroll();
            const currentSlideIndex = getVisualSlideIndex();
            // Mantiene el carrusel en el mismo slide visualmente
            carouselContainer.scrollLeft = currentSlideIndex * slideWidth; 
            slides.forEach(slide => {
                slide.style.minWidth = `${slideWidth}px`;
            });
        });

        // INICIALIZACIÓN: Arranca el autoplay al cargar
        updateDotsBasedOnScroll();
        startAutoplay();
    }
    
    // -----------------------------------------------------------
    // 3. INICIALIZAR AMBOS CAROUSELES
    // -----------------------------------------------------------

    // 1. Carrusel Principal (Header)
    initCarousel(
        'principal-carousel-container', 
        'principal-prev', 
        'principal-next', 
        'principal-dots'
    );

    // 2. Carrusel de Campus
    initCarousel(
        'campus-carousel-container', 
        'campus-prev', 
        'campus-next', 
        'campus-dots'
    );
});
document.addEventListener('DOMContentLoaded', function() {

    // -----------------------------------------------------------
    // 3. LÓGICA DE ACTUALIZACIÓN DE CARRERA Y CONTENIDO
    // -----------------------------------------------------------
    
    // 1. Obtener los elementos del DOM
    const carreraDropdown = document.getElementById('carrera');
    const introImage = document.querySelector('.imagen-profesionista');
    const titleDiv = document.querySelector('.elige-presencial-u-online');
    const descriptionDiv = document.querySelector('.descripcion-carrera');
    
       // 2. Manejar el cambio de selección   

    if (carreraDropdown && introImage && titleDiv) {
        carreraDropdown.addEventListener('change', function() {
            // Captura el valor seleccionado del dropdown
            const selectedValue = this.value;
            let data = carreraData[selectedValue];

            // Si el valor no tiene datos definidos (ej. la opción "Selecciona una carrera"), usa el default
            if (!data) {
                data = carreraData['default'];
            }

            // 2. Aplicar los cambios
            
            // Cambiar la imagen (src)
            introImage.src = data.imageSrc;
            
            // Cambiar el texto del div
            titleDiv.innerHTML = data.titleText;
            
            // Cambiar el texto del div
            descriptionDiv.innerHTML = data.descriptionText;
            
            // Opcional: Añadir una clase para animación (CSS) al cambiar la imagen
            introImage.classList.add('fade-in');
            setTimeout(() => {
                introImage.classList.remove('fade-in');
            }, 500); // 500ms debe coincidir con la duración de la transición en CSS
        });
    }

    // -----------------------------------------------------------
// 4. LÓGICA DEL CHATBOT
// -----------------------------------------------------------

const chatToggle = document.getElementById('chatbot-toggle');
const chatBox = document.getElementById('chat-box');
const chatClose = document.getElementById('chat-close');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatBody = document.getElementById('chat-body');
const btnInscribete = document.getElementById('btn_inscribete_fernanda');
const btnInscribete2 = document.getElementById('btn_inscribete_fernanda2');
const btnInscribete3 = document.getElementById('btn_inscribete_fernanda3');
const btnConoceCampus = document.getElementById('btn-conoce-campus');

// 1. Mostrar/Ocultar la caja de chat
if (chatToggle && chatBox && chatClose)  {
    chatToggle.addEventListener('click', () => {
        // Usa el estilo 'display' para controlar la visibilidad
        chatBox.style.display = chatBox.style.display === 'flex' ? 'none' : 'flex';
        // Asegura que el scroll esté al final al abrir
        chatBody.scrollTop = chatBody.scrollHeight;
    });

    chatClose.addEventListener('click', () => {
        chatBox.style.display = 'none';
    });
}
// 2. 🚀 Event Listener del botón 'Inscríbete con Fernanda'
if (btnInscribete && chatBox) {
    btnInscribete.addEventListener('click', function(e) {
        e.preventDefault(); // Evita cualquier comportamiento predeterminado (si tuviera un form)
        
        // Abre el chat
        chatBox.style.display = 'flex';
        chatBody.scrollTop = chatBody.scrollHeight;
        
        // Opcional: Si quieres que el usuario escriba inmediatamente, enfoca el input
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.focus();
        }
    });
}
if (btnInscribete2 && chatBox) {
    btnInscribete2.addEventListener('click', function(e) {
        e.preventDefault(); // Evita cualquier comportamiento predeterminado (si tuviera un form)
        
        // Abre el chat
        chatBox.style.display = 'flex';
        chatBody.scrollTop = chatBody.scrollHeight;
        
        // Opcional: Si quieres que el usuario escriba inmediatamente, enfoca el input
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.focus();
        }
    });
}
if (btnInscribete3 && chatBox) {
    btnInscribete3.addEventListener('click', function(e) {
        e.preventDefault(); // Evita cualquier comportamiento predeterminado (si tuviera un form)
        
        // Abre el chat
        chatBox.style.display = 'flex';
        chatBody.scrollTop = chatBody.scrollHeight;
        
        // Opcional: Si quieres que el usuario escriba inmediatamente, enfoca el input
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.focus();
        }
    });
}
// 3. 🚀 Event Listener del botón 'Conoce Nuestro Campus'
if (btnConoceCampus && chatBox) {
    btnConoceCampus.addEventListener('click', function(e) {
        e.preventDefault(); 
        
        // Abre el chat
        chatBox.style.display = 'flex';
        chatBody.scrollTop = chatBody.scrollHeight;
        
        // Opcional: Enfocar el input
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.focus();
        }
    });
}
// 2. Función principal para enviar mensajes y consumir el servicio REST
async function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (userMessage === "") return;

    // A. Mostrar mensaje del usuario
    appendMessage(userMessage, 'user-message');
    chatInput.value = ''; // Limpiar input
    
    // B. Mostrar mensaje de carga del bot
    const loadingMessageElement = appendMessage('...', 'bot-message');
    
    // ⚠️ REEMPLAZA ESTO CON LA URL REAL DE TU API ⚠️
    const API_ENDPOINT = 'https://tu-servicio-rest-de-chatbot.com/api/chat'; 

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Si tu API requiere un token de autenticación:
                // 'Authorization': 'Bearer TU_TOKEN_AQUÍ'
            },
            body: JSON.stringify({ message: userMessage })
        });

        if (!response.ok) {
            throw new Error(`Error en la API: ${response.statusText}`);
        }

        const data = await response.json();
        
        // C. Actualizar el mensaje de carga con la respuesta del bot
        loadingMessageElement.textContent = data.response; // ⚠️ Asegúrate que 'response' sea la clave correcta de tu API
        loadingMessageElement.classList.remove('loading'); // Opcional: si usas una clase 'loading'
        
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        loadingMessageElement.textContent = 'Lo siento, hubo un error al conectar con el servidor.';
    }
}

// 3. Función auxiliar para agregar mensajes
function appendMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = text;
    messageDiv.classList.add('message', className);
    chatBody.appendChild(messageDiv);
    
    // Desplazar al último mensaje
    chatBody.scrollTop = chatBody.scrollHeight;
    
    return messageDiv;
}

// 4. Event Listeners para enviar mensaje
if (chatSend && chatInput) {
    chatSend.addEventListener('click', sendMessage);
    
    // Permitir enviar con Enter
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Evita el salto de línea
            sendMessage();
        }
    });
}

});

