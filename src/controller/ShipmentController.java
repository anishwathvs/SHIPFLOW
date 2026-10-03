import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * REST API Controller and HTTP Server for the Shipment Management System.
 * Handles HTTP requests, enforces CORS, parses JSON payloads via Gson,
 * and maps domain exceptions to appropriate HTTP status codes without exposing stack traces.
 */
public class ShipmentController {

    private final ShipmentService shipmentService;
    private final Gson gson;
    private HttpServer server;

    public ShipmentController(ShipmentService shipmentService) {
        this.shipmentService = shipmentService;
        this.gson = new GsonBuilder().setPrettyPrinting().serializeNulls().create();
    }

    /**
     * Starts the HTTP REST server on the specified port.
     */
    public void startServer(int port) throws IOException {
        server = HttpServer.create(new InetSocketAddress(port), 0);

        // Register REST API Route Contexts
        server.createContext("/api/health", new HealthHandler());
        server.createContext("/api/calculate-cost", new CostCalculationHandler());
        server.createContext("/api/shipments", new ShipmentsHandler());

        server.setExecutor(java.util.concurrent.Executors.newCachedThreadPool());
        server.start();
        System.out.println("[ShipmentController] REST API running at http://localhost:" + port);
    }

    /**
     * Stops the HTTP server.
     */
    public void stopServer() {
        if (server != null) {
            server.stop(0);
            System.out.println("[ShipmentController] REST API server stopped.");
        }
    }

    // ==========================================
    // ROUTE HANDLERS
    // ==========================================

    /**
     * Handles GET /api/health
     * Reports live service health and Supabase database readiness.
     */
    private class HealthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handleCorsPreflight(exchange)) return;

            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendErrorResponse(exchange, 405, "Method Not Allowed");
                return;
            }

            Map<String, Object> response = new HashMap<>();
            response.put("service", "Shipment Management REST API");
            response.put("timestamp", System.currentTimeMillis());

            if (DatabaseConnection.isConfigured()) {
                boolean dbConnected = DatabaseConnection.testConnection();
                if (dbConnected) {
                    response.put("status", "UP");
                    response.put("database", "CONNECTED");
                } else {
                    response.put("status", "DEGRADED");
                    response.put("database", "DISCONNECTED");
                    response.put("error", "Database configured but unreachable.");
                }
            } else {
                response.put("status", "UP");
                response.put("database", "NOT_CONFIGURED");
                response.put("message", "Supabase credentials not set in environment.");
            }

            sendJsonResponse(exchange, 200, response);
        }
    }

    /**
     * Handles GET /api/calculate-cost?weight={w}
     */
    private class CostCalculationHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handleCorsPreflight(exchange)) return;

            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendErrorResponse(exchange, 405, "Method Not Allowed");
                return;
            }

            Map<String, String> queryParams = parseQueryParams(exchange.getRequestURI());
            String weightStr = queryParams.get("weight");

            if (weightStr == null || weightStr.trim().isEmpty()) {
                sendErrorResponse(exchange, 400, "Missing required query parameter: weight");
                return;
            }

            try {
                double weight = Double.parseDouble(weightStr.trim());
                double cost = shipmentService.calculateShipmentCost(weight);

                Map<String, Object> response = new HashMap<>();
                response.put("weight", weight);
                response.put("cost", cost);
                sendJsonResponse(exchange, 200, response);

            } catch (NumberFormatException e) {
                sendErrorResponse(exchange, 400, "Invalid weight format. Must be a valid numeric value.");
            } catch (IllegalArgumentException e) {
                sendErrorResponse(exchange, 400, e.getMessage());
            } catch (Exception e) {
                sendErrorResponse(exchange, 500, "Error calculating cost: " + e.getMessage());
            }
        }
    }

    /**
     * Handles /api/shipments, /api/shipments/{id}, and /api/shipments/{id}/status
     */
    private class ShipmentsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (handleCorsPreflight(exchange)) return;

            String method = exchange.getRequestMethod().toUpperCase();
            String path = exchange.getRequestURI().getPath();
            String[] pathParts = path.split("/");

            try {
                if (pathParts.length == 3) { // /api/shipments
                    if ("GET".equals(method)) {
                        handleGetAllShipments(exchange);
                    } else if ("POST".equals(method)) {
                        handleCreateShipment(exchange);
                    } else {
                        sendErrorResponse(exchange, 405, "Method Not Allowed");
                    }
                } else if (pathParts.length == 4) { // /api/shipments/{id}
                    String shipmentId = pathParts[3];
                    if ("GET".equals(method)) {
                        handleGetShipmentById(exchange, shipmentId);
                    } else {
                        sendErrorResponse(exchange, 405, "Method Not Allowed");
                    }
                } else if (pathParts.length == 5 && "status".equalsIgnoreCase(pathParts[4])) { // /api/shipments/{id}/status
                    String shipmentId = pathParts[3];
                    if ("PATCH".equals(method) || "PUT".equals(method) || "POST".equals(method)) {
                        handleUpdateStatus(exchange, shipmentId);
                    } else {
                        sendErrorResponse(exchange, 405, "Method Not Allowed");
                    }
                } else {
                    sendErrorResponse(exchange, 404, "Endpoint Not Found");
                }
            } catch (Exception e) {
                sendErrorResponse(exchange, 500, "Internal Server Error: " + e.getMessage());
            }
        }
    }

    private void handleGetAllShipments(HttpExchange exchange) throws IOException {
        try {
            ArrayList<Shipment> list = shipmentService.getAllShipments();
            sendJsonResponse(exchange, 200, list);
        } catch (Exception e) {
            sendErrorResponse(exchange, 500, "Error fetching shipments: " + e.getMessage());
        }
    }

    private void handleGetShipmentById(HttpExchange exchange, String shipmentId) throws IOException {
        try {
            Shipment shipment = shipmentService.getShipmentById(shipmentId);
            if (shipment != null) {
                sendJsonResponse(exchange, 200, shipment);
            } else {
                sendErrorResponse(exchange, 404, "Shipment with ID '" + shipmentId + "' not found.");
            }
        } catch (Exception e) {
            sendErrorResponse(exchange, 500, "Error searching shipment: " + e.getMessage());
        }
    }

    private void handleCreateShipment(HttpExchange exchange) throws IOException {
        String body = readRequestBody(exchange);
        if (body == null || body.trim().isEmpty()) {
            sendErrorResponse(exchange, 400, "Request body is empty.");
            return;
        }

        try {
            JsonObject json = JsonParser.parseString(body).getAsJsonObject();

            String shipmentId = getJsonString(json, "shipmentId");
            if (shipmentId == null) {
                shipmentId = getJsonString(json, "id");
            }
            String senderName = getJsonString(json, "senderName");
            String receiverName = getJsonString(json, "receiverName");
            String source = getJsonString(json, "source");
            String destination = getJsonString(json, "destination");
            String packageDescription = getJsonString(json, "packageDescription");

            if (!json.has("weight") || json.get("weight").isJsonNull()) {
                sendErrorResponse(exchange, 400, "Field 'weight' is required.");
                return;
            }
            double weight = json.get("weight").getAsDouble();

            Shipment created = shipmentService.createShipment(
                shipmentId, senderName, receiverName, source, destination, packageDescription, weight
            );

            sendJsonResponse(exchange, 201, created);

        } catch (IllegalStateException e) { // 409 Conflict for duplicate ID
            sendErrorResponse(exchange, 409, e.getMessage());
        } catch (IllegalArgumentException e) { // 400 Bad Request for validation failure
            sendErrorResponse(exchange, 400, e.getMessage());
        } catch (Exception e) {
            sendErrorResponse(exchange, 400, "Malformed request: " + e.getMessage());
        }
    }

    private void handleUpdateStatus(HttpExchange exchange, String shipmentId) throws IOException {
        String body = readRequestBody(exchange);
        if (body == null || body.trim().isEmpty()) {
            sendErrorResponse(exchange, 400, "Request body is empty.");
            return;
        }

        try {
            JsonObject json = JsonParser.parseString(body).getAsJsonObject();
            String statusStr = getJsonString(json, "status");

            if (statusStr == null || statusStr.trim().isEmpty()) {
                sendErrorResponse(exchange, 400, "Field 'status' is required.");
                return;
            }

            ShipmentStatus newStatus;
            try {
                newStatus = ShipmentStatus.valueOf(statusStr.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                sendErrorResponse(exchange, 400, "Invalid status. Allowed values: CREATED, IN_TRANSIT, DELIVERED, CANCELLED.");
                return;
            }

            Shipment updated = shipmentService.updateShipmentStatus(shipmentId, newStatus);
            if (updated != null) {
                sendJsonResponse(exchange, 200, updated);
            } else {
                sendErrorResponse(exchange, 404, "Shipment with ID '" + shipmentId + "' not found.");
            }

        } catch (IllegalArgumentException e) {
            sendErrorResponse(exchange, 400, e.getMessage());
        } catch (Exception e) {
            sendErrorResponse(exchange, 400, "Invalid request body: " + e.getMessage());
        }
    }

    // ==========================================
    // HTTP UTILITIES & CORS
    // ==========================================

    private boolean handleCorsPreflight(HttpExchange exchange) throws IOException {
        addCorsHeaders(exchange);
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            exchange.close();
            return true;
        }
        return false;
    }

    private void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
    }

    private void sendJsonResponse(HttpExchange exchange, int statusCode, Object data) throws IOException {
        addCorsHeaders(exchange);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        String json = gson.toJson(data);
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private void sendErrorResponse(HttpExchange exchange, int statusCode, String errorMessage) throws IOException {
        Map<String, Object> errorBody = new HashMap<>();
        errorBody.put("error", errorMessage);
        errorBody.put("statusCode", statusCode);
        sendJsonResponse(exchange, statusCode, errorBody);
    }

    private String readRequestBody(HttpExchange exchange) throws IOException {
        try (InputStream is = exchange.getRequestBody()) {
            return new String(is.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    private String getJsonString(JsonObject json, String key) {
        if (json.has(key) && !json.get(key).isJsonNull()) {
            return json.get(key).getAsString();
        }
        return null;
    }

    private Map<String, String> parseQueryParams(URI uri) {
        Map<String, String> queryPairs = new HashMap<>();
        String query = uri.getQuery();
        if (query != null) {
            String[] pairs = query.split("&");
            for (String pair : pairs) {
                int idx = pair.indexOf("=");
                if (idx > 0 && idx < pair.length() - 1) {
                    queryPairs.put(pair.substring(0, idx), pair.substring(idx + 1));
                }
            }
        }
        return queryPairs;
    }
}
