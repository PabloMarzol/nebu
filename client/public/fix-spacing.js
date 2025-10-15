
document.addEventListener('DOMContentLoaded', function() {
  // Force remove all top spacing
  document.documentElement.style.margin = '0';
  document.documentElement.style.padding = '0';
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  
  const root = document.getElementById('root');
  if (root) {
    root.style.margin = '0';
    root.style.padding = '0';
  }
  
  // Force navbar to top
  const nav = document.querySelector('nav');
  if (nav) {
    nav.style.position = 'absolute';
    nav.style.top = '0';
    nav.style.left = '0';
    nav.style.right = '0';
    nav.style.zIndex = '999999';
    nav.style.margin = '0';
    nav.style.padding = '0';
  }
});

