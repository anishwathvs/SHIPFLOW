# Shipment Management System — Architecture & Engineering Specification

## 1. System Architecture Overview

The **Shipment Management System** is built on a clean multi-tier architectural pattern. Each layer has strict boundaries and responsibilities, promoting testability, maintainability, separation of concerns, and robust security.

```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend Layer (Frozen)                   │
│   React 18 + Three.js 3D Logistics Command Center           │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON (REST API)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Controller Layer                         │
│   ShipmentController (com.sun.net.httpserver + Gson)        │
│   - CORS Preflight & Request Routing                        │
│   - JSON Parsing & HTTP Status Code Mapping                 │
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

## 2. Layer Responsibilities & Separation Rationale

### A. Controller Layer (`ShipmentController.java`)
- **HTTP Transport**: Receives HTTP requests on `/api/*` endpoints.
- **CORS Handling**: Injects standard CORS headers allowing secure browser communication.
- **JSON Serialization**: Uses Google Gson to serialize/deserialize request and response objects.
- **Error Formatting**: Maps internal exceptions to standardized JSON error payloads (`{"error": "...", "statusCode": ...}`) without leaking stack traces or database passwords.

### B. Service Layer (`ShipmentService.java`)
- **Business Logic & Rules**: Enforces domain integrity (e.g., sender/receiver cannot be empty, description length limits).
- **Tariff Delegation**: Uses `CostCalculator` to compute shipment cost authoritatively; client-supplied cost values are discarded.
- **Duplicate Prevention**: Verifies ID uniqueness before creating records (`IllegalStateException` -> `409 Conflict`).
- **Lifecycle Transition Guard**: Enforces terminal states: shipments in `DELIVERED` or `CANCELLED` status cannot transition to any other status.

### C. Data Access Layer (`ShipmentDao.java`)
- **Persistence Abstraction**: Hides SQL details from business logic.
- **SQL Injection Prevention**: Uses `PreparedStatement` with parameterized placeholders (`?`) for all queries and updates.
- **Resource Management**: Implements Java try-with-resources to ensure `Connection`, `PreparedStatement`, and `ResultSet` are closed promptly.
- **Explicit Projection**: Queries explicit column names rather than `SELECT *`.

### D. Database Factory (`DatabaseConnection.java`)
- **Credential Management**: Reads credentials from `.env` or system environment variables (`SUPABASE_DB_URL`, `SUPABASE_DB_USER`, `SUPABASE_DB_PASSWORD`).
- **Security & SSL**: Enforces `ssl=true` and `sslmode=require`.
- **Health Check**: Executes `SELECT 1` ping for live `/api/health` queries.

### E. Domain Models & Calculators
- **`Shipment.java`**: Pure encapsulated POJO with private fields and getters/setters.
- **`CostCalculator.java`**: Pure static utility with Single Responsibility Principle (SRP) for tiered tariff logic.
- **`ShipmentStatus.java`**: Strongly-typed enum (`CREATED`, `IN_TRANSIT`, `DELIVERED`, `CANCELLED`).
- **`ShipmentManager.java`**: Standalone in-memory collection manager used for standalone console application viva demonstrations.

---

## 3. Shipment Lifecycle & State Machine

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

- **Valid Transitions**:
  - `CREATED` → `IN_TRANSIT`
  - `CREATED` → `CANCELLED`
  - `IN_TRANSIT` → `DELIVERED`
  - `IN_TRANSIT` → `CANCELLED`
- **Terminal State Rules**:
  - Once `DELIVERED`, the shipment status is locked permanently.
  - Once `CANCELLED`, the shipment status is locked permanently.
  - Any attempt to alter status from a terminal state throws `IllegalArgumentException` (`400 Bad Request`).

---

## 4. Authoritative Cost Calculation Rules

The tariff engine implements a 4-tier weight calculation:

$$\text{Tariff}(w) = \begin{cases} 
\text{Invalid} & \text{if } w \le 0 \\
\text{₹}50.00 & \text{if } 0 < w \le 1 \\
\text{₹}50.00 + (w - 1) \times 20.00 & \text{if } 1 < w \le 5 \\
\text{₹}130.00 + (w - 5) \times 15.00 & \text{if } 5 < w \le 10 \\
\text{₹}205.00 + (w - 10) \times 10.00 & \text{if } w > 10
\end{cases}$$

### Tariff Slabs & Examples

| Weight (kg) | Formula | Total Cost (INR) |
|---|---|---|
| `0.5 kg` | Up to 1 kg slab | **₹50.00** |
| `1.0 kg` | Up to 1 kg slab | **₹50.00** |
| `3.0 kg` | ₹50 + (2.0 × ₹20) | **₹90.00** |
| `5.0 kg` | ₹50 + (4.0 × ₹20) | **₹130.00** |
| `7.0 kg` | ₹130 + (2.0 × ₹15) | **₹160.00** |
| `10.0 kg` | ₹130 + (5.0 × ₹15) | **₹205.00** |
| `12.0 kg` | ₹205 + (2.0 × ₹10) | **₹225.00** |
