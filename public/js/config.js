// public/js/config.js
export const Config = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
    TEST_MODE: import.meta.env.VITE_TEST_MODE === 'true',
};