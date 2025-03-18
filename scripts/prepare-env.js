/**
 * Environment Preparation Script for NSAI Tasker Frontend
 * 
 * This script sets up the correct environment configuration based on the deployment target.
 * Usage: node prepare-env.js [environment]
 * where environment is one of: dev, staging, prod
 */

const fs = require('fs');
const path = require('path');

// Get the environment from command line arguments
const environment = process.argv[2];

if (!environment || !['dev', 'staging', 'prod'].includes(environment)) {
  console.error('Error: Please specify a valid environment (dev, staging, or prod)');
  process.exit(1);
}

console.log(`Preparing environment configuration for: ${environment}`);

// Path to environment config files
const configDir = path.join(__dirname, '../config');
const envConfigPath = path.join(configDir, `${environment}.json`);
const targetConfigPath = path.join(configDir, 'current.json');

// Ensure config directory exists
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
  console.log('Created config directory');
}

// Check if environment config exists
if (!fs.existsSync(envConfigPath)) {
  console.error(`Error: Configuration file for ${environment} environment not found at ${envConfigPath}`);
  console.log('Creating a default configuration file...');
  
  // Create default config for the environment
  const defaultConfig = {
    apiBaseUrl: environment === 'prod' 
      ? 'https://api.nsai-tasker.com' 
      : `https://api-${environment}.nsai-tasker.com`,
    sentryDsn: process.env.SENTRY_DSN || '',
    sentryEnvironment: environment,
    features: {
      analytics: environment === 'prod',
      feedback: true,
      experimentalFeatures: environment !== 'prod'
    }
  };
  
  fs.writeFileSync(envConfigPath, JSON.stringify(defaultConfig, null, 2));
  console.log(`Created default configuration for ${environment} environment.`);
}

// Copy environment config to current.json
try {
  const configContent = fs.readFileSync(envConfigPath, 'utf8');
  const config = JSON.parse(configContent);
  
  // Allow overriding config values from environment variables
  if (process.env.API_BASE_URL) {
    config.apiBaseUrl = process.env.API_BASE_URL;
  }
  
  // Apply any CI/CD pipeline specific overrides
  if (process.env.CI === 'true') {
    console.log('Running in CI environment, applying CI-specific configuration');
    // Add any CI-specific configuration here
  }
  
  fs.writeFileSync(targetConfigPath, JSON.stringify(config, null, 2));
  console.log(`Successfully configured application for ${environment} environment`);
} catch (error) {
  console.error('Error preparing environment configuration:', error);
  process.exit(1);
}

