document.addEventListener('DOMContentLoaded', () => {
    
    // Register GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        const video = document.getElementById("helmet-video");
        const textOverlay = document.querySelector(".hero-text-overlay");

        const initScrollVideo = () => {
            if (!video) return;
            const duration = video.duration || 1.8;
            
            // Set video position to end of clip at the top of scroll (visor closed)
            video.currentTime = duration;
            
            // Sync scroll position with video playhead backwards (duration -> 0) to open the visor
            gsap.to(video, {
                currentTime: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: "#hero-banner",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1, // Smooth scrolling visual follow-up
                }
            });

            // Fade out the overlay text as the visor opens
            if (textOverlay) {
                gsap.to(textOverlay, {
                    opacity: 0,
                    y: -40,
                    ease: "power1.out",
                    scrollTrigger: {
                        trigger: "#hero-banner",
                        start: "top top",
                        end: "60% top",
                        scrub: true,
                    }
                });
            }
        };

        if (video) {
            // If metadata is already loaded, initialize immediately
            if (video.readyState >= 1) {
                initScrollVideo();
            } else {
                video.addEventListener('loadedmetadata', initScrollVideo);
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
    
    const handleScroll = () => {
        // Sticky/scrolled style
        if (window.scrollY > 100) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }

        // Active link highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
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
                        entry.target.textContent = targetNum + (entry.target.getAttribute('data-target') === '1450' || entry.target.getAttribute('data-target') === '2' ? '+' : '');
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
    const timelineSection = document.getElementById('trajetoria');
    const timelineProgress = document.querySelector('.timeline-track-progress');

    if (timelineSection && timelineProgress) {
        const animateTimeline = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    timelineProgress.style.width = '100%';
                    observer.unobserve(entry.target);
                }
            });
        };

        const timelineObserver = new IntersectionObserver(animateTimeline, {
            threshold: 0.2
        });
        timelineObserver.observe(timelineSection);
    }

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
