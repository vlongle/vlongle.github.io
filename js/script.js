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

    // Function to detect Safari browser
    function isSafariBrowser() {
        const ua = navigator.userAgent.toLowerCase();
        return (
            ua.includes('safari') &&
            !ua.includes('chrome') &&
            !ua.includes('chromium') &&
            !ua.includes('android')
        );
    }

    // Initialize Matrix Animation based on the browser
    if (isSafariBrowser()) {
        initializeSimplifiedMatrix();
    } else {
        initializeFullMatrix();
    }

    /**
     * Simplified Matrix Animation for Safari
     */
    function initializeSimplifiedMatrix() {
        (function () {
            const canvas = document.getElementById('matrix-canvas');
            const ctx = canvas.getContext('2d');

            // Set canvas size
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Characters to be used in the Matrix effect
            const matrixChars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴン';

            // Adjust the font size and sparsity
            const fontSize = 16; // Increase for larger characters
            const columnWidth = fontSize + 5; // Spacing between columns
            let columns = Math.floor(canvas.width / columnWidth);

            // Arrays to store the drops, update frequencies, and previous characters
            const drops = [];
            const updateFrequency = [];
            const previousText = [];

            // Initialize the drops array
            for (let x = 0; x < columns; x++) {
                drops[x] = canvas.height; // Start at the bottom of the canvas
                updateFrequency[x] = Math.floor(Math.random() * 20) + 1; // Random between 1 and 20
                previousText[x] = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
            }

            // Mouse position
            const mouse = { x: null, y: null };

            // Event listener to update mouse position
            window.addEventListener('mousemove', function(event) {
                const rect = canvas.getBoundingClientRect();
                mouse.x = event.clientX - rect.left;
                mouse.y = event.clientY - rect.top;
            });

            // Event listener to reset mouse position when it leaves the canvas
            canvas.addEventListener('mouseleave', function() {
                mouse.x = null;
                mouse.y = null;
            });

            // Draw the Matrix effect
            function drawMatrix() {
                // Semi-transparent black background to create the trail effect
                ctx.fillStyle = 'rgba(13, 13, 13, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.font = fontSize + 'px monospace';

                // Create gradient once
                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, '#0ABAB5'); // Cyan
                gradient.addColorStop(1, '#39FF14'); // Neon green

                for (let i = 0; i < drops.length; i++) {
                    const x = i * columnWidth;
                    const y = drops[i] * fontSize;

                    // Only update the character based on the update frequency
                    if (drops[i] % updateFrequency[i] === 0) {
                        // Randomly select a character
                        const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
                        previousText[i] = text; // Store the character
                    }

                    // Set default color
                    ctx.fillStyle = gradient;
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;

                    // Highlight the leading character (falling star)
                    if (Math.random() > 0.975) {
                        ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // Bright white
                    } else {
                        ctx.shadowColor = 'transparent';
                        ctx.shadowBlur = 0;
                    }

                    // Check if mouse is near the character
                    if (mouse.x !== null && mouse.y !== null) {
                        const dx = mouse.x - x;
                        const dy = mouse.y - y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < 50) { // Adjust radius as needed
                            // Increase brightness and add glow
                            ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // Bright white
                            // Optional: Uncomment below lines for glow effect
                            // ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
                            // ctx.shadowBlur = 15;
                        }
                    }

                    // Draw the character
                    ctx.fillText(previousText[i], x, y);

                    // Randomly reset the drop to the top after it passes the bottom
                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                        updateFrequency[i] = Math.floor(Math.random() * 20) + 1; // Reset update frequency
                    }

                    // Increment Y coordinate
                    drops[i] += 0.9; // Speed of falling characters
                }

                requestAnimationFrame(drawMatrix);
            }

            // Adjust canvas size on window resize
            window.addEventListener('resize', function () {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                // Recalculate columns and reinitialize arrays
                columns = Math.floor(canvas.width / columnWidth);
                drops.length = 0;
                updateFrequency.length = 0;
                previousText.length = 0;
                for (let x = 0; x < columns; x++) {
                    drops[x] = canvas.height;
                    updateFrequency[x] = Math.floor(Math.random() * 20) + 1;
                    previousText[x] = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
                }
            });

            drawMatrix();
        })();
    }

    /**
     * Full-Featured Matrix Animation for Non-Safari Browsers
     */
    function initializeFullMatrix() {
        (function () {
            const canvas = document.getElementById('matrix-canvas');
            const ctx = canvas.getContext('2d');

            // Handle devicePixelRatio for high-DPI displays
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.scale(dpr, dpr);

            // Set canvas CSS size
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;

            // Characters to be used in the Matrix effect
            // const matrixChars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴン';
            // const matrixChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
            const matrixChars = '01'

            // Base values for font size, speed, opacity, and tail length
            const baseFontSize = 14;
            const baseSpeed = 2;
            const baseOpacity = 0.6;
            const baseTailLength = 15;

            // Define layers for depth effect
            const layers = [
                {
                    count: Math.floor(window.innerWidth / 50), // Number of drops in this layer
                    fontSize: baseFontSize * 1.5,
                    speed: baseSpeed * 1.5,
                    opacity: baseOpacity * 1,
                    tailLength: Math.floor(baseTailLength * 1.5),
                    drops: [],
                    gradient: null,
                },
                {
                    count: Math.floor(window.innerWidth / 20),
                    fontSize: baseFontSize * 1.2,
                    speed: baseSpeed * 1.2,
                    opacity: baseOpacity * 0.8,
                    tailLength: Math.floor(baseTailLength * 1.2),
                    drops: [],
                    gradient: null,
                },
                {
                    count: Math.floor(window.innerWidth / 15),
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
                layer.gradient = ctx.createLinearGradient(0, 0, 0, canvas.height / dpr);
                layer.gradient.addColorStop(0, '#FF0000'); // Cyan
                layer.gradient.addColorStop(0.5, '#0ABAB5'); // Cyan
                layer.gradient.addColorStop(1, '#39FF14'); // Neon green

                for (let i = 0; i < layer.count; i++) {
                    const x = Math.random() * window.innerWidth;
                    const y = Math.random() * window.innerHeight;
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
                ctx.globalCompositeOperation = 'destination-in';
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Adjust opacity for trail effect
                ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

                // Set composite operation back to default
                ctx.globalCompositeOperation = 'source-over';

                // Loop through each layer
                layers.forEach(layer => {
                    ctx.font = `${layer.fontSize}px monospace`;
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
                                ctx.shadowBlur = 50;
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
                        if (drop.y - layer.tailLength * layer.fontSize > window.innerHeight) {
                            drop.y = -layer.tailLength * layer.fontSize;
                        }
                    });
                });

                requestAnimationFrame(drawMatrix);
            }

            // Adjust canvas size and reinitialize drops on window resize
            window.addEventListener('resize', function () {
                // Update devicePixelRatio
                const dpr = window.devicePixelRatio || 1;
                canvas.width = window.innerWidth * dpr;
                canvas.height = window.innerHeight * dpr;
                ctx.scale(dpr, dpr);

                // Set canvas CSS size
                canvas.style.width = `${window.innerWidth}px`;
                canvas.style.height = `${window.innerHeight}px`;

                // Re-initialize drops and gradients for each layer
                layers.forEach(layer => {
                    layer.gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
                    layer.gradient.addColorStop(0, '#0ABAB5'); // Cyan
                    layer.gradient.addColorStop(1, '#39FF14'); // Neon green

                    layer.drops.length = 0;
                    layer.count = Math.floor(window.innerWidth / (25 / (layer.speed / baseSpeed)));
                    for (let i = 0; i < layer.count; i++) {
                        const x = Math.random() * window.innerWidth;
                        const y = Math.random() * window.innerHeight;
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
    }
});
