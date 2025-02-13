const config = {
    API_URL: '/api',  // Use relative path for API requests
    WS_URL: window.location.protocol === 'https:' 
        ? `wss://${window.location.host}`
        : `ws://${window.location.host}`
};

export default config;
