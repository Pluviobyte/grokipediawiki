/**
 * Grokipedia Wiki - Main JavaScript
 * Vanilla JS implementation for interactions
 */

(function() {
  'use strict';

  // ======================
  // Theme Management
  // ======================
  const ThemeManager = {
    init() {
      this.themeToggle = document.getElementById('theme-toggle');
      this.mobileThemeToggle = document.getElementById('mobile-theme-toggle');
      this.sunIcons = document.querySelectorAll('.sun-icon, .mobile-sun-icon');
      this.moonIcons = document.querySelectorAll('.moon-icon, .mobile-moon-icon');

      // Set initial state
      this.updateIcons();

      // Bind events
      if (this.themeToggle) {
        this.themeToggle.addEventListener('click', () => this.toggle());
      }
      if (this.mobileThemeToggle) {
        this.mobileThemeToggle.addEventListener('click', () => this.toggle());
      }
    },

    toggle() {
      const html = document.documentElement;
      const isDark = html.classList.contains('dark');

      if (isDark) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }

      this.updateIcons();
    },

    updateIcons() {
      const isDark = document.documentElement.classList.contains('dark');

      this.sunIcons.forEach(icon => {
        icon.classList.toggle('hidden', isDark);
      });

      this.moonIcons.forEach(icon => {
        icon.classList.toggle('hidden', !isDark);
      });
    }
  };

  // ======================
  // Mobile Menu
  // ======================
  const MobileMenu = {
    init() {
      this.toggle = document.getElementById('mobile-menu-toggle');
      this.menu = document.getElementById('mobile-menu');
      this.hamburger = document.querySelector('.hamburger-icon');
      this.closeIcon = document.querySelector('.close-icon');
      this.isOpen = false;

      if (this.toggle && this.menu) {
        this.toggle.addEventListener('click', () => this.toggleMenu());

        // Close menu when clicking on a link
        const menuLinks = this.menu.querySelectorAll('a');
        menuLinks.forEach(link => {
          link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && this.isOpen) {
            this.closeMenu();
          }
        });
      }
    },

    toggleMenu() {
      this.isOpen = !this.isOpen;
      this.updateUI();
    },

    closeMenu() {
      this.isOpen = false;
      this.updateUI();
    },

    updateUI() {
      this.menu.classList.toggle('hidden', !this.isOpen);
      this.toggle.setAttribute('aria-expanded', this.isOpen);

      // Toggle icons
      if (this.hamburger && this.closeIcon) {
        this.hamburger.classList.toggle('hidden', this.isOpen);
        this.closeIcon.classList.toggle('hidden', !this.isOpen);
      }

      // Prevent body scroll when menu is open
      if (this.isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  };

  // ======================
  // Smooth Scroll
  // ======================
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (href === '#') return;

          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });

            // Update URL without jumping
            history.pushState(null, '', href);
          }
        });
      });
    }
  };

  // ======================
  // Scroll Animations with GSAP
  // ======================
  const ScrollAnimations = {
    init() {
      if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded');
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      // Fade in elements on scroll
      const fadeElements = document.querySelectorAll('.animate-in, .fade-in');
      fadeElements.forEach(element => {
        gsap.from(element, {
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power2.out'
        });
      });

      // Parallax effects for hero sections
      const heroSections = document.querySelectorAll('.hero-section');
      heroSections.forEach(section => {
        const bg = section.querySelector('.hero-bg');
        if (bg) {
          gsap.to(bg, {
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: true
            },
            y: 150,
            ease: 'none'
          });
        }
      });

      // Counter animations
      const counters = document.querySelectorAll('[data-count]');
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);

        gsap.from(counter, {
          scrollTrigger: {
            trigger: counter,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          innerText: 0,
          duration: 2,
          snap: { innerText: 1 },
          onUpdate: function() {
            counter.innerText = Math.ceil(counter.innerText) + '+';
          }
        });
      });
    }
  };

  // ======================
  // Header Scroll Behavior
  // ======================
  const HeaderScroll = {
    init() {
      this.header = document.querySelector('header');
      if (!this.header) return;

      let lastScroll = 0;
      const scrollThreshold = 100;

      window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > scrollThreshold) {
          this.header.classList.add('scrolled');
        } else {
          this.header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
      });
    }
  };

  // ======================
  // Form Handling
  // ======================
  const Forms = {
    init() {
      const forms = document.querySelectorAll('form[data-form]');

      forms.forEach(form => {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleSubmit(form);
        });
      });
    },

    async handleSubmit(form) {
      const formData = new FormData(form);
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;

      // Disable button and show loading state
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';

      try {
        // Simulate API call (replace with actual endpoint)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Success
        this.showMessage(form, 'success', 'Thank you! Your message has been sent.');
        form.reset();
      } catch (error) {
        // Error
        this.showMessage(form, 'error', 'Oops! Something went wrong. Please try again.');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    },

    showMessage(form, type, message) {
      const existingMessage = form.querySelector('.form-message');
      if (existingMessage) {
        existingMessage.remove();
      }

      const messageEl = document.createElement('div');
      messageEl.className = `form-message ${type} mt-4 p-4 rounded-lg text-sm ${
        type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      }`;
      messageEl.textContent = message;

      form.appendChild(messageEl);

      // Remove message after 5 seconds
      setTimeout(() => {
        messageEl.remove();
      }, 5000);
    }
  };

  // ======================
  // Lazy Loading Images
  // ======================
  const LazyLoad = {
    init() {
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          });
        });

        document.querySelectorAll('img.lazy').forEach(img => {
          imageObserver.observe(img);
        });
      }
    }
  };

  // ======================
  // Initialize All
  // ======================
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initModules);
    } else {
      initModules();
    }
  }

  function initModules() {
    ThemeManager.init();
    MobileMenu.init();
    SmoothScroll.init();
    ScrollAnimations.init();
    HeaderScroll.init();
    Forms.init();
    LazyLoad.init();

    console.log('✨ Grokipedia Wiki initialized');
  }

  // Start
  init();

})();
