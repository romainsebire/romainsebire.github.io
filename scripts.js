// Injecte le header
fetch('header.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
  });

// Injecte le footer
fetch('footer.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('footer-placeholder').innerHTML = data;
  });

// Fonction pour le menu burger
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}

document.querySelectorAll('.toggle-details').forEach(button => {
  button.addEventListener('click', () => {
    const card = button.closest('.project-card');
    const details = card.querySelector('.details');
    const expanded = card.getAttribute('data-expanded') === 'true';
    const textNode = button.querySelector('.toggle-label');

    card.setAttribute('data-expanded', !expanded);

    if (!expanded) {
      // Ouverture : on définit la hauteur exacte
      details.style.display = 'block';
      const height = details.scrollHeight;
      details.offsetHeight; // force reflow
      details.style.maxHeight = '0'; // reset
      requestAnimationFrame(() => {
        details.style.maxHeight = height + 'px';
      });
      if (textNode) textNode.textContent = 'Réduire';
    } else {
      // Fermeture : on anime vers 0 puis on cache
      details.style.maxHeight = details.scrollHeight + 'px'; // étape intermédiaire
      details.offsetHeight;
      requestAnimationFrame(() => {
        details.style.maxHeight = '0';
      });
      if (textNode) textNode.textContent = 'En savoir plus';

      // Une fois l’animation terminée, on cache le bloc
      setTimeout(() => {
        details.style.display = 'none';
      }, 600); // doit correspondre à la durée CSS
    }
  });
});

document.querySelectorAll('tr[data-target]').forEach(row => {
  row.addEventListener('click', () => {
    const targetId = row.getAttribute('data-target');
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

