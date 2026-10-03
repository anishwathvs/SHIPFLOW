import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;

/**
 * Service layer encapsulating all business logic, validations, status lifecycle rules,
 * and cost calculations for the Shipment Management System.
 */
public class ShipmentService {

    private final ShipmentDao shipmentDao;
    // In-memory isolated storage for testing and standalone dev mode
    private final ArrayList<Shipment> inMemoryStore;

    public ShipmentService() {
        this.shipmentDao = new ShipmentDao();
        this.inMemoryStore = new ArrayList<>();
    }

    /**
     * Checks if Supabase database connectivity is configured.
     */
    public boolean isDatabaseConfigured() {
        return DatabaseConnection.isConfigured();
    }

    /**
     * Creates, validates, calculates tariff, and persists a new shipment.
     * 
     * @throws IllegalArgumentException on field validation failure
     * @throws IllegalStateException on duplicate shipment ID
     * @throws RuntimeException on database access error
     */
    public Shipment createShipment(String shipmentId, String senderName, String receiverName,
                                   String source, String destination, String packageDescription,
                                   double weight) {
        // --- 1. Validation ---
        validateString("Shipment ID", shipmentId, 50);
        validateString("Sender Name", senderName, 100);
        validateString("Receiver Name", receiverName, 100);
        validateString("Source Location", source, 100);
        validateString("Destination Location", destination, 100);
        validateString("Package Description", packageDescription, 500);

        if (weight <= 0) {
            throw new IllegalArgumentException("Weight must be greater than 0 kg.");
        }

        String cleanId = shipmentId.trim();

        // --- 2. Duplicate Check ---
        if (isDuplicateId(cleanId)) {
            throw new IllegalStateException("Shipment with ID '" + cleanId + "' already exists.");
        }

        // --- 3. Tariff Calculation (Authoritative domain logic) ---
        double cost = CostCalculator.calculateCost(weight);

        Timestamp now = new Timestamp(System.currentTimeMillis());
        Shipment shipment = new Shipment(
            cleanId,
            senderName.trim(),
            receiverName.trim(),
            source.trim(),
            destination.trim(),
            packageDescription.trim(),
            weight,
            cost,
            ShipmentStatus.CREATED,
            now,
            now
        );

        // --- 4. Persistence ---
        if (isDatabaseConfigured()) {
            try {
                boolean success = shipmentDao.addShipment(shipment);
                if (!success) {
                    throw new RuntimeException("Failed to persist shipment in database.");
                }
            } catch (SQLException e) {
                throw new RuntimeException("Database error persisting shipment: " + e.getMessage(), e);
            }
        } else {
            inMemoryStore.add(shipment);
        }

        return shipment;
    }

    /**
     * Retrieves all shipments.
     */
    public ArrayList<Shipment> getAllShipments() {
        if (isDatabaseConfigured()) {
            try {
                return shipmentDao.getAllShipments();
            } catch (SQLException e) {
                throw new RuntimeException("Database error retrieving shipments: " + e.getMessage(), e);
            }
        }
        return new ArrayList<>(inMemoryStore);
    }

    /**
     * Retrieves a shipment by its ID.
     */
    public Shipment getShipmentById(String shipmentId) {
        if (shipmentId == null || shipmentId.trim().isEmpty()) {
            return null;
        }

        String cleanId = shipmentId.trim();
        if (isDatabaseConfigured()) {
            try {
                return shipmentDao.getShipmentById(cleanId);
            } catch (SQLException e) {
                throw new RuntimeException("Database error searching shipment: " + e.getMessage(), e);
            }
        }

        for (Shipment s : inMemoryStore) {
            if (s.getShipmentId().equalsIgnoreCase(cleanId)) {
                return s;
            }
        }
        return null;
    }

    /**
     * Updates shipment status adhering to lifecycle transition rules.
     * 
     * Transition rules:
     * - DELIVERED is a terminal state (cannot be changed).
     * - CANCELLED is a terminal state (cannot be changed).
     * 
     * @throws IllegalArgumentException on invalid status or terminal transition violation
     */
    public Shipment updateShipmentStatus(String shipmentId, ShipmentStatus newStatus) {
        if (newStatus == null) {
            throw new IllegalArgumentException("Status is required and must be a valid ShipmentStatus value.");
        }

        Shipment existing = getShipmentById(shipmentId);
        if (existing == null) {
            return null;
        }

        // Terminal state validation
        if (existing.getStatus() == ShipmentStatus.DELIVERED && newStatus != ShipmentStatus.DELIVERED) {
            throw new IllegalArgumentException("Cannot modify status: Shipment has already been DELIVERED.");
        }
        if (existing.getStatus() == ShipmentStatus.CANCELLED && newStatus != ShipmentStatus.CANCELLED) {
            throw new IllegalArgumentException("Cannot modify status: Shipment has already been CANCELLED.");
        }

        if (isDatabaseConfigured()) {
            try {
                boolean updated = shipmentDao.updateShipmentStatus(existing.getShipmentId(), newStatus);
                if (updated) {
                    return shipmentDao.getShipmentById(existing.getShipmentId());
                }
                return null;
            } catch (SQLException e) {
                throw new RuntimeException("Database error updating status: " + e.getMessage(), e);
            }
        }

        // In-memory update
        existing.setStatus(newStatus);
        existing.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        return existing;
    }

    /**
     * Calculates shipment freight tariff from weight.
     */
    public double calculateShipmentCost(double weight) {
        return CostCalculator.calculateCost(weight);
    }

    private boolean isDuplicateId(String shipmentId) {
        if (isDatabaseConfigured()) {
            try {
                return shipmentDao.shipmentIdExists(shipmentId);
            } catch (SQLException e) {
                throw new RuntimeException("Database error checking duplicate ID: " + e.getMessage(), e);
            }
        }
        for (Shipment s : inMemoryStore) {
            if (s.getShipmentId().equalsIgnoreCase(shipmentId)) {
                return true;
            }
        }
        return false;
    }

    private void validateString(String fieldName, String value, int maxLength) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(fieldName + " cannot be empty.");
        }
        if (value.trim().length() > maxLength) {
            throw new IllegalArgumentException(fieldName + " exceeds maximum allowed length of " + maxLength + " characters.");
        }
    }
}
