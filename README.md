# Shipment Management System (SHIPFLOW)

A robust, full-stack logistics and shipment management platform built with **Java 21**, **Maven**, **PostgreSQL JDBC**, **Supabase PostgreSQL Cloud Database**, and a layered **REST API**.

---

## 1. Project Overview

The **Shipment Management System** provides end-to-end logistics tracking, automated tiered shipping tariff calculations, status lifecycle enforcement, and persistent cloud storage. The application is designed to demonstrate clean architectural separation across Controller, Service, DAO, and Database tiers, complete with automated unit and integration tests.

---

## 2. Main Features

- **Package Registration & Manifest Creation**: Create new shipments with tracking ID, consignor, consignee, route, contents, and weight.
- **Automated Tiered Tariff Calculation**: Dynamic 4-tier cost engine based on package weight.
- **Shipment Tracking & Search**: Search shipments by ID or view all records ordered by creation date.
- **Lifecycle Status Management**: Track progression through `CREATED` → `IN_TRANSIT` → `DELIVERED`, with state-machine safeguards preventing modifications to terminal states.
- **Supabase Cloud Persistence**: Relational storage in PostgreSQL with check constraints, indexing, and automated `updated_at` triggers.
- **RESTful API**: Standardized JSON endpoints with CORS support and structured error responses.
- **Interactive Console Mode**: Standalone console interface preserved for viva/demonstration purposes.

---

## 3. Technology Stack

- **Backend Runtime**: Java 21 (LTS)
- **Build & Dependency Management**: Apache Maven 3.8+
- **HTTP Server**: `com.sun.net.httpserver` (Lightweight, zero-dependency REST HTTP engine)
- **JSON Serialization**: Google Gson 2.11.0
- **Database Driver**: PostgreSQL JDBC 42.7.3 (SSL Mode Enforced)
- **Cloud Database**: Supabase PostgreSQL 15+
- **Testing**: JUnit 5 Jupiter 5.10.2 (Parameterized & Integration Tests)
- **Frontend**: React 18, Vite, Three.js, React Three Fiber (Currently Frozen)

---

## 4. System Architecture

The application implements a multi-tier layered architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                 Frontend Layer (Frozen)                     │
│   React 18 + Three.js 3D Logistics Command Center           │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON (REST API)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Controller Layer                         │
│   ShipmentController (com.sun.net.httpserver + Gson)        │
│   - CORS Preflight & Request Routing                        │
│   - JSON Payload Parsing & HTTP Status Code Mapping         │
│   - Exception Sanitization (No Stack Trace Leakage)         │
└──────────────────────────────┬──────────────────────────────┘
                               │ Domain DTOs / Method Parameters
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                           │
│   ShipmentService & CostCalculator                          │
│   - Business Validation (String lengths, positive weights)  │
│   - Duplicate ID Conflict Guard                             │
│   - Authoritative Tiered Freight Tariff Computation         │
│   - Terminal Status Transition Safeguards                   │
└──────────────────────────────┬──────────────────────────────┘
                               │ Strongly-typed Shipment Entity
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Data Access Layer (DAO)                     │
│   ShipmentDao & DatabaseConnection                          │
│   - Parameterized SQL PreparedStatements                    │
│   - Explicit Column Projection                              │
│   - SSL Mode Requirement & Connection Timeout               │
│   - ResultSet Mapping to Domain Objects                     │
└──────────────────────────────┬──────────────────────────────┘
                               │ TLS 1.3 / JDBC Port 5432
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Database Layer (Supabase)                   │
│   PostgreSQL 15+ (`shipments` table)                        │
│   - Primary Key & Check Constraints                         │
│   - Indexes on status and created_at DESC                   │
│   - Automated PL/pgSQL updated_at Trigger                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Database Architecture & Schema

The PostgreSQL schema (`database/schema.sql`) enforces relational integrity:

```sql
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

CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_created_at ON shipments(created_at DESC);
```

---

## 6. Java OOP Concepts Demonstrated

- **Encapsulation**: Private attributes with public getters/setters in [Shipment.java](file:///Users/reethika/Desktop/shipment/src/Shipment.java).
- **Enums**: Strongly-typed lifecycle stages in [ShipmentStatus.java](file:///Users/reethika/Desktop/shipment/src/ShipmentStatus.java).
- **Single Responsibility Principle (SRP)**: Pricing logic isolated within [CostCalculator.java](file:///Users/reethika/Desktop/shipment/src/CostCalculator.java).
- **Data Access Object (DAO) Pattern**: SQL persistence decoupled in [ShipmentDao.java](file:///Users/reethika/Desktop/shipment/src/dao/ShipmentDao.java).
- **Dependency Injection**: Services and DAOs passed via constructors.
- **Defensive Programming**: Try-with-resources closing JDBC resources; input validation prior to SQL execution.

---

## 7. Cost Calculation Rules

The tariff calculation is defined as:

$$\text{Tariff}(w) = \begin{cases} 
\text{Invalid} & \text{if } w \le 0 \\
\text{₹}50.00 & \text{if } 0 < w \le 1 \\
\text{₹}50.00 + (w - 1) \times 20.00 & \text{if } 1 < w \le 5 \\
\text{₹}130.00 + (w - 5) \times 15.00 & \text{if } 5 < w \le 10 \\
\text{₹}205.00 + (w - 10) \times 10.00 & \text{if } w > 10
\end{cases}$$

### Benchmark Tariff Table

| Weight (kg) | Formula | Cost (INR) |
|---|---|---|
| `0.5 kg` | Base slab | **₹50.00** |
| `1.0 kg` | Base slab | **₹50.00** |
| `3.0 kg` | ₹50 + (2 × ₹20) | **₹90.00** |
| `5.0 kg` | ₹50 + (4 × ₹20) | **₹130.00** |
| `7.0 kg` | ₹130 + (2 × ₹15) | **₹160.00** |
| `10.0 kg` | ₹130 + (5 × ₹15) | **₹205.00** |
| `12.0 kg` | ₹205 + (2 × ₹10) | **₹225.00** |

---

## 8. Shipment Lifecycle & State Machine

```
               ┌───────────┐
               │  CREATED  │
               └─────┬─────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
   ┌────────────┐         ┌───────────┐
   │ IN_TRANSIT │         │ CANCELLED │ (Terminal)
   └─────┬──────┘         └───────────┘
         │
         ▼
   ┌───────────┐
   │ DELIVERED │ (Terminal)
   └───────────┘
```

- `DELIVERED` and `CANCELLED` are **terminal states**; any subsequent update attempt is rejected with `400 Bad Request`.

---

## 9. REST API Endpoints

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/health` | Live system health and database ping | `200` |
| `GET` | `/api/calculate-cost?weight={w}` | Calculate freight charge for weight | `200`, `400` |
| `GET` | `/api/shipments` | List all shipments (newest first) | `200`, `500` |
| `GET` | `/api/shipments/{id}` | Search shipment by unique ID | `200`, `404` |
| `POST` | `/api/shipments` | Register a new shipment | `201`, `400`, `409`, `500` |
| `PATCH` | `/api/shipments/{id}/status` | Update shipment status | `200`, `400`, `404` |

See [docs/api.md](file:///Users/reethika/Desktop/shipment/docs/api.md) for full endpoint specifications and JSON payload schemas.

---

## 10. Project Directory Structure

```
shipment/
├── pom.xml
├── .env.example
├── .gitignore
├── README.md
├── database/
│   └── schema.sql
├── docs/
│   ├── api.md
│   ├── architecture.md
│   ├── database.md
│   ├── frontend-design.md
│   └── setup.md
├── src/
│   ├── AppServer.java
│   ├── CostCalculator.java
│   ├── Main.java
│   ├── Shipment.java
│   ├── ShipmentManager.java
│   ├── ShipmentStatus.java
│   ├── controller/
│   │   └── ShipmentController.java
│   ├── dao/
│   │   └── ShipmentDao.java
│   ├── database/
│   │   └── DatabaseConnection.java
│   └── service/
│       └── ShipmentService.java
├── test/
│   ├── CostCalculatorTest.java
│   ├── DatabaseConnectionTest.java
│   ├── DirectDatabaseVerificationAndCleanupTest.java
│   ├── ShipmentServiceTest.java
│   └── SupabaseMigrationTest.java
└── frontend/ (Frozen)
    ├── package.json
    ├── src/
    └── index.html
```

---

## 11. Prerequisites & Environment Configuration

### Prerequisites
- **Java 21 JDK** or newer
- **Maven 3.8+**

### Supabase Setup & `.env`
Create a `.env` file in the project root:
```env
SUPABASE_DB_URL=jdbc:postgresql://<your-supabase-host>:5432/postgres
SUPABASE_DB_USER=postgres.<your-project-ref>
SUPABASE_DB_PASSWORD=<your-database-password>
```

> **IMPORTANT**: The `.env` file is ignored by Git and must **never** be committed.

---

## 12. Build, Test, and Run Commands

### Run Automated Tests
```bash
mvn clean test
```

### Compile
```bash
mvn clean compile
```

### Start REST Backend Server
```bash
mvn exec:java -Dexec.mainClass="AppServer"
```

### Run Standalone Console Mode (Viva / CLI Demo)
```bash
mvn exec:java -Dexec.mainClass="Main"
```

---

## 13. Example API Requests

### Check Health
```bash
curl http://localhost:8080/api/health
```

### Calculate Cost
```bash
curl "http://localhost:8080/api/calculate-cost?weight=3.0"
```

### Create Shipment
```bash
curl -X POST http://localhost:8080/api/shipments \
  -H "Content-Type: application/json" \
  -d '{
    "shipmentId": "SH-101",
    "senderName": "Alice Freeman",
    "receiverName": "Bob Vance",
    "source": "Chennai",
    "destination": "Bengaluru",
    "packageDescription": "Electronics Box",
    "weight": 3.0
  }'
```

### Update Status
```bash
curl -X PATCH http://localhost:8080/api/shipments/SH-101/status \
  -H "Content-Type: application/json" \
  -d '{"status": "IN_TRANSIT"}'
```

---

## 14. Security & Best Practices

- **Zero Hardcoded Credentials**: Database passwords and URLs are read dynamically from `.env` or system environment.
- **SQL Injection Defense**: 100% of database interactions use parameterized `PreparedStatement`.
- **Encrypted Transport**: SSL (`sslmode=require`) is enforced for all JDBC connections.
- **Safe Error Handling**: Error messages never expose database credentials, stack traces, or raw SQL queries.

---

## 15. Project Status

- **Java REST Backend**: Complete, verified, and operational.
- **Supabase Cloud Database**: Live, verified, persistent.
- **Automated Tests**: 18/18 tests passing.
- **Frontend**: Temporarily frozen pending final redesign phase.
