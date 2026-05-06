// Comprehensive Multi-language Support System
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('ax_lang') || 'en';
        this.translations = this.loadTranslations();
        this.rtlLanguages = ['ar', 'he', 'fa']; // Right-to-left languages
    }

    loadTranslations() {
        return {
            en: {
                // Navigation
                'nav.citizen': 'Citizen',
                'nav.map': 'Live Map',
                'nav.chat': 'AI Assistant',
                'nav.authority': 'Authorities',
                'nav.laundry': 'Laundry',
                'nav.leaderboard': 'Leaderboard',
                
                // Common
                'common.welcome': 'Welcome to AquaX',
                'common.loading': 'Loading...',
                'common.error': 'Error',
                'common.success': 'Success',
                'common.submit': 'Submit',
                'common.cancel': 'Cancel',
                'common.save': 'Save',
                
                // Home Page
                'home.heroTitle': 'Smart Water Management Platform',
                'home.heroSubtitle': 'Revolutionizing campus water management through AI-powered technology',
                'home.reportIssue': 'Report Issue',
                'home.liveMap': 'Live Water Map',
                'home.aiAssistant': 'AI Assistant',
                'home.waterSafety': 'Water Safety',
                'home.laundryStatus': 'Laundry Status',
                'home.smsAccess': 'SMS/IVR Access',
                
                // Citizen Page
                'citizen.reportTitle': 'Report Water Issue',
                'citizen.issueType': 'Issue Type',
                'citizen.leak': 'Water Leak',
                'citizen.contamination': 'Contamination',
                'citizen.lowPressure': 'Low Pressure',
                'citizen.noWater': 'No Water',
                'citizen.severity': 'Severity',
                'citizen.minor': 'Minor',
                'citizen.moderate': 'Moderate',
                'citizen.severe': 'Severe',
                'citizen.notes': 'Additional Notes',
                'citizen.autoLocation': 'Auto-location',
                'citizen.submitReport': 'Submit Report',
                'citizen.shareAlert': 'Share Alert',
                'citizen.sosButton': '🚨 EMERGENCY SOS',
                'citizen.alerts': 'Real-time Alerts',
                'citizen.quickActions': 'Quick Actions',
                'citizen.boilWater': 'Boil Water Guide',
                'citizen.chlorination': 'Chlorination Guide',
                'citizen.safetyQuiz': 'Safety Quiz',
                'citizen.safetyVideos': 'Safety Videos',
                
                // Emergency
                'emergency.sosTitle': 'EMERGENCY SOS',
                'emergency.sosMessage': 'Immediate assistance required!',
                'emergency.sendSOS': 'Send SOS to Authorities',
                'emergency.cancel': 'Cancel',
                'emergency.helpText': 'Help is on the way! Stay calm.',
                
                // Map
                'map.title': 'Live Water Map',
                'map.filters': 'Filters',
                'map.leaks': 'Leaks',
                'map.contamination': 'Contamination',
                'map.lowPressure': 'Low Pressure',
                'map.tanker': 'Tanker',
                'map.centerOnMe': 'Center on Me',
                'map.reportHere': 'Report Issue Here',
                
                // Chat
                'chat.title': 'AI Assistant',
                'chat.placeholder': 'Ask about water safety, report issues, or get help...',
                'chat.send': 'Send',
                'chat.voice': 'Voice',
                'chat.typing': 'AI is typing...',
                
                // Laundry
                'laundry.title': 'Laundry