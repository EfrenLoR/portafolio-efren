document.addEventListener('DOMContentLoaded', () => {

    // ------------------------------------------------------------------
    // 1. Footer: Calcular y actualizar el año actual dinámicamente
    // ------------------------------------------------------------------
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ------------------------------------------------------------------
    // 2. Navbar: Interacción del Menú Hamburguesa Móvil
    // ------------------------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIconPath = document.getElementById('menu-icon-path');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let isMenuOpen = false;

    // Función principal para alternar estado del menú
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;

        if (isMenuOpen) {
            // Abrir menú
            mobileMenu.classList.remove('hidden');
            // Timeout pequeño para permitir que 'display: block' aplique antes de jugar con las opacidades/transforms (Transition Tailwind)
            setTimeout(() => {
                mobileMenu.classList.remove('opacity-0', '-translate-y-4');
                mobileMenu.classList.add('opacity-100', 'translate-y-0');
            }, 10);

            // Cambiar icono a 'X'
            menuIconPath.setAttribute('d', 'M6 18L18 6M6 6l12 12');
        } else {
            // Cerrar menú animado
            mobileMenu.classList.remove('opacity-100', 'translate-y-0');
            mobileMenu.classList.add('opacity-0', '-translate-y-4');

            // Esperar a que acabe la transacción CSS (300ms aprox) antes de dar display: none
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);

            // Volver al icono de hamburguesa normal
            menuIconPath.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
        }
    }

    if (mobileMenuBtn && mobileMenu) {
        // Estado inicial de las clases de transición del menú móvil
        mobileMenu.classList.add('opacity-0', '-translate-y-4', 'transform', 'transition-all', 'duration-300', 'origin-top');
        mobileMenuBtn.addEventListener('click', toggleMenu);
    }

    // Cerrar automáticamente el menú móvil cuando se hace clic en un enlace interno
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMenu();
        });
    });

    // ------------------------------------------------------------------
    // 3. Navbar: Efecto Sticky (Desplazamiento Translúcido al Scrollear)
    // ------------------------------------------------------------------
    const navbar = document.getElementById('navbar');

    function handleScrollNavbar() {
        if (window.scrollY > 30) {
            // Aplicar fondo, blur, sombra y borde cuando bajas un poco
            navbar.classList.add('bg-dark-bg/90', 'backdrop-blur-md', 'shadow-lg', 'border-b', 'border-dark-border');
            navbar.classList.remove('bg-transparent', 'py-2');
        } else {
            // Navbar transparente totalmente arriba
            navbar.classList.remove('bg-dark-bg/90', 'backdrop-blur-md', 'shadow-lg', 'border-b', 'border-dark-border');
            navbar.classList.add('bg-transparent', 'py-2'); // Padding vertical extra para el estado transparente si es deseado
        }
    }

    // Ejecutar al hacer scroll y al cargar por si recargas a mitad de la página
    window.addEventListener('scroll', handleScrollNavbar);
    handleScrollNavbar();

    // ------------------------------------------------------------------
    // 4. Smooth Scroll: Interceptación manual para enlaces de anclaje
    // ------------------------------------------------------------------
    // Nota: Aunque agregamos 'scroll-smooth' al HTML (efecto nativo de CSS), 
    // manejarlo con JS asegura un buen comportamiento con navbars fixed
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Ignorar enlaces vacíos

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                // Calculamos la posición tomando en cuenta el alto del navbar
                const navbarHeight = navbar.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - (navbarHeight + 20); // 20px espacio extra visual

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // ------------------------------------------------------------------
    // 5. Base de Datos de Proyectos
    // ------------------------------------------------------------------
    const MisProyectos = [
        {
            titulo: {
                es: "Plataforma de Servicios de Belleza + Agenda",
                en: "Beauty Services Platform + Planner"
            },
            descripcion: {
                es: "Aplicación web interactiva para servicios de pestañas y cejas. Integra precios dinámicos conectándose directamente a una base de datos en Google Sheets.",
                en: "Interactive web application for lash and brow services. Integrates dynamic pricing by connecting directly to a Google Sheets database."
            },
            imagen: "./assets/img/lash-agenda.png",
            url: "https://lash-agenda.vercel.app/",
            github: "https://github.com/EfrenLoR/lash-agenda",
            tecnologias: ["HTML", "CSS", "JavaScript", "Google Sheets", "React", "VITE"]
        },
        {
            titulo: {
                es: "Estrategia Meta Ads - SocialON Agency",
                en: "Meta Ads Strategy - SocialON Agency"
            },
            descripcion: {
                es: "Pequeño negocio de manejo de redes sociales, estrategia de Meta Ads y generación de leads.",
                en: "Small business for social media management, Meta Ads strategy, and lead generation."
            },
            imagen: "./assets/img/meta-ads.png",
            url: "https://www.facebook.com/SoocialOn",
            github: "#",
            tecnologias: ["Meta Ads", "Estrategia", "Marketing"]
        },
        {
            titulo: {
                es: "Invitaciones Digitales",
                en: "Digital Invitations"
            },
            descripcion: {
                es: "Creación de invitaciones digitales para eventos sociales, con animaciones y efectos visuales.",
                en: "Creation of digital invitations for social events, with animations and visual effects."
            },
            imagen: "./assets/img/invitacion-web.png",
            url: "https://xv-naomi.netlify.app/",
            github: "#",
            tecnologias: ["HTML", "CSS", "JavaScript"]
        }
    ];

    // ------------------------------------------------------------------
    // 6. Renderizado Dinámico y Animaciones (Todo en el mismo Scope)
    // ------------------------------------------------------------------
    const projectsContainer = document.getElementById('contenedor-proyectos');

    // Creamos el Observer fuera para reusarlo
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-up-show');
                observer.unobserve(entry.target);
            }
        });
    };

    const scrollObserver = new IntersectionObserver(animateOnScroll, observerOptions);

    function renderProyectos() {
        if (!projectsContainer) return;

        // A. Limpiamos el contenedor
        projectsContainer.innerHTML = '';

        // B. Dibujamos las tarjetas
        MisProyectos.forEach((proyecto, index) => {
            const card = document.createElement('div');

            const tituloActual = proyecto.titulo[currentLang] || proyecto.titulo['es'];
            const descActual = proyecto.descripcion[currentLang] || proyecto.descripcion['es'];

            card.className = 'bg-dark-card/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-brand/20 hover:border-brand/50 transition-all duration-300 transform hover:-translate-y-2 group flex flex-col slide-up-element block-fade-in relative z-10';
            card.style.animationDelay = `${index * 150}ms`;

            card.innerHTML = `
                <div class="relative overflow-hidden aspect-video">
                    <div class="absolute inset-0 bg-dark-bg/60 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                    <img src="${proyecto.imagen}" onerror="this.src='https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'" alt="${tituloActual}" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700">
                </div>
                
                <div class="p-6 flex flex-col flex-grow">
                    <h3 class="text-xl font-bold text-white mb-2 group-hover:text-brand transition-colors">${tituloActual}</h3>
                    <p class="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3">
                        ${descActual}
                    </p>
                    
                    <div class="flex flex-wrap gap-2 mb-6">
                        ${proyecto.tecnologias.map(tech => `
                            <span class="px-3 py-1 text-xs font-semibold bg-brand/10 text-brand rounded-full border border-brand/20">
                                ${tech}
                            </span>
                        `).join('')}
                    </div>
                    
                    <div class="flex items-center gap-4 mt-auto pt-4 border-t border-dark-border/50">
                        <a href="${proyecto.url}" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-white flex items-center gap-2 hover:text-brand transition-colors group/link">
                            <svg class="w-5 h-5 group-hover/link:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            Demo
                        </a>
                        <a href="${proyecto.github}" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-gray-400 flex items-center gap-2 hover:text-white transition-colors group/link">
                            <svg class="w-5 h-5 group-hover/link:-translate-y-1 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" /></svg>
                            GitHub
                        </a>
                    </div>
                </div>
            `;
            projectsContainer.appendChild(card);
        });

        // C. Observamos TODOS los elementos animados (incluyendo nuestras nuevas tarjetas)
        const animatedElements = document.querySelectorAll('.slide-up-element');
        animatedElements.forEach(el => scrollObserver.observe(el));
    }

    // ------------------------------------------------------------------
    // 7. HABILIDADES (Logos SVG Personalizados)
    // ------------------------------------------------------------------

    const skillsContainer = document.getElementById('skills-container');
    if (skillsContainer) {
        const MisHabilidades = [
            { nombre: "HTML5", color: "text-orange-500", viewBox: "0 0 24 24", svg: '<path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/>' },
            { nombre: "CSS3", color: "text-blue-500", viewBox: "0 0 24 24", svg: '<path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.41H5.41l.23 2.626h10.057l-.234 2.716H6.103l.233 2.622h9.126l-.325 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157z"/>' },
            { nombre: "JavaScript", color: "text-yellow-400", viewBox: "0 0 24 24", svg: '<path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/>' },
            { nombre: "Tailwind CSS", color: "text-[#38bdf8]", viewBox: "0 0 24 24", svg: '<path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>' },
            { nombre: "Photoshop", color: "text-[#31A8FF]", viewBox: "0 0 24 24", svg: '<path d="M9.85 8.42c-.37-.15-.77-.21-1.18-.2-.26 0-.49 0-.68.01-.2-.01-.34 0-.41.01v3.36c.14.01.27.02.39.02h.53c.39 0 .78-.06 1.15-.18.32-.09.6-.28.82-.53.21-.25.31-.59.31-1.03.01-.31-.07-.62-.23-.89-.17-.26-.41-.46-.7-.57zM19.75.3H4.25C1.9.3 0 2.2 0 4.55v14.899c0 2.35 1.9 4.25 4.25 4.25h15.5c2.35 0 4.25-1.9 4.25-4.25V4.55C24 2.2 22.1.3 19.75.3zm-7.391 11.65c-.399.56-.959.98-1.609 1.22-.68.25-1.43.34-2.25.34-.24 0-.4 0-.5-.01s-.24-.01-.43-.01v3.209c.01.07-.04.131-.11.141H5.52c-.08 0-.12-.041-.12-.131V6.42c0-.07.03-.11.1-.11.17 0 .33 0 .56-.01.24-.01.49-.01.76-.02s.56-.01.87-.02c.31-.01.61-.01.91-.01.82 0 1.5.1 2.06.31.5.17.96.45 1.34.82.32.32.57.71.73 1.14.149.42.229.85.229 1.3.001.86-.199 1.57-.6 2.13zm7.091 3.89c-.28.4-.671.709-1.12.891-.49.209-1.09.318-1.811.318-.459 0-.91-.039-1.359-.129-.35-.061-.7-.17-1.02-.32-.07-.039-.121-.109-.111-.189v-1.74c0-.029.011-.07.041-.09.029-.02.06-.01.09.01.39.23.8.391 1.24.49.379.1.779.15 1.18.15.38 0 .65-.051.83-.141.16-.07.27-.24.27-.42 0-.141-.08-.27-.24-.4-.16-.129-.489-.279-.979-.471-.51-.18-.979-.42-1.42-.719-.31-.221-.569-.51-.761-.85-.159-.32-.239-.67-.229-1.021 0-.43.12-.84.341-1.21.25-.4.619-.72 1.049-.92.469-.239 1.059-.349 1.769-.349.41 0 .83.03 1.24.09.3.04.59.12.86.23.039.01.08.05.1.09.01.04.02.08.02.12v1.63c0 .04-.02.08-.05.1-.09.02-.14.02-.18 0-.3-.16-.62-.27-.96-.34-.37-.08-.74-.13-1.12-.13-.2-.01-.41.02-.601.07-.129.03-.24.1-.31.2-.05.08-.08.18-.08.27s.04.18.101.26c.09.11.209.2.34.27.229.12.47.23.709.33.541.18 1.061.43 1.541.73.33.209.6.49.789.83.16.318.24.67.23 1.029.011.471-.129.94-.389 1.331z"/>' },
            { nombre: "Illustrator", color: "text-[#FF9A00]", viewBox: "0 0 24 24", svg: '<path d="M10.53 10.73c-.1-.31-.19-.61-.29-.92-.1-.31-.19-.6-.27-.89-.08-.28-.15-.54-.22-.78h-.02c-.09.43-.2.86-.34 1.29-.15.48-.3.98-.46 1.48-.14.51-.29.98-.44 1.4h2.54c-.06-.211-.14-.46-.23-.721-.09-.269-.18-.559-.27-.859zM19.75.3H4.25C1.9.3 0 2.2 0 4.55v14.9c0 2.35 1.9 4.25 4.25 4.25h15.5c2.35 0 4.25-1.9 4.25-4.25V4.55C24 2.2 22.1.3 19.75.3zM14.7 16.83h-2.091c-.069.01-.139-.04-.159-.11l-.82-2.38H7.91l-.76 2.35c-.02.09-.1.15-.19.141H5.08c-.11 0-.14-.061-.11-.18L8.19 7.38c.03-.1.06-.21.1-.33.04-.21.06-.43.06-.65-.01-.05.03-.1.08-.11h2.59c.08 0 .12.03.13.08l3.65 10.3c.03.109 0 .16-.1.16zm3.4-.15c0 .11-.039.16-.129.16H16.01c-.1 0-.15-.061-.15-.16v-7.7c0-.1.041-.14.131-.14h1.98c.09 0 .129.05.129.14v7.7zm-.209-9.03c-.231.24-.571.37-.911.35-.33.01-.65-.12-.891-.35-.23-.25-.35-.58-.34-.92-.01-.34.12-.66.359-.89.242-.23.562-.35.892-.35.391 0 .689.12.91.35.22.24.34.56.33.89.01.34-.11.67-.349.92z"/>' },
            { nombre: "Git", color: "text-[#F05032]", viewBox: "0 0 24 24", svg: '<path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187"/>' },
            { nombre: "GitHub", color: "text-white", viewBox: "0 0 24 24", svg: '<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>' },
            { nombre: "React", color: "text-[#004ce5ff]", viewBox: "0 0 24 24", svg: '<path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"/>' },
            { nombre: "Vite", color: "text-[#646CFF]", viewBox: "0 0 24 24", svg: '<path d="M13.056 23.238a.57.57 0 0 1-1.02-.355v-5.202c0-.63-.512-1.143-1.144-1.143H5.148a.57.57 0 0 1-.464-.903l3.777-5.29c.54-.753 0-1.804-.93-1.804H.57a.574.574 0 0 1-.543-.746.6.6 0 0 1 .08-.157L5.008.78a.57.57 0 0 1 .467-.24h14.589a.57.57 0 0 1 .466.903l-3.778 5.29c-.54.755 0 1.806.93 1.806h5.745c.238 0 .424.138.513.322a.56.56 0 0 1-.063.603z"/>' }
        ];

        MisHabilidades.forEach(skill => {
            const div = document.createElement('div');
            div.className = 'w-[calc(50%-15px)] lg:w-[calc(25%-18px)] bg-dark-card/40 backdrop-blur-md border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center group hover:border-brand hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 hover:-translate-y-2';
            div.innerHTML = `
                <div class="w-14 h-14 mb-4 ${skill.color} group-hover:scale-110 transition-transform duration-300">
                    <svg viewBox="${skill.viewBox || '0 0 24 24'}" fill="currentColor">${skill.svg}</svg>
                </div>
                <span class="text-sm font-medium text-gray-300 group-hover:text-white uppercase tracking-wider">${skill.nombre}</span>
            `;
            skillsContainer.appendChild(div);
        });
    }

    // ------------------------------------------------------------------
    // 8. Base de Datos de Estudios
    // ------------------------------------------------------------------
    const MisEstudios = [
        {
            titulo: {
                es: "Ingeniería en Sistemas Computacionales",
                en: "Computer Systems Engineering"
            },
            escuela: {
                es: "Tecnológico Universitario de Aguascalientes",
                en: "University Technological of Aguascalientes"
            },
            periodo: {
                es: "Septiembre 2023 - Agosto 2026",
                en: "September 2023 - August 2026"
            }
        },
        {
            titulo: {
                es: "Licenciatura en Mercadotecnia",
                en: "Bachelor of Marketing"
            },
            escuela: {
                es: "Universidad Autónoma de Aguascalientes",
                en: "Autonomous University of Aguascalientes"
            },
            periodo: {
                es: "Enero 2018 - Junio 2021",
                en: "January 2018 - June 2021"
            }
        },
        {
            titulo: {
                es: "Técnico en Programación",
                en: "Programming Technician"
            },
            escuela: {
                es: "Centro de Estudios Cientificos y Técnologico de Aguascalientes",
                en: "Center for Scientific and Technological Studies of Aguascalientes"
            },
            periodo: {
                es: "2014 - 2017",
                en: "2014 - 2017"
            }
        }
    ];

    const estudiosContainer = document.getElementById('estudios-grid');

    function renderEstudios() {
        if (!estudiosContainer) return;
        estudiosContainer.innerHTML = '';

        MisEstudios.forEach(estudio => {
            const tituloActual = estudio.titulo[currentLang] || estudio.titulo['es'];
            const escuelaActual = estudio.escuela[currentLang] || estudio.escuela['es'];
            const periodoActual = estudio.periodo[currentLang] || estudio.periodo['es'];

            const div = document.createElement('div');
            div.className = 'bg-dark-card/40 backdrop-blur-md border border-white/10 rounded-xl p-6 group hover:border-brand hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 hover:-translate-y-2';
            div.innerHTML = `
                <h3 class="text-xl font-bold text-white mb-2 group-hover:text-brand transition-colors">${tituloActual}</h3>
                <p class="text-gray-400 text-sm mb-4">${escuelaActual}</p>
                <p class="text-gray-500 text-xs font-mono">${periodoActual}</p>
            `;
            estudiosContainer.appendChild(div);
        });
    }

    // ------------------------------------------------------------------
    // 9. Base de Datos de Experiencia
    // ------------------------------------------------------------------
    const MisExperiencias = [
        {
            titulo: {
                es: "Practicante de Desarrollo de Software",
                en: "Software Development Intern"
            },
            empresa: {
                es: "GL Pestañas",
                en: "GL Lashes"
            },
            periodo: "2026",
            descripcion: {
                es: "Creación de sitio web, desarrollo de landing pages, implementación de nuevas tecnologías, uso de API Google Sheets para automatización de procesos.",
                en: "Website creation, landing page development, implementation of new technologies, use of Google Sheets API for process automation."
            }
        },
        {
            titulo: {
                es: "Staff Community Manager",
                en: "Staff Community Manager"
            },
            empresa: {
                es: "MexQ - Aseguradora de Calidad",
                en: "MexQ - Quality Assurance"
            },
            periodo: "2024 - 2026",
            descripcion: {
                es: "Digitalización de procesos, automatización de tareas, análisis de datos, responsable de gestionar la presencia de la empresa en redes sociales, generar contenido, interactuar con la comunidad y analizar métricas de rendimiento.",
                en: "Process digitization, task automation, data analysis, responsible for managing the company's presence on social media, generating content, interacting with the community, and analyzing performance metrics."
            }
        }
    ];

    const experienciaTimeline = document.getElementById('experiencia-timeline');

    // Observer global para las tarjetas de experiencia y la iluminación de los puntos
    const expObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animar la tarjeta
                entry.target.classList.remove('opacity-0', 'translate-y-6');
                entry.target.classList.add('opacity-100', 'translate-y-0');

                // Iluminar el punto correspondiente
                const dot = entry.target.querySelector('.timeline-dot');
                if (dot) {
                    dot.classList.remove('bg-gray-700', 'border-gray-600');
                    dot.classList.add('bg-brand', 'border-brand', 'shadow-[0_0_15px_rgba(59,130,246,0.8)]', 'scale-110');
                }

                // Dejar de observar una vez que ya apareció
                expObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const timelineLine = document.getElementById("timeline-line");

    if (experienciaTimeline && timelineLine) {
        // Evento scroll global para la línea de tiempo
        window.addEventListener("scroll", () => {
            const rect = experienciaTimeline.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Queremos que la línea progrese según una posición visual, ej: el 65% de la altura de la pantalla
            const visualOffset = windowHeight * 0.65;

            const progress = Math.min(
                Math.max((visualOffset - rect.top) / rect.height, 0),
                1
            );

            timelineLine.style.transform = `scaleY(${progress})`;
        });
    }

    function renderExperiencia() {
        if (!experienciaTimeline) return;

        // Limpiamos tarjetas existentes pero mantenemos la linea de timeline (fondo y progreso)
        const existingCards = experienciaTimeline.querySelectorAll('.relative.mb-12');
        existingCards.forEach(card => card.remove());

        MisExperiencias.forEach((exp, index) => {
            const isLeft = index % 2 === 0;
            const div = document.createElement('div');

            const tituloActual = exp.titulo[currentLang] || exp.titulo['es'];
            const empresaActual = exp.empresa[currentLang] || exp.empresa['es'];
            const descActual = exp.descripcion[currentLang] || exp.descripcion['es'];

            // Clases iniciales para la animación de la tarjeta
            div.classList.add('opacity-0', 'translate-y-6', 'transition-all', 'duration-700', 'ease-out');

            div.className += ` relative mb-12 flex flex-col md:flex-row items-center ${isLeft ? 'md:justify-start' : 'md:justify-end'}`;

            div.innerHTML = `
                <!-- Punto apagado al inicio -->
                <div class="timeline-dot absolute left-4 md:left-1/2 w-5 h-5 bg-gray-700 rounded-full 
                    border-4 border-gray-600 -translate-x-1/2 z-10 transition-all duration-500"></div>

                <!-- Card -->
                <div class="w-full md:w-1/2 ${isLeft ? 'md:pr-10 md:text-right' : 'md:pl-10'} relative z-10">
                
                    <div class="bg-dark-card/40 backdrop-blur-md border border-white/10 rounded-xl p-6 
                        hover:border-brand/30 transition-all duration-300">

                        <span class="text-sm text-brand font-mono block mb-2">
                            ${exp.periodo}
                        </span>

                        <h3 class="text-xl font-bold text-white mb-1">
                            ${tituloActual}
                        </h3>

                        <p class="text-gray-400 text-sm mb-3">
                            ${empresaActual}
                        </p>

                        <p class="text-gray-500 text-sm">
                            ${descActual}
                        </p>

                    </div>
                </div>
            `;

            experienciaTimeline.appendChild(div);
            expObserver.observe(div);
        });
    }

    // ------------------------------------------------------------------
    // 10. Internacialización (i18n)
    // ------------------------------------------------------------------

    let currentLang = 'es'; // Idioma por defecto

    // Función auxiliar para acceder a propiedades anidadas de un objeto como "hero.title"
    function getNestedTranslation(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }

    // Función para aplicar la traducción a la página
    function setLanguage(lang) {
        currentLang = lang;

        // 1. Traducir elementos estáticos del HTML usando data-lang
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            const translatedText = getNestedTranslation(translations[lang], key);

            if (translatedText) {
                // Usamos innerHTML porque hay etiquetas <span> en tus traducciones
                element.innerHTML = translatedText;
            }
        });

        // 2. Actualizar el texto de todos los botones de idioma (escritorio y móvil)
        document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
            btn.textContent = lang === 'es' ? 'EN' : 'ES';
        });

        // Opcional: Guardar la preferencia en localStorage para que se guarde si recarga la página
        localStorage.setItem('portfolioLang', lang);

        // 3. Volver a renderizar las secciones dinámicas (Proyectos, Estudios, etc.)
        renderProyectos();
        renderEstudios();
        renderExperiencia();
    }

    // Evento click del botón
    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const newLang = currentLang === 'es' ? 'en' : 'es';
            setLanguage(newLang);
        });
    });

    // Al cargar la página, revisar si ya había un idioma guardado en el navegador
    const savedLang = localStorage.getItem('portfolioLang') || 'es';
    setLanguage(savedLang);

}); // Cierre final del DOMContentLoaded