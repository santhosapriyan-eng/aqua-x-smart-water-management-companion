// Advanced Voice Recognition and Text-to-Speech System
class VoiceAssistant {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.isSpeaking = false;
        this.commands = this.initializeCommands();
        this.currentLanguage = localStorage.getItem('ax_lang') || 'en-US';
    }

    initializeCommands() {
        return {
            'report': {
                patterns: ['report', 'issue', 'problem', 'complaint'],
                action: () => window.location.href = 'citizen.html',
                response: 'Opening issue reporting page'
            },
            'map': {
                patterns: ['map', 'location', 'where', 'nearby'],
                action: () => window.location.href = 'map.html',
                response: 'Opening water map'
            },
            'emergency': {
                patterns: ['emergency', 'sos', 'help', 'urgent'],
                action: () => window.location.href = 'citizen.html#sos',
                response: 'Emergency mode activated'
            },
            'assistant': {
                patterns: ['assistant', 'help', 'chat', 'ai'],
                action: () => window.location.href = 'chat.html',
                response: 'Opening AI assistant'
            },
            'laundry': {
                patterns: ['laundry', 'clothes', 'washing'],
                action: () => window.location.href = 'laundry.html',
                response: 'Opening laundry services'
            },
            'status': {
                patterns: ['status', 'water status', 'quality'],
                action: () => this.getWaterStatus(),
                response: 'Checking water status'
            },
            'education': {
                patterns: ['learn', 'education', 'safety', 'tips'],
                action: () => window.location.href = 'education.html',
                response: 'Opening educational resources'
            }
        };
    }

    init() {
        this.setupSpeechRecognition();
        this.setupEventListeners();
        this.updateVoiceBasedOnLanguage();
    }

    setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.warn('Speech recognition not supported in this browser');
            this.showFallbackMessage();
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateListeningUI(true);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateListeningUI(false);
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            this.processVoiceCommand(transcript);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.handleRecognitionError(event.error);
        };
    }

    setupEventListeners() {
        // Voice control button
        document.addEventListener('click', (e) => {
            if (e.target.closest('#voiceControl') || e.target.closest('#startVoice')) {
                this.toggleListening();
            }
        });

        // Keyboard shortcut (Ctrl+Space)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.code === 'Space') {
                e.preventDefault();
                this.toggleListening();
            }
        });

        // Language change listener
        document.addEventListener('languageChange', (e) => {
            this.currentLanguage = e.detail.language;
            this.updateVoiceBasedOnLanguage();
        });
    }

    toggleListening() {
        if (!this.recognition) {
            this.showNotSupportedMessage();
            return;
        }

        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        if (this.recognition && !this.isListening) {
            this.recognition.lang = this.getLanguageCode();
            this.recognition.start();
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    processVoiceCommand(transcript) {
        console.log('Voice command:', transcript);
        
        // Show command feedback
        this.showCommandFeedback(transcript);

        // Find matching command
        const matchedCommand = this.findMatchingCommand(transcript);
        
        if (matchedCommand) {
            this.speak(matchedCommand.response);
            setTimeout(() => {
                matchedCommand.action();
            }, 1000);
        } else {
            this.speak("I didn't understand that command. Try saying 'report issue', 'check water status', or 'emergency help'.");
        }
    }

    findMatchingCommand(transcript) {
        for (const [key, command] of Object.entries(this.commands)) {
            for (const pattern of command.patterns) {
                if (transcript.includes(pattern)) {
                    return command;
                }
            }
        }
        return null;
    }

    speak(text, rate = 1.0, pitch = 1.0) {
        if (!this.synthesis) {
            console.warn('Speech synthesis not supported');
            return;
        }

        // Cancel any ongoing speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.getLanguageCode();
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = 0.8;

        utterance.onstart = () => {
            this.isSpeaking = true;
            this.updateSpeakingUI(true);
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            this.updateSpeakingUI(false);
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            this.isSpeaking = false;
            this.updateSpeakingUI(false);
        };

        this.synthesis.speak(utterance);
    }

    getWaterStatus() {
        // Simulate API call to get water status
        const status = {
            quality: 'Excellent',
            pressure: 'Normal',
            lastTest: '2 hours ago',
            issues: 'None reported'
        };

        const message = `Water status: Quality is ${status.quality}, pressure is ${status.pressure}. Last test was ${status.lastTest}. No current issues reported.`;
        this.speak(message);
        return message;
    }

    updateListeningUI(listening) {
        const voiceButton = document.getElementById('voiceControl');
        const voiceStatus = document.querySelector('.voice-status');
        
        if (voiceButton) {
            voiceButton.textContent = listening ? '🔴' : '🎤';
            voiceButton.style.background = listening ? 'var(--danger)' : '';
        }

        if (voiceStatus) {
            const pulseRing = voiceStatus.querySelector('.pulse-ring');
            if (pulseRing) {
                pulseRing.style.animation = listening ? 'pulse-ring 1.5s ease-out infinite' : 'none';
            }
        }
    }

    updateSpeakingUI(speaking) {
        // Could add visual feedback for speaking state
    }

    showCommandFeedback(transcript) {
        // Create or update command feedback element
        let feedbackEl = document.getElementById('voiceCommandFeedback');
        if (!feedbackEl) {
            feedbackEl = document.createElement('div');
            feedbackEl.id = 'voiceCommandFeedback';
            feedbackEl.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--glass-bg);
                backdrop-filter: blur(20px);
                padding: 1rem 2rem;
                border-radius: var(--radius-lg);
                border: 1px solid var(--glass-border);
                z-index: 10001;
                text-align: center;
                box-shadow: var(--glass-shadow);
            `;
            document.body.appendChild(feedbackEl);
        }

        feedbackEl.innerHTML = `
            <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">🎤</div>
            <div style="font-weight: 500;">"${transcript}"</div>
        `;

        // Remove after 2 seconds
        setTimeout(() => {
            if (feedbackEl.parentNode) {
                feedbackEl.parentNode.removeChild(feedbackEl);
            }
        }, 2000);
    }

    getLanguageCode() {
        const langMap = {
            'en': 'en-US',
            'hi': 'hi-IN',
            'ta': 'ta-IN',
            'te': 'te-IN',
            'kn': 'kn-IN',
            'ml': 'ml-IN'
        };
        return langMap[this.currentLanguage] || 'en-US';
    }

    updateVoiceBasedOnLanguage() {
        // Update voice parameters based on language
        const voices = this.synthesis.getVoices();
        const preferredVoices = {
            'en-US': 'Google US English',
            'hi-IN': 'Google हिन्दी',
            'ta-IN': 'Google தமிழ்',
            'te-IN': 'Google తెలుగు',
            'kn-IN': 'Google ಕನ್ನಡ',
            'ml-IN': 'Google മലയാളം'
        };

        // Note: Voice selection would happen in the speak method
        // This is a simplified implementation
    }

    handleRecognitionError(error) {
        let message = 'Voice recognition error. ';
        
        switch (error) {
            case 'not-allowed':
                message += 'Microphone access denied. Please allow microphone permissions.';
                break;
            case 'audio-capture':
                message += 'No microphone found. Please check your audio device.';
                break;
            case 'network':
                message += 'Network error occurred. Please check your connection.';
                break;
            default:
                message += 'Please try again.';
        }
        
        this.showError(message);
    }

    showError(message) {
        alert(`Voice Assistant: ${message}`);
    }

    showNotSupportedMessage() {
        this.showError('Voice recognition is not supported in your browser. Try using Chrome or Edge.');
    }

    showFallbackMessage() {
        console.log('Voice recognition not available. Using fallback methods.');
    }

    // Public methods
    start() {
        this.init();
    }

    stop() {
        this.stopListening();
        this.synthesis.cancel();
    }
}

// Initialize voice assistant when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const voiceAssistant = new VoiceAssistant();
    voiceAssistant.start();
    
    // Make globally available
    window.VoiceAssistant = voiceAssistant;
    window.startListening = (callback) => {
        voiceAssistant.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            callback(transcript);
        };
        voiceAssistant.startListening();
    };
    window.speak = (text) => voiceAssistant.speak(text);
});

// Add styles for voice interface
const voiceStyles = `
.voice-listening {
    animation: pulse 1.5s infinite;
}

@keyframes voice-pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

.voice-command-feedback {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--success);
    color: white;
    padding: 10px 15px;
    border-radius: var(--radius-md);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
}

@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
`;

// Inject styles
const voiceStyleSheet = document.createElement('style');
voiceStyleSheet.textContent = voiceStyles;
document.head.appendChild(voiceStyleSheet);