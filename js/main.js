// Force scroll restoration to manual and scroll to top on refresh (prevent scroll jumps)
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
    
    // Register GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        const video = document.getElementById("helmet-video");
        const scrollHint = document.getElementById("scrollHint");
        
        const initScrollVideo = () => {
            if (!video) return;
            const duration = video.duration || 1.8;
            
            // Set video position to start of clip at the top of scroll (visor closed)
            video.currentTime = 0;
            
            // Create a single timeline linked to ScrollTrigger with smooth scrub and pin
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#hero",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1, // smooth scrub response
                    pin: ".hero-sticky",
                    onLeave: () => {
                        document.body.classList.add('hero-complete');
                    },
                    onEnterBack: () => {
                        document.body.classList.remove('hero-complete');
                    }
                }
            });

            // FASE 1: Abertura da viseira (0% a 60% do scroll - tempo 0 a 6.0 na timeline)
            
            // 1. Scroll helper (Hint) desaparece imediatamente no início do scroll
            if (scrollHint) {
                tl.to(scrollHint, {
                    opacity: 0,
                    scale: 0.9,
                    duration: 1.5,
                    ease: "power1.out"
                }, 0);
            }

            // 2. A viseira abre (currentTime do vídeo vai de 0 para duration)
            tl.to(video, {
                currentTime: duration,
                ease: "none",
                duration: 6.0 // termina em 60% do progresso total
            }, 0);

            // 3. Efeito de zoom-out na imagem do capacete (scale 1.05 -> 1.0)
            tl.to(video, {
                scale: 1.0,
                ease: "none",
                duration: 6.0
            }, 0);


            // FASE 2: Entrada cinematográfica do título (60% a 100% do scroll - tempo 6.0 a 10.0 na timeline)
            
            // 1. Fade-in do overlay escuro para contraste
            tl.to(".hero-dark-overlay", {
                opacity: 0.7,
                duration: 1.5,
                ease: "power2.out"
            }, 6.0);

            // 2. Aparece o supertítulo "PILOTO PROFISSIONAL"
            tl.to(".hero-eyebrow", {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power2.out"
            }, 6.0);

            // 3. Entrada triunfal de "FELIPE RICOY" (rise, fade, letter-spacing decrease)
            tl.to(".hero-name", {
                opacity: 1,
                y: 0,
                letterSpacing: "0.02em",
                duration: 2.0,
                ease: "power2.out"
            }, 6.2);

            // 4. Aparece a tagline
            tl.to(".hero-tagline", {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power2.out"
            }, 6.8);

            // 5. Revelação do botão CTA
            tl.to(".hero-cta", {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power2.out"
            }, 7.4);
        };

        if (video) {
            // If metadata is already loaded, initialize immediately
            if (video.readyState >= 1) {
                initScrollVideo();
            } else {
                video.addEventListener('loadedmetadata', initScrollVideo);
            }
        }

        const trajVideo = document.getElementById("trajectory-video");
        const initScrollTrajectoryVideo = () => {
            if (!trajVideo) return;
            const trajDuration = trajVideo.duration || 2.0;
            
            // Set video position to start of clip at the top of scroll
            trajVideo.currentTime = 0;
            
            // Create a timeline linked to ScrollTrigger with smooth scrub and pin
            const trajTl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#trajetoria",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1, // smooth scrub response
                    pin: ".trajectory-sticky",
                    invalidateOnRefresh: true, // recalculates sizes on window resize
                    onLeave: () => {
                        document.body.classList.add('trajectory-complete');
                    },
                    onEnterBack: () => {
                        document.body.classList.remove('trajectory-complete');
                    }
                }
            });

            // PHASE 1: Car completes the curve (0% to 50% of scroll - tempo 0 to 5.0 in timeline)
            trajTl.to(trajVideo, {
                currentTime: trajDuration,
                ease: "none",
                duration: 5.0
            }, 0);

            // PHASE 2: Information fades in (50% to 60% of scroll - tempo 5.0 to 6.0 in timeline)
            trajTl.to(".trajectory-dark-overlay", {
                opacity: 0.8,
                duration: 1.0,
                ease: "power2.out"
            }, 5.0);

            trajTl.to(".trajectory-content", {
                opacity: 1,
                y: 0,
                duration: 1.0,
                ease: "power2.out"
            }, 5.0);

            // PHASE 3: Horizontal scroll & progress track (60% to 100% of scroll - tempo 6.0 to 10.0 in timeline)
            const timelineWrapper = document.querySelector('.timeline-wrapper');
            const timelineContainer = document.querySelector('.timeline-container');
            if (timelineWrapper && timelineContainer) {
                gsap.set(timelineWrapper, { x: 0 });
                trajTl.to(timelineWrapper, {
                    x: () => -(timelineWrapper.scrollWidth - timelineContainer.clientWidth),
                    ease: "none",
                    duration: 4.0
                }, 6.0);
            }

            const progressLine = document.querySelector('.timeline-track-progress');
            if (progressLine) {
                gsap.set(progressLine, { width: "0%" });
                trajTl.to(progressLine, {
                    width: "100%",
                    ease: "none",
                    duration: 4.0
                }, 6.0);
            }
        };

        if (trajVideo) {
            if (trajVideo.readyState >= 1) {
                initScrollTrajectoryVideo();
            } else {
                trajVideo.addEventListener('loadedmetadata', initScrollTrajectoryVideo);
            }
        }
    }

    // 1. MOBILE MENU TOGGLE
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-open');
            if (navMenu.classList.contains('mobile-open')) {
                navToggle.textContent = '// FECHAR';
            } else {
                navToggle.textContent = '// MENU';
            }
        });

        // Close menu when clicking link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('mobile-open');
                navToggle.textContent = '// MENU';
            });
        });
    }

    // 2. SCROLLED NAVIGATION STYLING & ACTIVE LINK DETECTION
    const mainNav = document.getElementById('mainNav');
    const sections = document.querySelectorAll('section[id]');
    const heroSection = document.getElementById('hero');
    
    const handleScroll = () => {
        const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight * 2.5;
        const unpinThreshold = heroHeight - window.innerHeight; // Height where hero unpins (150vh)
        
        // Sticky/scrolled style lock: only solid background after hero unpins
        if (window.scrollY >= unpinThreshold - 80) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }

        // Active link highlighting lock: ignore highlighting while inside hero scroll
        let currentSectionId = '';
        if (window.scrollY >= unpinThreshold - 120) {
            sections.forEach(section => {
                if (section.getAttribute('id') === 'hero') return;
                const sectionTop = section.offsetTop - 120;
                const sectionHeight = section.offsetHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    currentSectionId = section.getAttribute('id');
                }
            });
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (currentSectionId && link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run initially

    // 3. STATS COUNT-UP ANIMATION
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateStats = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetNum = parseInt(entry.target.getAttribute('data-target'), 10);
                const duration = 2000; // 2 seconds
                const stepTime = Math.abs(Math.floor(duration / targetNum));
                let currentNum = 0;
                
                const safeStepTime = Math.max(stepTime, 20);
                const increment = Math.ceil(targetNum / (duration / safeStepTime));
                
                const timer = setInterval(() => {
                    currentNum += increment;
                    if (currentNum >= targetNum) {
                        let suffix = '';
                        const tgt = entry.target.getAttribute('data-target');
                        if (tgt === '2') suffix = '+';
                        if (tgt === '204') suffix = ' km/h';
                        entry.target.textContent = (tgt === '17' ? '#' : '') + targetNum + suffix;
                        clearInterval(timer);
                    } else {
                        entry.target.textContent = currentNum;
                    }
                }, safeStepTime);
                
                observer.unobserve(entry.target);
            }
        });
    };

    const statsObserver = new IntersectionObserver(animateStats, {
        threshold: 0.5
    });

    statNumbers.forEach(stat => statsObserver.observe(stat));

    // 4. TIMELINE TRACK PROGRESS
    // Progress line animation is now handled directly inside the GSAP trajectory timeline to sync with the scroll-scrubbed video.

    // 5. GALLERY FILTER & LIGHTBOX
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    // Filtering
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Lightbox popup
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgPath = item.getAttribute('data-src');
            if (lightbox && lightboxImg && imgPath) {
                lightboxImg.src = imgPath;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (lightboxClose && lightbox) {
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // 6. CONTACT FORM SUBMISSION MOCKUP
    const contactForm = document.getElementById('contactForm');
    const formSuccessMsg = document.getElementById('formSuccessMsg');

    if (contactForm && formSuccessMsg) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            setTimeout(() => {
                formSuccessMsg.style.display = 'block';
                formSuccessMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                setTimeout(() => {
                    formSuccessMsg.style.display = 'none';
                }, 5000);
            }, 1200);
        });
    }

    // 7. SCROLL REVEAL EFFECT
    const scrollRevealItems = document.querySelectorAll('.scroll-reveal');
    
    const revealOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealOnScroll, {
        threshold: 0.15
    });

    scrollRevealItems.forEach(item => revealObserver.observe(item));
});
