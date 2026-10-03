import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for ShipmentService domain validation, duplicate prevention, and lifecycle transitions.
 */
class ShipmentServiceTest {

    private ShipmentService shipmentService;
    private String testPrefix;

    @BeforeEach
    void setUp() {
        shipmentService = new ShipmentService();
        testPrefix = "TEST-" + System.currentTimeMillis() + "-";
    }

    @AfterAll
    static void cleanUpAll() {
        if (DatabaseConnection.isConfigured()) {
            try (Connection conn = DatabaseConnection.getConnection();
                 PreparedStatement stmt = conn.prepareStatement("DELETE FROM shipments WHERE id LIKE 'TEST-%'")) {
                stmt.executeUpdate();
            } catch (SQLException ignored) {
            }
        }
    }

    @Test
    @DisplayName("Should successfully create a valid shipment with status CREATED and calculated cost")
    void testCreateValidShipment() {
        String testId = testPrefix + "101";
        Shipment s = shipmentService.createShipment(
            testId, "Alice", "Bob", "Chennai", "Bangalore", "Electronic Parts", 3.0
        );

        assertNotNull(s);
        assertEquals(testId, s.getShipmentId());
        assertEquals("Alice", s.getSenderName());
        assertEquals("Bob", s.getReceiverName());
        assertEquals("Chennai", s.getSource());
        assertEquals("Bangalore", s.getDestination());
        assertEquals(3.0, s.getWeight(), 0.001);
        assertEquals(90.0, s.getCost(), 0.001); // 50 + 2*20 = 90
        assertEquals(ShipmentStatus.CREATED, s.getStatus());
        assertNotNull(s.getCreatedAt());
        assertNotNull(s.getUpdatedAt());
    }

    @Test
    @DisplayName("Should reject duplicate shipment ID with IllegalStateException")
    void testDuplicateShipmentIdRejection() {
        String testId = testPrefix + "DUP";
        shipmentService.createShipment(
            testId, "Alice", "Bob", "Chennai", "Bangalore", "Box A", 2.0
        );

        IllegalStateException ex = assertThrows(
            IllegalStateException.class,
            () -> shipmentService.createShipment(
                testId, "Charlie", "David", "Delhi", "Mumbai", "Box B", 4.0
            )
        );

        assertTrue(ex.getMessage().contains("already exists"));
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when required fields are missing or empty")
    void testFieldValidation() {
        assertThrows(
            IllegalArgumentException.class,
            () -> shipmentService.createShipment("", "Alice", "Bob", "Chennai", "Bangalore", "Box", 2.0)
        );
        assertThrows(
            IllegalArgumentException.class,
            () -> shipmentService.createShipment("SH-1", " ", "Bob", "Chennai", "Bangalore", "Box", 2.0)
        );
        assertThrows(
            IllegalArgumentException.class,
            () -> shipmentService.createShipment("SH-1", "Alice", "Bob", "Chennai", "Bangalore", "Box", -1.0)
        );
    }

    @Test
    @DisplayName("Should update status from CREATED to IN_TRANSIT and then DELIVERED")
    void testValidStatusTransitions() {
        String testId = testPrefix + "LIFE";
        Shipment s = shipmentService.createShipment(
            testId, "Alice", "Bob", "Chennai", "Bangalore", "Box", 2.0
        );

        Shipment inTransit = shipmentService.updateShipmentStatus(testId, ShipmentStatus.IN_TRANSIT);
        assertNotNull(inTransit);
        assertEquals(ShipmentStatus.IN_TRANSIT, inTransit.getStatus());

        Shipment delivered = shipmentService.updateShipmentStatus(testId, ShipmentStatus.DELIVERED);
        assertNotNull(delivered);
        assertEquals(ShipmentStatus.DELIVERED, delivered.getStatus());
    }

    @Test
    @DisplayName("Should prevent status modification once a shipment is in terminal DELIVERED state")
    void testTerminalStateDeliveredCannotChange() {
        String testId = testPrefix + "TERM";
        shipmentService.createShipment(
            testId, "Alice", "Bob", "Chennai", "Bangalore", "Box", 2.0
        );

        shipmentService.updateShipmentStatus(testId, ShipmentStatus.DELIVERED);

        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> shipmentService.updateShipmentStatus(testId, ShipmentStatus.CREATED)
        );
        assertTrue(ex.getMessage().contains("DELIVERED"));
    }
}
