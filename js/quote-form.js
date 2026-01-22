/* ============================================
   SJ Electrical - Quote Form with Photo Upload
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    const quoteForm = document.getElementById('quoteForm');
    const uploadZone = document.getElementById('uploadZone');
    const photoUpload = document.getElementById('photoUpload');
    const imagePreviews = document.getElementById('imagePreviews');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');

    if (!quoteForm) return;

    let uploadedFiles = [];
    const MAX_FILES = 5;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    /* ============================================
       Error Display Functions
       ============================================ */
    const errorContainer = document.getElementById('form-errors');

    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.classList.add('visible');
        errorContainer.setAttribute('tabindex', '-1');
        errorContainer.focus();
        // Scroll error into view
        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function clearErrors() {
        errorContainer.textContent = '';
        errorContainer.classList.remove('visible');
    }

    /* ============================================
       Drag and Drop Functionality
       ============================================ */
    uploadZone.addEventListener('click', function() {
        photoUpload.click();
    });

    uploadZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    photoUpload.addEventListener('change', function(e) {
        handleFiles(e.target.files);
    });

    /* ============================================
       File Handling
       ============================================ */
    function handleFiles(files) {
        const fileArray = Array.from(files);

        fileArray.forEach(file => {
            // Check if already at max files
            if (uploadedFiles.length >= MAX_FILES) {
                showError(`Maximum ${MAX_FILES} photos allowed.`);
                return;
            }

            // Validate file type
            if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
                showError(`${file.name} is not a valid image file.`);
                return;
            }

            // Validate file size
            if (file.size > MAX_FILE_SIZE) {
                showError(`${file.name} is too large. Maximum file size is 5MB.`);
                return;
            }

            // Add to uploaded files
            uploadedFiles.push(file);
            createPreview(file, uploadedFiles.length - 1);
        });

        updateFileInput();
    }

    function createPreview(file, index) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.dataset.index = index;

            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button type="button" class="preview-remove" aria-label="Remove image">&times;</button>
            `;

            // Add remove functionality
            previewItem.querySelector('.preview-remove').addEventListener('click', function() {
                removeFile(index);
            });

            imagePreviews.appendChild(previewItem);
        };

        reader.readAsDataURL(file);
    }

    function removeFile(index) {
        uploadedFiles.splice(index, 1);
        renderPreviews();
        updateFileInput();
    }

    function renderPreviews() {
        imagePreviews.innerHTML = '';
        uploadedFiles.forEach((file, index) => {
            createPreview(file, index);
        });
    }

    function updateFileInput() {
        // Create a new DataTransfer object to update the file input
        const dt = new DataTransfer();
        uploadedFiles.forEach(file => {
            dt.items.add(file);
        });
        photoUpload.files = dt.files;
    }

    /* ============================================
       Form Submission
       ============================================ */
    quoteForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Clear previous errors
        clearErrors();

        // Client-side validation
        if (!quoteForm.checkValidity()) {
            quoteForm.reportValidity();
            return;
        }

        // Set loading state
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';
        submitBtn.setAttribute('aria-busy', 'true');

        try {
            const formData = new FormData(quoteForm);

            // Remove existing photos and re-add from our array with proper names
            formData.delete('photos');
            uploadedFiles.forEach((file, index) => {
                formData.append(`photo_${index + 1}`, file);
            });

            // Submit to n8n webhook
            const response = await fetch(quoteForm.action, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                // Success - show confirmation
                quoteForm.style.display = 'none';
                formSuccess.classList.add('show');
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                showError('Something went wrong. Please try again or call us directly on 07875 210 678.');
                resetButton();
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showError('Network error. Please check your connection and try again, or call us directly on 07875 210 678.');
            resetButton();
        }

        function resetButton() {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            submitBtn.setAttribute('aria-busy', 'false');
        }
    });

    /* ============================================
       Form Validation Enhancement
       ============================================ */
    const requiredInputs = quoteForm.querySelectorAll('[required]');

    requiredInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateInput(this);
            }
        });
    });

    function validateInput(input) {
        if (!input.value.trim()) {
            input.classList.add('error');
            input.setAttribute('aria-invalid', 'true');
        } else {
            input.classList.remove('error');
            input.removeAttribute('aria-invalid');
        }
    }

    /* ============================================
       Phone Number Formatting
       ============================================ */
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Allow only numbers, spaces, and common phone characters
            let value = e.target.value.replace(/[^\d\s\+\-\(\)]/g, '');
            e.target.value = value;
        });
    }

    /* ============================================
       Postcode Formatting
       ============================================ */
    const postcodeInput = document.getElementById('postcode');
    if (postcodeInput) {
        postcodeInput.addEventListener('input', function(e) {
            // Convert to uppercase
            e.target.value = e.target.value.toUpperCase();
        });
    }
});
