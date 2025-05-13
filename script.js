
document.addEventListener('DOMContentLoaded', function () {
    // ==================== 1. EVENT HANDLING ====================
    // Mobile Navigation Toggle
    const menuBtn = document.querySelector('.hamburger');
    const navList = document.querySelector('.navlist');

    if (menuBtn && navList) {
        menuBtn.addEventListener('click', function () {
            navList.classList.toggle('show');
            menuBtn.classList.toggle('open');
        });

        document.querySelectorAll('.navlist a').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('show');
                menuBtn.classList.remove('open');
            });
        });
    }

    // Keyboard Event Handling
    document.addEventListener('keydown', function (e) {
        // Close mobile menu on ESC
        if (e.key === 'Escape' && navList?.classList.contains('show')) {
            navList.classList.remove('show');
            menuBtn?.classList.remove('open');
        }

        // Navigate accordion with keyboard
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const activeAccordion = document.querySelector('.accordion-item.active');
            if (activeAccordion) {
                const allItems = document.querySelectorAll('.accordion-item');
                const currentIndex = Array.from(allItems).indexOf(activeAccordion);
                let nextIndex;

                if (e.key === 'ArrowDown') {
                    nextIndex = (currentIndex + 1) % allItems.length;
                } else {
                    nextIndex = (currentIndex - 1 + allItems.length) % allItems.length;
                }

                allItems[nextIndex]?.querySelector('.accordion-header')?.click();
            }
        }
    });

    // ==================== 2. INTERACTIVE ELEMENTS ====================
    // Image Slideshow
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        currentSlide = (n + slides.length) % slides.length;

        slides[currentSlide]?.classList.add('active');
        dots[currentSlide]?.classList.add('active');
    }

    if (slides.length > 0) {
        setInterval(() => {
            currentSlide++;
            showSlide(currentSlide);
        }, 5000);
        showSlide(0);
    }

    // Service Tabs
    function setupServiceTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        if (tabButtons.length === 0 || tabContents.length === 0) return;

        function activateTab(tabId) {
            // Deactivate all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Activate selected tab
            const activeButton = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
            const activeContent = document.getElementById(tabId);

            if (activeButton && activeContent) {
                activeButton.classList.add('active');
                activeContent.classList.add('active');
            }
        }

        tabButtons.forEach(button => {
            button.addEventListener('click', function () {
                const tabId = this.getAttribute('data-tab');
                if (tabId) activateTab(tabId);
            });
        });

        // Activate first tab by default
        const firstTabId = tabButtons[0]?.getAttribute('data-tab');
        if (firstTabId) activateTab(firstTabId);
    }
    setupServiceTabs();

    // FAQ Accordion
    function setupFAQAccordion() {
        const accordionItems = document.querySelectorAll('.accordion-item');

        if (accordionItems.length === 0) return;

        function toggleAccordion(item) {
            const isActive = item.classList.contains('active');
            const content = item.querySelector('.accordion-content');
            const icon = item.querySelector('.accordion-header i');

            // Close all items first
            accordionItems.forEach(accordion => {
                accordion.classList.remove('active');
                const accContent = accordion.querySelector('.accordion-content');
                if (accContent) accContent.style.maxHeight = null;
                const accIcon = accordion.querySelector('.accordion-header i');
                if (accIcon) {
                    accIcon.classList.remove('fa-chevron-up');
                    accIcon.classList.add('fa-chevron-down');
                }
            });

            // Open clicked item if it was closed
            if (!isActive) {
                item.classList.add('active');
                if (content) content.style.maxHeight = content.scrollHeight + 'px';
                if (icon) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                }
            }
        }

        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            if (header) {
                header.addEventListener('click', () => toggleAccordion(item));
            }
        });
    }
    setupFAQAccordion();

    // ==================== 3. FORM VALIDATION ====================
    // Booking Form
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const service = document.getElementById('service');
            const checkin = document.getElementById('checkin');
            const checkout = document.getElementById('checkout');
            const guests = document.getElementById('guest_count');

            if (service.value === '') {
                alert('Please select a service');
                return;
            }
            if (checkin.value === '') {
                alert('Please select a check-in date');
                return;
            }
            if (checkout.value === '') {
                alert('Please select a check-out date');
                return;
            }
            if (checkout.value < checkin.value) {
                alert('Check-out date must be after check-in date');
                return;
            }
            if (guests.value < 1) {
                alert('Please enter number of guests');
                return;
            }

            alert('Booking submitted successfully!');
            this.reset();
        });
        // Restore saved data if available
        const savedBooking = JSON.parse(localStorage.getItem('bookingFormData'));
        if (savedBooking) {
            if (service) service.value = savedBooking.service || '';
            if (checkin) checkin.value = savedBooking.checkin || '';
            if (checkout) checkout.value = savedBooking.checkout || '';
            if (guests) guests.value = savedBooking.guests || '';
            if (comments) comments.value = savedBooking.comments || '';
        }
        // Save data to localStorage on input/change
        [service, checkin, checkout, guests, comments].forEach(field => {
            if (field) {
                field.addEventListener('input', () => {
                    const bookingData = {
                        service: service.value,
                        checkin: checkin.value,
                        checkout: checkout.value,
                        guests: guests.value,
                        comments: comments.value
                    };
                    localStorage.setItem('bookingFormData', JSON.stringify(bookingData));
                });
            }
        });

        // On form submit, clear saved data
        bookingForm.addEventListener('submit', function (e) {
            // ... your validation code ...
            localStorage.removeItem('bookingFormData');
            // ... rest of your submit code ...
        });
    }

    // Registration Form with Real-time Validation
    const regForm = document.getElementById('regForm');
    if (regForm) {
        // Real-time Password Strength
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('input', function () {
                const strengthIndicator = document.createElement('div');
                strengthIndicator.className = 'password-strength';

                if (this.value.length === 0) {
                    strengthIndicator.textContent = '';
                } else if (this.value.length < 6) {
                    strengthIndicator.textContent = 'Weak';
                    strengthIndicator.style.color = 'red';
                } else if (this.value.length < 10) {
                    strengthIndicator.textContent = 'Medium';
                    strengthIndicator.style.color = 'orange';
                } else {
                    strengthIndicator.textContent = 'Strong';
                    strengthIndicator.style.color = 'green';
                }

                const existingIndicator = this.parentNode.querySelector('.password-strength');
                if (existingIndicator) {
                    existingIndicator.replaceWith(strengthIndicator);
                } else {
                    this.parentNode.appendChild(strengthIndicator);
                }
            });
        }

        // Real-time Email Validation
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('input', function () {
                const emailError = document.getElementById('emailError') || document.createElement('div');
                emailError.id = 'emailError';
                emailError.className = 'real-time-error';

                if (!this.value.includes('@') || !this.value.includes('.')) {
                    emailError.textContent = 'Please enter a valid email';
                    emailError.style.color = 'red';
                } else {
                    emailError.textContent = '✓ Valid email';
                    emailError.style.color = 'green';
                }

                if (!document.getElementById('emailError')) {
                    this.parentNode.appendChild(emailError);
                }
            });
        }

        // Form Submission
        regForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirmPassword');
            const interests = document.querySelectorAll('input[name="interests"]:checked');

            if (name.value.length < 2) {
                alert('Name must be at least 2 characters');
                return;
            }
            if (!email.value.includes('@') || !email.value.includes('.')) {
                alert('Please enter a valid email');
                return;
            }
            if (password.value.length < 6) {
                alert('Password must be at least 6 characters');
                return;
            }
            if (password.value !== confirmPassword.value) {
                alert('Passwords do not match');
                return;
            }
            if (interests.length === 0) {
                alert('Please select at least one interest');
                return;
            }

            alert('Registration successful!');
            this.reset();
        });
    }

    // ==================== BONUS FEATURES ====================
    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Easter Eggs
    const logo = document.querySelector('.logo');
    if (logo) {
        // Double Click
        logo.addEventListener('dblclick', function () {
            alert('🎉 Secret Discount Code: BOOKNOW10 🎉');
        });

        // Long Press
        let pressTimer;
        logo.addEventListener('mousedown', function () {
            pressTimer = window.setTimeout(function () {
                alert('🌟 Long press secret: Use code LONGPRESS15 for 15% off!');
            }, 1000);
        });

        logo.addEventListener('mouseup', function () {
            clearTimeout(pressTimer);
        });

        logo.addEventListener('mouseleave', function () {
            clearTimeout(pressTimer);
        });
    }
});
