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
            setTimeout(typeSubMessage, 500);
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
