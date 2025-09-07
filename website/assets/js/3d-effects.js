// RedBoxVM Website - 3D Effects and Canvas Animations

class ThreeDEffects {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        this.isVisible = true;
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupParticles();
        this.setupEventListeners();
        this.animate();
        this.setup3DCards();
        this.setupFloatingElements();
    }

    setupCanvas() {
        this.canvas = document.getElementById('hero-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // Set canvas styles
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
    }

    resizeCanvas() {
        if (!this.canvas) return;
        
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Reinitialize particles after resize
        this.setupParticles();
    }

    setupParticles() {
        if (!this.canvas) return;
        
        this.particles = [];
        const particleCount = Math.min(50, Math.floor((this.canvas.width * this.canvas.height) / 15000));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
    }

    setupEventListeners() {
        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            if (!this.canvas) return;
            
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        // Resize handling
        window.addEventListener('resize', this.debounce(() => {
            this.resizeCanvas();
        }, 250));

        // Visibility handling
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
            if (this.isVisible && !this.animationId) {
                this.animate();
            }
        });

        // Scroll-based effects
        window.addEventListener('scroll', this.throttle(() => {
            this.updateScrollEffects();
        }, 16));
    }

    animate() {
        if (!this.isVisible || !this.canvas || !this.ctx) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });

        // Draw connections between nearby particles
        this.drawConnections();

        // Continue animation
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        if (!this.ctx) return;
        
        const maxDistance = 120;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(102, 126, 234, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    updateScrollEffects() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Update parallax elements
        const parallaxElements = document.querySelectorAll('.parallax-element');
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.speed) || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });

        // Update 3D transforms based on scroll
        const hero = document.querySelector('.hero');
        if (hero) {
            const heroRect = hero.getBoundingClientRect();
            const heroProgress = Math.max(0, Math.min(1, -heroRect.top / windowHeight));
            
            // Apply 3D transform to hero visual
            const heroVisual = document.querySelector('.hero-visual');
            if (heroVisual) {
                const rotateY = -15 + (heroProgress * 30);
                const rotateX = 5 - (heroProgress * 10);
                const scale = 1 - (heroProgress * 0.2);
                
                heroVisual.style.transform = `
                    perspective(1000px) 
                    rotateY(${rotateY}deg) 
                    rotateX(${rotateX}deg) 
                    scale(${scale})
                `;
            }
        }
    }

    setup3DCards() {
        const cards = document.querySelectorAll('.feature-card, .doc-card, .download-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * -10;
                const rotateY = (x - centerX) / centerX * 10;
                
                card.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    translateZ(20px)
                `;
                
                // Add glow effect
                const glowX = (x / rect.width) * 100;
                const glowY = (y / rect.height) * 100;
                
                card.style.background = `
                    radial-gradient(circle at ${glowX}% ${glowY}%, 
                    rgba(102, 126, 234, 0.1) 0%, 
                    transparent 50%), 
                    rgba(255, 255, 255, 0.8)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
                card.style.background = '';
            });
        });
    }

    setupFloatingElements() {
        // Create floating geometric shapes
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const shapes = ['circle', 'triangle', 'square', 'hexagon'];
        const colors = ['#667eea', '#764ba2', '#4facfe', '#00f2fe'];
        
        for (let i = 0; i < 8; i++) {
            const shape = document.createElement('div');
            const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            shape.className = `floating-shape floating-${shapeType}`;
            shape.style.cssText = `
                position: absolute;
                width: ${20 + Math.random() * 40}px;
                height: ${20 + Math.random() * 40}px;
                background: ${color}20;
                border: 2px solid ${color}40;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: floatingShape ${5 + Math.random() * 10}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
                pointer-events: none;
                z-index: -1;
            `;
            
            // Shape-specific styles
            switch (shapeType) {
                case 'circle':
                    shape.style.borderRadius = '50%';
                    break;
                case 'triangle':
                    shape.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
                    break;
                case 'hexagon':
                    shape.style.clipPath = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
                    break;
            }
            
            hero.appendChild(shape);
        }

        // Add floating animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatingShape {
                0%, 100% {
                    transform: translateY(0px) rotate(0deg) scale(1);
                    opacity: 0.6;
                }
                25% {
                    transform: translateY(-20px) rotate(90deg) scale(1.1);
                    opacity: 0.8;
                }
                50% {
                    transform: translateY(-10px) rotate(180deg) scale(0.9);
                    opacity: 1;
                }
                75% {
                    transform: translateY(-30px) rotate(270deg) scale(1.2);
                    opacity: 0.7;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Particle class for canvas animation
class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        
        // Color variations
        const colors = [
            'rgba(102, 126, 234, ',
            'rgba(118, 75, 162, ',
            'rgba(79, 172, 254, ',
            'rgba(0, 242, 254, '
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update(mouse) {
        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            const force = (100 - distance) / 100;
            this.vx -= (dx / distance) * force * 0.01;
            this.vy -= (dy / distance) * force * 0.01;
        }

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Boundary collision
        if (this.x < 0 || this.x > this.canvasWidth) {
            this.vx *= -1;
            this.x = Math.max(0, Math.min(this.canvasWidth, this.x));
        }
        if (this.y < 0 || this.y > this.canvasHeight) {
            this.vy *= -1;
            this.y = Math.max(0, Math.min(this.canvasHeight, this.y));
        }

        // Add some randomness
        this.vx += (Math.random() - 0.5) * 0.01;
        this.vy += (Math.random() - 0.5) * 0.01;

        // Limit velocity
        const maxVelocity = 2;
        this.vx = Math.max(-maxVelocity, Math.min(maxVelocity, this.vx));
        this.vy = Math.max(-maxVelocity, Math.min(maxVelocity, this.vy));

        // Friction
        this.vx *= 0.99;
        this.vy *= 0.99;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.fill();
        
        // Add glow effect
        ctx.shadowColor = this.color + '0.5)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Advanced 3D Text Effect
class Text3D {
    constructor(element) {
        this.element = element;
        this.init();
    }

    init() {
        if (!this.element) return;

        this.element.addEventListener('mousemove', (e) => {
            const rect = this.element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * 5;
            const rotateY = (x - centerX) / centerX * 5;
            
            this.element.style.transform = `
                perspective(1000px) 
                rotateX(${-rotateX}deg) 
                rotateY(${rotateY}deg)
            `;
            
            // Dynamic text shadow for 3D effect
            const shadowX = rotateY * 2;
            const shadowY = rotateX * 2;
            
            this.element.style.textShadow = `
                ${shadowX}px ${shadowY}px 0px rgba(0, 0, 0, 0.1),
                ${shadowX * 2}px ${shadowY * 2}px 0px rgba(0, 0, 0, 0.05),
                ${shadowX * 3}px ${shadowY * 3}px 10px rgba(0, 0, 0, 0.1)
            `;
        });

        this.element.addEventListener('mouseleave', () => {
            this.element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            this.element.style.textShadow = '';
        });
    }
}

// Morphing Background Effect
class MorphingBackground {
    constructor(element) {
        this.element = element;
        this.init();
    }

    init() {
        if (!this.element) return;

        // Create morphing blob
        const blob = document.createElement('div');
        blob.className = 'morphing-blob';
        blob.style.cssText = `
            position: absolute;
            top: 20%;
            left: 20%;
            width: 300px;
            height: 300px;
            background: linear-gradient(45deg, 
                rgba(102, 126, 234, 0.1) 0%, 
                rgba(118, 75, 162, 0.1) 100%);
            border-radius: 50%;
            filter: blur(40px);
            animation: morphBlob 20s ease-in-out infinite;
            pointer-events: none;
            z-index: -1;
        `;

        this.element.appendChild(blob);

        // Add morphing animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes morphBlob {
                0%, 100% {
                    border-radius: 50% 50% 50% 50%;
                    transform: rotate(0deg) scale(1);
                }
                25% {
                    border-radius: 70% 30% 30% 70%;
                    transform: rotate(90deg) scale(1.1);
                }
                50% {
                    border-radius: 30% 70% 70% 30%;
                    transform: rotate(180deg) scale(0.9);
                }
                75% {
                    border-radius: 50% 50% 30% 70%;
                    transform: rotate(270deg) scale(1.2);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize 3D effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main 3D effects
    new ThreeDEffects();

    // Initialize 3D text effects
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        new Text3D(heroTitle);
    }

    // Initialize morphing background
    const hero = document.querySelector('.hero');
    if (hero) {
        new MorphingBackground(hero);
    }

    // Initialize section titles with 3D effect
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        new Text3D(title);
    });
});

// Performance monitoring for 3D effects
if ('performance' in window) {
    let frameCount = 0;
    let lastTime = performance.now();
    
    function measureFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            // Reduce effects if FPS is too low
            if (fps < 30) {
                document.body.classList.add('low-performance');
                console.warn('Low FPS detected, reducing 3D effects');
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(measureFPS);
    }
    
    requestAnimationFrame(measureFPS);
}