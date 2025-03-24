import crypto from'crypto' // Importing crypto module
// Function to generate a security key


function generateSecurityKey() {
    return crypto.randomBytes(64).toString('hex');
}
// Exporting the function
const securityKey = generateSecurityKey();
console.log(`Generated Security Key: ${securityKey}`);