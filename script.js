document.addEventListener('DOMContentLoaded', function() {

  // --- PRODUCT DATA & RENDERING ---
  // This is a list of your products. You can easily add, remove, or edit them here.
  const products = [
    { name: 'Yin & Yang Handbag', category: 'accessories', price: '3000', image: 'balckwhite.jpg', description: 'A stylish black and white yin-yang themed crochet handbag, perfect for everyday use.' },
    { name: 'Ruby Noir Handbag', category: 'accessories', price: '3200', image: 'redbalck.jpg', description: 'Elegant red and black crochet handbag, a bold statement piece for your collection.' },
    { name: 'Azure Tote Bag', category: 'accessories', price: '2800', image: 'bluewhite.jpg', description: 'A spacious blue and white tote bag, ideal for shopping or a day out.' },
    { name: 'Sweetheart Headband', category: 'apparel', price: '950', image: 'rosee.jpg', description: 'A cute and comfy crochet headband with a sweetheart design.' },
    { name: 'Sunny Keychain', category: 'amigurumi', price: '500', image: 'sunflower.jpg', description: 'A cheerful sunflower amigurumi keychain to brighten your day.' },
    { name: 'Monochrome Shoulder Bag', category: 'accessories', price: '3000', image: 'monochrome.jpg', description: 'A modern monochrome crochet shoulder bag for a chic look.' },
    { name: 'Flowery Bandana', category: 'accessories', price: '600', image: 'hairband.jpg', description: 'A floral crochet bandana, perfect for spring and summer.' },
    { name: 'The Santorini Tote', category: 'accessories', price: '2800', image: 'bluewhite1.jpg', description: 'Inspired by Santorini, this blue and white tote is both beautiful and practical.' },
    { name: 'Flower Bouquet', category: 'apparel', price: '1999', image: 'bouqet.jpg', description: 'A sweet symbol of love and friendship for your dear ones.' },
  ];

  const productsGrid = document.querySelector('.products-grid');

  // --- CART STATE ---
  let cart = [];
  const cartCountElement = document.getElementById('cart-count');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const checkoutBtn = document.getElementById('checkout-btn');
  const cartOverlay = document.getElementById('cart-overlay');

  // --- WISHLIST STATE ---
  let wishlist = [];
  const wishlistCountElement = document.getElementById('wishlist-count');
  const wishlistSidebar = document.getElementById('wishlist-sidebar');
  const wishlistItemsContainer = document.getElementById('wishlist-items');
  const wishlistOverlay = document.getElementById('wishlist-overlay');
  const addAllToCartBtn = document.getElementById('add-all-to-cart-btn');

  function getCartItem(product) {
    return cart.find(item => item.product.name === product.name);
  }
  function getCartQuantity(product) {
    const item = getCartItem(product);
    return item ? item.quantity : 0;
  }
  function addToCart(product) {
    let item = getCartItem(product);
    if (item) {
      item.quantity++;
    } else {
      cart.push({ product, quantity: 1 });
    }
  }
  function removeFromCart(product) {
    let idx = cart.findIndex(item => item.product.name === product.name);
    if (idx !== -1) {
      cart.splice(idx, 1);
    }
  }
  function setCartQuantity(product, qty) {
    let item = getCartItem(product);
    if (item) {
      item.quantity = qty;
      if (item.quantity < 1) removeFromCart(product);
    }
  }

  // --- WISHLIST FUNCTIONS ---
  function getWishlistItem(product) {
    return wishlist.find(item => item.name === product.name);
  }

  function addToWishlist(product) {
    if (!getWishlistItem(product)) {
      wishlist.push(product);
    }
  }

  function removeFromWishlist(product) {
    let idx = wishlist.findIndex(item => item.name === product.name);
    if (idx !== -1) {
      wishlist.splice(idx, 1);
    }
  }

  function updateWishlistCount() {
    wishlistCountElement.textContent = wishlist.length;
    wishlistCountElement.classList.toggle('active', wishlist.length > 0);
  }

  function updateWishlistSidebar() {
    wishlistItemsContainer.innerHTML = '';
    if (wishlist.length === 0) {
      wishlistItemsContainer.innerHTML = '<div class="wishlist-empty">Your wishlist is empty.</div>';
      return;
    }
    wishlist.forEach((product, idx) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'wishlist-item';
      itemDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="wishlist-item-img">
        <div class="wishlist-item-info">
          <div class="wishlist-item-name">${product.name}</div>
          <div class="wishlist-item-price">₹${product.price}</div>
          <button class="wishlist-add-to-cart-btn" data-index="${idx}">Add to Cart</button>
        </div>
        <button class="wishlist-remove-btn" data-index="${idx}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;
      wishlistItemsContainer.appendChild(itemDiv);
    });
  }

  function updateCartCount() {
    // Show total quantity in cart
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = total;
    cartCountElement.classList.toggle('active', total > 0);
  }

  function updateCartSidebar() {
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<div class="cart-empty">Your cart is empty.</div>';
      cartTotalElement.textContent = '';
      return;
    }
    let total = 0;
    cart.forEach((item, idx) => {
      total += parseInt(item.product.price) * item.quantity;
      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';
      itemDiv.innerHTML = `
        <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.product.name}</div>
          <div class="cart-item-price">₹${item.product.price} x ${item.quantity}</div>
        </div>
        <div class="cart-qty-controls">
          <button class="cart-qty-btn cart-qty-minus" data-index="${idx}">-</button>
          <span class="cart-qty-count">${item.quantity}</span>
          <button class="cart-qty-btn cart-qty-plus" data-index="${idx}">+</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemDiv);
    });
    cartTotalElement.textContent = `Total: ₹${total}`;
  }

  function openCartSidebar() {
    cartOverlay.style.display = 'flex';
    setTimeout(() => cartSidebar.classList.add('active'), 10);
  }
  function closeCartSidebar() {
    cartSidebar.classList.remove('active');
    setTimeout(() => cartOverlay.style.display = 'none', 200);
  }
  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', closeCartSidebar);
  }
  document.querySelectorAll('[aria-label="Shopping Cart"]').forEach(btn => {
    btn.addEventListener('click', openCartSidebar);
  });

  // --- WISHLIST SIDEBAR FUNCTIONS ---
  function openWishlistSidebar() {
    wishlistOverlay.style.display = 'flex';
    setTimeout(() => wishlistSidebar.classList.add('active'), 10);
  }

  function closeWishlistSidebar() {
    wishlistSidebar.classList.remove('active');
    setTimeout(() => wishlistOverlay.style.display = 'none', 200);
  }

  // Wishlist button event listeners
  document.getElementById('wishlist-btn').addEventListener('click', openWishlistSidebar);
  document.getElementById('mobile-wishlist-btn').addEventListener('click', openWishlistSidebar);
  document.getElementById('wishlist-close-btn').addEventListener('click', closeWishlistSidebar);

  // Close wishlist when clicking outside
  wishlistOverlay.addEventListener('click', function(e) {
    if (e.target === wishlistOverlay) closeWishlistSidebar();
  });

  // Close wishlist with Escape key
  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && wishlistOverlay.style.display !== 'none') {
      closeWishlistSidebar();
    }
  });
  // Close cart when clicking outside the sidebar
  cartOverlay.addEventListener('click', function(e) {
    if (e.target === cartOverlay) closeCartSidebar();
  });
  // Close cart with Escape key
  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && cartOverlay.style.display !== 'none') {
      closeCartSidebar();
    }
  });
  cartItemsContainer.addEventListener('click', function(e) {
    if (e.target.closest('.cart-remove-btn')) {
      const idx = e.target.closest('.cart-remove-btn').dataset.index;
      cart.splice(idx, 1);
      updateCartCount();
      updateCartSidebar();
      renderProducts();
      renderSearchResults(searchInput.value);
    }
  });

  // Wishlist item removal and add to cart
  wishlistItemsContainer.addEventListener('click', function(e) {
    if (e.target.closest('.wishlist-remove-btn')) {
      const idx = parseInt(e.target.closest('.wishlist-remove-btn').dataset.index);
      if (wishlist[idx]) {
        wishlist.splice(idx, 1);
        updateWishlistCount();
        updateWishlistSidebar();
        renderProducts();
        renderSearchResults(searchInput.value);
      }
    }
    
    // Add individual item from wishlist to cart
    if (e.target.classList.contains('wishlist-add-to-cart-btn')) {
      const idx = parseInt(e.target.dataset.index);
      if (wishlist[idx]) {
        const product = wishlist[idx];
        addToCart(product);
        // Remove from wishlist
        wishlist.splice(idx, 1);
        updateCartCount();
        updateCartSidebar();
        updateWishlistCount();
        updateWishlistSidebar();
        renderProducts();
        renderSearchResults(searchInput.value);
      }
    }
  });

  // Add all wishlist items to cart
  addAllToCartBtn.addEventListener('click', function() {
    wishlist.forEach(product => {
      if (!getCartItem(product)) {
        addToCart(product);
      }
    });
    // Clear the entire wishlist after adding all items to cart
    wishlist = [];
    updateCartCount();
    updateCartSidebar();
    updateWishlistCount();
    updateWishlistSidebar();
    renderProducts();
    renderSearchResults(searchInput.value);
    closeWishlistSidebar();
  });
  checkoutBtn.addEventListener('click', function() {
    alert('Checkout is not implemented in this demo.');
  });

  // --- PRODUCT MODAL LOGIC ---
  const productModal = document.getElementById('product-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalProductImage = document.getElementById('modal-product-image');
  const modalProductName = document.getElementById('modal-product-name');
  const modalProductCategory = document.getElementById('modal-product-category');
  const modalProductPrice = document.getElementById('modal-product-price');
  const modalProductDescription = document.getElementById('modal-product-description');
  const modalAddToCart = document.getElementById('modal-add-to-cart');
  const modalBuyNow = document.getElementById('modal-buy-now');
  let currentModalProduct = null;

  // --- MODAL CONTEXT LOGIC ---
  let modalContext = 'main'; // 'main' or 'search'

  // --- OPEN PRODUCT MODAL (supports context) ---
  function openProductModal(product, context = 'main') {
    currentModalProduct = product;
    modalContext = context;
    modalProductImage.src = product.image;
    modalProductImage.alt = product.name;
    modalProductName.textContent = product.name;
    modalProductCategory.textContent = product.category;
    modalProductPrice.textContent = `₹${product.price}`;
    modalProductDescription.textContent = product.description;
    // Hide all cart-related buttons in the modal
    modalAddToCart.style.display = 'none';
    modalBuyNow.style.display = 'none';
    let removeBtn = document.getElementById('modal-remove-from-cart');
    if (removeBtn) {
      removeBtn.style.display = 'none';
      removeBtn.onclick = null;
    }
    // Always move modal to correct context before showing
    if (context === 'search') {
      if (!searchOverlay.contains(productModal)) {
        searchOverlay.appendChild(productModal);
      }
      searchOverlay.classList.add('modal-active');
    } else {
      if (document.body && !document.body.contains(productModal)) {
        document.body.appendChild(productModal);
      }
      searchOverlay.classList.remove('modal-active');
    }
    productModal.style.display = 'flex';
    setTimeout(() => productModal.classList.add('active'), 10);
  }
  function closeProductModal() {
    productModal.classList.remove('active');
    setTimeout(() => {
      productModal.style.display = 'none';
      // Only move modal back to body if it was opened from the homepage
      if (modalContext === 'main' && searchOverlay.contains(productModal)) {
        document.body.appendChild(productModal);
        searchOverlay.classList.remove('modal-active');
      }
    }, 200);
  }
  modalCloseBtn.addEventListener('click', closeProductModal);
  productModal.addEventListener('click', (e) => {
    if (e.target === productModal) closeProductModal();
  });
  modalAddToCart.addEventListener('click', function() {
    if (!cart.some(item => item.product.name === currentModalProduct.name)) {
      cart.push({ product: currentModalProduct, quantity: 1 });
      // Remove from wishlist if present
      if (getWishlistItem(currentModalProduct)) {
        removeFromWishlist(currentModalProduct);
        updateWishlistCount();
        updateWishlistSidebar();
      }
      updateCartCount();
      updateCartSidebar();
      renderProducts();
      renderSearchResults(searchInput.value);
    }
    closeProductModal();
  });
  modalBuyNow.addEventListener('click', function() {
    if (!cart.some(item => item.product.name === currentModalProduct.name)) {
      cart.push({ product: currentModalProduct, quantity: 1 });
      // Remove from wishlist if present
      if (getWishlistItem(currentModalProduct)) {
        removeFromWishlist(currentModalProduct);
        updateWishlistCount();
        updateWishlistSidebar();
      }
      updateCartCount();
      updateCartSidebar();
      renderProducts();
      renderSearchResults(searchInput.value);
    }
    closeProductModal();
    openCartSidebar();
  });

  // --- SEARCH OVERLAY ---
  const searchBtn = document.getElementById('search-btn');
  const mobileSearchBtn = document.getElementById('mobile-search-btn');
  const searchOverlay = document.getElementById('search-overlay');
  const searchCloseBtn = document.getElementById('search-close-btn');
  const searchInput = document.querySelector('.search-input');

  // Ensure search overlay is always above cart overlay
  searchOverlay.style.zIndex = '3000';

  const openSearch = () => {
    // Always close cart overlay if open
    if (typeof cartOverlay !== 'undefined' && cartOverlay.style.display !== 'none') {
      closeCartSidebar();
    }
    searchOverlay.classList.add('active');
    searchOverlay.style.display = 'block';
    setTimeout(() => searchInput.focus(), 300);
    if (typeof mobileMenu !== 'undefined' && mobileMenu.classList.contains('active')) {
      toggleMenu();
    }
    searchInput.value = '';
    renderSearchResults('');
  }

  const closeSearch = () => {
    searchOverlay.classList.remove('active');
    searchOverlay.style.display = 'none';
    searchInput.blur();
  }

  // Set up event listeners for search icon, mobile search, and close
  searchBtn.addEventListener('click', openSearch);
  mobileSearchBtn.addEventListener('click', openSearch);
  searchCloseBtn.addEventListener('click', closeSearch);

  // Keyboard shortcuts: '/' or Ctrl+K to open, Escape to close
  window.addEventListener('keydown', (e) => {
    if ((e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') || (e.ctrlKey && e.key.toLowerCase() === 'k')) {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
      closeSearch();
    }
  });

  // --- ENSURE SEARCH RESULTS CONTAINER EXISTS ---
  let searchResultsContainer = document.querySelector('.search-results');
  if (!searchResultsContainer) {
    searchResultsContainer = document.createElement('div');
    searchResultsContainer.className = 'search-results';
    // Add a grid container for product cards
    const grid = document.createElement('div');
    grid.className = 'products-grid search-products-grid';
    searchResultsContainer.appendChild(grid);
    searchOverlay.querySelector('.search-content').appendChild(searchResultsContainer);
  }
  const searchGrid = searchResultsContainer.querySelector('.products-grid') || searchResultsContainer.querySelector('.search-products-grid');

  // --- SEARCH INPUT EVENT LISTENER ---
  searchInput.addEventListener('input', (e) => {
    renderSearchResults(e.target.value);
  });

  // --- FIXED renderSearchResults FUNCTION ---
  function renderSearchResults(query) {
    const trimmed = query.trim().toLowerCase();
    let matches = [];
    if (trimmed) {
      matches = products.filter(p => p.name.toLowerCase().includes(trimmed) || p.category.toLowerCase().includes(trimmed));
    }
    if (!trimmed) {
      searchGrid.innerHTML = '';
      searchResultsContainer.innerHTML = '<div class="search-placeholder">Type to search for creations...</div>';
      searchResultsContainer.appendChild(searchGrid);
      return;
    }
    if (matches.length === 0) {
      searchGrid.innerHTML = '';
      searchResultsContainer.innerHTML = '<div class="no-results">No creations found.</div>';
      searchResultsContainer.appendChild(searchGrid);
      return;
    }
    searchResultsContainer.innerHTML = '';
    searchResultsContainer.appendChild(searchGrid);
    searchGrid.innerHTML = matches.map((product, index) => {
      const cartItem = getCartItem(product);
      const wishlistItem = getWishlistItem(product);
      const inCart = !!cartItem;
      const inWishlist = !!wishlistItem;
      const qty = cartItem ? cartItem.quantity : 0;
      return `
        <div class="product-card fade-in visible" data-category="${product.category}" style="transition-delay: ${index * 100}ms">
          <div class="product-image-wrapper">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <button class="heart-btn ${inWishlist ? 'active' : ''}" data-product="${product.name}">
              <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${inWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
          <div class="product-info">
            <p class="product-category">${product.category}</p>
            <h4 class="product-name">${highlightMatch(product.name, trimmed)}</h4>
            <p class="product-price">₹${product.price}</p>
            ${inCart ? `
              <div class="qty-controls">
                <button class="qty-btn qty-minus">-</button>
                <span class="qty-count">${qty}</span>
                <button class="qty-btn qty-plus">+</button>
              </div>
            ` : '<button class="btn add-to-cart-btn">Add to Cart</button>'}
          </div>
        </div>
      `;
    }).join('');
    setTimeout(addProductCardListeners, 10);
  }

  // --- PRODUCT CARD CLICK HANDLER (works for both home and search) ---
  function addProductCardListeners() {
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', function(e) {
        // Prevent modal opening if clicking buttons or controls
        if (
          e.target.classList.contains('add-to-cart-btn') ||
          e.target.classList.contains('remove-from-cart-btn') ||
          e.target.classList.contains('heart-btn') ||
          e.target.closest('.heart-btn') ||
          e.target.classList.contains('qty-btn') ||
          e.target.closest('.qty-controls')
        ) return;
        const name = card.querySelector('.product-name').textContent;
        const product = products.find(p => p.name === name);
        // Determine context: if inside search overlay, use 'search'
        const context = card.closest('.search-overlay') ? 'search' : 'main';
        if (product) openProductModal(product, context);
      });
    });
  }

  // --- RENDER PRODUCTS (with heart icon for wishlist) ---
  function renderProducts(filter = 'all') {
    productsGrid.innerHTML = '';
    const filteredProducts = filter === 'all' 
      ? products 
      : products.filter(p => p.category === filter);
    filteredProducts.forEach((product, index) => {
      const cartItem = getCartItem(product);
      const wishlistItem = getWishlistItem(product);
      const inCart = !!cartItem;
      const inWishlist = !!wishlistItem;
      const qty = cartItem ? cartItem.quantity : 0;
      const productCard = document.createElement('div');
      productCard.className = 'product-card fade-in';
      productCard.setAttribute('data-category', product.category);
      productCard.style.transitionDelay = `${index * 100}ms`;
      productCard.innerHTML = `
        <div class="product-image-wrapper">
          <img src="${product.image}" alt="${product.name}" class="product-image">
          <button class="heart-btn ${inWishlist ? 'active' : ''}" data-product="${product.name}">
            <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${inWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
        <div class="product-info">
          <p class="product-category">${product.category}</p>
          <h4 class="product-name">${product.name}</h4>
          <p class="product-price">₹${product.price}</p>
          ${inCart ? `
            <div class="qty-controls">
              <button class="qty-btn qty-minus">-</button>
              <span class="qty-count">${qty}</span>
              <button class="qty-btn qty-plus">+</button>
            </div>
          ` : '<button class="btn add-to-cart-btn">Add to Cart</button>'}
        </div>
      `;
      productsGrid.appendChild(productCard);
    });
    setTimeout(() => {
      const newObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            newObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      document.querySelectorAll('.products-grid .fade-in').forEach(el => newObserver.observe(el));
      addProductCardListeners();
    }, 10);
  }

  // --- PRODUCT FILTERING ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      renderProducts(button.dataset.filter);
    });
  });

  // --- ADD TO CART / REMOVE FROM CART BUTTONS (delegated) ---
  document.body.addEventListener('click', function(e) {
    // Add to Cart
    if (e.target.classList.contains('add-to-cart-btn')) {
      const card = e.target.closest('.product-card');
      const name = card.querySelector('.product-name').textContent;
      const product = products.find(p => p.name === name);
      addToCart(product);
      // Remove from wishlist if present
      if (getWishlistItem(product)) {
        removeFromWishlist(product);
        updateWishlistCount();
        updateWishlistSidebar();
      }
      updateCartCount();
      updateCartSidebar();
      renderProducts();
      renderSearchResults(searchInput.value);
      e.target.textContent = 'Added!';
      setTimeout(() => {
        e.target.textContent = 'Add to Cart';
      }, 1500);
    }

    // Heart button (Add/Remove from Wishlist)
    if (e.target.classList.contains('heart-btn') || e.target.closest('.heart-btn')) {
      const heartBtn = e.target.classList.contains('heart-btn') ? e.target : e.target.closest('.heart-btn');
      const productName = heartBtn.dataset.product;
      const product = products.find(p => p.name === productName);
      const isInWishlist = getWishlistItem(product);
      
      if (isInWishlist) {
        removeFromWishlist(product);
      } else {
        addToWishlist(product);
      }
      
      updateWishlistCount();
      updateWishlistSidebar();
      renderProducts();
      renderSearchResults(searchInput.value);
    }
    // Quantity minus
    if (e.target.classList.contains('qty-minus')) {
      e.stopPropagation();
      const card = e.target.closest('.product-card');
      const name = card.querySelector('.product-name').textContent;
      const product = products.find(p => p.name === name);
      let item = getCartItem(product);
      if (item) {
        item.quantity--;
        if (item.quantity < 1) removeFromCart(product);
        updateCartCount();
        updateCartSidebar();
        renderProducts();
        renderSearchResults(searchInput.value);
      }
    }
    // Quantity plus
    if (e.target.classList.contains('qty-plus')) {
      e.stopPropagation();
      const card = e.target.closest('.product-card');
      const name = card.querySelector('.product-name').textContent;
      const product = products.find(p => p.name === name);
      let item = getCartItem(product);
      if (item) {
        item.quantity++;
        updateCartCount();
        updateCartSidebar();
        renderProducts();
        renderSearchResults(searchInput.value);
      }
    }
    // Cart sidebar quantity controls
    if (e.target.classList.contains('cart-qty-minus')) {
      const idx = parseInt(e.target.dataset.index);
      if (cart[idx]) {
        cart[idx].quantity--;
        if (cart[idx].quantity < 1) cart.splice(idx, 1);
        updateCartCount();
        updateCartSidebar();
        renderProducts();
        renderSearchResults(searchInput.value);
      }
    }
    if (e.target.classList.contains('cart-qty-plus')) {
      const idx = parseInt(e.target.dataset.index);
      if (cart[idx]) {
        cart[idx].quantity++;
        updateCartCount();
        updateCartSidebar();
        renderProducts();
        renderSearchResults(searchInput.value);
      }
    }
  });

/* =================================== */
/* === SPLASH SCREEN ANIMATION JS === */
/* =================================== */

// Run the animation logic as soon as the script loads
(function() {
  const splashScreen = document.getElementById('splash-screen');
  const body = document.body;

  // Add a class to the body to prevent scrolling during the animation
  body.classList.add('splash-active');

  // Total animation duration before the splash screen is removed
  const totalDuration = 4500; // 4.5 seconds

  // --- Animation Sequence ---

  // 1. After 3.5 seconds (when needle animation ends), split the panels
  setTimeout(() => {
    splashScreen.classList.add('open');
  }, 3500);

  // 2. After the panels have split and the site is revealed, remove the splash screen
  setTimeout(() => {
    splashScreen.style.transition = 'opacity 0.5s';
    splashScreen.style.opacity = '0';
    body.classList.remove('splash-active'); // Re-enable scrolling

    // 3. After the fade out, remove the element completely from the page
    setTimeout(() => {
      splashScreen.remove();
          // Now run initial renders
    renderProducts(); // Restored to bring back products and search
    updateCartCount();
    updateCartSidebar();
    updateWishlistCount();
    updateWishlistSidebar();
    }, 500);

  }, totalDuration);
})();
  function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
    return text.replace(regex, '<mark>$1</mark>');
  }
  
  // --- SCROLL-BASED ANIMATIONS ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop observing the element once it's visible
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Observe all elements with the 'fade-in' class
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  
});

// === TORN SPLASH ANIMATION ===
(function() {
  const splash = document.getElementById('splash-torn');
  if (!splash) return;
  const leftMask = splash.querySelector('.torn-mask-svg.left');
  const rightMask = splash.querySelector('.torn-mask-svg.right');
  const needle = document.getElementById('torn-needle');
  const thread = document.getElementById('torn-thread');
  const threadPath = document.getElementById('torn-thread-path');
  // Initial positions: masks apart, needle left
  leftMask.style.transform = 'translateX(-40px)';
  rightMask.style.transform = 'translateX(40px)';
  needle.style.left = 'calc(50% - 80px)';
  thread.style.opacity = 0;
  // Animate
  setTimeout(() => {
    thread.style.opacity = 1;
    let progress = 0;
    const duration = 1800;
    const start = performance.now();
    function animateStitch(now) {
      progress = Math.min(1, (now - start) / duration);
      // Move needle horizontally
      needle.style.left = `calc(50% - 80px + ${progress * 160}px)`;
      // Animate thread path length
      threadPath.style.strokeDasharray = 400;
      threadPath.style.strokeDashoffset = 400 - 400 * progress;
      if (progress < 1) {
        requestAnimationFrame(animateStitch);
      } else {
        // Join halves
        leftMask.style.transform = 'translateX(0)';
        rightMask.style.transform = 'translateX(0)';
        setTimeout(() => {
          splash.style.opacity = 0;
          setTimeout(() => splash.remove(), 700);
        }, 800);
      }
    }
    requestAnimationFrame(animateStitch);
  }, 400);
})();
