// AquaX AI Chat Management System
class AquaXChat {
    constructor() {
        this.messages = [];
        this.isTyping = false;
        this.currentLanguage = localStorage.getItem('ax_lang') || 'en';
        this.socket = io();
        this.voiceEnabled = localStorage.getItem('voiceEnabled') === 'true';
        this.setupEventListeners();
        this.loadChatHistory();
        this.setupSocketEvents();
    }

    setupEventListeners() {
        // Enter key to send message
        const chatInput = document.getElementById('chatInput');
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        chatInput.addEventListener('input', this.autoResizeTextarea);

        // Voice input toggle
        const voiceBtn = document.getElementById('voiceChatBtn');
        voiceBtn?.addEventListener('click', this.toggleVoiceInput.bind(this));

        // Language change
        const langSwitcher = document.getElementById('langSwitcher');
        langSwitcher?.addEventListener('change', (e) => {
            this.currentLanguage = e.target.value;
            localStorage.setItem('ax_lang', this.currentLanguage);
            this.addSystemMessage(`Language changed to ${this.getLanguageName(this.currentLanguage)}`, 'info');
        });
    }

    setupSocketEvents() {
        this.socket.on('connect', () => {
            this.addSystemMessage('Connected to AquaX AI server', 'success');
        });

        this.socket.on('disconnect', () => {
            this.addSystemMessage('Disconnected from server', 'error');
        });

        this.socket.on('reconnect', () => {
            this.addSystemMessage('Reconnected to server', 'success');
        });
    }

    autoResizeTextarea() {
        const textarea = document.getElementById('chatInput');
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message to chat
        this.addUserMessage(message);
        input.value = '';
        this.autoResizeTextarea();
        input.focus();

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Send to backend API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    language: this.currentLanguage,
                    context: this.getChatContext()
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Hide typing indicator
            this.hideTypingIndicator();

            // Add AI response
            this.addAIMessage(data.reply || this.getFallbackResponse());

            // Speak response if voice is enabled
            if (this.voiceEnabled && window.speak) {
                window.speak(data.reply);
            }

        } catch (error) {
            console.error('Chat API error:', error);
            this.hideTypingIndicator();
            this.addAIMessage(this.getOfflineResponse(message));
        }
    }

    getChatContext() {
        // Provide context about the conversation
        const recentMessages = this.messages.slice(-5).map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
        }));

        return {
            platform: 'AquaX Web',
            location: 'Karunya University',
            userType: 'student',
            recentMessages: recentMessages,
            emergencyMode: this.hasEmergencyKeywords()
        };
    }

    hasEmergencyKeywords() {
        const emergencyKeywords = ['emergency', 'sos', 'urgent', 'critical', 'contamination', 'poison', 'flood'];
        const lastMessage = this.messages[this.messages.length - 1]?.content.toLowerCase();
        return emergencyKeywords.some(keyword => lastMessage?.includes(keyword));
    }

    getFallbackResponse() {
        const fallbacks = {
            en: "I apologize, but I'm having trouble processing your request. Please try again or contact water authorities directly for urgent matters.",
            hi: "मैं माफी चाहता हूं, लेकिन मुझे आपके अनुरोध को संसाधित करने में परेशानी हो रही है। कृपया पुनः प्रयास करें या जरूरी मामलों के लिए सीधे जल अधिकारियों से संपर्क करें।",
            ta: "மன்னிக்கவும், ஆனால் உங்கள் கோரிக்கையை செயலாக்க எனக்கு சிக்கல் உள்ளது. தயவு செய்து மீண்டும் முயற்சிக்கவும் அல்லது அவசர விஷயங்களுக்கு நேரடியாக நீர் அதிகாரிகளைத் தொடர்பு கொள்ளவும்.",
            te: "నన్ను క్షమించండి, కానీ మీ అభ్యర్థనను ప్రాసెస్ చేయడంలో నాకు సమస్య ఉంది. దయచేసి మళ్లీ ప్రయత్నించండి లేదా అత్యవసర విషయాల కోసం నేరుగా నీటి అధికారులను సంప్రదించండి.",
            kn: "ಕ್ಷಮಿಸಿ, ಆದರೆ ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ನನಗೆ ತೊಂದರೆ ಉಂಟಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ತುರ್ತು ವಿಷಯಗಳಿಗೆ ನೇರವಾಗಿ ನೀರು ಅಧಿಕಾರಿಗಳನ್ನು ಸಂಪರ್ಕಿಸಿ.",
            ml: "ക്ഷമിക്കണം, പക്ഷേ നിങ്ങളുടെ അഭ്യർത്ഥന പ്രോസസ്സ് ചെയ്യുന്നതിൽ എനിക്ക് പ്രശ്നമുണ്ട്. ദയവായി വീണ്ടും ശ്രമിക്കുക അല്ലെങ്കിൽ അടിയന്തര കാര്യങ്ങൾക്ക് നേരിട്ട് ജല അധികൃതരെ ബന്ധപ്പെടുക."
        };
        return fallbacks[this.currentLanguage] || fallbacks.en;
    }

    getOfflineResponse(userMessage) {
        // Provide intelligent offline responses based on message content
        const message = userMessage.toLowerCase();
        
        // Emergency responses
        if (message.includes('emergency') || message.includes('sos') || message.includes('urgent')) {
            return `🚨 **EMERGENCY MODE - OFFLINE RESPONSE**

**Immediate Actions Required:**
1. 🆘 Call Campus Security: **1066**
2. 💧 Water Emergency Line: **1800-XXX-XXXX**
3. 🏥 Medical Emergency: **108**

**If you suspect water contamination:**
- Stop using the water immediately
- Use bottled water for all needs
- Report to hostel warden
- Seek medical attention if symptoms appear

**For flooding or pipe bursts:**
- Turn off electricity if safe
- Evacuate the area
- Contact maintenance immediately

*Note: I'm currently offline. Please use the above emergency contacts for immediate assistance.*`;
        }

        // Water quality questions
        if (message.includes('safe') || message.includes('quality') || message.includes('drink')) {
            return `💧 **Water Safety Guidelines - Offline Response**

**Signs of Safe Water:**
- Clear and colorless
- No unusual odor
- No particles or sediment
- Normal pressure

**If Unsure:**
1. Boil water for 1 minute before use
2. Use RO filters in hostel common areas
3. Contact water testing lab: **EXT 5678**

**Emergency Testing Available at:**
- Campus Water Lab (Main Building)
- Security Office (Quick test kits)
- Hostel Wardens Office

*For real-time water quality data, please check when I'm back online.*`;
        }

        // General offline response
        const offlineResponses = {
            en: "I'm currently offline, but here's what I can suggest based on your question. For immediate assistance, please contact:\n\n🏢 Water Department: EXT 5678\n🔧 Maintenance: EXT 1234\n🚨 Emergency: 1066\n\nI'll be back online shortly to provide more detailed help.",
            hi: "मैं वर्तमान में ऑफलाइन हूं, लेकिन आपके प्रश्न के आधार पर मैं यह सुझाव दे सकता हूं। तत्काल सहायता के लिए, कृपया संपर्क करें:\n\n🏢 जल विभाग: EXT 5678\n🔧 रखरखाव: EXT 1234\n🚨 आपातकाल: 1066\n\nमैं अधिक विस्तृत सहायता प्रदान करने के लिए शीघ्र ही ऑनलाइन आऊंगा।",
            ta: "நான் தற்போது ஆஃப்லைனில் உள்ளேன், ஆனால் உங்கள் கேள்வியின் அடிப்படையில் இதை பரிந்துரைக்க முடியும். உடனடி உதவிக்கு, தயவு செய்து தொடர்பு கொள்ளவும்:\n\n🏢 நீர் துறை: EXT 5678\n🔧 பராமரிப்பு: EXT 1234\n🚨 அவசர: 1066\n\nமேலும் விரிவான உதவியை வழங்க விரைவில் ஆன்லைனில் வருவேன்."
        };

        return offlineResponses[this.currentLanguage] || offlineResponses.en;
    }

    addUserMessage(message) {
        const messageObj = {
            type: 'user',
            content: message,
            timestamp: new Date(),
            language: this.currentLanguage
        };
        
        this.messages.push(messageObj);
        this.renderMessage(messageObj);
        this.saveChatHistory();
        this.scrollToBottom();
    }

    addAIMessage(message) {
        const messageObj = {
            type: 'ai',
            content: message,
            timestamp: new Date(),
            language: this.currentLanguage
        };
        
        this.messages.push(messageObj);
        this.renderMessage(messageObj);
        this.saveChatHistory();
        this.scrollToBottom();
    }

    addSystemMessage(message, type = 'info') {
        const messageObj = {
            type: 'system',
            content: message,
            timestamp: new Date(),
            messageType: type
        };
        
        this.messages.push(messageObj);
        this.renderMessage(messageObj);
        this.saveChatHistory();
        this.scrollToBottom();
    }

    renderMessage(messageObj) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        const messageElement = document.createElement('div');
        messageElement.className = `message ${messageObj.type}-message`;
        
        if (messageObj.type === 'system') {
            messageElement.innerHTML = this.createSystemMessageHTML(messageObj);
        } else {
            messageElement.innerHTML = this.createChatMessageHTML(messageObj);
        }
        
        messagesContainer.appendChild(messageElement);
    }

    createSystemMessageHTML(messageObj) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            error: '❌',
            warning: '⚠️'
        };

        return `
            <div class="system-message ${messageObj.messageType}">
                <span class="system-icon">${icons[messageObj.messageType] || 'ℹ️'}</span>
                <span>${messageObj.content}</span>
                <span class="message-time">${this.formatTime(messageObj.timestamp)}</span>
            </div>
        `;
    }

    createChatMessageHTML(messageObj) {
        const avatar = messageObj.type === 'user' ? '👤' : '🤖';
        const bubbleClass = messageObj.type === 'user' ? 'user-bubble' : 'ai-bubble';
        
        return `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-bubble ${bubbleClass}">
                    ${this.formatMessageContent(messageObj.content)}
                </div>
                <div class="message-time">${this.formatTime(messageObj.timestamp)}</div>
            </div>
        `;
    }

    formatMessageContent(content) {
        if (!content) return '';

        // Convert markdown-like syntax to HTML
        let formatted = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
            .replace(/\n/g, '<br>'); // Line breaks

        // Format lists
        formatted = formatted.replace(/(\d+\.\s.*?(?=\n|$))/g, '<li>$1</li>');
        if (formatted.includes('<li>')) {
            formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
        }

        // Format unordered lists
        formatted = formatted.replace(/(-|\*)\s(.*?)(?=\n|$)/g, '<li>$2</li>');
        if (formatted.match(/<li>.*<\/li>/s) && !formatted.includes('<ol>')) {
            formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        }

        return formatted;
    }

    formatTime(timestamp) {
        const now = new Date();
        const messageTime = new Date(timestamp);
        const diff = now - messageTime;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return this.translateTime('just_now');
        if (minutes < 60) return `${minutes}${this.translateTime('min_ago')}`;
        if (hours < 24) return `${hours}${this.translateTime('hour_ago')}`;
        if (days < 7) return `${days}${this.translateTime('day_ago')}`;
        return messageTime.toLocaleDateString();
    }

    translateTime(unit) {
        const translations = {
            en: { just_now: 'Just now', min_ago: 'm ago', hour_ago: 'h ago', day_ago: 'd ago' },
            hi: { just_now: 'अभी', min_ago: 'मि. पहले', hour_ago: 'घं. पहले', day_ago: 'दिन पहले' },
            ta: { just_now: 'இப்போது', min_ago: 'நி. முன்பு', hour_ago: 'மணி. முன்பு', day_ago: 'நாள் முன்பு' },
            te: { just_now: 'ఇప్పుడే', min_ago: 'ని. క్రితం', hour_ago: 'గం. క్రితం', day_ago: 'రోజు క్రితం' },
            kn: { just_now: 'ಇದೀಗ', min_ago: 'ನಿ. ಹಿಂದೆ', hour_ago: 'ಗಂ. ಹಿಂದೆ', day_ago: 'ದಿನ ಹಿಂದೆ' },
            ml: { just_now: 'ഇപ്പോൾ', min_ago: 'മി. മുമ്പ്', hour_ago: 'മണി. മുമ്പ്', day_ago: 'ദിവസം മുമ്പ്' }
        };
        
        const langData = translations[this.currentLanguage] || translations.en;
        return langData[unit] || unit;
    }

    getLanguageName(code) {
        const languages = {
            en: 'English',
            hi: 'Hindi',
            ta: 'Tamil',
            te: 'Telugu',
            kn: 'Kannada',
            ml: 'Malayalam'
        };
        return languages[code] || code;
    }

    showTypingIndicator() {
        this.isTyping = true;
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.style.display = 'flex';
        }
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }
    }

    saveChatHistory() {
        try {
            // Keep only last 100 messages to prevent storage issues
            const recentMessages = this.messages.slice(-100);
            localStorage.setItem('aquax_chat_history', JSON.stringify(recentMessages));
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }

    loadChatHistory() {
        try {
            const saved = localStorage.getItem('aquax_chat_history');
            if (saved) {
                this.messages = JSON.parse(saved);
                this.messages.forEach(msg => this.renderMessage(msg));
                this.scrollToBottom();
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            localStorage.removeItem('aquax_chat_history');
        }
    }

    clearChat() {
        if (confirm(this.getClearChatConfirmText())) {
            this.messages = [];
            const messagesContainer = document.getElementById('chatMessages');
            if (messagesContainer) {
                messagesContainer.innerHTML = '';
            }
            localStorage.removeItem('aquax_chat_history');
            this.addSystemMessage(this.getClearChatMessage(), 'info');
        }
    }

    getClearChatConfirmText() {
        const texts = {
            en: 'Are you sure you want to clear the chat history?',
            hi: 'क्या आप वाकई चैट इतिहास साफ करना चाहते हैं?',
            ta: 'சாட் வரலாற்றை அழிக்க விரும்புகிறீர்களா?',
            te: 'మీరు నిజంగా చాట్ చరిత్రను క్లియర్ చేయాలనుకుంటున్నారా?',
            kn: 'ಚಾಟ್ ಇತಿಹಾಸವನ್ನು ತೆರವುಗೊಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?',
            ml: 'ചാറ്റ് ചരിത്രം മായ്ച്ചുകളയാൻ നിങ്ങൾക്ക് തീർച്ചയായും താൽപ്പര്യമുണ്ടോ?'
        };
        return texts[this.currentLanguage] || texts.en;
    }

    getClearChatMessage() {
        const texts = {
            en: 'Chat history cleared',
            hi: 'चैट इतिहास साफ कर दिया गया',
            ta: 'சாட் வரலாறு அழிக்கப்பட்டது',
            te: 'చాట్ చరిత్ర క్లియర్ చేయబడింది',
            kn: 'ಚಾಟ್ ಇತಿಹಾಸವನ್ನು ತೆರವುಗೊಳಿಸಲಾಗಿದೆ',
            ml: 'ചാറ്റ് ചരിത്രം മായ്ച്ചുകളഞ്ഞു'
        };
        return texts[this.currentLanguage] || texts.en;
    }

    exportChat() {
        try {
            const chatText = this.messages.map(msg => {
                const prefix = msg.type === 'user' ? 'You' : 
                             msg.type === 'ai' ? 'AquaX AI' : 'System';
                return `[${this.formatTime(msg.timestamp)}] ${prefix}: ${msg.content.replace(/\*\*/g, '')}`;
            }).join('\n\n');
            
            const blob = new Blob([chatText], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `aquax-chat-${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.addSystemMessage('Chat exported successfully', 'success');
        } catch (error) {
            console.error('Error exporting chat:', error);
            this.addSystemMessage('Error exporting chat', 'error');
        }
    }

    toggleVoiceInput() {
        const voiceInterface = document.getElementById('voiceInterface');
        if (voiceInterface.classList.contains('hidden')) {
            this.openVoiceInterface();
        } else {
            this.closeVoiceInterface();
        }
    }

    openVoiceInterface() {
        const voiceInterface = document.getElementById('voiceInterface');
        const voiceInstruction = document.getElementById('voiceInstruction');
        const voiceTranscript = document.getElementById('voiceTranscript');
        
        voiceInterface.classList.remove('hidden');
        voiceInstruction.textContent = this.getVoiceInstructionText();
        voiceTranscript.textContent = '';

        if (window.startListening) {
            window.startListening((text) => {
                voiceTranscript.textContent = `You said: "${text}"`;
                setTimeout(() => {
                    this.closeVoiceInterface();
                    this.addUserMessage(text);
                    this.sendMessage();
                }, 1000);
            });
        } else {
            this.addSystemMessage('Voice recognition not available in your browser', 'error');
            this.closeVoiceInterface();
        }
    }

    closeVoiceInterface() {
        const voiceInterface = document.getElementById('voiceInterface');
        voiceInterface.classList.add('hidden');
    }

    getVoiceInstructionText() {
        const texts = {
            en: 'Click and speak about your water issue...',
            hi: 'क्लिक करें और अपनी जल समस्या के बारे में बोलें...',
            ta: 'கிளிக் செய்து உங்கள் நீர் சிக்கலைப் பற்றி பேசுங்கள்...',
            te: 'క్లిక్ చేసి మీ నీటి సమస్య గురించి మాట్లాడండి...',
            kn: 'ಕ್ಲಿಕ್ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ ನೀರಿನ ಸಮಸ್ಯೆಯ ಬಗ್ಗೆ ಮಾತನಾಡಿ...',
            ml: 'ക്ലിക്ക് ചെയ്ത് നിങ്ങളുടെ ജല സമസ്യയെക്കുറിച്ച് സംസാരിക്കുക...'
        };
        return texts[this.currentLanguage] || texts.en;
    }

    // Quick action handlers
    handleQuickAction(action, predefinedMessage) {
        if (predefinedMessage) {
            this.addUserMessage(predefinedMessage);
            this.sendMessage();
        } else {
            // Handle specific actions
            switch(action) {
                case 'emergency':
                    this.handleEmergencyQuery();
                    break;
                case 'water_safety':
                    this.handleWaterSafetyQuery();
                    break;
                case 'maintenance':
                    this.handleMaintenanceQuery();
                    break;
                default:
                    this.addUserMessage(action);
                    this.sendMessage();
            }
        }
    }

    handleEmergencyQuery() {
        this.addUserMessage('Water emergency help needed');
        this.showTypingIndicator();
        
        // Simulate immediate emergency response
        setTimeout(() => {
            this.hideTypingIndicator();
            this.addAIMessage(this.getEmergencyResponse());
        }, 500);
    }

    getEmergencyResponse() {
        return `🚨 **EMERGENCY WATER SITUATION**

**IMMEDIATE ACTIONS:**
1. 🆘 **Call Campus Security: 1066**
2. 💧 **Water Emergency Line: 1800-XXX-XXXX**
3. 🏥 **Medical Emergency: 108**

**For Water Contamination:**
- Stop using water immediately
- Use bottled water only
- Report to hostel warden
- Seek medical help if symptoms appear

**For Flooding/Pipe Bursts:**
- Turn off electricity if safe
- Evacuate the area immediately
- Contact maintenance: EXT 1234

**Emergency Contacts Saved:**
- Security: 1066
- Water Dept: EXT 5678
- Maintenance: EXT 1234
- Medical: 108

**Stay calm and follow instructions from authorities.**`;
    }

    handleWaterSafetyQuery() {
        this.addUserMessage('How to check water safety?');
    }

    handleMaintenanceQuery() {
        this.addUserMessage('Need water maintenance help');
    }

    // Utility methods
    attachFile() {
        this.addSystemMessage('File attachment feature coming soon', 'info');
    }

    sendLocation() {
        if (navigator.geolocation) {
            this.addSystemMessage('Getting your location...', 'info');
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const accuracy = position.coords.accuracy;
                    
                    this.addUserMessage(`My location: ${lat.toFixed(6)}, ${lng.toFixed(6)} (Accuracy: ${accuracy}m)`);
                    this.addAIMessage(`📍 I see you're at coordinates ${lat.toFixed(6)}, ${lng.toFixed(6)}. How can I help with water issues at your location? I can guide you to nearest water sources or help report location-specific issues.`);
                },
                (error) => {
                    let errorMessage = 'Could not get your location';
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location access denied. Please enable location permissions.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information unavailable.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Location request timed out.';
                            break;
                    }
                    this.addSystemMessage(errorMessage, 'error');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        } else {
            this.addSystemMessage('Geolocation is not supported by your browser', 'error');
        }
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        this.addSystemMessage(
            isDark ? 'Switched to dark theme' : 'Switched to light theme', 
            'info'
        );
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    // Initialize theme from localStorage
    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }

    // Initialize voice preference
    initVoicePreference() {
        this.voiceEnabled = localStorage.getItem('voiceEnabled') === 'true';
    }

    toggleVoicePreference() {
        this.voiceEnabled = !this.voiceEnabled;
        localStorage.setItem('voiceEnabled', this.voiceEnabled);
        this.addSystemMessage(
            this.voiceEnabled ? 'Voice responses enabled' : 'Voice responses disabled',
            'info'
        );
    }
}

// Global chat instance
let aquaXChat;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    aquaXChat = new AquaXChat();
    window.aquaXChat = aquaXChat;
    
    // Initialize theme
    aquaXChat.initTheme();
    
    // Initialize voice preference
    aquaXChat.initVoicePreference();
    
    // Auto-focus chat input
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        setTimeout(() => chatInput.focus(), 500);
    }
});

// Global functions for HTML onclick handlers
function sendMessage() {
    if (window.aquaXChat) {
        window.aquaXChat.sendMessage();
    }
}

function clearChat() {
    if (window.aquaXChat) {
        window.aquaXChat.clearChat();
    }
}

function exportChat() {
    if (window.aquaXChat) {
        window.aquaXChat.exportChat();
    }
}

function toggleTheme() {
    if (window.aquaXChat) {
        window.aquaXChat.toggleTheme();
    }
}

function attachFile() {
    if (window.aquaXChat) {
        window.aquaXChat.attachFile();
    }
}

function sendLocation() {
    if (window.aquaXChat) {
        window.aquaXChat.sendLocation();
    }
}

function toggleVoiceInput() {
    if (window.aquaXChat) {
        window.aquaXChat.toggleVoiceInput();
    }
}

function closeVoiceInterface() {
    const voiceInterface = document.getElementById('voiceInterface');
    if (voiceInterface) {
        voiceInterface.classList.add('hidden');
    }
}

function showQuickReplies() {
    const modal = document.getElementById('quickRepliesModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeQuickReplies() {
    const modal = document.getElementById('quickRepliesModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function insertQuickReply(text) {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.value = text;
        chatInput.focus();
        aquaXChat.autoResizeTextarea();
    }
    closeQuickReplies();
}

// Quick action functions (called from sidebar buttons)
function askEmergency() {
    if (window.aquaXChat) {
        window.aquaXChat.handleQuickAction('emergency');
    }
}

function askWaterSafety() {
    if (window.aquaXChat) {
        window.aquaXChat.handleQuickAction('water_safety', 'How to check if water is safe to drink?');
    }
}

function askPurification() {
    if (window.aquaXChat) {
        window.aquaXChat.handleQuickAction(null, 'What are water purification methods?');
    }
}

function askContamination() {
    if (window.aquaXChat) {
        window.aquaXChat.handleQuickAction(null, 'What are signs of water contamination?');
    }
}

function askLeakRepair() {
    if (window.aquaXChat) {
        window.aquaXChat.handleQuickAction(null, 'How to fix water leaks?');
    }
}

function askLowPressure() {
    if (window.aquaXChat) {
        window.aquaXChat.handleQuickAction(null, 'What causes low water pressure?');
    }
}

function askTankerInfo() {
    if (window.aquaXChat) {
        window.aquaXChat.handleQuickAction(null, 'What is the water tanker schedule?');
    }
}

function askConservation() {
    if (window.aquaXChat) {
        window.aquaXChat.handleQuickAction(null, 'How to conserve water in hostel?');
    }
}

function askHealthTips() {
    if (window.aquaXChat) {
        window.aquaXChat.handleQuickAction(null, 'What are water health tips?');
    }
}

function askRainwater() {
    if (window.aquaXChat) {
        window.aquaXChat.handleQuickAction(null, 'Tell me about rainwater harvesting');
    }
}

function askCampusWater() {
    if (window.aquaXChat) {
        window.aquaXChat.handleQuickAction(null, 'How does campus water system work?');
    }
}

function askContactInfo() {
    if (window.aquaXChat) {
        window.aquaXChat.handleQuickAction(null, 'What are water authority contacts?');
    }
}

function askLaundryInfo() {
    if (window.aquaXChat) {
        window.aquaXChat.handleQuickAction(null, 'How does laundry service work?');
    }
}

// Add CSS for animations
const chatStyles = `
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

.message {
    animation: slideInRight 0.3s ease;
}

.system-message {
    animation: slideInRight 0.3s ease;
}

.typing-dots span {
    animation: typing 1.4s infinite ease-in-out;
}

@keyframes typing {
    0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = chatStyles;
document.head.appendChild(styleSheet);