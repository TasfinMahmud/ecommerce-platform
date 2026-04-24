const products = [
    { id: 1, name: 'iPhone 16 Pro Max', category: 'phones', price: 1199, oldPrice: 1299, rating: 4.9, reviews: 2341, badge: 'New', emoji: '📱', desc: 'A17 Pro chip, 48MP camera system, titanium design with Action button.' },
    { id: 2, name: 'MacBook Pro M4', category: 'laptops', price: 1999, oldPrice: 2199, rating: 4.8, reviews: 1823, badge: 'Hot', emoji: '💻', desc: '14-inch Liquid Retina XDR, 18hr battery, up to 128GB unified memory.' },
    { id: 3, name: 'AirPods Pro 3', category: 'audio', price: 249, oldPrice: 279, rating: 4.7, reviews: 5421, badge: 'Sale', emoji: '🎧', desc: 'H2 chip, Active Noise Cancellation, Adaptive Transparency, USB-C.' },
    { id: 4, name: 'Apple Watch Ultra 3', category: 'wearables', price: 799, oldPrice: null, rating: 4.8, reviews: 987, badge: 'New', emoji: '⌚', desc: '49mm titanium case, 72hr battery, precision dual-frequency GPS.' },
    { id: 5, name: 'Samsung Galaxy S25', category: 'phones', price: 999, oldPrice: 1099, rating: 4.7, reviews: 3210, badge: null, emoji: '📱', desc: 'Snapdragon 8 Gen 4, 200MP camera, Galaxy AI built-in.' },
    { id: 6, name: 'Sony WH-1000XM6', category: 'audio', price: 349, oldPrice: 399, rating: 4.9, reviews: 4562, badge: 'Hot', emoji: '🎵', desc: 'Industry-leading noise cancellation, 40hr battery, multipoint.' },
    { id: 7, name: 'Dell XPS 15', category: 'laptops', price: 1599, oldPrice: null, rating: 4.6, reviews: 1245, badge: null, emoji: '💻', desc: 'Intel Core Ultra 9, 32GB RAM, OLED 3.5K display, Thunderbolt 4.' },
    { id: 8, name: 'MX Master 4S', category: 'accessories', price: 99, oldPrice: 119, rating: 4.8, reviews: 8932, badge: 'Sale', emoji: '🖱️', desc: 'Ergonomic wireless mouse, MagSpeed scroll, 8K DPI, multi-device.' },
    { id: 9, name: 'Pixel Watch 3', category: 'wearables', price: 349, oldPrice: null, rating: 4.5, reviews: 876, badge: null, emoji: '⌚', desc: 'Fitbit health tracking, Google AI assistant, circular AMOLED.' },
    { id: 10, name: 'Razer BlackWidow V4', category: 'accessories', price: 169, oldPrice: 199, rating: 4.7, reviews: 2134, badge: null, emoji: '⌨️', desc: 'Mechanical gaming keyboard, Razer Green switches, Chroma RGB.' },
    { id: 11, name: 'iPad Pro M4', category: 'laptops', price: 1099, oldPrice: 1199, rating: 4.9, reviews: 3456, badge: 'Hot', emoji: '📲', desc: 'Ultra Retina XDR, M4 chip, Tandem OLED, Apple Pencil Pro support.' },
    { id: 12, name: 'Galaxy Buds 3 Pro', category: 'audio', price: 229, oldPrice: 249, rating: 4.6, reviews: 1987, badge: null, emoji: '🎶', desc: '2-way speakers, 360 Audio, Blade Lights design, 30hr battery.' },
];

let cart = [];
let currentCategory = 'all';

const grid = document.getElementById('productsGrid');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');

function renderProducts(list) {
    grid.innerHTML = list.map(p => `
        <div class="product-card" onclick="openModal(${p.id})">
            <div class="product-img">
                ${p.badge ? `<span class="product-badge ${p.badge === 'Sale' ? 'sale' : ''}">${p.badge}</span>` : ''}
                <button class="product-wishlist" onclick="event.stopPropagation();this.classList.toggle('active')"><i class="fas fa-heart"></i></button>
                <span>${p.emoji}</span>
            </div>
            <div class="product-info">
                <div class="product-category">${p.category}</div>
                <div class="product-name">${p.name}</div>
                <div class="product-rating">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))} <span>(${p.reviews.toLocaleString()})</span></div>
                <div class="product-price-row">
                    <div><span class="product-price">$${p.price}</span>${p.oldPrice ? `<span class="product-old-price">$${p.oldPrice}</span>` : ''}</div>
                    <button class="add-cart-btn" onclick="event.stopPropagation();addToCart(${p.id})"><i class="fas fa-plus"></i></button>
                </div>
            </div>
        </div>`).join('');
}

function addToCart(id) {
    const p = products.find(x => x.id === id);
    const existing = cart.find(x => x.id === id);
    if (existing) existing.qty++;
    else cart.push({ ...p, qty: 1 });
    updateCart();
    showToast(`${p.name} added to cart!`);
}

function removeFromCart(id) {
    cart = cart.filter(x => x.id !== id);
    updateCart();
}

function changeQty(id, delta) {
    const item = cart.find(x => x.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) removeFromCart(id);
        else updateCart();
    }
}

function updateCart() {
    const totalItems = cart.reduce((a, x) => a + x.qty, 0);
    const totalPrice = cart.reduce((a, x) => a + x.price * x.qty, 0);
    cartCount.textContent = totalItems;
    cartTotal.textContent = '$' + totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 });

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Your cart is empty</p></div>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-img">${item.emoji}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${(item.price * item.qty).toLocaleString()}</div>
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
            </div>`).join('');
    }
}

function openModal(id) {
    const p = products.find(x => x.id === id);
    document.getElementById('productModal').innerHTML = `
        <div class="modal-img">${p.emoji}</div>
        <div class="modal-info">
            <div class="modal-cat">${p.category}</div>
            <div class="modal-name">${p.name}</div>
            <div class="modal-rating">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))} (${p.reviews.toLocaleString()} reviews)</div>
            <div class="modal-desc">${p.desc}</div>
            <div class="modal-price">$${p.price}${p.oldPrice ? `<span class="product-old-price" style="font-size:1rem;margin-left:8px">$${p.oldPrice}</span>` : ''}</div>
            <button class="modal-add-btn" onclick="addToCart(${p.id});closeModal()"><i class="fas fa-shopping-bag"></i> Add to Cart</button>
        </div>`;
    document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }

function showToast(msg) {
    const t = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
}

// Cart toggle
document.getElementById('cartBtn').addEventListener('click', () => {
    document.getElementById('cartDrawer').classList.add('open');
    document.getElementById('cartOverlay').classList.add('open');
});
document.getElementById('closeCart').addEventListener('click', () => {
    document.getElementById('cartDrawer').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('open');
});
document.getElementById('cartOverlay').addEventListener('click', () => {
    document.getElementById('cartDrawer').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('open');
});
document.getElementById('modalOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });

// Categories
document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.cat;
        const filtered = currentCategory === 'all' ? products : products.filter(p => p.category === currentCategory);
        renderProducts(filtered);
    });
});

// Sort
document.getElementById('sortSelect').addEventListener('change', e => {
    let list = currentCategory === 'all' ? [...products] : products.filter(p => p.category === currentCategory);
    if (e.target.value === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (e.target.value === 'price-high') list.sort((a, b) => b.price - a.price);
    else if (e.target.value === 'rating') list.sort((a, b) => b.rating - a.rating);
    renderProducts(list);
});

// Search
document.getElementById('searchInput').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(q) || p.category.includes(q));
    renderProducts(filtered);
});

// Checkout
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) return;
    showToast('Order placed successfully! 🎉');
    cart = [];
    updateCart();
    document.getElementById('cartDrawer').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('open');
});

// Init
renderProducts(products);
updateCart();
