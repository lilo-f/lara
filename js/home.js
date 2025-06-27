document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const animationDuration = 500; // Duração da animação em milissegundos (0.5s)

    // Garante que todos os itens estejam visíveis no início
    galleryItems.forEach(item => {
        item.classList.add('visible-state');
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.dataset.filter;

            galleryItems.forEach(item => {
                const itemStyles = item.dataset.style.split(' ');
                const itemArtist = item.dataset.artist;
                const itemBodyPart = item.dataset.bodyPart;

                let shouldBeVisible = false;

                if (filterValue === 'all') {
                    shouldBeVisible = true;
                } else if (filterValue.startsWith('artist-')) {
                    const artistFilter = filterValue.substring(7);
                    shouldBeVisible = itemArtist === artistFilter;
                } else if (filterValue === 'arm' || filterValue === 'leg' || filterValue === 'back') {
                    shouldBeVisible = itemBodyPart === filterValue;
                } else {
                    shouldBeVisible = itemStyles.includes(filterValue);
                }

                // Aplica as classes diretamente para mostrar/ocultar
                if (shouldBeVisible) {
                    item.classList.remove('hidden-state');
                    item.classList.add('visible-state');
                } else {
                    item.classList.remove('visible-state');
                    item.classList.add('hidden-state');
                }
            });
        });
    });
});
// Quiz Logic
document.addEventListener('DOMContentLoaded', function() {
    const quizIntro = document.getElementById('quiz-intro');
    const quizQuestions = document.getElementById('quiz-questions');
    const quizResult = document.getElementById('quiz-result');
    const startButton = document.getElementById('start-quiz');
    const questionContainer = document.getElementById('question-container');
    const progressBar = document.getElementById('quiz-progress');
    const currentQNumber = document.getElementById('current-q-number');
    const totalQuestions = document.getElementById('total-questions');
    const restartButton = document.getElementById('restart-quiz');
    
    let currentQuestion = 0;
    let userAnswers = [];
    let styleScores = {};
    
    // Initialize quiz
    function initQuiz() {
        currentQuestion = 0;
        userAnswers = [];
        styleScores = {};
        quizIntro.style.display = 'block';
        quizQuestions.style.display = 'none';
        quizResult.style.display = 'none';
        
        // Set total questions
        totalQuestions.textContent = tattooQuiz.questions.length;
    }
    
    // Start quiz
    startButton.addEventListener('click', function() {
        quizIntro.style.display = 'none';
        quizQuestions.style.display = 'block';
        showQuestion();
    });
    
    // Show question
    function showQuestion() {
        const question = tattooQuiz.questions[currentQuestion];
        
        // Update progress
        currentQNumber.textContent = currentQuestion + 1;
        progressBar.style.width = `${((currentQuestion + 1) / tattooQuiz.questions.length) * 100}%`;
        
        // Create question HTML
        questionContainer.innerHTML = `
            <div class="question-text">${question.question}</div>
            <div class="answer-options">
                ${question.answers.map((answer, index) => `
                    <div class="answer-option" data-index="${index}">
                        <div class="option-icon">${answer.icon}</div>
                        <div class="option-text">${answer.text}</div>
                    </div>
                `).join('')}
            </div>
            <div class="quiz-navigation">
                ${currentQuestion > 0 ? `
                    <button class="nav-button prev-button" id="prev-question">
                        <svg viewBox="0 0 24 24"><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/></svg>
                        <span>VOLTAR</span>
                    </button>
                ` : '<div></div>'}
                <button class="nav-button next-button" id="next-question" disabled>
                    <span>${currentQuestion === tattooQuiz.questions.length - 1 ? 'VER RESULTADO' : 'PRÓXIMA'}</span>
                    <svg viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/></svg>
                </button>
            </div>
        `;
        
        // Add event listeners
        document.querySelectorAll('.answer-option').forEach(option => {
            option.addEventListener('click', function() {
                selectAnswer(this);
            });
        });
        
        if (currentQuestion > 0) {
            document.getElementById('prev-question').addEventListener('click', prevQuestion);
        }
        
        document.getElementById('next-question').addEventListener('click', nextQuestion);
    }
    
    // Select answer
    function selectAnswer(option) {
        // Deselect all
        document.querySelectorAll('.answer-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Select clicked
        option.classList.add('selected');
        
        // Enable next button
        document.getElementById('next-question').disabled = false;
        
        // Store answer
        const answerIndex = option.getAttribute('data-index');
        userAnswers[currentQuestion] = tattooQuiz.questions[currentQuestion].answers[answerIndex];
    }
    
    // Next question
    function nextQuestion() {
        if (currentQuestion < tattooQuiz.questions.length - 1) {
            currentQuestion++;
            showQuestion();
        } else {
            calculateResult();
        }
    }
    
    // Previous question
    function prevQuestion() {
        currentQuestion--;
        showQuestion();
    }
    
    // Calculate result
    function calculateResult() {
        // Reset scores
        Object.keys(tattooQuiz.results).forEach(style => {
            styleScores[style] = 0;
        });
        
        // Calculate scores from all answers
        userAnswers.forEach(answer => {
            Object.entries(answer.styles).forEach(([style, points]) => {
                styleScores[style] += points;
            });
        });
        
        // Find highest score
        let maxScore = 0;
        let resultStyle = "";
        
        Object.entries(styleScores).forEach(([style, score]) => {
            if (score > maxScore) {
                maxScore = score;
                resultStyle = style;
            }
        });
        
        // Show result
        showResult(resultStyle);
    }
    
    // Show result
    function showResult(style) {
        const result = tattooQuiz.results[style];
        
        // Set result content
        document.getElementById('result-style').textContent = style;
        document.getElementById('result-description').textContent = result.description;
        
        // Set features
        const featuresList = document.getElementById('style-features');
        featuresList.innerHTML = result.features.map(feature => `
            <li>${feature}</li>
        `).join('');
        
        // Set gallery images
        const gallery = document.getElementById('result-gallery');
        gallery.innerHTML = result.images.map(image => `
            <div class="result-image">
                <img src="${image}" alt="Exemplo ${style}" loading="lazy">
            </div>
        `).join('');
        
        // Set recommended artists
        const artists = document.getElementById('artist-match');
        artists.innerHTML = result.artists.map(artist => `
            <div class="artist-badge">${artist}</div>
        `).join('');
        
        // Show result
        quizQuestions.style.display = 'none';
        quizResult.style.display = 'block';
        
        // Scroll to result
        quizResult.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Restart quiz
    restartButton.addEventListener('click', initQuiz);
    
    // Initialize
    initQuiz();
});
// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const discountModal = document.getElementById('discount-modal');
const modalClose = document.getElementById('modal-close');
const emailForm = document.getElementById('email-form');
const emailInput = document.getElementById('email-input');
const emailError = document.getElementById('email-error');
const bookingForm = document.getElementById('booking-form');
const giftSelection = document.getElementById('gift-selection');
const scratchGame = document.getElementById('scratch-game');
const scratchCard = document.getElementById('scratch-card');
const scratchCanvas = document.getElementById('scratch-canvas');
const discountResult = document.getElementById('discount-result');
const discountAmount = document.getElementById('discount-amount');
const finalDiscount = document.getElementById('final-discount');

// Game state
let gameState = 'gift-selection'; // 'gift-selection', 'scratching', 'completed'
let selectedDiscount = 0;
let isScratching = false;

// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const showError = (element, message) => {
    element.textContent = message;
    element.style.display = 'block';
    element.setAttribute('aria-live', 'assertive');
    setTimeout(() => {
        element.style.display = 'none';
        element.setAttribute('aria-live', 'polite');
    }, 5000);
};

const showSuccess = (message) => {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #00f5ff, #39ff14);
        color: #000000;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0, 245, 255, 0.5);
        z-index: 10000;
        font-family: 'Teko', sans-serif;
        font-weight: 600;
        letter-spacing: 1px;
        animation: slideInRight 0.3s ease-out;
    `;
    successDiv.textContent = message;
    successDiv.setAttribute('role', 'alert');
    successDiv.setAttribute('aria-live', 'assertive');
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(successDiv)) {
                document.body.removeChild(successDiv);
            }
        }, 300);
    }, 3000);
};

// Loading Screen
const hideLoadingScreen = () => {
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            showDiscountModal();
        }, 500);
    }, 3000);
};

// Navigation
const handleNavbarScroll = debounce(() => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 10);

const toggleMobileNav = () => {
    const isActive = navMenu.classList.contains('active');
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', !isActive);
    
    document.body.style.overflow = isActive ? 'auto' : 'hidden';
    
    // Announce to screen readers
    const announcement = isActive ? 'Menu fechado' : 'Menu aberto';
    announceToScreenReader(announcement);
};

const closeMobileNav = () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = 'auto';
};

// Accessibility helper
const announceToScreenReader = (message) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
};

// Smooth scrolling for navigation links
const handleNavClick = (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            closeMobileNav();
            
            // Focus management for accessibility
            targetSection.setAttribute('tabindex', '-1');
            targetSection.focus();
            setTimeout(() => {
                targetSection.removeAttribute('tabindex');
            }, 1000);
        }
    }
};

// Interactive Discount Modal
const showDiscountModal = () => {
    setTimeout(() => {
        discountModal.classList.add('show');
        discountModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const firstFocusable = discountModal.querySelector('.gift-option');
        if (firstFocusable) {
            firstFocusable.focus();
        }
        
        initGiftSelection();
    }, 1000);
};

const hideDiscountModal = () => {
    discountModal.classList.remove('show');
    discountModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
    resetGame();
};

// Gift Selection
const initGiftSelection = () => {
    const giftOptions = giftSelection.querySelectorAll('.gift-option');
    
    giftOptions.forEach(option => {
        option.addEventListener('click', handleGiftSelection);
        option.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleGiftSelection.call(option);
            }
        });
    });
};

const handleGiftSelection = function() {
    if (gameState !== 'gift-selection') return;
    
    selectedDiscount = parseInt(this.dataset.discount);
    gameState = 'scratching';
    
    // Hide gift selection and show scratch game
    giftSelection.style.display = 'none';
    scratchGame.style.display = 'block';
    
    // Update scratch content
    finalDiscount.textContent = `${selectedDiscount}%`;
    
    // Initialize scratch canvas
    initScratchCanvas();
    
    // Announce to screen readers
    announceToScreenReader(`Presente selecionado! Agora raspe a carta para revelar seu desconto de ${selectedDiscount}%`);
    
    // Focus on scratch card
    scratchCard.focus();
};

// Scratch Canvas Game
const initScratchCanvas = () => {
    const canvas = scratchCanvas;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas size
    canvas.width = 300;
    canvas.height = 150;
    
    // Draw scratch surface
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add scratch text
    ctx.fillStyle = '#666666';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('RASPE AQUI', canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = 'bold 16px Arial';
    ctx.fillText('🪙', canvas.width / 2, canvas.height / 2 + 20);
    
    // Set up scratch functionality
    ctx.globalCompositeOperation = 'destination-out';
    
    let scratching = false;
    let scratchedArea = 0;
    
    const getScratchedPercentage = () => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentPixels = 0;
        
        for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i + 3] === 0) {
                transparentPixels++;
            }
        }
        
        return (transparentPixels / (pixels.length / 4)) * 100;
    };
    
    const scratch = (x, y) => {
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fill();
        
        scratchedArea = getScratchedPercentage();
        if (scratchedArea > 60) {
            revealDiscount();
        }
    };
    
    const getEventPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX || e.touches[0].clientX) - rect.left,
            y: (e.clientY || e.touches[0].clientY) - rect.top
        };
    };
    
    // Mouse events
    canvas.addEventListener('mousedown', (e) => {
        scratching = true;
        const pos = getEventPos(e);
        scratch(pos.x, pos.y);
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (scratching) {
            const pos = getEventPos(e);
            scratch(pos.x, pos.y);
        }
    });
    
    canvas.addEventListener('mouseup', () => {
        scratching = false;
    });
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        scratching = true;
        const pos = getEventPos(e);
        scratch(pos.x, pos.y);
    });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (scratching) {
            const pos = getEventPos(e);
            scratch(pos.x, pos.y);
        }
    });
    
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        scratching = false;
    });
    
    // Keyboard accessibility
    canvas.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // Auto-reveal for keyboard users
            revealDiscount();
        }
    });
    
    canvas.setAttribute('aria-label', 'Raspadinha - Pressione Enter ou espaço para revelar o desconto');
};

const revealDiscount = () => {
    if (gameState !== 'scratching') return;
    
    gameState = 'completed';
    
    // Hide scratch game and show result
    setTimeout(() => {
        scratchGame.style.display = 'none';
        discountResult.style.display = 'block';
        discountAmount.textContent = `${selectedDiscount}%`;
        
        // Focus on email input
        emailInput.focus();
        
        // Announce result
        announceToScreenReader(`Parabéns! Você ganhou ${selectedDiscount}% de desconto!`);
    }, 500);
};

const handleEmailSubmit = (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    
    emailError.textContent = '';
    
    if (!email) {
        showError(emailError, 'Por favor, digite seu e-mail.');
        emailInput.focus();
        return;
    }
    
    if (!isValidEmail(email)) {
        showError(emailError, 'Por favor, digite um e-mail válido.');
        emailInput.focus();
        return;
    }
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalHTML = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ENVIANDO...';
    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
    
    setTimeout(() => {
        hideDiscountModal();
        showSuccess('🎉 Parabéns! Seu cupom foi enviado para seu e-mail!');
        submitButton.innerHTML = originalHTML;
        submitButton.disabled = false;
        submitButton.setAttribute('aria-busy', 'false');
    }, 2000);
};

const resetGame = () => {
    gameState = 'gift-selection';
    selectedDiscount = 0;
    giftSelection.style.display = 'flex';
    scratchGame.style.display = 'none';
    discountResult.style.display = 'none';
    emailForm.reset();
    
    // Clear canvas
    if (scratchCanvas) {
        const ctx = scratchCanvas.getContext('2d');
        ctx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);
    }
};

// Booking Form
const handleBookingSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const requiredFields = ['name', 'email', 'phone', 'tattoo-type', 'size'];
    let isValid = true;
    let firstInvalidField = null;
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!data[field] || data[field].trim() === '') {
            input.style.borderColor = '#ff0040';
            input.style.boxShadow = '0 0 10px rgba(255, 0, 64, 0.5)';
            input.setAttribute('aria-invalid', 'true');
            if (!firstInvalidField) {
                firstInvalidField = input;
            }
            isValid = false;
        } else {
            input.style.borderColor = '#2a2a2a';
            input.style.boxShadow = 'none';
            input.setAttribute('aria-invalid', 'false');
        }
    });
    
    if (!isValid) {
        showError(document.createElement('div'), 'Por favor, preencha todos os campos obrigatórios.');
        if (firstInvalidField) {
            firstInvalidField.focus();
        }
        announceToScreenReader('Formulário contém erros. Por favor, verifique os campos obrigatórios.');
        return;
    }
    
    if (!isValidEmail(data.email)) {
        const emailField = document.getElementById('email');
        emailField.style.borderColor = '#ff0040';
        emailField.style.boxShadow = '0 0 10px rgba(255, 0, 64, 0.5)';
        emailField.setAttribute('aria-invalid', 'true');
        emailField.focus();
        showError(document.createElement('div'), 'Por favor, digite um e-mail válido.');
        announceToScreenReader('E-mail inválido.');
        return;
    }
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalHTML = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ENVIANDO...';
    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
    
    setTimeout(() => {
        showSuccess('✅ Solicitação enviada! Entraremos em contato em breve.');
        submitButton.innerHTML = originalHTML;
        submitButton.disabled = false;
        submitButton.setAttribute('aria-busy', 'false');
        bookingForm.reset();
        
        // Clear validation styles
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            input.style.borderColor = '#2a2a2a';
            input.style.boxShadow = 'none';
            input.setAttribute('aria-invalid', 'false');
        });
        
        announceToScreenReader('Formulário enviado com sucesso!');
    }, 2000);
};

// Scroll Reveal Animation
const revealSections = () => {
    const sections = document.querySelectorAll('.reveal-section');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.8) {
            section.classList.add('revealed');
        }
    });
};

// Interactive Elements
const addInteractiveEffects = () => {
    // Add glow effect to interactive elements
    const interactiveElements = document.querySelectorAll('button, .portfolio-item, .stat-item, .step, .contact-item, .social-icon, .testimonial-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = element.style.transform || '';
            if (!element.style.transform.includes('scale')) {
                element.style.transform += ' scale(1.02)';
            }
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = element.style.transform.replace(' scale(1.02)', '');
        });
        
        // Add focus styles for keyboard navigation
        element.addEventListener('focus', () => {
            element.style.transform = element.style.transform || '';
            if (!element.style.transform.includes('scale')) {
                element.style.transform += ' scale(1.02)';
            }
        });
        
        element.addEventListener('blur', () => {
            element.style.transform = element.style.transform.replace(' scale(1.02)', '');
        });
    });
    
    // Portfolio lightbox effect
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('click', handlePortfolioClick);
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handlePortfolioClick.call(item);
            }
        });
    });
};

const handlePortfolioClick = function() {
    const item = this;
    const title = item.querySelector('.portfolio-info h3')?.textContent || 'Tatuagem';
    const style = item.querySelector('.portfolio-info p')?.textContent || 'Arte';
    const imgSrc = item.querySelector('img')?.src || '';
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: linear-gradient(135deg, #000000, #1a1a1a);
        border: 2px solid #00f5ff;
        border-radius: 15px;
        padding: 2rem;
        text-align: center;
        max-width: 500px;
        width: 90%;
        color: white;
        box-shadow: 0 0 20px rgba(0, 245, 255, 0.5);
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;
    
    content.innerHTML = `
        <img src="${imgSrc}" alt="${title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 1rem;">
        <h3 style="font-family: 'Bebas Neue', cursive; font-size: 2rem; margin-bottom: 1rem; color: #00f5ff; text-shadow: 0 0 10px #00f5ff;">${title}</h3>
        <p style="color: #39ff14; font-weight: 600; margin-bottom: 2rem; font-family: 'Orbitron', monospace;">${style}</p>
        <p style="color: #888; margin-bottom: 2rem; font-family: 'Orbitron', monospace;">Esta é uma prévia do nosso trabalho. Entre em contato para mais detalhes!</p>
        <button onclick="this.closest('.portfolio-lightbox').remove(); document.body.style.overflow='auto';" 
                style="background: linear-gradient(135deg, #00f5ff, #39ff14); color: #000000; border: none; padding: 1rem 2rem; border-radius: 50px; cursor: pointer; font-weight: 700; font-family: 'Bebas Neue', cursive; letter-spacing: 1px; transition: all 0.3s ease;">
            FECHAR
        </button>
    `;
    
    overlay.className = 'portfolio-lightbox';
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    
    // Animate in
    setTimeout(() => {
        overlay.style.opacity = '1';
        content.style.transform = 'scale(1)';
    }, 10);
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.style.opacity = '0';
            content.style.transform = 'scale(0.8)';
            setTimeout(() => {
                overlay.remove();
                document.body.style.overflow = 'auto';
            }, 300);
        }
    });
    
    // Close on Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            overlay.style.opacity = '0';
            content.style.transform = 'scale(0.8)';
            setTimeout(() => {
                overlay.remove();
                document.body.style.overflow = 'auto';
            }, 300);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
};

// Form Field Animation
const animateFormFields = () => {
    const formInputs = document.querySelectorAll('input, select, textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.transform = 'scale(1.02)';
            input.style.borderColor = '#4a90e2';
            input.style.boxShadow = '0 0 20px rgba(74, 144, 226, 0.3)';
        });
        
        input.addEventListener('blur', () => {
            input.style.transform = 'scale(1)';
            if (input.value === '') {
                input.style.borderColor = '#2a2a2a';
                input.style.boxShadow = 'none';
            }
        });
    });
};

// Keyboard Navigation
const handleKeyboardNav = (e) => {
    if (e.key === 'Escape') {
        if (discountModal.classList.contains('show')) {
            hideDiscountModal();
        }
        if (navMenu.classList.contains('active')) {
            closeMobileNav();
        }
    }
    
    // Trap focus in modal
    if (discountModal.classList.contains('show')) {
        trapFocus(e, discountModal);
    }
};

const trapFocus = (e, container) => {
    const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.key === 'Tab') {
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
};

// CSS Animations
const addDynamicStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes giftPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .gift-option:hover .gift-box {
            animation: giftPulse 1s infinite;
        }
    `;
    document.head.appendChild(style);
};

// Performance optimization: Lazy load images
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    addDynamicStyles();
    animateFormFields();
    addInteractiveEffects();
    lazyLoadImages();
    
    hideLoadingScreen();
    
    // Navigation events
    window.addEventListener('scroll', handleNavbarScroll);
    if (navToggle) navToggle.addEventListener('click', toggleMobileNav);
    if (navMenu) navMenu.addEventListener('click', handleNavClick);
    
    // Modal events
    if (modalClose) modalClose.addEventListener('click', hideDiscountModal);
    if (discountModal) {
        discountModal.addEventListener('click', (e) => {
            if (e.target === discountModal) {
                hideDiscountModal();
            }
        });
    }
    
    // Form events
    if (emailForm) emailForm.addEventListener('submit', handleEmailSubmit);
    if (bookingForm) bookingForm.addEventListener('submit', handleBookingSubmit);
    
    // Keyboard events
    document.addEventListener('keydown', handleKeyboardNav);
    
    // Scroll reveal
    window.addEventListener('scroll', debounce(revealSections, 100));
    revealSections();
    
    // Smooth scroll for all internal links
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMobileNav();
        }
    }, 250));
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.style.animationPlayState = 'paused';
    } else {
        document.body.style.animationPlayState = 'running';
    }
});

// Console welcome message
console.log(`
🐦‍⬛ BEM-VINDO AO RAVEN STUDIO! 🐦‍⬛

Este site foi criado com tecnologia de ponta e design inovador.
Transformamos pele em arte desde 2016.

Desenvolvido com:
- HTML5 semântico e acessível
- CSS3 com efeitos neon e animações avançadas
- JavaScript vanilla otimizado
- Design responsivo e interativo
- Microinterações e efeitos visuais únicos
- Recursos de acessibilidade completos

Para mais informações: contato@ravenstudio.com

🎨 Onde a arte encontra a tecnologia 🎨
`);
// Adicionar após o DOMContentLoaded
// Inicializar smooth scroll para todos os links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      // Foco acessível
      targetElement.setAttribute('tabindex', '-1');
      targetElement.focus();
      setTimeout(() => {
        targetElement.removeAttribute('tabindex');
      }, 1000);
    }
  });
});

// Adicionar aria-labels dinâmicos para imagens
function enhanceImageAccessibility() {
  document.querySelectorAll('img:not([alt])').forEach(img => {
    if (!img.getAttribute('alt') && !img.hasAttribute('aria-hidden')) {
      const parentText = img.parentElement.textContent || img.parentElement.getAttribute('aria-label') || '';
      img.setAttribute('alt', parentText.trim() || 'Imagem decorativa');
    }
  });
}

// Adicionar labels para elementos interativos
function enhanceInteractiveElements() {
  document.querySelectorAll('button:not([aria-label]), a:not([aria-label])').forEach(el => {
    const text = el.textContent.trim();
    if (text && !el.getAttribute('aria-label')) {
      el.setAttribute('aria-label', text);
    }
  });
}

// Chamar as funções
enhanceImageAccessibility();
enhanceInteractiveElements();