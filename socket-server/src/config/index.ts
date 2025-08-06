export const config = {
  // Port du serveur Socket.io
  PORT: process.env.PORT || 4000,

  // URL de l'API Symfony
  SYMFONY_API_URL: process.env.SYMFONY_API_URL || "http://localhost:8000/api",

  // Secret JWT (doit être le même que Symfony)
  JWT_SECRET: process.env.JWT_SECRET || "ChangeMeInEnv",

  // CORS origins autorisés
  CORS_ORIGINS: process.env.CORS_ORIGINS?.split(",") || [
    "http://localhost:3000",
  ],

  // Debug mode
  DEBUG: process.env.NODE_ENV !== "production",
};
