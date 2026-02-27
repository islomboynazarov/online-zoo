document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav__link');
  
  navLinks.forEach(link => {
    // Remove all active classes first
    link.classList.remove('active');
    
    // Add active to the link that matches current page
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });
});