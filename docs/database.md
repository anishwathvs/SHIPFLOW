# Supabase PostgreSQL Database Specification

This document details the database architecture, schema definitions, constraints, performance indexes, automated timestamp triggers, and configuration instructions for the **Shipment Management System** on Supabase PostgreSQL.

---

## 1. Database Architecture Overview

The system uses **Supabase PostgreSQL** as its relational persistence engine. Connectivity is established using standard **JDBC over TLS/SSL** (`sslmode=require`), ensuring encrypted, secure communication between the Java backend and the cloud database.

```
┌────────────────────────────────────────────────────────┐
│                      Java Backend                      │
│   (DatabaseConnection -> ShipmentDao PreparedStatements)│
└───────────────────────────┬────────────────────────────┘
                            │ TLS 1.3 / SSL Mode Require
                            ▼
┌────────────────────────────────────────────────────────┐
│                  Supabase PostgreSQL                   │
│   - Database: postgres                                 │
│   - Port: 5432 / 6543 (Pooler / Direct)                │
│   - Schema: public                                     │
│   - Table: shipments                                   │
└────────────────────────────────────────────────────────┘
```

---

## 2. Table Schema Definition (`shipments`)

The complete schema is located in `database/schema.sql`:

```sql
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
```

---

## 3. Columns & Constraints Specification

| Column | Data Type | Nullable | Default | Constraints & Description |
|---|---|---|---|---|
| `id` | `VARCHAR(50)` | `NOT NULL` | — | **Primary Key**. Unique shipment tracking identifier (e.g., `SH101`). |
| `sender_name` | `VARCHAR(100)` | `NOT NULL` | — | Name of the consignor / sender. Max 100 characters. |
| `receiver_name` | `VARCHAR(100)` | `NOT NULL` | — | Name of the consignee / receiver. Max 100 characters. |
| `source_location` | `VARCHAR(100)` | `NOT NULL` | — | Origin hub / city (e.g., `Chennai`). |
| `destination_location` | `VARCHAR(100)` | `NOT NULL` | — | Destination hub / city (e.g., `Bengaluru`). |
| `package_description` | `TEXT` | `NOT NULL` | — | Detailed summary of contents. |
| `weight` | `NUMERIC(8, 2)` | `NOT NULL` | — | Package weight in kg. **`CHECK (weight > 0)`**. |
| `cost` | `NUMERIC(10, 2)` | `NOT NULL` | — | Calculated freight charge in INR. **`CHECK (cost >= 0)`**. |
| `status` | `VARCHAR(20)` | `NOT NULL` | `'CREATED'` | Lifecycle stage. **`CHECK (status IN ('CREATED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'))`**. |
| `created_at` | `TIMESTAMPTZ` | `NULL` | `NOW()` | Timestamp when shipment was first registered. |
| `updated_at` | `TIMESTAMPTZ` | `NULL` | `NOW()` | Timestamp when shipment was last modified (maintained via SQL trigger). |

---

## 4. Performance Indexes

1. **`idx_shipments_status`**: B-Tree index on `status` to accelerate filtering by state (e.g., querying all `IN_TRANSIT` shipments).
2. **`idx_shipments_created_at`**: Descending B-Tree index on `created_at DESC` to optimize the default manifest view (`ORDER BY created_at DESC`).

---

## 5. Automated PostgreSQL Triggers

To guarantee that `updated_at` reflects every SQL modification without relying purely on application-level logic:
- The PL/pgSQL function `update_shipments_updated_at_column()` sets `NEW.updated_at = NOW();`
- Trigger `trigger_update_shipments_timestamp` executes `BEFORE UPDATE ON shipments FOR EACH ROW`.

---

## 6. Supabase Setup & Deployment Guide

To configure a new Supabase instance for this project:

1. **Create a Supabase Project**:
   - Go to [database.new](https://database.new) or sign in to [supabase.com](https://supabase.com).
   - Create a new project named `shipment-management`.
   - Set a strong database password and select your preferred region.

2. **Deploy Schema**:
   - Navigate to the **SQL Editor** in your Supabase dashboard.
   - Copy the contents of `database/schema.sql` and click **Run**.
   - Alternatively, let the Java backend auto-migrate using `DatabaseConnection.executeSchema("database/schema.sql")`.

3. **Obtain Connection Details**:
   - Navigate to **Project Settings > Database > Connection Parameters**.
   - Use the **Transaction Pooler** (Port `6543`) or **Session / Direct Connection** (Port `5432`).
   - Format: `jdbc:postgresql://<host>:<port>/postgres`

4. **Set Environment Variables**:
   - Create `.env` in the root of the project:
     ```env
     SUPABASE_DB_URL=jdbc:postgresql://<host>:<port>/postgres
     SUPABASE_DB_USER=postgres.<project-ref>
     SUPABASE_DB_PASSWORD=<your-database-password>
     ```
