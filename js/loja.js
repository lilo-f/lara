// Dados dos produtos
const products = [
    {
        id: 1,
        name: "Kit Cuidados Pós-Tatuagem",
        category: "care",
        price: 89.90,
        rating: 5,
        description: "Kit completo com pomada regeneradora, sabonete neutro e protetor solar específico para tatuagens novas.",
        image: "https://images.unsplash.com/photo-1583944121841-8a8706a71d22?w=400&h=400&fit=crop",
        badge: "Mais vendido"
    },
    {
        id: 2,
        name: "Camiseta Raven Studio",
        category: "clothing",
        price: 79.90,
        rating: 4,
        description: "Camiseta premium com estampa exclusiva do Raven Studio. 100% algodão e impressão de alta durabilidade.",
        image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400&h=400&fit=crop"
    },
    {
        id: 3,
        name: "Poster Arte Tribal",
        category: "art",
        price: 49.90,
        rating: 5,
        description: "Poster em alta qualidade com arte tribal exclusiva. Perfeito para decorar seu espaço com estilo.",
        image: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?w=400&h=400&fit=crop",
        badge: "Novidade"
    },
    {
        id: 4,
        name: "Óleo para Tatuagem",
        category: "care",
        price: 39.90,
        rating: 4,
        description: "Óleo nutritivo para manter suas tatuagens vivas e coloridas por mais tempo. Fórmula natural e vegana.",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop"
    },
    {
        id: 5,
        name: "Boné Raven Studio",
        category: "accessories",
        price: 69.90,
        rating: 4,
        description: "Boné ajustável com logo bordado do Raven Studio. Disponível em várias cores.",
        image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=400&fit=crop"
    },
    {
        id: 6,
        name: "Caderno de Esboços",
        category: "art",
        price: 59.90,
        rating: 5,
        description: "Caderno de alta qualidade para esboços e desenhos. Papel especial para arte em preto e branco.",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop"
    },
    {
        id: 7,
        name: "Moletom Raven Studio",
        category: "clothing",
        price: 149.90,
        rating: 5,
        description: "Moletom premium com capuz e estampa exclusiva. Conforto e estilo para os amantes da arte corporal.",
        image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400&h=400&fit=crop",
        badge: "Oferta"
    },
    {
        id: 8,
        name: "Caneca Tattoo Art",
        category: "art",
        price: 39.90,
        rating: 4,
        description: "Caneca de cerâmica com estampas de arte corporal. Perfeita para presentear ou decorar seu espaço.",
        image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=400&h=400&fit=crop"
    }
];

// Variáveis globais
let cart = [];
let currentPage = 1;
const productsPerPage = 8;
let filteredProducts = [...products];

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const featuredProducts = document.getElementById('featured-products');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const cartIcon = document.getElementById('cart-icon');
const productModal = document.getElementById('product-modal');
const productModalBody = document.getElementById('product-modal-body');
const priceSlider = document.getElementById('price-slider');
const maxPriceDisplay = document.getElementById('max-price-display');
const clearFiltersBtn = document.getElementById('clear-filters');
const sortBy = document.getElementById('sort-by');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageIndicator = document.getElementById('page-indicator');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderFeaturedProducts();
    renderProducts();
    updateCartCount();
    
    // Carrega carrinho do localStorage
    const savedCart = localStorage.getItem('ravenStoreCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        renderCart();
    }
});

// Renderiza produtos em destaque
function renderFeaturedProducts() {
    const featured = products.filter(p => p.badge).slice(0, 3);
    
    featuredProducts.innerHTML = featured.map(product => `
        <div class="product-card" data-id="${product.id}">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <span class="product-category">${getCategoryName(product.category)}</span>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">R$${product.price.toFixed(2)}</span>
                    <div class="product-rating">${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}</div>
                </div>
                <button class="add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
            </div>
        </div>
    `).join('');
    
    // Adiciona eventos aos produtos em destaque
    document.querySelectorAll('.featured-products .product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('add-to-cart')) {
                const productId = parseInt(card.dataset.id);
                showProductModal(productId);
            }
        });
    });
    
    document.querySelectorAll('.featured-products .add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.id);
            addToCart(productId);
        });
    });
}

// Renderiza todos os produtos
function renderProducts() {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    productsGrid.innerHTML = paginatedProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-actions">
                <button class="quick-view" data-id="${product.id}" aria-label="Visualizar rápido">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="wishlist" data-id="${product.id}" aria-label="Adicionar à lista de desejos">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <span class="product-category">${getCategoryName(product.category)}</span>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">R$${product.price.toFixed(2)}</span>
                    <div class="product-rating">${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}</div>
                </div>
                <button class="add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
            </div>
        </div>
    `).join('');
    
    // Atualiza paginação
    updatePagination();
    
    // Adiciona eventos aos produtos
    addProductEvents();
}

// Adiciona eventos aos produtos
function addProductEvents() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('add-to-cart') && 
                !e.target.classList.contains('quick-view') && 
                !e.target.classList.contains('wishlist') &&
                !e.target.closest('.product-actions')) {
                const productId = parseInt(card.dataset.id);
                showProductModal(productId);
            }
        });
    });
    
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.id);
            addToCart(productId);
        });
    });
    
    document.querySelectorAll('.quick-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.id);
            showProductModal(productId);
        });
    });
    
    document.querySelectorAll('.wishlist').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.innerHTML = '<i class="fas fa-heart"></i>';
            btn.style.color = '#ff0040';
            showSuccess('Produto adicionado à lista de desejos!');
        });
    });
}

// Mostra modal do produto
function showProductModal(productId) {
    const product = products.find(p => p.id === productId);
    
    productModalBody.innerHTML = `
        <div class="modal-product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-product-details">
            <h3 class="modal-product-title">${product.name}</h3>
            <span class="modal-product-category">${getCategoryName(product.category)}</span>
            <div class="modal-product-rating">${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}</div>
            <div class="modal-product-price">R$${product.price.toFixed(2)}</div>
            <p class="modal-product-description">${product.description}</p>
            <div class="modal-product-actions">
                <button class="modal-add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
                <button class="modal-wishlist">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Adiciona eventos aos botões do modal
    document.querySelector('.modal-add-to-cart').addEventListener('click', () => {
        addToCart(product.id);
        productModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    document.querySelector('.modal-wishlist').addEventListener('click', (e) => {
        e.target.classList.toggle('far');
        e.target.classList.toggle('fas');
        if (e.target.classList.contains('fas')) {
            showSuccess('Produto adicionado à lista de desejos!');
        }
    });
}

// Fecha modal do produto
function closeProductModal() {
    productModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Adiciona produto ao carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showSuccess('Produto adicionado ao carrinho!');
}

// Atualiza carrinho
function updateCart() {
    renderCart();
    updateCartCount();
    saveCartToLocalStorage();
}

// Renderiza itens do carrinho
function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
                <a href="#products" class="btn">Continuar Comprando</a>
            </div>
        `;
        cartTotal.textContent = 'R$0.00';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-price">R$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="decrease-quantity">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity">+</button>
                </div>
                <button class="remove-item">Remover</button>
            </div>
        </div>
    `).join('');
    
    // Calcula total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `R$${total.toFixed(2)}`;
    
    // Adiciona eventos aos itens do carrinho
    document.querySelectorAll('.decrease-quantity').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.closest('.cart-item').dataset.id);
            updateQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.increase-quantity').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.closest('.cart-item').dataset.id);
            updateQuantity(productId, 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.closest('.cart-item').dataset.id);
            removeFromCart(productId);
        });
    });
}

// Atualiza quantidade do item no carrinho
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Remove item do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showSuccess('Produto removido do carrinho!');
}

// Atualiza contador do carrinho
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
}

// Salva carrinho no localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('ravenStoreCart', JSON.stringify(cart));
}

// Filtra produtos
function filterProducts() {
    const selectedCategory = document.querySelector('.category-list a.active')?.dataset.category;
    const maxPrice = parseInt(priceSlider.value);
    const minRating = document.querySelector('input[name="rating"]:checked')?.value;
    const searchTerm = searchInput.value.toLowerCase();
    
    filteredProducts = products.filter(product => {
        // Filtro por categoria
        if (selectedCategory && selectedCategory !== 'all' && product.category !== selectedCategory) {
            return false;
        }
        
        // Filtro por preço
        if (product.price > maxPrice) {
            return false;
        }
        
        // Filtro por avaliação
        if (minRating && product.rating < parseInt(minRating)) {
            return false;
        }
        
        // Filtro por busca
        if (searchTerm && !product.name.toLowerCase().includes(searchTerm) && 
            !product.description.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        return true;
    });
    
    // Ordena produtos
    sortProducts();
    
    // Reseta para a primeira página
    currentPage = 1;
    renderProducts();
}

// Ordena produtos
function sortProducts() {
    const sortValue = sortBy.value;
    
    switch (sortValue) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            filteredProducts.sort((a, b) => a.id - b.id);
    }
}

// Atualiza paginação
function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    pageIndicator.textContent = `Página ${currentPage} de ${totalPages}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
}

// Navegação entre páginas
function goToPage(page) {
    currentPage = page;
    renderProducts();
}

// Mostra mensagem de sucesso
function showSuccess(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Retorna nome da categoria
function getCategoryName(category) {
    const categories = {
        'care': 'Cuidados pós-tatuagem',
        'clothing': 'Vestuário',
        'accessories': 'Acessórios',
        'art': 'Arte e Decoração'
    };
    
    return categories[category] || category;
}

// Event Listeners
cartIcon.addEventListener('click', () => {
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

document.querySelector('.close-cart').addEventListener('click', () => {
    cartModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

document.querySelector('.close-modal').addEventListener('click', closeProductModal);

priceSlider.addEventListener('input', () => {
    maxPriceDisplay.textContent = `R$${priceSlider.value}`;
    filterProducts();
});

document.querySelectorAll('.category-list a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.category-list a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        filterProducts();
    });
});

document.querySelectorAll('input[name="rating"]').forEach(radio => {
    radio.addEventListener('change', filterProducts);
});

clearFiltersBtn.addEventListener('click', () => {
    priceSlider.value = 500;
    maxPriceDisplay.textContent = 'R$500';
    document.querySelectorAll('.category-list a').forEach(l => l.classList.remove('active'));
    document.querySelector('.category-list a[data-category="all"]').classList.add('active');
    document.querySelectorAll('input[name="rating"]').forEach(r => r.checked = false);
    searchInput.value = '';
    filterProducts();
});

sortBy.addEventListener('change', filterProducts);

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        goToPage(currentPage - 1);
    }
});

nextPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (currentPage < totalPages) {
        goToPage(currentPage + 1);
    }
});

searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        filterProducts();
    }
});

searchBtn.addEventListener('click', filterProducts);

// Fecha modais ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    if (e.target === productModal) {
        closeProductModal();
    }
});