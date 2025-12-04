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
};

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
 * Fetch weather data (mock implementation)
 */
async function fetchWeather(location) {
    try {
        // Mock weather data - replace with real API call
        const mockWeather = {
            location,
            temperature: Math.floor(Math.random() * 15 + 15),
            condition: ['Sunny', 'Cloudy', 'Partly Cloudy'][Math.floor(Math.random() * 3)],
            humidity: Math.floor(Math.random() * 30 + 40),
            windSpeed: Math.floor(Math.random() * 15 + 5),
            uvIndex: Math.floor(Math.random() * 8 + 3),
        };

        return mockWeather;

        // Real API call (uncomment when API key available):
        // const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${CONFIG.WEATHER_API_KEY}`;
        // const data = await fetchWithTimeout(url);
        // return {
        //     location: data.name,
        //     temperature: Math.round(data.main.temp),
        //     condition: data.weather[0].main,
        //     humidity: data.main.humidity,
        //     windSpeed: Math.round(data.wind.speed),
        //     uvIndex: 'N/A',
        // };
    } catch (error) {
        console.error('Weather fetch error:', error);
        throw new Error('Could not fetch weather data');
    }
}

/**
 * Display weather information
 */
function displayWeather(weather) {
    const display = document.getElementById('weatherDisplay');
    if (!display) return;

    display.innerHTML = `
        <div class="weather-info">
            <div class="weather-item">
                <div class="weather-item__label">Temperature</div>
                <div class="weather-item__value">${weather.temperature}°C</div>
            </div>
            <div class="weather-item">
                <div class="weather-item__label">Condition</div>
                <div class="weather-item__value">${escapeHtml(weather.condition)}</div>
            </div>
            <div class="weather-item">
                <div class="weather-item__label">Humidity</div>
                <div class="weather-item__value">${weather.humidity}%</div>
            </div>
            <div class="weather-item">
                <div class="weather-item__label">Wind Speed</div>
                <div class="weather-item__value">${weather.windSpeed} km/h</div>
            </div>
        </div>
        <p style="margin-top: 16px; text-align: center; color: #7F8C8D; font-size: 14px;">
            Weather for <strong>${escapeHtml(weather.location)}</strong>
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
            const location = weatherInput.value.trim();
            if (!location) {
                showNotification('Please enter a location', 'error');
                return;
            }

            try {
                const display = document.getElementById('weatherDisplay');
                if (display) display.innerHTML = '<p class="loading">Loading weather...</p>';

                const weather = await fetchWeather(location);
                displayWeather(weather);

                // Cache the weather data
                StorageManager.set(`weather_${location}`, weather);
            } catch (error) {
                showNotification(`Error: ${error.message}`, 'error');
            }
        };

        searchBtn.addEventListener('click', handleSearch);
        weatherInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch(e);
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
