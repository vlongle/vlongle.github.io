/* script.js */

// Typing Effect for Hero Section
document.addEventListener('DOMContentLoaded', () => {
    const heroTitleText = "Hi! I'm Long Le";
    const subMessageText = "I like bots";
    let index = 0;
    const speed = 50;
    const heroTitle = document.getElementById('hero-title');
    const subMessage = document.getElementById('sub-message');

    function typeWriter() {
        if (index < heroTitleText.length) {
            heroTitle.innerHTML += heroTitleText.charAt(index);
            index++;
            setTimeout(typeWriter, speed);
        } else {
            index = 0;
            setTimeout(() => {
                typeSubMessage();
            }, 500);
        }
    }

    function typeSubMessage() {
        if (index < subMessageText.length) {
            subMessage.innerHTML += subMessageText.charAt(index);
            index++;
            setTimeout(typeSubMessage, speed);
        }
    }

    typeWriter();
});

// Particle Background with Random Connections and Falling Stars Effect
(function () {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let particlesArray = [];
    const colors = ['#39FF14', '#0ABAB5', '#FFFFFF', '#FF5733', '#FFC300'];
    let mouse = {
        x: null,
        y: null,
        radius: 100
    };

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();

    window.addEventListener('resize', function () {
        resizeCanvas();
        initParticles();
    });

    // Mouse move event
    window.addEventListener('mousemove', function (event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    // Scroll event for parallax effect
    let scrollPosition = 0;
    window.addEventListener('scroll', function () {
        scrollPosition = window.scrollY;
    });

    // Create Particle class
    function Particle(x, y, directionX, directionY, size, color, isStar) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.isStar = isStar; // Determines if particle is a falling star
        this.history = []; // For trail effect
        this.connections = []; // Store connections for each particle
    }

    // Draw method
    Particle.prototype.draw = function () {
        if (this.isStar) {
            // Draw trail for falling stars
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            for (let i = this.history.length - 1; i >= 0; i--) {
                let point = this.history[i];
                ctx.lineTo(point.x, point.y);
            }
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.size / 2;
            ctx.stroke();
        } else {
            // Regular particle
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    };

    // Update method
    Particle.prototype.update = function () {
        // Update position
        this.x += this.directionX;
        this.y += this.directionY + scrollPosition * 0.001;

        // Wrap particles to the top when they go off screen
        if (this.y > canvas.height + this.size) {
            this.y = 0 - this.size;
            this.x = Math.random() * canvas.width;
            this.history = [];
        }

        // For falling stars, keep track of history for trail
        if (this.isStar) {
            this.history.push({ x: this.x, y: this.y });
            if (this.history.length > 10) {
                this.history.shift();
            }
        }

        this.draw();
    };



    function calculateConnections() {
        let maxDistance = 50;
        for (let a = 0; a < particlesArray.length; a++) {
            particlesArray[a].connections = []; // Reset connections
            for (let b = a + 1; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
    
                if (distance < maxDistance) {
                    // Determine if connection should be made (10% chance)
                    if (Math.random() < 0.5) {
                        particlesArray[a].connections.push(b);
                        particlesArray[b].connections.push(a);
                    }
                }
            }
        }
    }
    
    function drawConnections() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b of particlesArray[a].connections) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let maxDistance = 100;
    
                let opacity = 1 - (distance / maxDistance);
                ctx.strokeStyle = `rgba(57, 255, 20, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
    



    // Initialize particle array
    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.width * canvas.height) / 8000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = Math.random() * 3 + 1; // Particle size between 1 and 3
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            let directionX = 0; // No horizontal movement
            let directionY = Math.random() * 0.5 + 0.5; // Moves downward
            let color = colors[Math.floor(Math.random() * colors.length)];

            // Randomly assign some particles as falling stars
            let isStar = Math.random() < 0.1; // 10% chance to be a falling star

            // For falling stars, adjust properties
            if (isStar) {
                size = Math.random() * 3 + 2; // Larger size for stars
                directionX = (Math.random() * 1) - 0.5; // Slight horizontal movement
                directionY = Math.random() * 1 + 1; // Faster downward movement
                color = '#FFFFFF'; // White color for stars
            }

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color, isStar));
        }

        calculateConnections(); // Calculate initial connections
    }


    // Animation loop
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }

    drawConnections(); // Draw lines between particles

    requestAnimationFrame(animateParticles);
}

    setInterval(calculateConnections, 5000); // Recalculate every 5 seconds

    // Initialize and animate particles
    initParticles();
    animateParticles();
})();
