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



// hamburger
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burger');
  const nav = document.querySelector('.header__nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      nav.classList.toggle('open');
    });
  }
}); 
