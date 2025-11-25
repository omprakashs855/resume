
// Theme toggle + reveal-on-scroll animations
const btn = document.getElementById('themeToggle');
const root = document.documentElement;
const body = document.body;
btn.addEventListener('click', () => {
  body.classList.toggle('dark');
  // toggle emoji
  btn.textContent = body.classList.contains('dark') ? '☀️' : '🌙';
});

// simple intersection observer for reveal animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold: 0.12});

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    document.querySelector(a.getAttribute('href')).scrollIntoView({behavior:'smooth'});
  });
});
