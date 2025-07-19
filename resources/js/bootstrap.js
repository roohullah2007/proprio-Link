import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Make route function available globally if it exists
if (typeof window.route !== 'undefined') {
    window.route = window.route;
} else {
    // Fallback route function
    window.route = (name, params = {}) => {
        console.warn(`Route function not available. Attempted to call route: ${name}`);
        return '#';
    };
}
