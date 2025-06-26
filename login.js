document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DO DOM ---
    const loadingScreen = document.getElementById('loading-screen');
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    // Modais
    const registerModal = document.getElementById('register-modal');
    const forgotModal = document.getElementById('forgot-modal');
    
    // Links e Botões para abrir Modais
    const showRegisterLink = document.getElementById('show-register');
    const forgotPasswordLink = document.querySelector('.forgot-password');

    // Botões para fechar Modais
    const registerClose = document.getElementById('register-close');
    const forgotClose = document.getElementById('forgot-close');
    
    // Formulários dos Modais
    const registerForm = document.getElementById('register-form');
    const forgotForm = document.getElementById('forgot-form');

    // Outros Elementos
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    const googleLoginBtn = document.querySelector('.google-login-button');

    // --- FUNÇÕES UTILITÁRIAS ---

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Função para mostrar notificação de sucesso (Toast)
    const showSuccess = (message) => {
        const successDiv = document.createElement('div');
        successDiv.className = 'toast-notification success';
        successDiv.textContent = message;
        document.body.appendChild(successDiv);
        
        // Adiciona um estilo dinamicamente para a notificação
        const style = document.createElement('style');
        style.innerHTML = `
            .toast-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                z-index: 10001;
                font-family: 'Teko', sans-serif;
                font-size: 1.2rem;
                letter-spacing: 0.5px;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.4s ease-in-out;
            }
            .toast-notification.success {
                background: linear-gradient(135deg, #4a90e2, #5fa4ff);
                color: #050505;
            }
            .toast-notification.show {
                opacity: 1;
                transform: translateX(0);
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => successDiv.classList.add('show'), 10);

        setTimeout(() => {
            successDiv.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(successDiv)) {
                    document.body.removeChild(successDiv);
                }
                document.head.removeChild(style);
            }, 400);
        }, 4000);
    };
    
    // --- LÓGICA DA PÁGINA ---

    // Esconder tela de loading
    const hideLoadingScreen = () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 2000); 
    };
    
    // Mostrar/Esconder Senha
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const icon = button.querySelector('i');
            const isPassword = input.getAttribute('type') === 'password';
            input.setAttribute('type', isPassword ? 'text' : 'password');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    });

    // --- LÓGICA DOS MODAIS ---

    const showModal = (modal) => {
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        const firstInput = modal.querySelector('input');
        if (firstInput) firstInput.focus();
    };

    const hideModal = (modal) => {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    };

    // --- VALIDAÇÃO E SUBMISSÃO DE FORMULÁRIOS ---

    const handleFormSubmit = (form, successMessage) => {
        // Simulação de envio para o backend
        const submitButton = form.querySelector('button[type="submit"]');
        const originalHTML = submitButton.innerHTML;
        submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ENVIANDO...`;
        submitButton.disabled = true;

        setTimeout(() => {
            if (form.id.includes('register')) hideModal(registerModal);
            if (form.id.includes('forgot')) hideModal(forgotModal);
            
            showSuccess(successMessage);
            submitButton.innerHTML = originalHTML;
            submitButton.disabled = false;
            form.reset();
        }, 2000);
    };

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Adicionar validação se necessário antes de chamar handleFormSubmit
            handleFormSubmit(loginForm, 'Login realizado com sucesso!');
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Adicionar validação
            const password = registerForm.querySelector('#register-password').value;
            const confirmPassword = registerForm.querySelector('#register-confirm').value;
            if (password !== confirmPassword) {
                alert('As senhas não coincidem!');
                return;
            }
            handleFormSubmit(registerForm, 'Conta criada com sucesso!');
        });
    }
    
    if (forgotForm) {
        forgotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit(forgotForm, 'Instruções enviadas para seu e-mail!');
        });
    }

    // --- EVENT LISTENERS ---

    // Abrir modais
    if (showRegisterLink) showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        showModal(registerModal);
    });

    if (forgotPasswordLink) forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        showModal(forgotModal);
    });

    // Fechar modais
    if (registerClose) registerClose.addEventListener('click', () => hideModal(registerModal));
    if (forgotClose) forgotClose.addEventListener('click', () => hideModal(forgotModal));
    
    // Fechar ao clicar fora ou com a tecla ESC
    document.addEventListener('click', (e) => {
        if (e.target === registerModal) hideModal(registerModal);
        if (e.target === forgotModal) hideModal(forgotModal);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (registerModal.classList.contains('show')) hideModal(registerModal);
            if (forgotModal.classList.contains('show')) hideModal(forgotModal);
        }
    });

    // Login com Google (simulação)
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => {
            showSuccess('Redirecionando para login com Google...');
            // Aqui entraria a lógica real da API do Google
        });
    }

    // Iniciar a página
    hideLoadingScreen();
    
    console.log("🎨 Raven Studio Login Page Loaded Successfully 🎨");
});