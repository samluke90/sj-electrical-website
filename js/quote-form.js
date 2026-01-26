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

            // Fix: Collect contact method checkboxes as comma-separated string
            const contactMethods = [];
            document.querySelectorAll('input[name="contact_method"]:checked').forEach(cb => {
                contactMethods.push(cb.value);
            });
            formData.delete('contact_method');
            formData.append('contact_method', contactMethods.join(', ') || 'Not specified');

            // Collect symptom checker answers if present
            const symptomAnswers = collectSymptomAnswers();
            if (symptomAnswers) {
                formData.append('symptom_details', symptomAnswers);
            }

            // Add voice message if recorded (use correct extension based on mimeType)
            if (voiceBlob) {
                const voiceExtension = voiceMimeType && voiceMimeType.includes('mp4') ? 'mp4' : 'webm';
                formData.append('voice_message', voiceBlob, `voice-message.${voiceExtension}`);
            }

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

    /* ============================================
       WhatsApp Handoff
       ============================================ */
    const whatsappBtn = document.getElementById('whatsappBtn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const message = buildWhatsAppMessage();
            const phoneNumber = '447875210678';
            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        });
    }

    function buildWhatsAppMessage() {
        const name = document.getElementById('name')?.value || '';
        const phone = document.getElementById('phone')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const postcode = document.getElementById('postcode')?.value || '';
        const service = document.getElementById('service')?.value || '';
        const urgency = document.getElementById('urgency')?.value || '';
        const description = document.getElementById('description')?.value || '';

        // Collect symptom answers
        const symptomDetails = collectSymptomAnswers();

        let message = `*Quote Request*\n\n`;
        message += `Name: ${name}\n`;
        message += `Phone: ${phone}\n`;
        message += `Email: ${email}\n`;
        message += `Postcode: ${postcode}\n\n`;
        message += `Service: ${service}\n`;
        message += `Urgency: ${urgency}\n`;

        if (symptomDetails) {
            message += `\n${symptomDetails}\n`;
        }

        message += `\nDescription:\n${description}\n\n`;
        message += `(Sent from sjec.uk quote form)`;

        return message;
    }

    /* ============================================
       Voice Message Recording
       ============================================ */
    let mediaRecorder = null;
    let audioChunks = [];
    let voiceBlob = null;
    let voiceMimeType = null;
    let recordingTimer = null;
    let recordingSeconds = 0;
    const MAX_RECORDING_SECONDS = 60;

    /**
     * Detect supported audio MIME type for MediaRecorder
     * Returns the first supported format in preference order:
     * 1. audio/webm;codecs=opus (Chrome/Firefox preference)
     * 2. audio/webm (generic webm)
     * 3. audio/mp4 (Safari preference)
     * 4. '' (let browser choose default)
     */
    function getSupportedMimeType() {
        const types = [
            'audio/webm;codecs=opus',
            'audio/webm',
            'audio/mp4'
        ];

        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }

        return ''; // Let browser choose default
    }

    const voiceSection = document.getElementById('voiceSection');
    const recordBtn = document.getElementById('recordBtn');
    const recordingIndicator = document.getElementById('recordingIndicator');
    const recordingTime = document.getElementById('recordingTime');
    const voicePlayback = document.getElementById('voicePlayback');
    const voiceAudio = document.getElementById('voiceAudio');
    const deleteVoiceBtn = document.getElementById('deleteVoiceBtn');

    // Progressive enhancement: Hide voice section if recording not supported
    // Check for both getUserMedia (microphone access) and MediaRecorder (recording capability)
    if (voiceSection) {
        const hasGetUserMedia = navigator.mediaDevices?.getUserMedia;
        const hasMediaRecorder = typeof MediaRecorder !== 'undefined';

        if (!hasGetUserMedia || !hasMediaRecorder) {
            voiceSection.style.display = 'none';
        }
    }

    if (recordBtn) {
        recordBtn.addEventListener('click', async function() {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                stopRecording();
            } else {
                await startRecording();
            }
        });
    }

    if (deleteVoiceBtn) {
        deleteVoiceBtn.addEventListener('click', deleteRecording);
    }

    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Detect supported MIME type for cross-browser compatibility
            const mimeType = getSupportedMimeType();
            const options = mimeType ? { mimeType } : {};

            mediaRecorder = new MediaRecorder(stream, options);
            audioChunks = [];

            mediaRecorder.ondataavailable = (e) => {
                audioChunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                // Use actual mimeType from recorder (may differ from requested)
                voiceMimeType = mediaRecorder.mimeType || mimeType || 'audio/webm';
                voiceBlob = new Blob(audioChunks, { type: voiceMimeType });
                const audioUrl = URL.createObjectURL(voiceBlob);
                voiceAudio.src = audioUrl;
                voicePlayback.classList.add('visible');
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            recordBtn.classList.add('recording');
            recordBtn.querySelector('.record-text').textContent = 'Stop';
            recordingIndicator.classList.add('visible');
            recordingSeconds = 0;
            updateRecordingTime();

            recordingTimer = setInterval(() => {
                recordingSeconds++;
                updateRecordingTime();
                if (recordingSeconds >= MAX_RECORDING_SECONDS) {
                    stopRecording();
                }
            }, 1000);

        } catch (err) {
            console.error('Recording error:', err);

            // Provide specific error messages based on error type
            let errorMessage;
            switch (err.name) {
                case 'NotAllowedError':
                case 'PermissionDeniedError':
                    errorMessage = 'Microphone access denied. Allow microphone in browser settings to record.';
                    break;
                case 'NotFoundError':
                    errorMessage = 'No microphone found. Connect a microphone to record.';
                    break;
                case 'NotSupportedError':
                    errorMessage = 'Voice recording not supported in this browser.';
                    break;
                default:
                    errorMessage = 'Could not start recording. Voice message unavailable.';
            }

            showError(errorMessage);
        }
    }

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            clearInterval(recordingTimer);
            recordBtn.classList.remove('recording');
            recordBtn.querySelector('.record-text').textContent = 'Record';
            recordingIndicator.classList.remove('visible');
        }
    }

    function deleteRecording() {
        voiceBlob = null;
        voiceAudio.src = '';
        voicePlayback.classList.remove('visible');
        recordingSeconds = 0;
        updateRecordingTime();
    }

    function updateRecordingTime() {
        const mins = Math.floor(recordingSeconds / 60).toString().padStart(2, '0');
        const secs = (recordingSeconds % 60).toString().padStart(2, '0');
        if (recordingTime) {
            recordingTime.textContent = `${mins}:${secs}`;
        }
    }

    /* ============================================
       Electrical Symptom Checker
       ============================================ */
    const serviceSelect = document.getElementById('service');
    const symptomChecker = document.getElementById('symptomChecker');

    const symptomQuestions = {
        'Domestic - Fault Finding': {
            title: 'Help us diagnose the issue',
            questions: [
                {
                    id: 'fault_symptom',
                    label: "What's happening?",
                    options: ['Lights flickering', 'Tripping breaker/fuse', 'No power to outlets', 'Burning smell', 'Other']
                },
                {
                    id: 'fault_area',
                    label: 'Affecting which area?',
                    options: ['One room', 'Multiple rooms', 'Whole property']
                },
                {
                    id: 'fault_timing',
                    label: 'When did it start?',
                    options: ['Just now', 'Last few days', 'Ongoing issue']
                }
            ]
        },
        'Domestic - Rewiring': {
            title: 'Tell us about your property',
            questions: [
                {
                    id: 'rewire_property',
                    label: 'Property type?',
                    options: ['Flat', 'Terraced house', 'Semi-detached', 'Detached', 'Commercial']
                },
                {
                    id: 'rewire_age',
                    label: 'Approximate age of wiring?',
                    options: ['Pre-1960s', '1960s-1980s', '1980s-2000s', 'Post-2000s', 'Not sure']
                },
                {
                    id: 'rewire_scope',
                    label: 'Full or partial rewire?',
                    options: ['Full property', 'Specific rooms only']
                }
            ]
        },
        'Domestic - Consumer Unit': {
            title: 'About your fuse box',
            questions: [
                {
                    id: 'cu_type',
                    label: 'Current fuse box type?',
                    options: ['Old rewirable fuses', 'MCB breakers (switches)', 'Modern RCD protected', 'Not sure']
                },
                {
                    id: 'cu_reason',
                    label: 'Reason for upgrade?',
                    options: ['Required for new work', 'Keeps tripping', 'Insurance/landlord requirement', 'General upgrade']
                }
            ]
        }
    };

    if (serviceSelect && symptomChecker) {
        serviceSelect.addEventListener('change', function() {
            showSymptomQuestions(this.value);
        });
    }

    function showSymptomQuestions(service) {
        if (!symptomChecker) return;

        const config = symptomQuestions[service];
        if (!config) {
            symptomChecker.classList.remove('visible');
            symptomChecker.innerHTML = '';
            return;
        }

        let html = `<h4>${config.title}</h4><div class="symptom-questions">`;

        config.questions.forEach(q => {
            html += `
                <div class="symptom-question">
                    <label>${q.label}</label>
                    <div class="symptom-options">
                        ${q.options.map(opt => `
                            <label class="symptom-option">
                                <input type="radio" name="${q.id}" value="${opt}">
                                <span>${opt}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        html += '</div>';
        symptomChecker.innerHTML = html;
        symptomChecker.classList.add('visible');
    }

    function collectSymptomAnswers() {
        if (!symptomChecker || !symptomChecker.classList.contains('visible')) {
            return null;
        }

        const answers = [];
        symptomChecker.querySelectorAll('.symptom-question').forEach(q => {
            const label = q.querySelector('label:first-child')?.textContent || '';
            const selected = q.querySelector('input:checked');
            if (selected) {
                answers.push(`${label} ${selected.value}`);
            }
        });

        return answers.length > 0 ? 'Diagnostic Info:\n' + answers.join('\n') : null;
    }
});
