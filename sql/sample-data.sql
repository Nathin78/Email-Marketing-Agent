USE email_agent_db;

INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@example.com', '$2a$10$eW5bK7t4u2D7zCQJk2S4L.9lV5FQ7Rc9A4G9V2GfQX9Y2wM0zV0hO', 'USER');

INSERT INTO customers (name, company, industry, email, job_title, country, interest, purchase_history) VALUES
('Ava Thompson', 'Northwind', 'Retail', 'ava@example.com', 'Marketing Lead', 'USA', 'Eco-friendly products', 'Bought 3 products last quarter'),
('Liam Chen', 'BluePeak', 'SaaS', 'liam@example.com', 'Operations Manager', 'Canada', 'Automation', 'Subscribed to premium plan');

INSERT INTO campaigns (campaign_name, product_name, goal, tone, language, created_date, user_id) VALUES
('Spring Launch', 'AI CRM Suite', 'Increase signups', 'Professional', 'English', NOW(), 1),
('Holiday Offer', 'Automation Bundle', 'Boost conversions', 'Friendly', 'English', NOW(), 1);
