# Shipment Management REST API Specification

**Base URL**: `http://localhost:8080/api`  
**Content-Type**: `application/json; charset=UTF-8`  
**CORS**: Supported across all routes (`Access-Control-Allow-Origin: *`, `Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS`)

---

## Endpoints Summary

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/api/health` | Health & Supabase database connectivity status | `200` |
| `GET` | `/api/calculate-cost?weight={w}` | Live shipping tariff calculation | `200`, `400`, `405` |
| `GET` | `/api/shipments` | Fetch all shipments (ordered newest first) | `200`, `500` |
| `GET` | `/api/shipments/{id}` | Search single shipment by unique ID | `200`, `404`, `500` |
| `POST` | `/api/shipments` | Create and register a new shipment | `201`, `400`, `409`, `500` |
| `PATCH` | `/api/shipments/{id}/status` | Update shipment lifecycle status | `200`, `400`, `404`, `500` |
| `OPTIONS` | `/api/*` | CORS preflight handler | `204` |

---

## Detailed Endpoint Documentation

### 1. Health & Database Check
- **Endpoint**: `GET /api/health`
- **Description**: Returns the server operational status and tests the live Supabase PostgreSQL connection via `DatabaseConnection.testConnection()`.

#### Success Response (`200 OK` - Database Connected)
```json
{
  "service": "Shipment Management REST API",
  "status": "UP",
  "database": "CONNECTED",
  "timestamp": 1727954000000
}
```

#### Response (`200 OK` - Database Degraded)
```json
{
  "service": "Shipment Management REST API",
  "status": "DEGRADED",
  "database": "DISCONNECTED",
  "error": "Database configured but unreachable.",
  "timestamp": 1727954000000
}
```

---

### 2. Calculate Shipping Tariff
- **Endpoint**: `GET /api/calculate-cost?weight={weightInKg}`
- **Description**: Calculates the authoritative shipping cost according to tiered pricing slabs.
- **Query Parameters**:
  - `weight` (decimal, required): Weight in kilograms (`weight > 0`).

#### Success Response (`200 OK`)
```json
{
  "weight": 3.0,
  "cost": 90.0
}
```

#### Error Response (`400 Bad Request` - Invalid weight)
```json
{
  "error": "Weight must be greater than 0 kg.",
  "statusCode": 400
}
```

---

### 3. Get All Shipments
- **Endpoint**: `GET /api/shipments`
- **Description**: Returns all shipments in the database sorted by `created_at DESC`.

#### Success Response (`200 OK`)
```json
[
  {
    "shipmentId": "SH101",
    "senderName": "Alice Freeman",
    "receiverName": "Bob Vance",
    "source": "Chennai",
    "destination": "Bengaluru",
    "packageDescription": "Electronics Box",
    "weight": 3.0,
    "cost": 90.0,
    "status": "CREATED",
    "createdAt": "2026-10-03 15:40:00.0",
    "updatedAt": "2026-10-03 15:40:00.0"
  }
]
```

---

### 4. Get Shipment by ID
- **Endpoint**: `GET /api/shipments/{id}`
- **Description**: Searches for a single shipment by its unique tracking ID (case-insensitive).

#### Success Response (`200 OK`)
```json
{
  "shipmentId": "SH101",
  "senderName": "Alice Freeman",
  "receiverName": "Bob Vance",
  "source": "Chennai",
  "destination": "Bengaluru",
  "packageDescription": "Electronics Box",
  "weight": 3.0,
  "cost": 90.0,
  "status": "CREATED",
  "createdAt": "2026-10-03 15:40:00.0",
  "updatedAt": "2026-10-03 15:40:00.0"
}
```

#### Error Response (`404 Not Found`)
```json
{
  "error": "Shipment with ID 'SH999' not found.",
  "statusCode": 404
}
```

---

### 5. Create Shipment
- **Endpoint**: `POST /api/shipments`
- **Description**: Validates input fields, checks for duplicate IDs, computes the official cost, and persists the record to Supabase PostgreSQL.
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "shipmentId": "SH102",
  "senderName": "David Miller",
  "receiverName": "Sophia Chen",
  "source": "Mumbai",
  "destination": "Delhi",
  "packageDescription": "Industrial Hardware",
  "weight": 7.0
}
```
*(Note: Both `shipmentId` and `id` field names are accepted by the controller).*

#### Success Response (`201 Created`)
```json
{
  "shipmentId": "SH102",
  "senderName": "David Miller",
  "receiverName": "Sophia Chen",
  "source": "Mumbai",
  "destination": "Delhi",
  "packageDescription": "Industrial Hardware",
  "weight": 7.0,
  "cost": 160.0,
  "status": "CREATED",
  "createdAt": "2026-10-03 15:45:00.0",
  "updatedAt": "2026-10-03 15:45:00.0"
}
```

#### Error Response (`409 Conflict` - Duplicate ID)
```json
{
  "error": "Shipment with ID 'SH102' already exists.",
  "statusCode": 409
}
```

#### Error Response (`400 Bad Request` - Validation Failure)
```json
{
  "error": "Sender Name cannot be empty.",
  "statusCode": 400
}
```

---

### 6. Update Shipment Status
- **Endpoint**: `PATCH /api/shipments/{id}/status`
- **Description**: Updates the lifecycle state of an existing shipment. Enforces terminal state protections (`DELIVERED` and `CANCELLED` cannot be changed). Also updates the PostgreSQL `updated_at` timestamp.
- **Request Body**:
```json
{
  "status": "IN_TRANSIT"
}
```
Allowed values for `status`: `CREATED`, `IN_TRANSIT`, `DELIVERED`, `CANCELLED`.

#### Success Response (`200 OK`)
```json
{
  "shipmentId": "SH102",
  "senderName": "David Miller",
  "receiverName": "Sophia Chen",
  "source": "Mumbai",
  "destination": "Delhi",
  "packageDescription": "Industrial Hardware",
  "weight": 7.0,
  "cost": 160.0,
  "status": "IN_TRANSIT",
  "createdAt": "2026-10-03 15:45:00.0",
  "updatedAt": "2026-10-03 15:46:00.0"
}
```

#### Error Response (`400 Bad Request` - Terminal State Guard)
```json
{
  "error": "Cannot modify status: Shipment has already been DELIVERED.",
  "statusCode": 400
}
```

#### Error Response (`404 Not Found`)
```json
{
  "error": "Shipment with ID 'SH999' not found.",
  "statusCode": 404
}
```

---

## Error Handling Standards

All error responses across all endpoints adhere to the unified format:
```json
{
  "error": "<Clear, actionable error message>",
  "statusCode": 400
}
```
- No Java stack traces are exposed to clients.
- No SQL statements or raw database connection strings are exposed.
- Database passwords and secrets are strictly protected.
