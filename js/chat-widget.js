/**
 * SJ Electrical — AI Chat Widget
 * Drop-in chat bubble for sjec.uk
 */
(function() {
    const API = 'https://receptionist.jenk0.uk';
    let messages = [];
    let isOpen = false;
    let isTyping = false;

    // ── Inject Styles ──────────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
        #sjec-chat-bubble {
            position: fixed;
            bottom: 130px;
            right: 24px;
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: linear-gradient(135deg, #FF8C00, #ff6b00);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(255,140,0,0.4);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            animation: sjec-pulse 3s infinite;
        }
        #sjec-chat-bubble:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 30px rgba(255,140,0,0.5);
        }
        #sjec-chat-bubble.open {
            animation: none;
            transform: scale(1);
        }
        @keyframes sjec-pulse {
            0%, 100% { box-shadow: 0 4px 20px rgba(255,140,0,0.4); }
            50% { box-shadow: 0 4px 30px rgba(255,140,0,0.6); }
        }
        #sjec-chat-bubble svg { width: 28px; height: 28px; }

        #sjec-chat-panel {
            position: fixed;
            bottom: 210px;
            right: 24px;
            width: 380px;
            max-width: calc(100vw - 48px);
            height: 520px;
            max-height: calc(100vh - 140px);
            background: #0f0f0f;
            border-radius: 20px;
            box-shadow: 0 10px 50px rgba(0,0,0,0.5);
            z-index: 99998;
            display: none;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid rgba(255,140,0,0.2);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        #sjec-chat-panel.open { display: flex; }

        .sjec-chat-header {
            background: linear-gradient(135deg, #FF8C00, #ff6b00);
            padding: 16px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .sjec-chat-header-icon {
            width: 40px;
            height: 40px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .sjec-chat-header-icon svg { width: 22px; height: 22px; fill: white; }
        .sjec-chat-header-info h3 {
            margin: 0;
            font-size: 0.95rem;
            font-weight: 600;
            color: white;
        }
        .sjec-chat-header-info p {
            margin: 2px 0 0;
            font-size: 0.8rem;
            color: rgba(255,255,255,0.8);
        }
        .sjec-chat-close {
            margin-left: auto;
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 1.3rem;
            padding: 4px;
            opacity: 0.8;
        }
        .sjec-chat-close:hover { opacity: 1; }

        .sjec-chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .sjec-chat-messages::-webkit-scrollbar { width: 4px; }
        .sjec-chat-messages::-webkit-scrollbar-thumb { background: rgba(255,140,0,0.3); border-radius: 2px; }

        .sjec-msg {
            max-width: 85%;
            padding: 10px 14px;
            border-radius: 16px;
            font-size: 0.9rem;
            line-height: 1.5;
            white-space: pre-wrap;
            overflow-wrap: anywhere;
            animation: sjec-fadeIn 0.3s ease;
        }
        .sjec-chat-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-self: flex-start;
            max-width: 90%;
        }
        .sjec-chat-action {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 40px;
            padding: 9px 13px;
            border: 1px solid rgba(255,140,0,0.55);
            border-radius: 999px;
            background: rgba(255,140,0,0.12);
            color: #fff;
            font-size: 0.84rem;
            font-weight: 600;
            line-height: 1.2;
            text-decoration: none;
            transition: background 0.2s, border-color 0.2s;
        }
        .sjec-chat-action:hover,
        .sjec-chat-action:focus-visible {
            background: #FF8C00;
            border-color: #FF8C00;
            color: #fff;
            outline: none;
        }
        @keyframes sjec-fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .sjec-msg.ai {
            background: rgba(255,140,0,0.12);
            color: #f0f0f0;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
        }
        .sjec-msg.user {
            background: #FF8C00;
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
        }
        .sjec-msg.typing {
            background: rgba(255,140,0,0.12);
            color: rgba(255,255,255,0.5);
            align-self: flex-start;
            border-bottom-left-radius: 4px;
        }
        .sjec-typing-dots span {
            animation: sjec-blink 1.4s infinite;
            font-size: 1.2rem;
        }
        .sjec-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .sjec-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes sjec-blink {
            0%, 60%, 100% { opacity: 0.2; }
            30% { opacity: 1; }
        }

        .sjec-chat-input {
            display: flex;
            padding: 12px 16px;
            gap: 8px;
            border-top: 1px solid rgba(255,255,255,0.08);
            background: #0a0a0a;
        }
        .sjec-chat-input input {
            flex: 1;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 50px;
            padding: 10px 16px;
            color: white;
            font-size: 0.9rem;
            outline: none;
            transition: border-color 0.2s;
        }
        .sjec-chat-input input:focus {
            border-color: rgba(255,140,0,0.5);
        }
        .sjec-chat-input input::placeholder { color: rgba(255,255,255,0.3); }
        .sjec-chat-input button {
            background: #FF8C00;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
            flex-shrink: 0;
        }
        .sjec-chat-input button:hover { background: #ff6b00; }
        .sjec-chat-input button:disabled { opacity: 0.5; cursor: not-allowed; }
        .sjec-chat-input button svg { width: 18px; height: 18px; fill: white; }

        .sjec-chat-powered {
            text-align: center;
            padding: 6px;
            font-size: 0.7rem;
            color: rgba(255,255,255,0.2);
        }

        @media (max-width: 480px) {
            #sjec-chat-panel {
                bottom: 0;
                right: 0;
                width: 100%;
                height: 100%;
                max-width: 100%;
                max-height: 100%;
                border-radius: 0;
            }
            #sjec-chat-bubble { bottom: 130px; right: 16px; }
        }
    `;
    document.head.appendChild(style);

    // ── Create Elements ────────────────────────────────────────────────
    // Chat bubble
    const bubble = document.createElement('button');
    bubble.id = 'sjec-chat-bubble';
    bubble.type = 'button';
    bubble.setAttribute('aria-label', 'Open chat with SJ Electrical');
    bubble.setAttribute('aria-expanded', 'false');
    bubble.setAttribute('aria-controls', 'sjec-chat-panel');
    bubble.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;
    bubble.onclick = toggleChat;
    document.body.appendChild(bubble);

    // Chat panel
    const panel = document.createElement('div');
    panel.id = 'sjec-chat-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'SJ Electrical quick enquiry assistant');
    panel.setAttribute('aria-hidden', 'true');
    panel.innerHTML = `
        <div class="sjec-chat-header">
            <div class="sjec-chat-header-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <div class="sjec-chat-header-info">
                <h3>SJ Electrical</h3>
                <p>⚡ Quick enquiry assistant</p>
            </div>
            <button type="button" class="sjec-chat-close" aria-label="Close chat">✕</button>
        </div>
        <div class="sjec-chat-messages" id="sjec-messages" aria-live="polite"></div>
        <div class="sjec-chat-input">
            <input type="text" id="sjec-input" aria-label="Chat message" autocomplete="off" placeholder="Ask us anything...">
            <button type="button" id="sjec-send" aria-label="Send message">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
        </div>
        <div class="sjec-chat-powered">Need urgent help? Call 07875 210 678</div>
    `;
    document.body.appendChild(panel);

    const closeButton = panel.querySelector('.sjec-chat-close');
    const input = panel.querySelector('#sjec-input');
    const sendButton = panel.querySelector('#sjec-send');
    closeButton.addEventListener('click', closeChat);
    sendButton.addEventListener('click', () => window._sjecSend());
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') window._sjecSend();
        if (event.key === 'Escape') closeChat();
    });

    // ── Functions ───────────────────────────────────────────────────────
    function toggleChat() {
        isOpen = !isOpen;
        panel.classList.toggle('open', isOpen);
        bubble.classList.toggle('open', isOpen);
        bubble.setAttribute('aria-expanded', String(isOpen));
        panel.setAttribute('aria-hidden', String(!isOpen));
        
        if (isOpen && messages.length === 0) {
            // Send initial greeting
            addMessage('ai', "Hey! 👋 Thanks for visiting SJ Electrical Contractors. I'm here to help with any electrical questions, quotes, or bookings. What can I help you with?");
        }
        
        if (isOpen) {
            setTimeout(() => input.focus(), 100);
        }
    }

    function closeChat() {
        isOpen = false;
        panel.classList.remove('open');
        bubble.classList.remove('open');
        bubble.setAttribute('aria-expanded', 'false');
        panel.setAttribute('aria-hidden', 'true');
        bubble.focus();
    }

    function addMessage(role, text) {
        const container = document.getElementById('sjec-messages');
        const div = document.createElement('div');
        div.className = 'sjec-msg ' + role;
        div.textContent = text;
        container.appendChild(div);
        if (role === 'ai') addContextActions(container, text);
        container.scrollTop = container.scrollHeight;
        
        if (role !== 'typing') {
            messages.push({role: role === 'ai' ? 'assistant' : 'user', content: text});
        }
    }

    function addContextActions(container, text) {
        const lower = String(text || '').toLowerCase();
        const actions = [];

        if (/quote|estimate|price|photo/.test(lower)) {
            actions.push({label: 'Get a free quote', href: 'quote.html'});
        }
        if (/call|phone|urgent|emergency/.test(lower)) {
            actions.push({label: 'Call 07875 210 678', href: 'tel:07875210678'});
        }
        if (/whatsapp|text/.test(lower)) {
            actions.push({label: 'Open WhatsApp', href: 'https://wa.me/447875210678'});
        }

        const unique = actions.filter((action, index, all) =>
            all.findIndex(candidate => candidate.href === action.href) === index
        );
        if (!unique.length) return;

        const actionRow = document.createElement('div');
        actionRow.className = 'sjec-chat-actions';
        actionRow.setAttribute('aria-label', 'Suggested actions');
        unique.forEach(action => {
            const link = document.createElement('a');
            link.className = 'sjec-chat-action';
            link.href = action.href;
            link.textContent = action.label;
            if (action.href.startsWith('https://')) {
                link.target = '_blank';
                link.rel = 'noopener';
            }
            actionRow.appendChild(link);
        });
        container.appendChild(actionRow);
    }

    function showTyping() {
        const container = document.getElementById('sjec-messages');
        const div = document.createElement('div');
        div.className = 'sjec-msg typing';
        div.id = 'sjec-typing';
        div.innerHTML = '<span class="sjec-typing-dots"><span>●</span><span>●</span><span>●</span></span>';
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    function hideTyping() {
        const el = document.getElementById('sjec-typing');
        if (el) el.remove();
    }

    window._sjecSend = async function() {
        const input = document.getElementById('sjec-input');
        const text = input.value.trim();
        if (!text || isTyping) return;
        
        input.value = '';
        addMessage('user', text);
        isTyping = true;
        document.getElementById('sjec-send').disabled = true;
        showTyping();

        try {
            const resp = await fetch(API + '/api/chat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({messages: messages.map(m => ({role: m.role, content: m.content}))})
            });
            const data = await resp.json();
            hideTyping();
            addMessage('ai', data.text);
        } catch(e) {
            hideTyping();
            addMessage('ai', "The chat is having a wobble. Please call 07875 210 678 for urgent help, or use the quote form with photos.");
        }
        
        isTyping = false;
        document.getElementById('sjec-send').disabled = false;
        document.getElementById('sjec-input').focus();
    };
})();
