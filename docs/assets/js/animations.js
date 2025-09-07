// RedBoxVM Website - Advanced Animations Controller

class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animationQueue = [];
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        this.setupIntersectionObservers();
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupLoadingAnimations();
        this.setupCounterAnimations();
        this.setupTypewriterAnimations();
        this.setupMorphingAnimations();
        this.setupParticleAnimations();
    }

    setupIntersectionObservers() {
        // Main content observer
        const mainObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all animatable elements
        const animatableElements = document.querySelectorAll(`
            .animate-on-scroll,
            .feature-card,
            .doc-card,
            .arch-layer,
            .download-card,
            .stat,
            .hero-badge,
            .section-badge
        `);

        animatableElements.forEach(element => {
            mainObserver.observe(element);
        });

        this.observers.set('main', mainObserver);
    }

    triggerAnimation(element) {
        if (this.isReducedMotion) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            return;
        }

        const animationType = this.getAnimationType(element);
        
        switch (animationType) {
            case 'fadeInUp':
                this.animateFadeInUp(element);
                break;
            case 'slideInLeft':
                this.animateSlideInLeft(element);
                break;
            case 'slideInRight':
                this.animateSlideInRight(element);
                break;
            case 'scaleIn':
                this.animateScaleIn(element);
                break;
            case 'rotateIn':
                this.animateRotateIn(element);
                break;
            case 'bounceIn':
                this.animateBounceIn(element);
                break;
            case 'flipIn':
                this.animateFlipIn(element);
                break;
            default:
                this.animateFadeInUp(element);
        }

        // Trigger staggered animations for children
        this.triggerStaggeredAnimations(element);
    }

    getAnimationType(element) {
        if (element.classList.contains('feature-card')) return 'scaleIn';
        if (element.classList.contains('doc-card')) return 'flipIn';
        if (element.classList.contains('arch-layer')) return 'slideInLeft';
        if (element.classList.contains('download-card')) return 'bounceIn';
        if (element.classList.contains('stat')) return 'rotateIn';
        if (element.classList.contains('hero-badge') || element.classList.contains('section-badge')) return 'slideInRight';
        return 'fadeInUp';
    }

    animateFadeInUp(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    animateSlideInLeft(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-50px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }

    animateSlideInRight(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(50px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        });
    }

    animateScaleIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        element.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }

    animateRotateIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'rotate(-180deg) scale(0.5)';
        element.style.transition = 'all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'rotate(0deg) scale(1)';
        });
    }

    animateBounceIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.3)';
        element.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
    }

    animateFlipIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'perspective(400px) rotateY(-90deg)';
        element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'perspective(400px) rotateY(0deg)';
        });
    }

    triggerStaggeredAnimations(element) {
        const staggerElements = element.querySelectorAll('.stagger-animation, .feature-details li, .arch-component');
        
        staggerElements.forEach((child, index) => {
            setTimeout(() => {
                child.style.opacity = '0';
                child.style.transform = 'translateY(20px)';
                child.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                
                requestAnimationFrame(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0)';
                });
            }, index * 100);
        });
    }

    setupScrollAnimations() {
        let ticking = false;
        
        const updateScrollAnimations = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            
            // Parallax effects
            this.updateParallaxElements(scrollY);
            
            // Progress bars
            this.updateProgressBars(scrollY, windowHeight);
            
            // Floating elements
            this.updateFloatingElements(scrollY);
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        }, { passive: true });
    }

    updateParallaxElements(scrollY) {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }

    updateProgressBars(scrollY, windowHeight) {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        progressBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top < windowHeight && rect.bottom > 0;
            
            if (isVisible && !bar.classList.contains('animated')) {
                const progress = parseFloat(bar.dataset.progress) || 100;
                bar.style.width = `${progress}%`;
                bar.classList.add('animated');
            }
        });
    }

    updateFloatingElements(scrollY) {
        const floatingElements = document.querySelectorAll('.floating-element');
        
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = Math.sin((scrollY * 0.01) + (index * 0.5)) * 20;
            const rotation = (scrollY * 0.1) + (index * 30);
            
            element.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
        });
    }

    setupHoverAnimations() {
        // Magnetic hover effect
        const magneticElements = document.querySelectorAll('.magnetic, .btn, .feature-card, .doc-card');
        
        magneticElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });

            element.addEventListener('mousemove', (e) => {
                if (this.isReducedMotion) return;
                
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const moveX = x * 0.1;
                const moveY = y * 0.1;
                
                element.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0px, 0px) scale(1)';
            });
        });

        // Glow effect on hover
        const glowElements = document.querySelectorAll('.hover-glow');
        
        glowElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (this.isReducedMotion) return;
                
                element.style.boxShadow = `
                    0 0 20px rgba(102, 126, 234, 0.3),
                    0 0 40px rgba(102, 126, 234, 0.2),
                    0 0 60px rgba(102, 126, 234, 0.1)
                `;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.boxShadow = '';
            });
        });
    }

    setupLoadingAnimations() {
        // Skeleton loading animation
        const skeletonElements = document.querySelectorAll('.skeleton');
        
        skeletonElements.forEach(element => {
            element.style.background = `
                linear-gradient(90deg, 
                    rgba(255, 255, 255, 0.1) 25%, 
                    rgba(255, 255, 255, 0.3) 50%, 
                    rgba(255, 255, 255, 0.1) 75%)
            `;
            element.style.backgroundSize = '200% 100%';
            element.style.animation = 'shimmer 2s infinite';
        });

        // Add shimmer keyframes
        if (!document.querySelector('#shimmer-keyframes')) {
            const style = document.createElement('style');
            style.id = 'shimmer-keyframes';
            style.textContent = `
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number, [data-counter]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    this.animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseFloat(element.dataset.counter) || parseFloat(element.textContent) || 100;
        const duration = 2000;
        const start = performance.now();
        const isInfinity = element.textContent.includes('∞');
        
        if (isInfinity) {
            // Special animation for infinity symbol
            let frame = 0;
            const animateInfinity = () => {
                frame++;
                const opacity = 0.5 + Math.sin(frame * 0.1) * 0.5;
                element.style.opacity = opacity;
                
                if (frame < 60) {
                    requestAnimationFrame(animateInfinity);
                } else {
                    element.style.opacity = '1';
                }
            };
            animateInfinity();
            return;
        }

        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(target * easeOutQuart);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target === Math.floor(target) ? target.toLocaleString() : target.toFixed(1);
            }
        };
        
        requestAnimationFrame(animate);
    }

    setupTypewriterAnimations() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid';
            element.style.animation = 'blink 1s infinite';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    element.style.borderRight = 'none';
                    element.style.animation = 'none';
                }
            };
            
            // Start typing when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(typeWriter, 500);
                        observer.unobserve(element);
                    }
                });
            });
            
            observer.observe(element);
        });
    }

    setupMorphingAnimations() {
        const morphingElements = document.querySelectorAll('.morphing-shape');
        
        morphingElements.forEach((element, index) => {
            const shapes = [
                '50% 50% 50% 50%',
                '70% 30% 30% 70%',
                '30% 70% 70% 30%',
                '50% 50% 30% 70%'
            ];
            
            let currentShape = 0;
            
            setInterval(() => {
                currentShape = (currentShape + 1) % shapes.length;
                element.style.borderRadius = shapes[currentShape];
                element.style.transform = `rotate(${currentShape * 90}deg) scale(${0.8 + Math.random() * 0.4})`;
            }, 3000 + (index * 500));
        });
    }

    setupParticleAnimations() {
        // Create animated particles
        const particleContainers = document.querySelectorAll('.particle-container');
        
        particleContainers.forEach(container => {
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'animated-particle';
                particle.style.cssText = `
                    position: absolute;
                    width: ${2 + Math.random() * 4}px;
                    height: ${2 + Math.random() * 4}px;
                    background: radial-gradient(circle, rgba(102, 126, 234, 0.8) 0%, transparent 70%);
                    border-radius: 50%;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    animation: particleFloat ${5 + Math.random() * 10}s ease-in-out infinite;
                    animation-delay: ${Math.random() * 5}s;
                    pointer-events: none;
                `;
                
                container.appendChild(particle);
            }
        });
    }

    // Utility methods
    addAnimation(element, animationName, duration = '1s', easing = 'ease') {
        element.style.animation = `${animationName} ${duration} ${easing}`;
        
        return new Promise(resolve => {
            element.addEventListener('animationend', resolve, { once: true });
        });
    }

    removeAnimation(element) {
        element.style.animation = '';
    }

    pauseAnimations() {
        document.body.style.animationPlayState = 'paused';
    }

    resumeAnimations() {
        document.body.style.animationPlayState = 'running';
    }

    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.animationQueue = [];
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
});

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
    if (window.animationController) {
        if (document.hidden) {
            window.animationController.pauseAnimations();
        } else {
            window.animationController.resumeAnimations();
        }
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}