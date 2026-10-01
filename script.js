document.addEventListener("DOMContentLoaded", async () => {

    const loadingScreen = document.getElementById("loadingScreen");
    const progress = document.getElementById("progress");
    const percentage = document.getElementById("percentage");
    const loadingText = document.getElementById("loadingText");
    const tip = document.getElementById("tip");
    const particles = document.getElementById("particles");

    // Configuración de la página de destino
    const DESTINATION_URL = "principal.html"; // Cambia esto por la URL o ruta de tu página

    /* =========================================
       PARTÍCULAS
    ========================================= */
    for (let i = 0; i < 45; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.top = Math.random() * 100 + "%";
        particle.style.animationDuration = (4 + Math.random() * 8) + "s";
        particle.style.animationDelay = Math.random() * 5 + "s";

        const size = 1 + Math.random() * 2;
        particle.style.width = size + "px";
        particle.style.height = size + "px";

        particles.appendChild(particle);
    }

    /* =========================================
       RECURSOS QUE QUEREMOS CARGAR
    ========================================= */
    const resources = [
        {
            type: "image",
            url: "assets/background.jpg",
            name: "FONDO PRINCIPAL"
        },
        {
            type: "image",
            url: "assets/city.jpg",
            name: "CIUDAD"
        }
    ];

    /* =========================================
       MENSAJES
    ========================================= */
    const messages = [
        { percent: 0, text: "INICIANDO SISTEMA", tip: "PREPARANDO TICO CITY..." },
        { percent: 20, text: "CARGANDO RECURSOS", tip: "CARGANDO RECURSOS DE LA CIUDAD..." },
        { percent: 40, text: "CARGANDO IMÁGENES", tip: "PREPARANDO EL ENTORNO..." },
        { percent: 60, text: "PREPARANDO INTERFAZ", tip: "CONFIGURANDO LA INTERFAZ..." },
        { percent: 80, text: "INICIANDO SISTEMAS", tip: "CONECTANDO TODOS LOS SISTEMAS..." },
        { percent: 95, text: "FINALIZANDO", tip: "CASI ESTAMOS LISTOS..." },
        { percent: 100, text: "COMPLETADO", tip: "BIENVENIDO A TICO CITY" }
    ];

    /* =========================================
       ACTUALIZAR TEXTO Y PROGRESO
    ========================================= */
    function updateMessage(value) {
        let current = messages[0];
        for (const message of messages) {
            if (value >= message.percent) {
                current = message;
            }
        }
        loadingText.textContent = current.text;
        tip.textContent = current.tip;
    }

    function setProgress(value) {
        value = Math.max(0, Math.min(100, value));
        progress.style.width = value + "%";
        percentage.textContent = Math.floor(value) + "%";
        updateMessage(value);
    }

    /* =========================================
       CARGAR RECURSOS (PARALELO)
    ========================================= */
    function loadImage(url) {
        return new Promise((resolve) => {
            const image = new Image();
            image.onload = () => resolve({ success: true });
            image.onerror = () => {
                console.warn("No se pudo cargar:", url);
                resolve({ success: false });
            };
            image.src = url;
        });
    }

    async function loadResources() {
        if (resources.length === 0) {
            setProgress(80);
            return;
        }

        let loaded = 0;
        const total = resources.length;

        // Carga simultánea de imágenes para mejorar el tiempo de respuesta
        const loadPromises = resources.map(async (resource) => {
            if (resource.type === "image") {
                await loadImage(resource.url);
            }
            loaded++;
            const resourceProgress = (loaded / total) * 80;
            setProgress(resourceProgress);
        });

        await Promise.all(loadPromises);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /* =========================================
       PREPARACIÓN Y REDIRECCIÓN
    ========================================= */
    async function prepareWebsite() {
        setProgress(82);
        await sleep(300);

        loadingText.textContent = "PREPARANDO INTERFAZ";
        tip.textContent = "CARGANDO ELEMENTOS DE LA PÁGINA...";
        await sleep(300);

        setProgress(88);
        await sleep(300);

        loadingText.textContent = "INICIANDO SISTEMAS";
        tip.textContent = "VERIFICANDO SISTEMAS...";
        await sleep(400);

        setProgress(94);
        await sleep(400);

        loadingText.textContent = "FINALIZANDO";
        tip.textContent = "PREPARANDO TU EXPERIENCIA...";
        await sleep(400);

        setProgress(100);
        loadingText.textContent = "COMPLETADO";
        tip.textContent = "BIENVENIDO A TICO CITY";
    }

    function redirectToPage() {
        // Redirige a la página elegida tras una breve pausa para mostrar el 100%
        setTimeout(() => {
            window.location.href = DESTINATION_URL;
        }, 800);
    }

    /* =========================================
       EJECUCIÓN PRINCIPAL
    ========================================= */
    try {
        setProgress(0);
        await loadResources();
        await prepareWebsite();
        redirectToPage();
    } catch (error) {
        console.error("Error en Loading Screen:", error);
        
        // En caso de fallo, asegura la redirección
        setProgress(100);
        loadingText.textContent = "LISTO";
        tip.textContent = "ENTRANDO A TICO CITY";
        redirectToPage();
    }

});