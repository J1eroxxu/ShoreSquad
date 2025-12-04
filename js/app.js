/**
 * ShoreSquad - Main Application JavaScript
 * Features:
 * - Event management and filtering
 * - Weather API integration
 * - Dynamic content loading
 * - Performance optimizations
 * - Accessibility support
 */

// ============================================
// Configuration
// ============================================
const CONFIG = {
    WEATHER_API_KEY: 'demo', // Replace with actual OpenWeatherMap API key
    CACHE_DURATION: 3600000, // 1 hour in ms
    DEBOUNCE_DELAY: 300,
    GEOLOCATION_TIMEOUT: 10000,
    NEXT_CLEANUP: {
        name: 'Pasir Ris Beach Cleanup',
        location: 'Street View Asia, Pasir Ris, Singapore',
        lat: 1.381497,
        lng: 103.955574,
        date: '2025-12-15', // Update with actual date
        mapsUrl: 'https://www.google.com/maps/place/1.381497,103.955574',
    },
};

/**
 * API DOCUMENTATION
 * ==================
 * Weather Data: National Environment Agency (NEA) API
 * Endpoint: https://api.data.gov.sg/v1/environment/4-day-weather-forecast
 * Description: Real-time 4-day weather forecast for Singapore
 * No authentication required
 * Response includes:
 *   - forecasts[]: Array of 4 daily forecasts
 *   - forecasts[].date: Date string (YYYY-MM-DD)
 *   - forecasts[].forecast: Weather condition (Sunny, Rainy, Cloudy, etc.)
 *   - forecasts[].relative_humidity: Object with .low and .high percentages
 * Rate limit: Free tier available without API key
 * Source: https://data.gov.sg/datasets/d_df7e8898dcd24abfbb762efc21f630a7/view
 */

// Mock data for events (replace with API call)
const MOCK_EVENTS = [
    {
        id: 1,
        title: 'Sunrise Beach Cleanup - Malibu',
        date: '2025-12-15',
        time: '06:00 AM',
        location: 'Malibu Beach, CA',
        crew: 24,
        icon: '🌅',
        description: 'Early morning cleanup with fresh crew energy!',
    },
    {
        id: 2,
        title: 'Santa Monica Pier Cleanup',
        date: '2025-12-16',
        time: '02:00 PM',
        location: 'Santa Monica, CA',
        crew: 18,
        icon: '🏖️',
        description: 'Weekend vibes with awesome volunteers.',
    },
    {
        id: 3,
        title: 'Venice Beach Social Cleanup',
        date: '2025-12-17',
        time: '10:00 AM',
        location: 'Venice Beach, CA',
        crew: 32,
        icon: '🎨',
        description: 'Join the crew for good cause and good times.',
    },
];

// ============================================
// Utility Functions
// ============================================

/**
 * Debounce function for performance optimization
 */
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

/**
 * Throttle function for frequent events
 */
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Fetch with timeout and error handling
 */
async function fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        console.error('Fetch error:', error);
        throw error;
    }
}

/**
 * LocalStorage wrapper with expiration
 */
const StorageManager = {
    set(key, value, duration = CONFIG.CACHE_DURATION) {
        const item = {
            value,
            expiry: Date.now() + duration,
        };
        try {
            localStorage.setItem(key, JSON.stringify(item));
        } catch (e) {
            console.warn('LocalStorage full or disabled:', e);
        }
    },

    get(key) {
        try {
            const item = JSON.parse(localStorage.getItem(key));
            if (!item) return null;
            if (Date.now() > item.expiry) {
                localStorage.removeItem(key);
                return null;
            }
            return item.value;
        } catch (e) {
            console.warn('Error reading from localStorage:', e);
            return null;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('Error removing from localStorage:', e);
        }
    },
};

// ============================================
// DOM Manipulation & Event Management
// ============================================

/**
 * Initialize navigation toggle
 */
function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', mainNav.classList.contains('active'));
        });

        // Close menu when nav link clicked
        document.querySelectorAll('.nav__link').forEach((link) => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                mainNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

/**
 * Create event card HTML
 */
function createEventCard(event) {
    const card = document.createElement('article');
    card.className = 'event-card fade-in';
    card.innerHTML = `
        <div class="event-card__image">${event.icon}</div>
        <div class="event-card__content">
            <h3 class="event-card__title">${escapeHtml(event.title)}</h3>
            <div class="event-card__meta">
                <div class="event-card__meta-item">
                    <span aria-hidden="true">📅</span>
                    <span>${event.date} @ ${event.time}</span>
                </div>
                <div class="event-card__meta-item">
                    <span aria-hidden="true">📍</span>
                    <span>${escapeHtml(event.location)}</span>
                </div>
                <div class="event-card__meta-item">
                    <span aria-hidden="true">👥</span>
                    <span>${event.crew} crew members</span>
                </div>
            </div>
            <p class="event-card__description">${escapeHtml(event.description)}</p>
            <button class="btn btn--primary btn--secondary event-card__cta" aria-label="Join ${escapeHtml(event.title)}">
                Join Event
            </button>
        </div>
    `;
    return card;
}

/**
 * Render events to DOM
 */
function renderEvents(events = MOCK_EVENTS) {
    const container = document.getElementById('eventsContainer');
    if (!container) return;

    container.innerHTML = '';
    if (events.length === 0) {
        container.innerHTML = '<p class="loading">No events found. Create one to get started!</p>';
        return;
    }

    events.forEach((event) => {
        container.appendChild(createEventCard(event));
    });

    // Add event listeners to join buttons
    document.querySelectorAll('.event-card__cta').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            showNotification('Awesome! You\'ve joined this cleanup! 🎉', 'success');
            e.target.disabled = true;
            e.target.textContent = 'Joined ✓';
        });
    });
}

/**
 * Filter events by search query
 */
function searchEvents(query) {
    const filtered = MOCK_EVENTS.filter(
        (event) =>
            event.title.toLowerCase().includes(query.toLowerCase()) ||
            event.location.toLowerCase().includes(query.toLowerCase())
    );
    renderEvents(filtered);
}

/**
 * Initialize event search
 */
function initEventSearch() {
    const searchInput = document.getElementById('searchEvents');
    if (searchInput) {
        const debouncedSearch = debounce((e) => {
            searchEvents(e.target.value);
        }, CONFIG.DEBOUNCE_DELAY);

        searchInput.addEventListener('input', debouncedSearch);
    }
}

// ============================================
// Weather Integration
// ============================================

/**
 * Weather emoji mapping for NEA conditions
 */
const WEATHER_EMOJI = {
    'Sunny': '☀️',
    'Cloudy': '☁️',
    'Rainy': '🌧️',
    'Thundery': '⛈️',
    'Partly cloudy': '⛅',
    'Partly Cloudy': '⛅',
    'Mostly Cloudy': '☁️',
    'Light Rain': '🌦️',
    'Moderate Rain': '🌧️',
    'Heavy Rain': '⛈️'
};

/**
 * Fetch 4-day weather forecast from NEA API (Singapore weather)
 */
async function fetchWeatherForecast() {
    try {
        const url = 'https://api.data.gov.sg/v1/environment/4-day-weather-forecast';
        const data = await fetchWithTimeout(url, 8000);
        return data;
    } catch (error) {
        console.error('NEA API fetch error:', error);
        throw new Error('Could not fetch weather forecast from NEA. Please try again.');
    }
}

/**
 * Parse NEA API response and format for display
 */
function parseNEAWeather(data) {
    if (!data.items || !data.items[0]) {
        throw new Error('Invalid weather data format');
    }

    const forecast = data.items[0].forecasts || [];
    const validDate = data.items[0].valid_period?.start || new Date().toISOString();

    return {
        validDate,
        forecasts: forecast,
        lastUpdated: new Date(validDate).toLocaleString('en-SG', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
    };
}

/**
 * Fetch weather data with location fallback
 */
async function fetchWeather(location) {
    try {
        // Always fetch NEA Singapore forecast
        const data = await fetchWeatherForecast();
        return parseNEAWeather(data);
    } catch (error) {
        console.error('Weather fetch error:', error);
        throw error;
    }
}

/**
 * Display weather information with 4-day forecast
 */
function displayWeather(weather) {
    const display = document.getElementById('weatherDisplay');
    if (!display) return;

    // Build forecast cards HTML
    const forecastHTML = weather.forecasts.map((day, index) => {
        const date = new Date(day.date);
        const dateStr = date.toLocaleDateString('en-SG', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
        
        const emoji = WEATHER_EMOJI[day.forecast] || '🌈';
        
        return `
            <div class="forecast-card">
                <div class="forecast-card__date">${dateStr}</div>
                <div class="forecast-card__emoji">${emoji}</div>
                <div class="forecast-card__condition">${escapeHtml(day.forecast)}</div>
                <div class="forecast-card__relative-humidity">
                    💧 ${day.relative_humidity?.low || 'N/A'}% - ${day.relative_humidity?.high || 'N/A'}%
                </div>
            </div>
        `;
    }).join('');

    display.innerHTML = `
        <div class="weather-header">
            <h3 class="weather-header__title">4-Day Forecast for Singapore Beaches</h3>
            <p class="weather-header__updated">Last updated: ${weather.lastUpdated}</p>
        </div>
        <div class="forecast-grid">
            ${forecastHTML}
        </div>
        <p class="weather-info__note">
            Data provided by National Environment Agency (NEA) via data.gov.sg
        </p>
    `;
}

/**
 * Initialize weather search
 */
function initWeatherSearch() {
    const searchBtn = document.getElementById('searchWeatherBtn');
    const weatherInput = document.getElementById('weatherLocation');

    if (searchBtn && weatherInput) {
        const handleSearch = async (e) => {
            e.preventDefault();
            
            try {
                const display = document.getElementById('weatherDisplay');
                if (display) display.innerHTML = '<p class="loading">⏳ Fetching latest weather from NEA...</p>';

                const weather = await fetchWeather('Singapore');
                displayWeather(weather);

                // Cache the weather data
                StorageManager.set('weather_forecast', weather);
                showNotification('✅ Weather forecast loaded successfully!', 'success');
            } catch (error) {
                showNotification(`❌ ${error.message}`, 'error');
                const display = document.getElementById('weatherDisplay');
                if (display) {
                    display.innerHTML = '<p class="weather-error">Unable to load weather data. Please try again or ensure the NEA API is accessible.</p>';
                }
            }
        };

        searchBtn.addEventListener('click', handleSearch);
        weatherInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch(e);
        });

        // Load cached forecast on page load
        window.addEventListener('load', () => {
            const cached = StorageManager.get('weather_forecast');
            if (cached) {
                displayWeather(cached);
            }
        });
    }
}

// ============================================
// Geolocation & User Location
// ============================================

/**
 * Get user's current location
 */
function getUserLocation() {
    if (!navigator.geolocation) {
        console.warn('Geolocation not supported');
        return Promise.reject(new Error('Geolocation not supported'));
    }

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                console.warn('Geolocation error:', error);
                reject(error);
            },
            { timeout: CONFIG.GEOLOCATION_TIMEOUT }
        );
    });
}

// ============================================
// Notifications & User Feedback
// ============================================

/**
 * Show notification toast
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    notification.textContent = message;

    // Add styles for notification
    const styles = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 16px 24px;
        background-color: ${type === 'success' ? '#2ECC71' : type === 'error' ? '#FF6B6B' : '#0088CC'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 2000;
        animation: slideInFromRight 0.3s ease-out;
        max-width: 400px;
        word-wrap: break-word;
    `;

    notification.setAttribute('style', styles);
    document.body.appendChild(notification);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ============================================
// Button Event Handlers
// ============================================

/**
 * Initialize CTA buttons
 */
function initButtons() {
    const createEventBtn = document.getElementById('createEventBtn');
    const findEventBtn = document.getElementById('findEventBtn');
    const joinBtn = document.getElementById('joinBtn');
    const getDirectionsBtn = document.getElementById('getDirectionsBtn');
    const addToCalendarBtn = document.getElementById('addToCalendarBtn');

    if (createEventBtn) {
        createEventBtn.addEventListener('click', () => {
            showNotification('Feature coming soon! Stay tuned. 🚀', 'info');
        });
    }

    if (findEventBtn) {
        findEventBtn.addEventListener('click', () => {
            document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (joinBtn) {
        joinBtn.addEventListener('click', () => {
            showNotification('Welcome to ShoreSquad! 🌊 Check your email to verify your account.', 'success');
        });
    }

    // Map section buttons
    if (getDirectionsBtn) {
        getDirectionsBtn.addEventListener('click', () => {
            window.open(CONFIG.NEXT_CLEANUP.mapsUrl, '_blank');
        });
    }

    if (addToCalendarBtn) {
        addToCalendarBtn.addEventListener('click', () => {
            addEventToCalendar();
        });
    }
}

// ============================================
// XSS Prevention
// ============================================

/**
 * Escape HTML to prevent XSS attacks
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

// ============================================
// Performance Optimizations
// ============================================

/**
 * Lazy load images
 */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        images.forEach((img) => imageObserver.observe(img));
    }
}

/**
 * Preload critical resources
 */
function preloadResources() {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://fonts.googleapis.com';
    document.head.appendChild(link);
}

// ============================================
// Accessibility Enhancements
// ============================================

/**
 * Add keyboard navigation support
 */
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Skip to main content (Ctrl+Shift+M)
        if (e.ctrlKey && e.shiftKey && e.key === 'M') {
            document.getElementById('main')?.focus();
            e.preventDefault();
        }

        // Close mobile nav on Escape
        if (e.key === 'Escape') {
            const mainNav = document.getElementById('mainNav');
            if (mainNav?.classList.contains('active')) {
                mainNav.classList.remove('active');
                document.getElementById('menuToggle')?.setAttribute('aria-expanded', 'false');
            }
        }
    });
}

// ============================================
// Calendar Integration
// ============================================

/**
 * Add cleanup event to user's calendar
 */
function addEventToCalendar() {
    const event = CONFIG.NEXT_CLEANUP;
    
    // Create iCal format for broad compatibility
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ShoreSquad//Cleanup Event//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
DTSTART:${event.date}T070000Z
DTEND:${event.date}T120000Z
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
UID:shoresquad-${Date.now()}@shoresquad.local
CREATED:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DESCRIPTION:Join ShoreSquad for a beach cleanup at ${event.location}. Coordinates: ${event.lat}, ${event.lng}
LAST-MODIFIED:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
LOCATION:${event.location}
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:${event.name}
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR`;

    // Create blob and download
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `shoresquad-cleanup-${event.date}.ics`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Calendar file downloaded! Add it to your calendar app. 📅', 'success');
}

// ============================================
// Initialization
// ============================================

/**
 * Initialize all components
 */
function initializeApp() {
    // Core functionality
    initNavigation();
    initButtons();
    renderEvents();
    initEventSearch();
    initWeatherSearch();

    // Performance
    initLazyLoading();
    preloadResources();

    // Accessibility
    initKeyboardNavigation();

    // Log successful initialization
    console.log('🌊 ShoreSquad app initialized successfully!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Handle visibility changes (pause animations/requests when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('App hidden - pausing resource-intensive tasks');
    } else {
        console.log('App visible - resuming tasks');
    }
});

// ============================================
// Service Worker Registration (PWA Support)
// ============================================

// This is handled in the HTML head, but we can add logging here
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('sw.js')
            .then((registration) => {
                console.log('✅ Service Worker registered:', registration);
            })
            .catch((error) => {
                console.log('❌ Service Worker registration failed:', error);
            });
    });
}

// Export for testing if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchWeather,
        searchEvents,
        StorageManager,
        debounce,
        escapeHtml,
    };
}
