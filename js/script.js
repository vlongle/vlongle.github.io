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

// Enhanced Matrix Effect with Mouse Interaction
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
