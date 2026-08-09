-- Carelink Medical Transportation LLC
-- Database Schema for Dispatch, Fleet & Patient Rides

CREATE TABLE IF NOT EXISTS vehicle_fleet (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    capacity VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    wheelchair_lift_certified BOOLEAN DEFAULT TRUE,
    last_inspection_date DATE
);

CREATE TABLE IF NOT EXISTS ride_bookings (
    id VARCHAR(50) PRIMARY KEY,
    passenger_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(100),
    pickup_address TEXT NOT NULL,
    destination_address TEXT NOT NULL,
    ride_date DATE NOT NULL,
    ride_time VARCHAR(20) NOT NULL,
    service_type VARCHAR(50) NOT NULL,
    wheelchair_needed BOOLEAN DEFAULT FALSE,
    oxygen_needed BOOLEAN DEFAULT FALSE,
    status VARCHAR(30) DEFAULT 'PENDING_DISPATCH',
    estimated_cost DECIMAL(10,2),
    payment_method VARCHAR(50),
    bambi_dispatch_ref VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS service_rates (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    base_rate DECIMAL(10,2) NOT NULL,
    mileage_rate DECIMAL(10,2) NOT NULL,
    description TEXT
);
