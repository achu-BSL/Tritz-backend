const env = {
  CLIENT_URL: process.env.CLIENT_URL,
  USER_SERVICE_URL: process.env.USER_SERVICE_URL,
};

for (const key of Object.keys(env)) {
  if (!env[key]) throw new Error(`${key} env variable not initialized`);
}

module.exports = { env };
