import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;

/**
 * Data Access Object (DAO) for persisting and retrieving Shipment records
 * from Supabase PostgreSQL database.
 * 
 * Uses PreparedStatements for all operations to prevent SQL Injection
 * and maps SQL ResultSets into strongly-typed Shipment domain objects.
 */
public class ShipmentDao {

    // Explicit column list for reliable, optimized SQL projection
    private static final String SELECT_COLUMNS = 
        "id, sender_name, receiver_name, source_location, destination_location, " +
        "package_description, weight, cost, status, created_at, updated_at";

    /**
     * Inserts a new Shipment record into the PostgreSQL database.
     * 
     * @param shipment The Shipment object to insert
     * @return true if inserted successfully, false otherwise
     * @throws SQLException if database write fails
     */
    public boolean addShipment(Shipment shipment) throws SQLException {
        if (shipment == null) {
            return false;
        }

        String sql = "INSERT INTO shipments (" +
                     "id, sender_name, receiver_name, source_location, destination_location, " +
                     "package_description, weight, cost, status, created_at, updated_at" +
                     ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            Timestamp now = new Timestamp(System.currentTimeMillis());

            stmt.setString(1, shipment.getShipmentId());
            stmt.setString(2, shipment.getSenderName());
            stmt.setString(3, shipment.getReceiverName());
            stmt.setString(4, shipment.getSource());
            stmt.setString(5, shipment.getDestination());
            stmt.setString(6, shipment.getPackageDescription());
            stmt.setDouble(7, shipment.getWeight());
            stmt.setDouble(8, shipment.getCost());
            stmt.setString(9, shipment.getStatus() != null ? shipment.getStatus().name() : ShipmentStatus.CREATED.name());
            stmt.setTimestamp(10, shipment.getCreatedAt() != null ? shipment.getCreatedAt() : now);
            stmt.setTimestamp(11, now);

            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        }
    }

    /**
     * Retrieves all shipment records from the database, sorted by creation timestamp descending.
     * 
     * @return ArrayList of Shipment objects
     * @throws SQLException if database read fails
     */
    public ArrayList<Shipment> getAllShipments() throws SQLException {
        ArrayList<Shipment> list = new ArrayList<>();
        String sql = "SELECT " + SELECT_COLUMNS + " FROM shipments ORDER BY created_at DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                list.add(mapResultSetToShipment(rs));
            }
        }
        return list;
    }

    /**
     * Retrieves a single shipment by its unique ID (case-insensitive).
     * 
     * @param shipmentId The ID to search for
     * @return Shipment object if found, or null if not found
     * @throws SQLException if database query fails
     */
    public Shipment getShipmentById(String shipmentId) throws SQLException {
        if (shipmentId == null || shipmentId.trim().isEmpty()) {
            return null;
        }

        String sql = "SELECT " + SELECT_COLUMNS + " FROM shipments WHERE LOWER(id) = LOWER(?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, shipmentId.trim());

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToShipment(rs);
                }
            }
        }
        return null;
    }

    /**
     * Updates the status and updated_at timestamp of an existing shipment.
     * 
     * @param shipmentId The ID of the shipment to update
     * @param status The new ShipmentStatus
     * @return true if updated successfully, false otherwise
     * @throws SQLException if database update fails
     */
    public boolean updateShipmentStatus(String shipmentId, ShipmentStatus status) throws SQLException {
        if (shipmentId == null || status == null) {
            return false;
        }

        String sql = "UPDATE shipments SET status = ?, updated_at = ? WHERE LOWER(id) = LOWER(?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, status.name());
            stmt.setTimestamp(2, new Timestamp(System.currentTimeMillis()));
            stmt.setString(3, shipmentId.trim());

            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        }
    }

    /**
     * Checks if a shipment with the given ID already exists in the database.
     * 
     * @param shipmentId The ID to check
     * @return true if ID exists, false otherwise
     * @throws SQLException if database query fails
     */
    public boolean shipmentIdExists(String shipmentId) throws SQLException {
        if (shipmentId == null || shipmentId.trim().isEmpty()) {
            return false;
        }

        String sql = "SELECT 1 FROM shipments WHERE LOWER(id) = LOWER(?) LIMIT 1";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, shipmentId.trim());

            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next();
            }
        }
    }

    /**
     * Maps a database ResultSet row to a strongly-typed Shipment domain object.
     */
    private Shipment mapResultSetToShipment(ResultSet rs) throws SQLException {
        String id = rs.getString("id");
        String sender = rs.getString("sender_name");
        String receiver = rs.getString("receiver_name");
        String source = rs.getString("source_location");
        String destination = rs.getString("destination_location");
        String description = rs.getString("package_description");
        double weight = rs.getDouble("weight");
        double cost = rs.getDouble("cost");
        
        String statusStr = rs.getString("status");
        ShipmentStatus status = ShipmentStatus.CREATED;
        if (statusStr != null) {
            try {
                status = ShipmentStatus.valueOf(statusStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                status = ShipmentStatus.CREATED;
            }
        }

        Timestamp createdAt = rs.getTimestamp("created_at");
        Timestamp updatedAt = rs.getTimestamp("updated_at");

        return new Shipment(id, sender, receiver, source, destination, 
                            description, weight, cost, status, createdAt, updatedAt);
    }
}
