-- BikeshareApp Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS bikeshare;
USE bikeshare;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Docks table
CREATE TABLE IF NOT EXISTS docks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lng DECIMAL(11, 8) NOT NULL,
    capacity INT NOT NULL DEFAULT 10,
    status ENUM('active', 'maintenance', 'offline') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bikes table
CREATE TABLE IF NOT EXISTS bikes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dock_id INT,
    battery_level INT DEFAULT 100 CHECK (battery_level >= 0 AND battery_level <= 100),
    status ENUM('available', 'rented', 'maintenance', 'charging') DEFAULT 'available',
    charging_status ENUM('not_charging', 'charging', 'fully_charged') DEFAULT 'not_charging',
    last_maintenance DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dock_id) REFERENCES docks(id) ON DELETE SET NULL
);

-- Rentals table (for tracking bike rentals)
CREATE TABLE IF NOT EXISTS rentals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    bike_id INT NOT NULL,
    start_dock_id INT NOT NULL,
    end_dock_id INT,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    duration_minutes INT,
    cost DECIMAL(10, 2),
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE CASCADE,
    FOREIGN KEY (start_dock_id) REFERENCES docks(id) ON DELETE CASCADE,
    FOREIGN KEY (end_dock_id) REFERENCES docks(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_bikes_dock_id ON bikes(dock_id);
CREATE INDEX idx_bikes_status ON bikes(status);
CREATE INDEX idx_rentals_user_id ON rentals(user_id);
CREATE INDEX idx_rentals_bike_id ON rentals(bike_id);
CREATE INDEX idx_rentals_status ON rentals(status);

-- Insert sample data
INSERT INTO docks (name, location_lat, location_lng, capacity) VALUES
('Downtown Station', 40.7589, -73.9851, 15),
('Central Park North', 40.7969, -73.9519, 20),
('Union Square', 40.7359, -73.9911, 12),
('Brooklyn Bridge', 40.7061, -73.9969, 18);

INSERT INTO bikes (dock_id, battery_level, status) VALUES
(1, 85, 'available'),
(1, 92, 'available'),
(1, 78, 'charging'),
(2, 100, 'available'),
(2, 65, 'available'),
(2, 45, 'charging'),
(3, 88, 'available'),
(3, 95, 'available'),
(4, 72, 'available'),
(4, 100, 'available');

INSERT INTO users (email, name, phone) VALUES
('john.doe@example.com', 'John Doe', '+1234567890'),
('jane.smith@example.com', 'Jane Smith', '+0987654321'),
('mike.johnson@example.com', 'Mike Johnson', '+1122334455');