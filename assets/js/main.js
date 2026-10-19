/**
 * Portfolio Enzo GIORDANI - Main JavaScript
 * Handles Theme (Dark/Light mode), Mobile Navigation, Project Filtering,
 * Email Copy utility, Scrollspy & Back-to-top.
 */

(function () {
  'use strict';

  // --- THEME MANAGEMENT (DARK / LIGHT MODE) ---
  const THEME_STORAGE_KEY = 'portfolio-theme';

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach((btn) => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
      btn.setAttribute('title', theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
    });
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  }

  // Listen to system changes if user hasn't explicitly set a preference
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // --- DOM READY INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial theme setup
    const initialTheme = getPreferredTheme();
    applyTheme(initialTheme);

    // Bind theme toggles
    const themeToggles = document.querySelectorAll('.theme-toggle');
    themeToggles.forEach((btn) => {
      btn.addEventListener('click', toggleTheme);
    });

    // 2. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
      mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navLinks.classList.toggle('active');
        mobileBtn.classList.toggle('active');
        mobileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      // Close menu when clicking on a link
      navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('active');
          mobileBtn.classList.remove('active');
          mobileBtn.setAttribute('aria-expanded', 'false');
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileBtn.contains(e.target)) {
          navLinks.classList.remove('active');
          mobileBtn.classList.remove('active');
          mobileBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // 3. Project Filter Tabs (if present)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card[data-category]');

    if (filterButtons.length > 0 && projectCards.length > 0) {
      filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          filterButtons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');

          const filterValue = btn.getAttribute('data-filter');

          projectCards.forEach((card) => {
            const cardCat = card.getAttribute('data-category');
            if (filterValue === 'all' || cardCat === filterValue) {
              card.style.display = '';
              card.classList.remove('hidden');
            } else {
              card.style.display = 'none';
              card.classList.add('hidden');
            }
          });

          // Also manage category titles visibility if filtering
          const sectionHeaders = document.querySelectorAll('.projects-subheading');
          sectionHeaders.forEach((header) => {
            const cat = header.getAttribute('data-category-heading');
            if (filterValue === 'all' || cat === filterValue) {
              header.style.display = '';
            } else {
              header.style.display = 'none';
            }
          });
        });
      });
    }

    // 4. Copy Email to Clipboard
    const copyBtns = document.querySelectorAll('.copy-email-btn');
    copyBtns.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const email = btn.getAttribute('data-email') || 'enzo.giordani57@gmail.com';
        try {
          await navigator.clipboard.writeText(email);
          const feedback = btn.querySelector('.copy-feedback');
          if (feedback) {
            feedback.textContent = 'Copié !';
            feedback.classList.add('visible');
            setTimeout(() => {
              feedback.textContent = 'Copier';
              feedback.classList.remove('visible');
            }, 2200);
          } else {
            const originalText = btn.textContent;
            btn.textContent = '✓ Email copié !';
            setTimeout(() => {
              btn.textContent = originalText;
            }, 2200);
          }
        } catch (err) {
          // Fallback for older browsers
          const input = document.createElement('input');
          input.value = email;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          document.body.removeChild(input);
          alert('Email copié : ' + email);
        }
      });
    });

    // 5. Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 350) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      });

      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      });
    }

    // 6. Dynamic Year in Footer
    const yearElements = document.querySelectorAll('#year, [data-year]');
    const currentYear = new Date().getFullYear();
    yearElements.forEach((el) => {
      el.textContent = currentYear;
    });

    // 7. ScrollSpy for Navbar links
    const sections = document.querySelectorAll('section[id], header[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    if (sections.length > 0 && navAnchors.length > 0) {
      window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120;

        sections.forEach((section) => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSectionId = section.getAttribute('id');
          }
        });

        navAnchors.forEach((a) => {
          const href = a.getAttribute('href');
          if (href === `#${currentSectionId}`) {
            a.classList.add('active');
          } else {
            a.classList.remove('active');
          }
        });
      });
    }
  });
})();
