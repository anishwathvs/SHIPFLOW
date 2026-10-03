-- ==========================================================================
-- Shipment Management System — Supabase PostgreSQL Database Schema
-- ==========================================================================

-- 1. Create Shipments Table
CREATE TABLE IF NOT EXISTS shipments (
    id VARCHAR(50) PRIMARY KEY,
    sender_name VARCHAR(100) NOT NULL,
    receiver_name VARCHAR(100) NOT NULL,
    source_location VARCHAR(100) NOT NULL,
    destination_location VARCHAR(100) NOT NULL,
    package_description TEXT NOT NULL,
    weight NUMERIC(8, 2) NOT NULL CHECK (weight > 0),
    cost NUMERIC(10, 2) NOT NULL CHECK (cost >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'CREATED'
        CHECK (status IN ('CREATED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Indexes for Query Performance
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_created_at ON shipments(created_at DESC);

-- 3. Trigger Function to automatically update `updated_at` on row modifications
CREATE OR REPLACE FUNCTION update_shipments_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_shipments_timestamp ON shipments;
CREATE TRIGGER trigger_update_shipments_timestamp
    BEFORE UPDATE ON shipments
    FOR EACH ROW
    EXECUTE FUNCTION update_shipments_updated_at_column();
