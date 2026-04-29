/* ============================================
   SJ Electrical - Contact Form Submission
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('contactSubmitBtn');
    const formSuccess = document.getElementById('contactFormSuccess');
    const errorContainer = document.getElementById('contact-form-errors');

    if (!contactForm || !submitBtn || !formSuccess || !errorContainer) return;

    function showError(message) {
        formSuccess.classList.remove('show');
        errorContainer.textContent = message;
        errorContainer.classList.add('visible');
        errorContainer.setAttribute('tabindex', '-1');
        errorContainer.focus();
        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function clearMessages() {
        errorContainer.textContent = '';
        errorContainer.classList.remove('visible');
        formSuccess.classList.remove('show');
    }

    function resetButton(originalBtnText) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        submitBtn.setAttribute('aria-busy', 'false');
    }

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        clearMessages();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
        submitBtn.setAttribute('aria-busy', 'true');

        try {
            const formData = new FormData(contactForm);
            formData.append('form_type', 'general_contact');

            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Contact form failed with HTTP ${response.status}`);
            }

            contactForm.reset();
            formSuccess.classList.add('show');
            formSuccess.setAttribute('tabindex', '-1');
            formSuccess.focus();
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (error) {
            console.error('Contact form submission error:', error);
            showError('Sorry, there was an error sending your message. Please try again or call us directly on 07875 210 678.');
        } finally {
            resetButton(originalBtnText);
        }
    });
});
