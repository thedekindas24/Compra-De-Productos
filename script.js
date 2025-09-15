document.addEventListener('DOMContentLoaded', () => {
    // --- Product Data (Typically from a server/database) ---
    const products = [
        { id: 1, name: "Dragón de peluche", price: 19.99, image: "imagenes/dragoncito.jpg" },
        { id: 2, name: "perro robot", price: 29.99, image: "imagenes/perrito.jpg" },
        { id: 3, name: "Conjunto de bloques de construcción", price: 24.50, image: "imagenes/legos.jpg" },
        { id: 4, name: "Carro control remoto", price: 35.00, image: "imagenes/carrito.jpg" },
        { id: 5, name: "Art Kit", price: 15.75, image: "imagenes/arte.jpg" },
        { id: 6, name: "Rompecabezas espacial", price: 12.99, image: "imagenes/espacio.jpg" }
    ];

    // --- State ---
    let cart = []; // Stores objects like { id, name, price, quantity }

    // --- DOM Elements ---
    const productGrid = document.querySelector('.product-grid');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const checkoutButton = document.getElementById('checkout-button');

    const productListingSection = document.getElementById('product-listing');
    const shoppingCartSection = document.getElementById('shopping-cart-section');
    const checkoutFormSection = document.getElementById('checkout-form-section');
    const confirmationMessageSection = document.getElementById('confirmation-message-section');
    const mainContainer = document.querySelector('main.container');

    const purchaseForm = document.getElementById('purchase-form');
    const backToCartButton = document.getElementById('back-to-cart-button');
    const shopAgainButton = document.getElementById('shop-again-button');

    // --- Functions ---

    // Render Products
    function renderProducts() {
        productGrid.innerHTML = ''; // Clear existing products
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button class="action-button add-to-cart-button" data-id="${product.id}">Add to Cart</button>
            `;
            productGrid.appendChild(productCard);
        });
    }

    // Render Cart
    function renderCart() {
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            if (cartItemsContainer.querySelector('ul')) {
                cartItemsContainer.querySelector('ul').remove();
            }
        } else {
            emptyCartMessage.style.display = 'none';
            let cartList = cartItemsContainer.querySelector('ul');
            if (!cartList) {
                cartList = document.createElement('ul');
                cartItemsContainer.appendChild(cartList);
            }
            cartList.innerHTML = ''; // Clear existing items

            cart.forEach(item => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <div class="cart-item-details">
                        <span class="cart-item-name">${item.name}</span> (x${item.quantity})
                    </div>
                    <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="remove-item-button" data-id="${item.id}">Remove</button>
                `;
                cartList.appendChild(listItem);
            });
        }
        updateCartTotal();
        checkoutButton.disabled = cart.length === 0;
    }

    // Update Cart Total
    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalPriceEl.textContent = `$${total.toFixed(2)}`;
    }

    // Add to Cart
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        renderCart();
    }

    // Remove from Cart
    function removeFromCart(productId) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            cart[itemIndex].quantity--;
            if (cart[itemIndex].quantity === 0) {
                cart.splice(itemIndex, 1);
            }
        }
        renderCart();
    }

    // Show specific section
    function showSection(sectionToShow) {
        productListingSection.style.display = 'none';
        shoppingCartSection.style.display = 'none';
        checkoutFormSection.style.display = 'none';
        confirmationMessageSection.style.display = 'none';
        mainContainer.classList.remove('checkout-view'); // Default view

        if (sectionToShow === 'checkout') {
            checkoutFormSection.style.display = 'block';
            mainContainer.classList.add('checkout-view');
        } else if (sectionToShow === 'confirmation') {
            confirmationMessageSection.style.display = 'block';
            mainContainer.classList.add('checkout-view');
        } else { // Default: products and cart
            productListingSection.style.display = 'block';
            shoppingCartSection.style.display = 'block';
        }
    }


    // --- Event Listeners ---

    // Add to Cart Buttons (Event Delegation)
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-button')) {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        }
    });

    // Remove from Cart Buttons (Event Delegation)
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item-button')) {
            const productId = parseInt(e.target.dataset.id);
            removeFromCart(productId);
        }
    });

    // Checkout Button
    checkoutButton.addEventListener('click', () => {
        if (cart.length > 0) {
            showSection('checkout');
        }
    });

    // Back to Cart Button (from checkout form)
    backToCartButton.addEventListener('click', () => {
        showSection('products'); // Show products and cart
    });

    // Purchase Form Submission
    purchaseForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent actual form submission
        // Basic validation (you can add more)
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        if (name && email) {
            console.log('Purchase Details:', {
                name: name,
                email: email,
                address: document.getElementById('address').value,
                // ... other dummy card details
                items: cart,
                total: parseFloat(cartTotalPriceEl.textContent.substring(1))
            });
            // Simulate purchase
            cart = []; // Empty the cart
            renderCart(); // Update cart display (will show empty)
            purchaseForm.reset(); // Clear form fields
            showSection('confirmation');
        } else {
            alert('Please fill in all required fields.');
        }
    });

    // Shop Again Button (from confirmation)
    shopAgainButton.addEventListener('click', () => {
        showSection('products');
    });


    // --- Initial Setup ---
    renderProducts();
    renderCart();
    showSection('products'); // Initial view
});