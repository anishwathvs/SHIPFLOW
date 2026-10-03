import java.sql.Timestamp;

/**
 * Represents a single shipment in the Shipment Management System.
 * Demonstrates the concept of Encapsulation (data hiding) using
 * private member variables with public getters and setters.
 */
public class Shipment {
    // Private attributes (Encapsulation)
    private String shipmentId;
    private String senderName;
    private String receiverName;
    private String source;
    private String destination;
    private String packageDescription;
    private double weight;
    private double cost;
    private ShipmentStatus status;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    /**
     * Parameterized constructor to initialize a new shipment.
     * The initial status is automatically set to CREATED.
     */
    public Shipment(String shipmentId, String senderName, String receiverName,
                    String source, String destination, String packageDescription,
                    double weight, double cost) {
        this.shipmentId = shipmentId;
        this.senderName = senderName;
        this.receiverName = receiverName;
        this.source = source;
        this.destination = destination;
        this.packageDescription = packageDescription;
        this.weight = weight;
        this.cost = cost;
        this.status = ShipmentStatus.CREATED; // Default initial status
        this.createdAt = new Timestamp(System.currentTimeMillis());
        this.updatedAt = new Timestamp(System.currentTimeMillis());
    }

    /**
     * Full constructor including status and timestamps (used by DAO when mapping database rows).
     */
    public Shipment(String shipmentId, String senderName, String receiverName,
                    String source, String destination, String packageDescription,
                    double weight, double cost, ShipmentStatus status,
                    Timestamp createdAt, Timestamp updatedAt) {
        this.shipmentId = shipmentId;
        this.senderName = senderName;
        this.receiverName = receiverName;
        this.source = source;
        this.destination = destination;
        this.packageDescription = packageDescription;
        this.weight = weight;
        this.cost = cost;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // --- Getters and Setters ---

    public String getShipmentId() {
        return shipmentId;
    }

    public void setShipmentId(String shipmentId) {
        this.shipmentId = shipmentId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getPackageDescription() {
        return packageDescription;
    }

    public void setPackageDescription(String packageDescription) {
        this.packageDescription = packageDescription;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public double getCost() {
        return cost;
    }

    public void setCost(double cost) {
        this.cost = cost;
    }

    public ShipmentStatus getStatus() {
        return status;
    }

    public void setStatus(ShipmentStatus status) {
        this.status = status;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    /**
     * Formats shipment details into a readable string representation.
     */
    @Override
    public String toString() {
        return "----------------------------------------\n" +
               "Shipment ID  : " + shipmentId + "\n" +
               "Sender       : " + senderName + "\n" +
               "Receiver     : " + receiverName + "\n" +
               "Route        : " + source + " -> " + destination + "\n" +
               "Description  : " + packageDescription + "\n" +
               "Weight       : " + String.format("%.2f", weight) + " kg\n" +
               "Cost         : Rs. " + String.format("%.2f", cost) + "\n" +
               "Status       : " + status + "\n" +
               "----------------------------------------";
    }
}
