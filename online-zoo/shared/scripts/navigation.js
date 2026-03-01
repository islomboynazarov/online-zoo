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


// sidebar highlight part

document.querySelectorAll('.sidebar__boxes').forEach(box => {
  box.classList.remove('active');
  const link = box.closest('a') || box.querySelector('a');
  if (link && window.location.href.includes(link.getAttribute('href').replace('../', '').replace('index.html', ''))) {
    box.classList.add('active');
  }
});