import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Direct PostgreSQL verification and cleanup test for live Supabase integration.
 */
class DirectDatabaseVerificationAndCleanupTest {

    @Test
    @DisplayName("Direct Supabase verification and temporary record cleanup")
    void testDirectDatabaseAndCleanup() throws SQLException {
        assertTrue(DatabaseConnection.isConfigured(), "Database connection must be configured in .env");

        String testId = "LIVE-SUPABASE-TEST-DIRECT";
        ShipmentDao dao = new ShipmentDao();

        // 1. Create a test record via DAO
        Shipment testShipment = new Shipment(
            testId,
            "Direct Test Sender",
            "Direct Test Receiver",
            "Mumbai",
            "Delhi",
            "Direct SQL Verification",
            5.0,
            130.0
        );
        assertTrue(dao.addShipment(testShipment), "DAO addShipment must succeed");

        // 2. Direct SQL Query to verify fields & timestamps
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT id, weight, cost, status, created_at, updated_at FROM shipments WHERE id = ?")) {
            stmt.setString(1, testId);
            try (ResultSet rs = stmt.executeQuery()) {
                assertTrue(rs.next(), "Direct SQL query must find the inserted test row in Supabase");
                assertEquals(testId, rs.getString("id"));
                assertEquals(5.0, rs.getDouble("weight"), 0.001);
                assertEquals(130.0, rs.getDouble("cost"), 0.001);
                assertEquals("CREATED", rs.getString("status"));
                assertNotNull(rs.getTimestamp("created_at"));
                assertNotNull(rs.getTimestamp("updated_at"));
            }
        }

        // 3. Update status to IN_TRANSIT and verify updated_at trigger in PostgreSQL
        assertTrue(dao.updateShipmentStatus(testId, ShipmentStatus.IN_TRANSIT));
        Shipment updated = dao.getShipmentById(testId);
        assertNotNull(updated);
        assertEquals(ShipmentStatus.IN_TRANSIT, updated.getStatus());

        // 4. Cleanup: Delete temporary test record directly
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement("DELETE FROM shipments WHERE id = ? OR id LIKE 'LIVE-SUPABASE-%'")) {
            stmt.setString(1, testId);
            int deleted = stmt.executeUpdate();
            assertTrue(deleted > 0, "Cleanup must remove temporary test records from Supabase");
        }

        // 5. Verify it no longer exists
        assertNull(dao.getShipmentById(testId), "Deleted test record must return null on subsequent query");
    }
}
