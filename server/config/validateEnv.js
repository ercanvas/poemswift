const validateEnv = () => {
    const required = [
        'MONGO_URL',
        'MONGOUSER',
        'MONGOPASSWORD',
        'MONGOHOST',
        'MONGOPORT',
        'JWT_SECRET'
    ];
    
    for (const item of required) {
        if (!process.env[item]) {
            console.error(`Environment variable ${item} is missing`);
            process.exit(1);
        }
    }
};

module.exports = validateEnv;
