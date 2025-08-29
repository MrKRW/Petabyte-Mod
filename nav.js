// Function to toggle the navigation menu
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    
    // Check if the navigation menu is currently displayed
    if (navMenu.style.display === 'block') {
        navMenu.style.display = 'none';
    } else {
        navMenu.style.display = 'block';
        // Apply mobile-specific styling
        navMenu.style.position = 'absolute';
        navMenu.style.top = '80px';
        navMenu.style.right = '10px';
        navMenu.style.width = '250px';
        navMenu.style.backgroundColor = 'hsl(0, 1%, 17%)';
        navMenu.style.borderRadius = '15px';
        navMenu.style.zIndex = '100';
    }
}

// Close the menu when clicking outside of it (optional, but improves UX)
document.addEventListener('click', function(event) {
    const navMenu = document.getElementById('navMenu');
    const hamburger = document.querySelector('.hamburger');
    
    // If the click is outside the navigation menu and not on the hamburger
    if (!navMenu.contains(event.target) && !hamburger.contains(event.target)) {
        // Only close if it's currently displayed
        if (window.getComputedStyle(navMenu).display === 'block' && window.innerWidth <= 700) {
            navMenu.style.display = 'none';
        }
    }
});

// Ensure the menu displays properly when resizing the window
window.addEventListener('resize', function() {
    const navMenu = document.getElementById('navMenu');
    
    if (window.innerWidth > 700) {
        navMenu.style = null; // Reset all inline styles
        navMenu.style.display = 'block';
    } else {
        navMenu.style.display = 'none';
    }
});