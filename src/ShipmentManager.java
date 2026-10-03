import java.util.ArrayList;

/**
 * Manages the collection of Shipment objects in memory.
 * Provides core business operations: adding, searching, viewing, and updating shipments.
 * Demonstrates the use of ArrayList, encapsulation, and separation of concerns.
 */
public class ShipmentManager {
    // Private list storing all shipments in memory
    private ArrayList<Shipment> shipments;

    /**
     * Constructor to initialize the shipments list.
     */
    public ShipmentManager() {
        this.shipments = new ArrayList<>();
    }

    /**
     * Checks if a shipment with the given ID already exists.
     * 
     * @param shipmentId The ID to check
     * @return true if ID exists, false otherwise
     */
    public boolean isIdExists(String shipmentId) {
        return searchShipmentById(shipmentId) != null;
    }

    /**
     * Adds a new shipment to the list after verifying that the ID is unique.
     * 
     * @param shipment The Shipment object to add
     * @return true if added successfully, false if duplicate ID exists or input is null
     */
    public boolean addShipment(Shipment shipment) {
        if (shipment == null) {
            return false;
        }
        
        // Prevent duplicate Shipment IDs
        if (isIdExists(shipment.getShipmentId())) {
            return false;
        }

        shipments.add(shipment);
        return true;
    }

    /**
     * Returns a copy of the list of all stored shipments.
     * Returning a new ArrayList preserves encapsulation of the internal list.
     * 
     * @return ArrayList of all shipments
     */
    public ArrayList<Shipment> getAllShipments() {
        return new ArrayList<>(shipments);
    }

    /**
     * Checks whether there are any shipments currently stored.
     * 
     * @return true if list is empty, false otherwise
     */
    public boolean isEmpty() {
        return shipments.isEmpty();
    }

    /**
     * Returns the total count of stored shipments.
     * 
     * @return number of shipments
     */
    public int getShipmentCount() {
        return shipments.size();
    }

    /**
     * Searches for a shipment by its unique Shipment ID using linear search.
     * 
     * @param shipmentId The ID of the shipment to search for
     * @return The matching Shipment object if found, or null if not found
     */
    public Shipment searchShipmentById(String shipmentId) {
        if (shipmentId == null || shipmentId.trim().isEmpty()) {
            return null;
        }

        // Standard for-each loop to iterate through the ArrayList
        for (Shipment s : shipments) {
            if (s.getShipmentId().equalsIgnoreCase(shipmentId.trim())) {
                return s;
            }
        }
        return null; // Not found
    }

    /**
     * Updates the status of an existing shipment identified by its ID.
     * 
     * @param shipmentId The ID of the shipment to update
     * @param newStatus The new status to assign
     * @return true if updated successfully, false if shipment not found or status is null
     */
    public boolean updateShipmentStatus(String shipmentId, ShipmentStatus newStatus) {
        if (newStatus == null) {
            return false;
        }

        Shipment shipment = searchShipmentById(shipmentId);
        if (shipment != null) {
            shipment.setStatus(newStatus);
            return true;
        }
        return false;
    }
}
