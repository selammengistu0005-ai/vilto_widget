(function() {
    // 1. CSS INJECTION (The Futuristic Skin)
    const style = document.createElement('style');
    style.textContent = `
        .v-chat-wrap { position: fixed; bottom: 25px; right: 25px; z-index: 10000; font-family: 'Orbitron', sans-serif; }
        .v-chat-btn { 
            width: 65px; height: 65px; border-radius: 50%; 
            background: linear-gradient(135deg, #7000ff, #00f2ff);
            box-shadow: 0 0 20px rgba(0, 242, 255, 0.5);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; border: 2px solid rgba(255,255,255,0.2);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .v-chat-btn:hover { transform: scale(1.1) rotate(15deg); box-shadow: 0 0 30px #00f2ff; }
        
        .v-chat-window {
            display: none; position: absolute; bottom: 85px; right: 0;
            width: 350px; height: 500px; background: rgba(5, 5, 5, 0.95);
            backdrop-filter: blur(20px); border: 1px solid #00f2ff;
            border-radius: 20px; flex-direction: column; overflow: hidden;
            box-shadow: 0 15px 50px rgba(0,0,0,0.8); 
            animation: v-slideIn 0.3s ease;
        }
        @keyframes v-slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .v-header { padding: 20px; background: rgba(112, 0, 255, 0.2); border-bottom: 1px solid rgba(0, 242, 255, 0.3); font-weight: bold; letter-spacing: 1px; color: #00f2ff; font-size: 0.8rem; }
        
        .v-msgs { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
        
        /* Message Bubbles */
        .v-msg { padding: 10px 15px; border-radius: 15px; font-size: 0.85rem; max-width: 80%; line-height: 1.4; word-wrap: break-word; }
        .v-msg.assistant { background: rgba(255,255,255,0.1); border-bottom-left-radius: 2px; border: 1px solid rgba(255,255,255,0.05); color: #eee; align-self: flex-start; }
        .v-msg.user { background: #00f2ff; color: #000; align-self: flex-end; border-bottom-right-radius: 2px; font-weight: bold; }
        
        /* Input Area */
        .v-input-box { padding: 15px; background: rgba(0,0,0,0.5); display: flex; gap: 10px; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); }
        .v-input-box input { flex: 1; background: transparent; border: 1px solid #333; border-radius: 10px; padding: 10px; color: white; outline: none; transition: 0.3s; font-family: 'Segoe UI', sans-serif; }
        .v-input-box input:focus { border-color: #00f2ff; box-shadow: 0 0 10px rgba(0, 242, 255, 0.2); }
        
        /* Send Button */
        #vSendBtn {
            background: transparent; border: none; cursor: pointer; color: #00f2ff; display: flex; align-items: center; justify-content: center; transition: 0.3s;
        }
        #vSendBtn:hover { transform: scale(1.1); filter: drop-shadow(0 0 5px #00f2ff); }
    `;
    document.head.appendChild(style);

    // 2. HTML GENERATION (The UI Structure)
    const widget = document.createElement('div');
    widget.className = 'v-chat-wrap';
    widget.innerHTML = `
        <div class="v-chat-window" id="vWindow">
            <div class="v-header">VILTO SUPPORT // ONLINE</div>
            <div class="v-msgs" id="vMsgs">
                <div class="v-msg assistant">Connection established. How can I assist you today ?</div>
            </div>
            <div class="v-input-box">
                <input type="text" id="vInput" placeholder="Type your message...">
                <button id="vSendBtn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
        </div>
        <div class="v-chat-btn" id="vToggleBtn">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
    `;
    document.body.appendChild(widget);

    // 3. LOGIC (Your Backend Integration)
    const vToggleBtn = document.getElementById('vToggleBtn');
    const vWindow = document.getElementById('vWindow');
    const inputField = document.getElementById('vInput');
    const sendButton = document.getElementById('vSendBtn');
    const vMsgs = document.getElementById('vMsgs');

    // Toggle Chat Window
    vToggleBtn.onclick = () => {
        const isOpen = vWindow.style.display === 'flex';
        vWindow.style.display = isOpen ? 'none' : 'flex';
        if(!isOpen) inputField.focus();
    };

    // Helper: Add Message to UI
    function addMessage(sender, text) {
        const div = document.createElement('div');
        // Maps 'user' to .user and 'assistant' to .assistant classes
        div.className = `v-msg ${sender}`; 
        div.innerText = text;
        vMsgs.appendChild(div);
        vMsgs.scrollTop = vMsgs.scrollHeight;
    }

    // Main Send Function (Backend Integrated)
    function sendMessage() {
        const message = inputField.value.trim();
        if (!message) return;

        // 1. Add User Message to UI
        addMessage('user', message);
        inputField.value = '';

        // 2. Send to Backend
        fetch('https://trex-backend-09ab.onrender.com/api/support', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message, 
                user: { name: 'Selam', preferences: {} } // Hardcoded as per your request
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                addMessage('assistant', data.reply);
            } else {
                addMessage('assistant', 'Sorry, there was an error. Please try again.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            addMessage('assistant', 'Sorry, connection issue. Please try again.');
        });
    }

    // Event Listeners
    sendButton.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', (e) => { 
        if (e.key === 'Enter') sendMessage(); 
    });

    console.log("Vilto Chat: Backend Integration Active.");
})();

