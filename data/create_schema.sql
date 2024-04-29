CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(24) NOT NULL UNIQUE, 
  first_name VARCHAR(64) NOT NULL, 
  last_name VARCHAR(64) NOT NULL, 
  email TEXT NOT NULL UNIQUE, 
  password TEXT NOT NULL
);