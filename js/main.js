document.addEventListener('DOMContentLoaded', () => {
    // --- Register GSAP Plugins ---
    gsap.registerPlugin(ScrollTrigger);

    // --- Performance Optimization: Lag Smoothing ---
    gsap.ticker.lagSmoothing(1000, 16);

    // Detect mobile for simplified animations
    const isMobile = window.innerWidth < 768;

    // --- Hero Animation (Immediate Load) ---
    const heroTitle = document.querySelector('.hero-title');
    const heroWords = gsap.utils.toArray('.hero-word');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');
    
    const masterTl = gsap.timeline();
    
    masterTl.from(heroWords, { 
                yPercent: 120, 
                rotationZ: isMobile ? 0 : 4,
                opacity: 0, 
                stagger: 0.1, 
                duration: 1, 
                ease: "power4.out",
                delay: 0.3
            })
            .from(heroSubtitle, { 
                y: 20, 
                opacity: 0, 
                filter: isMobile ? "none" : "blur(5px)", 
                duration: 0.8, 
                ease: "power3.out" 
            }, "-=0.7")
            .from(heroCta, { 
                y: 20, 
                opacity: 0, 
                scale: 0.98, 
                duration: 0.6, 
                ease: "back.out(1.2)" 
            }, "-=0.6");

    // --- Mobile Menu Toggle ---
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const toggleIcon = mobileToggle.querySelector('i');

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        toggleIcon.classList.toggle('fa-bars');
        toggleIcon.classList.toggle('fa-xmark');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            toggleIcon.classList.remove('fa-xmark');
            toggleIcon.classList.add('fa-bars');
        });
    });

    // --- Throttled Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (lastScrollY > 50) navbar.classList.add('scrolled');
                else navbar.classList.remove('scrolled');
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // --- Cinematic Hero Background ---
    const slides = document.querySelectorAll('#heroSlideshow .slide');
    if (slides.length > 0 && !isMobile) {
        gsap.to(slides[0], { scale: 1, duration: 6, ease: "none" });
    }

    // --- UNIVERSAL SCROLL ANIMATIONS ---

    // 1. Element Fade Ups
    const fadeElements = gsap.utils.toArray('.animate-on-scroll:not(.insta-collage):not(.menu-grid):not(.scroll-heading-container):not(.menu-card)');
    fadeElements.forEach(el => {
        gsap.fromTo(el, 
            { y: 30, opacity: 0, scale: 0.98 },
            {
                scrollTrigger: {
                    trigger: el,
                    start: "top 92%",
                    toggleActions: "play none none none"
                },
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "power2.out"
            }
        );
    });

    // 2. Staggered Menu Cards
    const menuCards = gsap.utils.toArray('.menu-card');
    menuCards.forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 98%", 
                end: isMobile ? "top 85%" : "top 70%",
                scrub: isMobile ? 0.4 : 0.8, // Light scrub on mobile for a sense of motion
            },
            y: 20,
            rotationX: isMobile ? 0 : 15, // No 3D on mobile
            scale: 0.96,
            opacity: 0,
            ease: "none",
            clearProps: "all"
        });
    });

    // 3. Clip-Path Reveal for About Image
    const aboutImgFrame = document.querySelector('.img-frame');
    if(aboutImgFrame) {
        gsap.fromTo(aboutImgFrame, 
            { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" },
            {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                scrollTrigger: {
                    trigger: '#about',
                    start: "top 85%",
                },
                duration: 1.2,
                ease: "power3.inOut"
            }
        );
        
        const innerImg = aboutImgFrame.querySelector('img');
        if(innerImg) {
            gsap.fromTo(innerImg, 
                { scale: isMobile ? 1.05 : 1.1, y: isMobile ? -10 : -20 },
                {
                    scale: 1,
                    y: isMobile ? 10 : 20,
                    scrollTrigger: {
                        trigger: '#about',
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    },
                    ease: "none"
                }
            );
        }
    }

    // 4. Split Heading
    gsap.utils.toArray('.split-heading').forEach(heading => {
        const leftBox = heading.querySelectorAll('.slide-left');
        const rightBox = heading.querySelectorAll('.slide-right');
        
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: heading,
                start: "top 100%",
                end: "bottom 0%",
                scrub: isMobile ? 0.5 : true
            }
        });
        
        const distance = window.innerWidth * (isMobile ? 0.15 : 0.25); 
        
        tl.fromTo(leftBox, { x: -distance }, { x: 0, ease: "none", duration: 1 }, 0);
        tl.fromTo(rightBox, { x: distance }, { x: 0, ease: "none", duration: 1 }, 0);
        
        tl.to(leftBox, { x: distance, ease: "none", duration: 1 });
        tl.to(rightBox, { x: -distance, ease: "none", duration: 1 }, "<");
    });

    // 5. Instagram Gallery
    const instaCollage = document.querySelector('.insta-collage');
    const instaWrappers = gsap.utils.toArray('.insta-pic-wrapper');
    const instaPics = gsap.utils.toArray('.insta-pic');
    
    if (instaCollage && instaWrappers.length > 0) {
        const entranceTl = gsap.timeline({
            scrollTrigger: {
                trigger: instaCollage,
                start: "top 95%",
                toggleActions: "play none none reverse"
            }
        });

        instaWrappers.forEach((wrapper, i) => {
            entranceTl.from(wrapper, {
                y: 30,
                opacity: 0,
                scale: 0.95,
                duration: 0.6,
                ease: "power2.out"
            }, i * 0.08);
        });

        // Restore parallax movement for photos on mobile, but with lower values
        instaPics.forEach((pic, i) => {
            const yVal = isMobile ? [ -30, 20, -40, 30 ][i] : [ -60, 40, -80, 70 ][i];
            const rotVal = isMobile ? [ 4, -3, -2, 3 ][i] : [ 8, -6, -5, 6 ][i];
            
            gsap.to(pic, {
                y: yVal || 0, 
                rotation: rotVal || 0,
                scrollTrigger: {
                    trigger: instaCollage,
                    start: "top 75%",
                    end: "bottom 15%",
                    scrub: isMobile ? 0.8 : 1.5
                },
                ease: "none"
            });
        });

        // Subtle glow effect
        instaPics.forEach(pic => {
            gsap.to(pic, {
                boxShadow: isMobile ? "0 10px 30px rgba(217, 140, 112, 0.2)" : "0 20px 50px rgba(217, 140, 112, 0.3)",
                scrollTrigger: {
                    trigger: pic,
                    start: "top 85%",
                    end: "top 45%",
                    scrub: 1
                },
                ease: "none"
            });
        });
    }


});


