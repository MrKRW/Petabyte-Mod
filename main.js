ndocument.addEventListener('DOMContentLoaded', function() {
    // Get all quantity control buttons
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const viewCartBtn = document.getElementById('view-cart-btn');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const buyNowBtns = document.querySelectorAll('.buy-now-btn');
    
    // Check if popup element exists, if not create it
    let popup = document.getElementById('popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'popup';
        popup.className = 'popup';
        document.body.appendChild(popup);
    }
    
    // Initialize cart
    let cart = [];
    
    // Check if we have cart data in localStorage
    const savedCart = localStorage.getItem('computerPartsCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        
        // Update quantity inputs based on saved cart
        cart.forEach(item => {
            const input = document.querySelector(`.quantity-input[data-id="${item.id}"]`);
            if (input) {
                input.value = item.quantity;
            }
        });
    }
    
    // Tab navigation functionality
    function openCategory(categoryId) {
        // Hide all categories
        const categories = document.querySelectorAll('.category');
        categories.forEach(category => {
            category.style.display = 'none';
        });
        
        // Show the selected category
        const selectedCategory = document.getElementById(categoryId);
        if (selectedCategory) {
            selectedCategory.style.display = 'block';
        }
        
        // Update active tab button
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            if (button.getAttribute('onclick').includes(categoryId)) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
    
    // Make the openCategory function globally available
    window.openCategory = openCategory;
    
    // Show the first category by default
    const firstCategory = document.querySelector('.category');
    if (firstCategory) {
        firstCategory.style.display = 'block';
    }
    
    // Add event listeners to quantity buttons
    quantityBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            const input = this.parentElement.querySelector('.quantity-input');
            const currentValue = parseInt(input.value);
            
            if (action === 'increase') {
                input.value = currentValue + 1;
            } else if (action === 'decrease' && currentValue > 0) {
                input.value = currentValue - 1;
            }
        });
    });
    
    // Add event listeners to quantity inputs for manual changes
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Ensure value is not negative
            if (parseInt(this.value) < 0) {
                this.value = 0;
            }
        });
    });
    
    // Function to add item to cart
    function addToCart(input) {
        const id = input.dataset.id;
        const name = input.dataset.name;
        const price = parseFloat(input.dataset.price);
        const quantity = parseInt(input.value);
        
        // Get product name and price from parent container if not in dataset
        const productContainer = input.closest('.grid-item');
        let actualName = name;
        let actualPrice = price;
        
        if (productContainer) {
            if (!actualName || actualName === "AMD Ryzen 7 5800X") {
                const productNameElement = productContainer.querySelector('.product-info');
                if (productNameElement) {
                    actualName = productNameElement.childNodes[0].textContent.trim();
                }
            }
            
            if (isNaN(actualPrice)) {
                const priceElement = productContainer.querySelector('.info p');
                if (priceElement) {
                    // Extract price value from "Price: $XXX.XX" format
                    const priceText = priceElement.textContent;
                    const priceMatch = priceText.match(/\$([0-9,]+\.[0-9]+)/);
                    if (priceMatch && priceMatch[1]) {
                        actualPrice = parseFloat(priceMatch[1].replace(',', ''));
                    }
                }
            }
        }
        
        if (quantity <= 0) {
            showPopup("Please select a quantity greater than zero");
            return false;
        }
        
        // Generate a unique ID if not provided
        const productId = id || `product-${Date.now()}`;
        
        // Check if item is already in cart
        const existingItemIndex = cart.findIndex(item => item.id === productId && item.name === actualName);
        
        if (existingItemIndex !== -1) {
            // Update existing item
            cart[existingItemIndex].quantity += quantity;
            input.value = 0; // Reset quantity input
        } else {
            // Add new item to cart
            cart.push({
                id: productId,
                name: actualName,
                price: actualPrice,
                quantity
            });
            input.value = 0; // Reset quantity input
        }
        
        // Save cart to localStorage
        localStorage.setItem('computerPartsCart', JSON.stringify(cart));
        return true;
    }
    
    // Add to cart button event listener
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            if (addToCart(input)) {
                const productName = input.closest('.grid-item').querySelector('.product-info').childNodes[0].textContent.trim();
                showPopup(`${productName} added to cart!`);
            }
        });
    });
    
    // Buy Now button event listener
    buyNowBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            if (addToCart(input)) {
                // Redirect to cart page for immediate checkout
                window.location.href = 'cart.html';
            }
        });
    });
    
    // Show popup function
    function showPopup(message) {
        popup.textContent = message;
        popup.classList.add('show');
        
        // Hide popup after 3 seconds
        setTimeout(() => {
            popup.classList.remove('show');
        }, 3000);
    }
    
    // View cart button event listener (if exists)
    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', function() {
            // Navigate to cart page
            window.location.href = 'cart.html';
        });
    }
    
    // Add cart icon counter functionality if it exists
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
        updateCartCounter();
    }
    
    function updateCartCounter() {
        if (!cartCounter) return;
        
        // Calculate total quantity across all items
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update the counter
        cartCounter.textContent = totalItems;
        
        // Show/hide based on quantity
        if (totalItems > 0) {
            cartCounter.style.display = 'block';
        } else {
            cartCounter.style.display = 'none';
        }
    }
    
    // Initial setup - show first category
    const firstTab = document.querySelector('.tab-button');
    if (firstTab) {
        const categoryId = firstTab.getAttribute('onclick').match(/openCategory\('([^']+)'\)/)[1];
        openCategory(categoryId);
    }
});


// hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get the hamburger button and nav menu elements
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    
    // Add click event listener to the hamburger button
    hamburger.addEventListener('click', function() {
      // Toggle the 'open' class on the nav element
      nav.classList.toggle('open');
      
      // Optional: Add animation or transition effects
      if (nav.classList.contains('open')) {
        // Menu is now open - you could add additional effects here
        console.log('Menu opened');
      } else {
        // Menu is now closed
        console.log('Menu closed');
      }
    });
    
    // Close the menu when clicking outside of it
    document.addEventListener('click', function(event) {
      const isClickInsideNav = nav.contains(event.target);
      const isClickOnHamburger = hamburger.contains(event.target);
      
      if (!isClickInsideNav && !isClickOnHamburger && nav.classList.contains('open')) {
        nav.classList.remove('open');
      }
    });
    
    // Close the menu when window is resized to desktop size
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768 && nav.classList.contains('open')) {
        nav.classList.remove('open');
      }
    });
  });



