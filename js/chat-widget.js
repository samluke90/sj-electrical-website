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
            bottom: 24px;
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
            bottom: 100px;
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
            animation: sjec-fadeIn 0.3s ease;
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
            #sjec-chat-bubble { bottom: 16px; right: 16px; }
        }
    `;
    document.head.appendChild(style);

    // ── Create Elements ────────────────────────────────────────────────
    // Chat bubble
    const bubble = document.createElement('button');
    bubble.id = 'sjec-chat-bubble';
    bubble.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`;
    bubble.onclick = toggleChat;
    document.body.appendChild(bubble);

    // Chat panel
    const panel = document.createElement('div');
    panel.id = 'sjec-chat-panel';
    panel.innerHTML = `
        <div class="sjec-chat-header">
            <div class="sjec-chat-header-icon">
                <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <div class="sjec-chat-header-info">
                <h3>SJ Electrical</h3>
                <p>⚡ Online — typically replies instantly</p>
            </div>
            <button class="sjec-chat-close" onclick="document.getElementById('sjec-chat-panel').classList.remove('open'); document.getElementById('sjec-chat-bubble').classList.remove('open');">✕</button>
        </div>
        <div class="sjec-chat-messages" id="sjec-messages"></div>
        <div class="sjec-chat-input">
            <input type="text" id="sjec-input" placeholder="Ask us anything..." onkeydown="if(event.key==='Enter')document.getElementById('sjec-send').click()">
            <button id="sjec-send" onclick="window._sjecSend()">
                <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
        </div>
        <div class="sjec-chat-powered">Powered by AI</div>
    `;
    document.body.appendChild(panel);

    // ── Functions ───────────────────────────────────────────────────────
    function toggleChat() {
        isOpen = !isOpen;
        panel.classList.toggle('open', isOpen);
        bubble.classList.toggle('open', isOpen);
        
        if (isOpen && messages.length === 0) {
            // Send initial greeting
            addMessage('ai', "Hey! 👋 Thanks for visiting SJ Electrical Contractors. I'm here to help with any electrical questions, quotes, or bookings. What can I help you with?");
        }
        
        if (isOpen) {
            setTimeout(() => document.getElementById('sjec-input').focus(), 100);
        }
    }

    function addMessage(role, text) {
        const container = document.getElementById('sjec-messages');
        const div = document.createElement('div');
        div.className = 'sjec-msg ' + role;
        div.textContent = text;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        
        if (role !== 'typing') {
            messages.push({role: role === 'ai' ? 'assistant' : 'user', content: text});
        }
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
            addMessage('ai', "Sorry, I'm having trouble connecting. Please call us on 07875 210 678 for immediate help.");
        }
        
        isTyping = false;
        document.getElementById('sjec-send').disabled = false;
        document.getElementById('sjec-input').focus();
    };
})();
