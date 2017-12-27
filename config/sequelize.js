module.exports = {
  "development": {
  "username": "ubuntu",
  "password": "password",
  "database": "project_mimirs_market_development",
  "host": "127.0.0.1",
  "dialect": "postgresql"
  },
  "test": {
    "username": "ubuntu",
    "password": "password",
    "database": "project_mimirs_market_test",
    "host": "127.0.0.1",
    "dialect": "postgresql"
  },
  "production": {
    "use_env_variable": "POSTGRES_URL",
    "dialect": "postgres"
  }
};