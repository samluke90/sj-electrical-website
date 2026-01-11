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
                alert(`Maximum ${MAX_FILES} photos allowed.`);
                return;
            }

            // Validate file type
            if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/)) {
                alert(`${file.name} is not a valid image file.`);
                return;
            }

            // Validate file size
            if (file.size > MAX_FILE_SIZE) {
                alert(`${file.name} is too large. Maximum file size is 5MB.`);
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

        // Disable submit button and show loading state
        submitBtn.disabled = true;
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner"></span> Sending...';

        try {
            const formData = new FormData(quoteForm);

            // Remove existing photos and re-add from our array
            formData.delete('photos');
            uploadedFiles.forEach((file, index) => {
                formData.append(`photo_${index + 1}`, file);
            });

            // Submit to Web3Forms
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                // Show success message
                quoteForm.style.display = 'none';
                formSuccess.classList.add('show');

                // Scroll to success message
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                throw new Error(result.message || 'Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Sorry, there was an error submitting your quote request. Please try again or call us directly.');

            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
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
            input.style.borderColor = '#DC3545';
            input.classList.add('error');
        } else {
            input.style.borderColor = '';
            input.classList.remove('error');
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
