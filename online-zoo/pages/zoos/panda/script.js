const sidebar = document.querySelector('.live__sidebar');
const toggleBtn = document.querySelector('.live__collapse');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});