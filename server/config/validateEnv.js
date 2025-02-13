const validateEnv = () => {
    const required = ['JWT_SECRET', 'MONGO_PUBLIC_URL'];
    
    for (const item of required) {
        if (!process.env[item]) {
            console.error(`Environment variable ${item} is missing`);
            process.exit(1);
        }
    }
};

module.exports = validateEnv;
