CREATE DATABASE IF NOT EXISTS email_agent_db;
USE email_agent_db;

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL
);

CREATE TABLE customers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  industry VARCHAR(255),
  email VARCHAR(255) NOT NULL UNIQUE,
  job_title VARCHAR(255),
  country VARCHAR(255),
  interest VARCHAR(255),
  purchase_history TEXT
);

CREATE TABLE campaigns (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  campaign_name VARCHAR(255) NOT NULL,
  product_name VARCHAR(255),
  goal VARCHAR(255),
  tone VARCHAR(255),
  language VARCHAR(255),
  created_date DATETIME NOT NULL,
  user_id BIGINT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE generated_emails (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  subject VARCHAR(255) NOT NULL,
  preview VARCHAR(255),
  body TEXT,
  cta VARCHAR(255),
  customer_id BIGINT,
  campaign_id BIGINT,
  score INT,
  spam_score DOUBLE,
  readability VARCHAR(255),
  tips TEXT,
  generated_at DATETIME NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);

CREATE TABLE login_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  login_time DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
