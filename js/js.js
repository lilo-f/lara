
// FAQ Data
const faqData = {
    precos: [
        {
            question: "Quanto custa uma tatuagem?",
            answer: "Os preços variam de R$ 200 a R$ 2000, dependendo do tamanho e complexidade. Tatuagens pequenas: R$ 200-500, médias: R$ 500-1000, grandes: acima de R$ 1000."
        }
    ],
    procedimento: [
        {
            question: "Dói muito fazer tatuagem?",
            answer: "A dor varia conforme a região do corpo e tolerância pessoal. Áreas ósseas doem mais. A sensação é similar a uma queimação contínua. Usamos técnicas para minimizar o desconforto."
        }
    ],
    cuidados: [
        {
            question: "Como cuidar da tatuagem?",
            answer: "Mantenha limpa e hidratada com pomada cicatrizante por 7-10 dias. Evite sol direto, piscina e mar por 15 dias. Não retire as casquinhas naturalmente formadas."
        }
    ],
    estilos: [
        {
            question: "Que estilos vocês fazem?",
            answer: "Oferecemos: Tradicional/Old School, Realismo, Minimalista, Aquarela, Geométrico, Blackwork, Fine Line. Cada artista tem especialidades específicas."
        }
    ],
    agendamento: [
        {
            question: "Como funciona o agendamento?",
            answer: "Escolha o artista, data e horário disponível. Pedimos entrada de 50% do valor total. Você receberá confirmação por e-mail."
        }
    ],
    tempo: [
        {
            question: "Quanto tempo demora?",
            answer: "Tatuagens pequenas: 1-2h, médias: 2-4h, grandes podem precisar múltiplas sessões. O tempo varia conforme complexidade e detalhamento."
        }
    ]
};

// Navigation
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('active');
        }
    });
});

// Smooth scrolling function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Form handling
document.getElementById('appointment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const appointmentData = {};
    
    formData.forEach((value, key) => {
        appointmentData[key] = value;
    });
    
    // Simulate form submission
    alert('Agendamento enviado com sucesso! Entraremos em contato em breve.');
    
    // Reset form
    this.reset();
    
    console.log('Appointment data:', appointmentData);
});

// Chat Widget
let currentCategory = null;
let currentState = 'categories'; // categories, questions, answer

const chatToggle = document.getElementById('chat-toggle');
const chatContainer = document.getElementById('chat-container');
const chatClose = document.getElementById('chat-close');

chatToggle.addEventListener('click', function() {
    chatContainer.classList.toggle('active');
});

chatClose.addEventListener('click', function() {
    chatContainer.classList.remove('active');
});

// Close chat when clicking outside
document.addEventListener('click', function(event) {
    if (!chatToggle.contains(event.target) && !chatContainer.contains(event.target)) {
        chatContainer.classList.remove('active');
    }
});

function showCategories() {
    document.getElementById('chat-categories').style.display = 'block';
    document.getElementById('chat-questions').style.display = 'none';
    document.getElementById('chat-answer').style.display = 'none';
    currentState = 'categories';
    currentCategory = null;
}

function showCategory(category) {
    currentCategory = category;
    currentState = 'questions';
    
    const questionsContainer = document.getElementById('questions-list');
    const categoryData = faqData[category] || [];
    
    questionsContainer.innerHTML = '';
    
    categoryData.forEach((faq, index) => {
        const questionBtn = document.createElement('button');
        questionBtn.className = 'question-btn';
        questionBtn.textContent = faq.question;
        questionBtn.onclick = () => showAnswer(category, index);
        questionsContainer.appendChild(questionBtn);
    });
    
    document.getElementById('chat-categories').style.display = 'none';
    document.getElementById('chat-questions').style.display = 'block';
    document.getElementById('chat-answer').style.display = 'none';
}

function showQuestions() {
    if (currentCategory) {
        showCategory(currentCategory);
    } else {
        showCategories();
    }
}

function showAnswer(category, questionIndex) {
    const faq = faqData[category][questionIndex];
    const answerContent = document.getElementById('answer-content');
    
    answerContent.innerHTML = `
        <div class="answer-content">
            <h5>Pergunta:</h5>
            <p>${faq.question}</p>
            <h5 style="color: #10b981; margin-top: 1rem;">Resposta:</h5>
            <p>${faq.answer}</p>
        </div>
    `;
    
    document.getElementById('chat-categories').style.display = 'none';
    document.getElementById('chat-questions').style.display = 'none';
    document.getElementById('chat-answer').style.display = 'block';
    currentState = 'answer';
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe sections for animations
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
});

// Portfolio image modal (simple version)
document.querySelectorAll('.portfolio-item img').forEach(img => {
    img.addEventListener('click', function() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            cursor: pointer;
        `;
        
        const modalImg = document.createElement('img');
        modalImg.src = this.src;
        modalImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 10px;
        `;
        
        modal.appendChild(modalImg);
        document.body.appendChild(modal);
        
        modal.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
    });
});

// Set minimum date for appointment form
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const minDate = tomorrow.toISOString().split('T')[0];
        dateInput.setAttribute('min', minDate);
    }
});

// Add active class to current navigation item
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    function setActiveLink() {
        const currentSection = getCurrentSection();
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    function getCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        for (let section of sections) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                return section.id;
            }
        }
        
        return 'home';
    }
    
    window.addEventListener('scroll', setActiveLink);
    setActiveLink();
});

console.log('Black Ink Studio website loaded successfully!');

