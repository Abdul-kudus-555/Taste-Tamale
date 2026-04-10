/* ======================================================
   TASTE TAMALE — script.js
   Features:
   - Scroll reveal animations
   - Sticky nav with scroll detection
   - Mobile hamburger menu
   - Booking form validation + submission
   - Photo upload for guides
   - Smooth scroll
====================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // ===========================
  // 1. STICKY NAV
  // ===========================
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });


  // ===========================
  // 2. SCROLL REVEAL
  // ===========================
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });


  // ===========================
  // 3. MOBILE HAMBURGER MENU
  // ===========================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', function () {
    mobileMenu.classList.toggle('open');
    // Animate hamburger lines
    const spans = hamburger.querySelectorAll('span');
    if (mobileMenu.classList.contains('open')) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      document.body.style.overflow = 'hidden';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
      document.body.style.overflow = '';
    }
  });

  window.closeMobile = function () {
    mobileMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
    document.body.style.overflow = '';
  };


  // ===========================
  // 4. SMOOTH SCROLL
  // ===========================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = nav.offsetHeight;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });


  // ===========================
  // 5. BOOKING FORM
  // ===========================
  const bookingForm = document.getElementById('bookingForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Clear previous errors
      bookingForm.querySelectorAll('.error').forEach(function (el) {
        el.classList.remove('error');
      });

      // Validate
      let valid = true;
      const required = bookingForm.querySelectorAll('[required]');
      required.forEach(function (field) {
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });

      // Email validation
      const emailField = document.getElementById('email');
      if (emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        emailField.classList.add('error');
        valid = false;
      }

      if (!valid) {
        // Scroll to first error
        const firstError = bookingForm.querySelector('.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
        return;
      }

      // Simulate submission
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');
      submitBtn.disabled = true;
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline';

      // Collect form data
      const formData = {
        name: document.getElementById('fname').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        month: document.getElementById('month').value,
        guests: document.getElementById('guests').value,
        message: document.getElementById('message').value.trim(),
        submittedAt: new Date().toLocaleString()
      };

      console.log('Booking Request:', formData);
      // ⚠️ BACKEND INTEGRATION POINT:
      // Replace the setTimeout below with a real fetch() call to your server/email endpoint.
      // Example:
      // fetch('https://your-backend.com/api/booking', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // }).then(res => { ... });

      setTimeout(function () {
        submitBtn.style.display = 'none';
        formSuccess.style.display = 'block';
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        bookingForm.reset();
      }, 1800);
    });

    // Remove error state on input
    bookingForm.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        this.classList.remove('error');
      });
    });
  }


  // ===========================
  // 6. GUIDE PHOTO UPLOAD
  // ===========================
  // This enables uploading photos for Salma and Basira.
  // When you receive photos, you can either:
  //   A) Replace the placeholder divs with <img> tags in the HTML directly, OR
  //   B) Use this JS upload feature for dynamic image loading.

  function setupPhotoUpload(photoContainerId, name) {
    const container = document.getElementById(photoContainerId);
    if (!container) return;

    // Create hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // Make placeholder clickable
    const placeholder = container.querySelector('.photo-placeholder');
    if (placeholder) {
      placeholder.style.cursor = 'pointer';
      placeholder.title = 'Click to upload ' + name + "'s photo";

      placeholder.addEventListener('click', function () {
        fileInput.click();
      });

      fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
          // Remove placeholder
          placeholder.style.display = 'none';
          // Create and insert image
          const img = document.createElement('img');
          img.src = event.target.result;
          img.alt = name + ' - Tour Guide';
          img.style.cssText = 'width:100%;height:100%;object-fit:cover;position:absolute;inset:0;';
          container.appendChild(img);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  setupPhotoUpload('salmaPhoto', 'Salma');
  setupPhotoUpload('basiraPhoto', 'Basira');


  // ===========================
  // 7. ACTIVE NAV LINK HIGHLIGHT
  // ===========================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', function () {
    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop <= 120) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });


  // ===========================
  // 8. MONTH OPTIONS — DYNAMIC
  // ===========================
  // Automatically populate the next 12 months in the booking form
  const monthSelect = document.getElementById('month');
  if (monthSelect) {
    monthSelect.innerHTML = '<option value="">Select a month</option>';
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() + i + 1, 1);
      const label = months[d.getMonth()] + ' ' + d.getFullYear();
      const option = document.createElement('option');
      option.value = label;
      option.textContent = label;
      monthSelect.appendChild(option);
    }
  }

  // ===========================
  // 9. CONSOLE WELCOME
  // ===========================
  console.log('%c🌍 TasteTamale', 'font-size:1.5rem;font-weight:bold;color:#C85A2B;');
  console.log('%cBuilt for Salma & Basira — the heart of Northern Ghana ❤️', 'color:#6B3F20;');
  console.log('%cBackend integration point: search for "BACKEND INTEGRATION POINT" in this file.', 'color:#7A6652;font-size:0.85rem;');

});
