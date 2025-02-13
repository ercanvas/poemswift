# Deployment Checklist

## Environment Variables

- [ ] MONGO_PUBLIC_URL is set correctly
- [ ] JWT_SECRET is secure
- [ ] NODE_ENV is set to 'production'
- [ ] PORT is set to 10000

## Directory Structure

- [ ] /public
  - [ ] /styles/main.css
  - [ ] /js/\*.js
  - [ ] /images/pslogo.png
- [ ] /views/\*.html
- [ ] /server
  - [ ] /config
  - [ ] /controllers
  - [ ] /models
  - [ ] /routes

## Security

- [ ] Remove any hardcoded credentials
- [ ] Enable CORS for specific origins
- [ ] Set secure headers
- [ ] Rate limiting enabled

## Database

- [ ] MongoDB connection tested
- [ ] Indexes created
- [ ] Backup configured

## Performance

- [ ] Static files compressed
- [ ] Cache headers set
- [ ] Error handling in place
