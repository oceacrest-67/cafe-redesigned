document.addEventListener('DOMContentLoaded', () => {
    // --- Register GSAP Plugins ---
    gsap.registerPlugin(ScrollTrigger);

    // --- Hero Animation (Immediate Load) ---
    // Target Hero Elements
    const heroTitle = document.querySelector('.hero-title');
    const heroWords = gsap.utils.toArray('.hero-word');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');
    
    // Master timeline to animate Hero elements immediately
    const masterTl = gsap.timeline();
    
    masterTl.from(heroWords, { 
                yPercent: 120, 
                rotationZ: 4,
                opacity: 0, 
                stagger: 0.12, 
                duration: 1.2, 
                ease: "power4.out",
                delay: 0.5
            })
            .from(heroSubtitle, { y: 30, opacity: 0, filter: "blur(5px)", duration: 1, ease: "power3.out" }, "-=0.9")
            .from(heroCta, { y: 30, opacity: 0, scale: 0.95, duration: 0.8, ease: "back.out(1.2)" }, "-=0.8");

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

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // --- Cinematic Hero Background (Ken Burns Effect) ---
    const slides = document.querySelectorAll('#heroSlideshow .slide');
    if (slides.length > 0) {
        // Apply initial slide zoom for a premium feel
        gsap.to(slides[0], { scale: 1, duration: 6, ease: "none" });
    }

    // --- CRAZY GOOD MOBILE SCROLL ANIMATIONS ---

    // 1. Universal Element Fade Ups (Cinematic Blur Reveal)
    const fadeElements = gsap.utils.toArray('.animate-on-scroll:not(.insta-collage):not(.menu-grid):not(.scroll-heading-container):not(.menu-card)');
    fadeElements.forEach(el => {
        gsap.fromTo(el, 
            { y: 60, opacity: 0, filter: "blur(15px)", scale: 0.95 },
            {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                scale: 1,
                duration: 1.2,
                ease: "power3.out"
            }
        );
    });

    // 2. Staggered Menu Cards (Creative Scrubbed 3D Fly-In)
    const menuCards = gsap.utils.toArray('.menu-card');
    menuCards.forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 98%", 
                end: "top 65%", // Dynamic range for creative motion
                scrub: 0.8,     // Snappy, responsive feel
            },
            y: 50,
            rotationX: 25,  // Restored creative 3D tilt
            rotationY: i % 2 === 0 ? -10 : 10, // Added side-swing
            rotationZ: i % 2 === 0 ? -3 : 3,
            scale: 0.85,    // Creative scale-up
            transformPerspective: 1200,
            opacity: 0,
            filter: "blur(10px)",
            ease: "none"
        });
    });

    // 3. Cinematic Clip-Path Reveal for About Image
    const aboutImgFrame = document.querySelector('.img-frame');
    if(aboutImgFrame) {
        // The outer frame wipes open from the left
        gsap.fromTo(aboutImgFrame, 
            { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" },
            {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                scrollTrigger: {
                    trigger: '#about',
                    start: "top 75%",
                },
                duration: 1.8,
                ease: "power4.inOut"
            }
        );
        
        // The inner image floats slowly as you scroll natively
        const innerImg = aboutImgFrame.querySelector('img');
        if(innerImg) {
            gsap.fromTo(innerImg, 
                { scale: 1.2, y: -30 },
                {
                    scale: 1.05,
                    y: 30,
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

    // 4. Split Heading GSAP Scrub!
    gsap.utils.toArray('.split-heading').forEach(heading => {
        const leftBox = heading.querySelectorAll('.slide-left');
        const rightBox = heading.querySelectorAll('.slide-right');
        
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: heading,
                start: "top 100%",
                end: "bottom 0%",
                scrub: true
            }
        });
        
        // Exact responsive distance
        const distance = window.innerWidth * 0.35; 
        
        // Starts completely split
        tl.fromTo(leftBox, { x: -distance }, { x: 0, ease: "none", duration: 1 }, 0);
        tl.fromTo(rightBox, { x: distance }, { x: 0, ease: "none", duration: 1 }, 0);
        
        // Exits completely split in the opposite direction
        tl.to(leftBox, { x: distance, ease: "none", duration: 1 });
        tl.to(rightBox, { x: -distance, ease: "none", duration: 1 }, "<");
    });

    // 5. Instagram Polaroid — Mobile-First Cinematic Scroll Gallery
    const instaCollage = document.querySelector('.insta-collage');
    const instaWrappers = gsap.utils.toArray('.insta-pic-wrapper');
    const instaPics = gsap.utils.toArray('.insta-pic');
    
    if (instaCollage && instaWrappers.length > 0) {

        // ═══════════════════════════════════════════════════
        // ENTRANCE: Animate WRAPPERS (Preserves unique CSS disalignment)
        // ═══════════════════════════════════════════════════
        const entranceTl = gsap.timeline({
            scrollTrigger: {
                trigger: instaCollage,
                start: "top 95%",
                toggleActions: "play none none reverse"
            }
        });

        // Animate WRAPPERS for entrance (staggered fly-in)
        instaWrappers.forEach((wrapper, i) => {
            const xOffset = i % 2 === 0 ? -50 : 50;
            entranceTl.from(wrapper, {
                x: xOffset,
                y: 60,
                opacity: 0,
                scale: 0.8,
                filter: "blur(10px)",
                duration: 1,
                ease: "power2.out"
            }, i * 0.15);
        });


        // ═══════════════════════════════════════════════════
        // SCROLL-LINKED MOVEMENT: Animate IMAGES (Scrubbed Parallax)
        // No property conflict because these target the CHILD elements
        // ═══════════════════════════════════════════════════

        // Pic 1 → drifts UP
        gsap.to(instaPics[0], {
            y: -80, rotation: 10, scale: 1.05,
            scrollTrigger: {
                trigger: instaCollage,
                start: "top 60%",
                end: "bottom 20%",
                scrub: 1.5
            },
            ease: "none"
        });

        // Pic 2 → drifts DOWN
        gsap.to(instaPics[1], {
            y: 60, rotation: -8, scale: 1.04,
            scrollTrigger: {
                trigger: instaCollage,
                start: "top 60%",
                end: "bottom 20%",
                scrub: 1.5
            },
            ease: "none"
        });

        // Pic 3 → drifts UP MORE (fastest)
        gsap.to(instaPics[2], {
            y: -110, rotation: -6, scale: 1.06,
            scrollTrigger: {
                trigger: instaCollage,
                start: "top 60%",
                end: "bottom 20%",
                scrub: 1.5
            },
            ease: "none"
        });

        // Pic 4 → drifts DOWN the most
        gsap.to(instaPics[3], {
            y: 90, rotation: 8, scale: 1.03,
            scrollTrigger: {
                trigger: instaCollage,
                start: "top 60%",
                end: "bottom 20%",
                scrub: 1.5
            },
            ease: "none"
        });

        // ═══════════════════════════════════════════════════
        // BOX SHADOW GLOW: Photos gain a warm glow as they approach center
        // ═══════════════════════════════════════════════════
        instaPics.forEach(pic => {
            gsap.to(pic, {
                boxShadow: "0 25px 60px rgba(217, 140, 112, 0.4)",
                scrollTrigger: {
                    trigger: pic,
                    start: "top 75%",
                    end: "top 35%",
                    scrub: 1
                },
                ease: "none"
            });
        });
    }
});

