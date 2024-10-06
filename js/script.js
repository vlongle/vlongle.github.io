/* script.js */

// Combined Typing Effect with Moving Cursor and Font Sizes
document.addEventListener('DOMContentLoaded', () => {
    const terminalOutput = [
        { text: "Hi! I'm Long Le", elementId: 'hero-title' },
        { text: "I like bots", elementId: 'sub-message' },
    ];
    let lineIndex = 0;
    let charIndex = 0;
    const speed = 50;

    function typeTerminal() {
        if (lineIndex < terminalOutput.length) {
            const currentLine = terminalOutput[lineIndex];
            const element = document.getElementById(currentLine.elementId);
            if (charIndex < currentLine.text.length) {
                element.innerHTML += currentLine.text.charAt(charIndex);
                charIndex++;
                setTimeout(typeTerminal, speed);
            } else {
                charIndex = 0;
                lineIndex++;
                setTimeout(typeTerminal, speed);
            }
        } else {
            // Typing complete; cursor continues blinking at the end of the second line
        }
    }

    typeTerminal();
});

// Matrix Effect with Layered Depth, Gradient, and Mouse Interaction
(function () {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Characters to be used in the Matrix effect
    const matrixChars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴン';

    // Base values for font size, speed, opacity, and tail length
    const baseFontSize = 14;
    const baseSpeed = 1;
    const baseOpacity = 0.6;
    const baseTailLength = 15;

    // Define layers for depth effect
    const layers = [
        {
            count: Math.floor(canvas.width / 25), // Number of drops in this layer
            fontSize: baseFontSize * 1.5,
            speed: baseSpeed * 1.5,
            opacity: baseOpacity * 1,
            tailLength: Math.floor(baseTailLength * 1.5),
            drops: [],
            gradient: null,
        },
        {
            count: Math.floor(canvas.width / 20), // Number of drops in this layer
            fontSize: baseFontSize * 1.2,
            speed: baseSpeed * 1.2,
            opacity: baseOpacity * 0.8,
            tailLength: Math.floor(baseTailLength * 1.2),
            drops: [],
            gradient: null,
        },
        {
            count: Math.floor(canvas.width / 15), // Number of drops in this layer
            fontSize: baseFontSize,
            speed: baseSpeed,
            opacity: baseOpacity * 0.6,
            tailLength: baseTailLength,
            drops: [],
            gradient: null,
        },
    ];

    // Initialize drops and gradients for each layer
    layers.forEach(layer => {
        // Create a gradient for this layer
        layer.gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        layer.gradient.addColorStop(0, '#0ABAB5'); // Cyan
        layer.gradient.addColorStop(1, '#39FF14'); // Neon green

        for (let i = 0; i < layer.count; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const chars = [];
            for (let k = 0; k < layer.tailLength; k++) {
                chars[k] = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
            }
            layer.drops.push({
                x: x,
                y: y,
                chars: chars,
            });
        }
    });

    // Mouse position
    const mouse = { x: null, y: null };

    // Event listener to update mouse position
    window.addEventListener('mousemove', function (event) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });

    // Event listener to reset mouse position when it leaves the canvas
    canvas.addEventListener('mouseleave', function () {
        mouse.x = null;
        mouse.y = null;
    });

    function drawMatrix() {
        // Clear the canvas with a slight opacity to create the trailing effect
        // globalCompositeOperation is important to fix the opacity accumulation
        // that will cause the screen to flicker
        ctx.globalCompositeOperation = 'destination-in';

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Adjust opacity for trail effect
        ctx.fillRect(0, 0, canvas.width, canvas.height);



    // Set composite operation back to default
    ctx.globalCompositeOperation = 'source-over';


        // Loop through each layer
        layers.forEach(layer => {
            ctx.font = layer.fontSize + 'px monospace';
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;

            // Loop through each drop in the layer
            layer.drops.forEach(drop => {
                const x = drop.x;
                for (let k = 0; k < layer.tailLength; k++) {
                    const y = drop.y - k * layer.fontSize;
                    if (y < 0) continue;

                    // Calculate combined opacity
                    let charOpacity = layer.opacity * (1 - k / layer.tailLength);

                    // Highlight the leading character
                    let isLeadingChar = k === 0;
                    if (isLeadingChar) {
                        charOpacity = 1; // Fully opaque for the leading character
                        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
                        ctx.shadowBlur = 10;
                    } else {
                        ctx.shadowColor = 'transparent';
                        ctx.shadowBlur = 0;
                    }

                    // Check if mouse is near the character
                    if (mouse.x !== null && mouse.y !== null) {
                        const dx = mouse.x - x;
                        const dy = mouse.y - y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < 50) {
                            // Increase brightness and add glow
                            charOpacity = 1; // Fully opaque
                            ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
                            ctx.shadowBlur = 15;
                        }
                    }

                    // Set global alpha
                    ctx.globalAlpha = charOpacity;

                    // Set fill style to the layer's gradient
                    ctx.fillStyle = layer.gradient;

                    // Draw the character
                    ctx.fillText(drop.chars[k % drop.chars.length], x, y);

                    // Reset global alpha for the next character
                    ctx.globalAlpha = 1;
                }

                // Update the drop position
                drop.y += layer.speed;

                // Randomly update characters
                if (Math.random() > 0.975) {
                    drop.chars.pop();
                    const newChar = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
                    drop.chars.unshift(newChar);
                }

                // Reset drop if it's off-screen
                if (drop.y - layer.tailLength * layer.fontSize > canvas.height) {
                    drop.y = -layer.tailLength * layer.fontSize;
                }
            });
        });

        requestAnimationFrame(drawMatrix);
    }

    // Adjust canvas size and reinitialize drops on window resize
    window.addEventListener('resize', function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Re-initialize drops and gradients for each layer
        layers.forEach(layer => {
            layer.gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            layer.gradient.addColorStop(0, '#0ABAB5'); // Cyan
            layer.gradient.addColorStop(1, '#39FF14'); // Neon green

            layer.drops.length = 0;
            layer.count = Math.floor(canvas.width / (25 / (layer.speed / baseSpeed))); // Adjust count based on layer speed
            for (let i = 0; i < layer.count; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const chars = [];
                for (let k = 0; k < layer.tailLength; k++) {
                    chars[k] = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
                }
                layer.drops.push({
                    x: x,
                    y: y,
                    chars: chars,
                });
            }
        });
    });

    drawMatrix();
})();
