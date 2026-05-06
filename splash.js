// Enhanced splash screen with animations and loading states
class SplashScreen {
    constructor() {
        this.splash = document.querySelector('.splash');
        this.main = document.querySelector('.main');
        this.loadingSteps = [
            'Initializing AquaX Platform...',
            'Loading Water Management Systems...',
            'Connecting to Google Cloud...',
            'Starting AI Assistant...',
            'Ready to Serve!'
        ];
        this.currentStep = 0;
    }

    init() {
        if (!this.splash) return;

        // Create loading progress element
        this.createLoadingProgress();
        
        // Start loading sequence
        this.startLoadingSequence();
        
        // Auto transition after 3 seconds or when fully loaded
        setTimeout(() => {
            this.transitionToMain();
        }, 3000);
    }

    createLoadingProgress() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'loading-progress';
        progressContainer.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="loading-text">${this.loadingSteps[0]}</div>
        `;
        
        this.splash.querySelector('.splash-inner').appendChild(progressContainer);
        this.progressFill = progressContainer.querySelector('.progress-fill');
        this.loadingText = progressContainer.querySelector('.loading-text');
    }

    startLoadingSequence() {
        const totalSteps = this.loadingSteps.length;
        const interval = setInterval(() => {
            if (this.currentStep < totalSteps) {
                this.updateProgress((this.currentStep + 1) / totalSteps * 100);
                this.loadingText.textContent = this.loadingSteps[this.currentStep];
                this.currentStep++;
            } else {
                clearInterval(interval);
            }
        }, 500);
    }

    updateProgress(percentage) {
        if (this.progressFill) {
            this.progressFill.style.width = `${percentage}%`;
        }
    }

    transitionToMain() {
        if (!this.splash || !this.main) return;

        // Add fade-out class to splash
        this.splash.classList.add('fade-out');
        
        // Show main content after animation
        setTimeout(() => {
            this.splash.style.display = 'none';
            this.main.classList.remove('hidden');
            
            // Initialize main page components
            this.initializeMainPage();
        }, 800);
    }

    initializeMainPage() {
        // Add any main page initialization logic here
        console.log('AquaX platform initialized successfully!');
        
        // Initialize real-time stats
        this.initializeStats();
    }

    initializeStats() {
        // Animate stat numbers
        const stats = [
            { element: 'activeUsers', target: 1247 },
            { element: 'issuesResolved', target: 892 },
            { element: 'waterSaved', target: 15200 }
        ];

        stats.forEach(stat => {
            this.animateValue(stat.element, 0, stat.target, 2000);
        });
    }

    animateValue(id, start, end, duration) {
        const element = document.getElementById(id);
        if (!element) return;

        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            
            // Format number with commas
            element.textContent = value.toLocaleString();
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
}

// Add CSS for loading progress
const splashStyles = `
.loading-progress {
    margin: 2rem 0;
    text-align: center;
}

.progress-bar {
    width: 200px;
    height: 4px;
    background: rgba(255,255,255,0.2);
    border-radius: 2px;
    margin: 0 auto 1rem;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-light), var(--accent-teal));
    border-radius: 2px;
    width: 0%;
    transition: width 0.5s ease;
}

.loading-text {
    font-size: 0.9rem;
    color: var(--text-muted);
    min-height: 1.2em;
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = splashStyles;
document.head.appendChild(styleSheet);

// Initialize splash screen when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const splash = new SplashScreen();
    splash.init();
});

// Export for use in other modules
window.SplashScreen = SplashScreen;