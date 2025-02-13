const validateEnv = () => {
    const required = ['MONGODB_URI', 'JWT_SECRET'];
    
    for (const item of required) {
        if (!process.env[item]) {
            console.error(`Environment variable ${item} is missing`);
            process.exit(1);
        }
    }

    // Validate JWT_SECRET strength
    if (process.env.JWT_SECRET.length < 32) {
        console.error('JWT_SECRET should be at least 32 characters long');
        process.exit(1);
    }
};

module.exports = validateEnv;
