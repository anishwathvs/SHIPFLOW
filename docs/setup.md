# Shipment Management System — Setup & Execution Guide

This guide provides end-to-end instructions for setting up the environment, configuring Supabase PostgreSQL, running automated tests, launching the Java REST backend, and verifying the application.

---

## 1. Prerequisites

Ensure the following tools are installed on your machine:
- **Java Development Kit (JDK) 21+** (e.g., OpenJDK 21, Eclipse Temurin 21)
- **Apache Maven 3.8+**
- **Git**

Verify your local installation:
```bash
java -version
mvn -version
```

---

## 2. Supabase Database Configuration

1. Log in to [Supabase](https://supabase.com/) and create a project.
2. In **Project Settings > Database**, find your connection string.
3. In the project root, create a file named `.env` by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` with your real database credentials:
   ```env
   SUPABASE_DB_URL=jdbc:postgresql://aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres
   SUPABASE_DB_USER=postgres.your_project_id
   SUPABASE_DB_PASSWORD=your_secure_password
   ```
   *(Note: `.env` is listed in `.gitignore` and must never be committed to Git).*

5. Apply the database schema:
   - Run `database/schema.sql` in the Supabase SQL Editor, or
   - The test suite (`SupabaseMigrationTest`) will automatically execute and verify the schema.

---

## 3. Building & Testing

### A. Run Automated Unit & Integration Tests
Execute all tests against the domain logic and live Supabase PostgreSQL instance:
```bash
mvn clean test
```
*Expected: 18/18 tests pass with 0 failures and 0 errors.*

### B. Compile the Project
Verify compilation with Java 21 release target:
```bash
mvn clean compile
```

---

## 4. Running the Backend Server

### A. Start the REST API Server
Run `AppServer.java` on port `8080`:
```bash
mvn exec:java -Dexec.mainClass="AppServer"
```
Or with custom port:
```bash
mvn exec:java -Dexec.mainClass="AppServer" -Dexec.args="8080"
```

The REST API will be available at:
```
http://localhost:8080/api
```

---

## 5. Verification & Smoke Testing

### A. Health & Supabase Ping Check
```bash
curl http://localhost:8080/api/health
```
**Expected Response:**
```json
{
  "service": "Shipment Management REST API",
  "database": "CONNECTED",
  "status": "UP",
  "timestamp": 1727954000000
}
```

### B. Live Shipping Cost Calculation
```bash
curl "http://localhost:8080/api/calculate-cost?weight=3.0"
```
**Expected Response:**
```json
{
  "weight": 3.0,
  "cost": 90.0
}
```

### C. Create a Shipment
```bash
curl -X POST http://localhost:8080/api/shipments \
  -H "Content-Type: application/json" \
  -d '{
    "shipmentId": "SH-DEMO-01",
    "senderName": "Alice Freeman",
    "receiverName": "Bob Vance",
    "source": "Chennai",
    "destination": "Bengaluru",
    "packageDescription": "Electronics & Precision Equipment",
    "weight": 3.0
  }'
```
**Expected Response (`201 Created`):**
```json
{
  "shipmentId": "SH-DEMO-01",
  "senderName": "Alice Freeman",
  "receiverName": "Bob Vance",
  "source": "Chennai",
  "destination": "Bengaluru",
  "packageDescription": "Electronics & Precision Equipment",
  "weight": 3.0,
  "cost": 90.0,
  "status": "CREATED"
}
```

### D. Update Status
```bash
curl -X PATCH http://localhost:8080/api/shipments/SH-DEMO-01/status \
  -H "Content-Type: application/json" \
  -d '{"status": "IN_TRANSIT"}'
```

---

## 7. Frontend & Google Maps Setup

### A. Run Frontend Locally
Navigate to the `frontend/` directory and install dependencies:
```bash
cd frontend
npm install
npm run dev
```
The application will launch on `http://localhost:5173/` with automated proxy to the Java backend at `http://localhost:8080/`.

### B. Google Maps JavaScript API Configuration (Part 15)
To activate live satellite and road telemetry in the Global Map view:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a Google Cloud project.
3. Enable billing for your project as required by Google Cloud.
4. Go to **APIs & Services > Library** and enable **Maps JavaScript API**.
5. Go to **APIs & Services > Credentials** and click **Create Credentials > API key**.
6. (Recommended) Restrict the API key:
   - Application restriction: HTTP referrers (`http://localhost:5173/*`, your production domain).
   - API restriction: Maps JavaScript API.
7. In `frontend/.env`, set your key:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   VITE_GOOGLE_MAP_ID=your_map_id_here
   ```
   *(Note: Never commit your real Google Maps API key to Git; it remains local in `frontend/.env`).*

---

## 8. Client Authentication Setup (Supabase Auth)
The application includes a complete enterprise Login page. To link client-side Supabase authentication:
1. In the Supabase Dashboard, go to **Authentication > Providers** and ensure Email/Password is enabled.
2. In `frontend/.env`, set:
   ```env
   VITE_SUPABASE_URL=https://your_project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_public_key
   ```
3. If these keys are not set, the frontend operates gracefully in Guest Admin mode for testing and grading.

---

## 9. Standalone Console Mode (Viva / Demo)

For classroom or viva demonstrations of pure core Java OOP without network dependencies, run the console application:
```bash
mvn exec:java -Dexec.mainClass="Main"
```

