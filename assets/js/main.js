/**
 * ROYAL PROPERTY - MAIN JAVASCRIPT
 * Real Estate Land Development & Property Sales (Bareilly, UP)
 * Consultant: Shakir Ali Khan | Phone: +91 9368129424
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initScrollReveal();
  initFaqAccordion();
  initPropertyFiltering();
  initContactForms();
  initPropertyModal();
  initBackToTop();
  setActiveNavLink();
});

/* ==========================================================================
   1. STICKY HEADER & SCROLL BEHAVIOR
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  if (!toggleBtn || !drawer) return;

  const toggleMenu = () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      drawer.classList.add('open');
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  };

  toggleBtn.addEventListener('click', toggleMenu);

  // Close when clicking a nav link
  const navLinks = drawer.querySelectorAll('.mobile-nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggleMenu();
    }
  });
}

/* ==========================================================================
   3. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const revealItems = document.querySelectorAll('.reveal-item');
  if (!revealItems.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    revealItems.forEach(el => el.classList.add('revealed'));
  }
}

/* ==========================================================================
   4. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other open accordions
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherHeader = otherItem.querySelector('.faq-header');
          if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
        }
      });

      if (isActive) {
        item.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   5. PROPERTY & PLOT FILTERING SYSTEM
   ========================================================================== */
function initPropertyFiltering() {
  const propertyGrid = document.querySelector('#propertyGrid');
  if (!propertyGrid) return;

  const propertyCards = propertyGrid.querySelectorAll('.property-card');
  const tabBtns = document.querySelectorAll('.filter-tab-btn');
  const locationSelect = document.querySelector('#filterLocation');
  const typeSelect = document.querySelector('#filterType');
  const sizeSelect = document.querySelector('#filterSize');
  const searchInput = document.querySelector('#filterSearch');
  const countDisplay = document.querySelector('#filterCount');
  const resetBtn = document.querySelector('#filterReset');
  const emptyState = document.querySelector('#filterEmptyState');

  let currentCategory = 'all';

  const filterProperties = () => {
    const selectedLoc = locationSelect ? locationSelect.value.toLowerCase() : 'all';
    const selectedType = typeSelect ? typeSelect.value.toLowerCase() : 'all';
    const selectedSize = sizeSelect ? sizeSelect.value.toLowerCase() : 'all';
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

    let visibleCount = 0;

    propertyCards.forEach(card => {
      const cardType = (card.dataset.type || '').toLowerCase();
      const cardLoc = (card.dataset.location || '').toLowerCase();
      const cardSize = (card.dataset.size || '').toLowerCase();
      const cardTitle = (card.querySelector('.property-card-title')?.textContent || '').toLowerCase();
      const cardDesc = (card.querySelector('.property-desc')?.textContent || '').toLowerCase();

      // Check Category Tabs
      const matchesTab = (currentCategory === 'all' || cardType === currentCategory);

      // Check Dropdowns
      const matchesLoc = (selectedLoc === 'all' || cardLoc.includes(selectedLoc));
      const matchesType = (selectedType === 'all' || cardType === selectedType);
      const matchesSize = (selectedSize === 'all' || cardSize === selectedSize);

      // Check Search text
      const matchesSearch = (!query || cardTitle.includes(query) || cardDesc.includes(query) || cardLoc.includes(query));

      if (matchesTab && matchesLoc && matchesType && matchesSize && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update Counter
    if (countDisplay) {
      countDisplay.textContent = `${visibleCount} Propert${visibleCount === 1 ? 'y' : 'ies'} Found`;
    }

    // Empty state toggle
    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  };

  // Tab button clicks
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = (btn.dataset.category || 'all').toLowerCase();
      filterProperties();
    });
  });

  // Select dropdown events
  if (locationSelect) locationSelect.addEventListener('change', filterProperties);
  if (typeSelect) typeSelect.addEventListener('change', filterProperties);
  if (sizeSelect) sizeSelect.addEventListener('change', filterProperties);
  if (searchInput) searchInput.addEventListener('input', filterProperties);

  // Reset button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentCategory = 'all';
      tabBtns.forEach(b => b.classList.remove('active'));
      if (tabBtns[0]) tabBtns[0].classList.add('active');
      if (locationSelect) locationSelect.value = 'all';
      if (typeSelect) typeSelect.value = 'all';
      if (sizeSelect) sizeSelect.value = 'all';
      if (searchInput) searchInput.value = '';
      filterProperties();
    });
  }
}

/* ==========================================================================
   6. CONTACT FORMS & WHATSAPP GENERATOR
   ========================================================================== */
function initContactForms() {
  const forms = document.querySelectorAll('.js-contact-form');
  if (!forms.length) return;

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('[name="fullName"]');
      const phoneInput = form.querySelector('[name="phone"]');
      const reqInput = form.querySelector('[name="requirement"]');
      const locationInput = form.querySelector('[name="location"]');
      const budgetInput = form.querySelector('[name="budget"]');
      const msgInput = form.querySelector('[name="message"]');

      const fullName = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const requirement = reqInput ? reqInput.value.trim() : 'General Enquiry';
      const preferredLocation = locationInput ? locationInput.value.trim() : 'Bareilly & Surroundings';
      const budget = budgetInput ? budgetInput.value.trim() : 'Not Specified';
      const message = msgInput ? msgInput.value.trim() : '';

      // Validate Phone & Name
      if (!fullName) {
        alert('Please enter your full name.');
        if (nameInput) nameInput.focus();
        return;
      }

      if (!phone || phone.length < 10) {
        alert('Please enter a valid 10-digit contact number.');
        if (phoneInput) phoneInput.focus();
        return;
      }

      // Build WhatsApp message
      const waText = `*New Property Enquiry - Royal Property*\n\n` +
        `👤 *Name:* ${fullName}\n` +
        `📞 *Phone:* ${phone}\n` +
        `🏡 *Requirement:* ${requirement}\n` +
        `📍 *Location:* ${preferredLocation}\n` +
        `💰 *Budget Range:* ${budget}\n` +
        (message ? `📝 *Message:* ${message}\n` : '') +
        `\n_Sent via Royal Property Website_`;

      const encodedText = encodeURIComponent(waText);
      const waUrl = `https://wa.me/919368129424?text=${encodedText}`;

      // Open WhatsApp
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      // Visual success confirmation on the form
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>✓ Opening WhatsApp...</span>`;
        submitBtn.style.background = '#159A72';
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          form.reset();
        }, 3000);
      }
    });
  });
}

/* ==========================================================================
   7. QUICK PROPERTY INQUIRY MODAL
   ========================================================================== */
function initPropertyModal() {
  const modal = document.querySelector('#inquiryModal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close-btn');
  const propertyTitleEl = modal.querySelector('#modalPropertyTitle');
  const propertyInputEl = modal.querySelector('#modalPropertyInput');
  const enquireBtns = document.querySelectorAll('.js-open-inquiry');

  const openModal = (title, location) => {
    if (propertyTitleEl) propertyTitleEl.textContent = title;
    if (propertyInputEl) propertyInputEl.value = `${title} (${location})`;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  enquireBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.property-card');
      const title = card ? card.querySelector('.property-card-title')?.textContent.trim() : 'Property Listing';
      const loc = card ? card.querySelector('.property-location')?.textContent.trim() : 'Bareilly';
      openModal(title, loc);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   8. ACTIVE NAVIGATION LINK HIGHLIGHTER
   ========================================================================== */
function setActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-link, .mobile-nav-link');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   9. BACK TO TOP SCROLL HANDLER
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.querySelector('#backToTopBtn');
  if (!backToTopBtn) return;

  const handleScroll = () => {
    if (window.scrollY > 280) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

