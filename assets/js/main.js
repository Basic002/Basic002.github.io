/**
 * Portfolio Enzo GIORDANI - Main JavaScript
 * Handles Theme (Dark/Light mode with Light Mode by default),
 * Mobile Navigation, and dynamic footer year.
 */

(function () {
  'use strict';

  const THEME_STORAGE_KEY = 'portfolio-theme';

  // Light mode is the default, unless the user explicitly chose 'dark'
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach((btn) => {
      btn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'
      );
      btn.setAttribute(
        'title',
        theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'
      );
    });
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  }

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

    // 3. Dynamic Year in Footer
    const yearElements = document.querySelectorAll('#year, [data-year]');
    const currentYear = new Date().getFullYear();
    yearElements.forEach((el) => {
      el.textContent = currentYear;
    });
  });
})();
