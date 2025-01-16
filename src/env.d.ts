declare namespace NodeJS {
    interface configType {
      connection: string; // Your database connection string
      JWT_PASSWORD: string; // Your JWT secret
    }
  }
  