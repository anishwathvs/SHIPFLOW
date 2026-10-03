import java.util.ArrayList;
import java.util.Scanner;

/**
 * Main entry point for the Shipment Management System.
 * Handles the console-based user interface, menu display, input reading,
 * and delegates business operations to ShipmentManager and CostCalculator.
 */
public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        ShipmentManager manager = new ShipmentManager();
        boolean running = true;

        while (running) {
            showMenu();
            System.out.print("Enter your choice (1-6): ");
            String choiceInput = scanner.nextLine().trim();

            switch (choiceInput) {
                case "1":
                    addShipment(scanner, manager);
                    break;
                case "2":
                    viewAllShipments(manager);
                    break;
                case "3":
                    searchShipment(scanner, manager);
                    break;
                case "4":
                    updateShipmentStatus(scanner, manager);
                    break;
                case "5":
                    calculateShipmentCost(scanner);
                    break;
                case "6":
                    System.out.println("\nThank you for using Shipment Management System. Goodbye!");
                    running = false;
                    break;
                default:
                    System.out.println("\n[Error] Invalid choice. Please enter a number between 1 and 6.");
                    break;
            }
            System.out.println(); // Blank line for cleaner spacing
        }

        scanner.close();
    }

    /**
     * Displays the main menu options.
     */
    private static void showMenu() {
        System.out.println("========================================");
        System.out.println("       SHIPMENT MANAGEMENT SYSTEM       ");
        System.out.println("========================================");
        System.out.println("1. Add Shipment");
        System.out.println("2. View All Shipments");
        System.out.println("3. Search Shipment");
        System.out.println("4. Update Shipment Status");
        System.out.println("5. Calculate Shipment Cost");
        System.out.println("6. Exit");
        System.out.println("========================================");
    }

    /**
     * Handles adding a new shipment with input validation and duplicate check.
     */
    private static void addShipment(Scanner scanner, ShipmentManager manager) {
        System.out.println("\n--- Add New Shipment ---");

        String shipmentId = readNonEmptyString(scanner, "Enter Shipment ID: ");

        // Check for duplicate ID before proceeding
        if (manager.isIdExists(shipmentId)) {
            System.out.println("[Error] A shipment with ID '" + shipmentId + "' already exists. Duplicate IDs are not allowed.");
            return;
        }

        String senderName = readNonEmptyString(scanner, "Enter Sender Name: ");
        String receiverName = readNonEmptyString(scanner, "Enter Receiver Name: ");
        String source = readNonEmptyString(scanner, "Enter Source Location: ");
        String destination = readNonEmptyString(scanner, "Enter Destination Location: ");
        String packageDescription = readNonEmptyString(scanner, "Enter Package Description: ");
        double weight = readPositiveDouble(scanner, "Enter Weight in kg: ");

        // Calculate cost using CostCalculator
        double cost = CostCalculator.calculateCost(weight);

        // Create shipment object
        Shipment newShipment = new Shipment(shipmentId, senderName, receiverName, 
                                           source, destination, packageDescription, 
                                           weight, cost);

        // Add to manager
        boolean added = manager.addShipment(newShipment);
        if (added) {
            System.out.println("\n----------------------------------------");
            System.out.println("Shipment added successfully!");
            System.out.println("Calculated Cost: Rs. " + String.format("%.2f", cost));
            System.out.println("Status Assigned: " + newShipment.getStatus());
            System.out.println("----------------------------------------");
        } else {
            System.out.println("[Error] Failed to add shipment. Please try again.");
        }
    }

    /**
     * Displays all stored shipments.
     */
    private static void viewAllShipments(ShipmentManager manager) {
        System.out.println("\n--- View All Shipments ---");

        if (manager.isEmpty()) {
            System.out.println("No shipments available.");
            return;
        }

        ArrayList<Shipment> list = manager.getAllShipments();
        for (Shipment s : list) {
            System.out.println(s);
        }
        System.out.println("Total Shipments: " + manager.getShipmentCount());
    }

    /**
     * Searches for a shipment by its ID and displays its details.
     */
    private static void searchShipment(Scanner scanner, ShipmentManager manager) {
        System.out.println("\n--- Search Shipment ---");
        String shipmentId = readNonEmptyString(scanner, "Enter Shipment ID to search: ");

        Shipment shipment = manager.searchShipmentById(shipmentId);
        if (shipment != null) {
            System.out.println("\nShipment details found:");
            System.out.println(shipment);
        } else {
            System.out.println("Shipment not found.");
        }
    }

    /**
     * Updates the status of an existing shipment.
     */
    private static void updateShipmentStatus(Scanner scanner, ShipmentManager manager) {
        System.out.println("\n--- Update Shipment Status ---");
        String shipmentId = readNonEmptyString(scanner, "Enter Shipment ID to update: ");

        Shipment shipment = manager.searchShipmentById(shipmentId);
        if (shipment == null) {
            System.out.println("Shipment not found.");
            return;
        }

        System.out.println("Current Status: " + shipment.getStatus());
        System.out.println("\nSelect New Status:");
        System.out.println("1. CREATED");
        System.out.println("2. IN_TRANSIT");
        System.out.println("3. DELIVERED");
        System.out.println("4. CANCELLED");

        System.out.print("Enter status option (1-4): ");
        String statusChoice = scanner.nextLine().trim();

        ShipmentStatus newStatus = null;
        switch (statusChoice) {
            case "1":
                newStatus = ShipmentStatus.CREATED;
                break;
            case "2":
                newStatus = ShipmentStatus.IN_TRANSIT;
                break;
            case "3":
                newStatus = ShipmentStatus.DELIVERED;
                break;
            case "4":
                newStatus = ShipmentStatus.CANCELLED;
                break;
            default:
                System.out.println("[Error] Invalid status choice. Status update cancelled.");
                return;
        }

        boolean updated = manager.updateShipmentStatus(shipmentId, newStatus);
        if (updated) {
            System.out.println("\nShipment status updated to " + newStatus + " successfully!");
        } else {
            System.out.println("[Error] Failed to update shipment status.");
        }
    }

    /**
     * Standalone utility to calculate shipment cost without creating a shipment.
     */
    private static void calculateShipmentCost(Scanner scanner) {
        System.out.println("\n--- Calculate Shipment Cost ---");
        double weight = readPositiveDouble(scanner, "Enter Weight in kg: ");

        try {
            double cost = CostCalculator.calculateCost(weight);
            System.out.println("Estimated Shipping Cost: Rs. " + String.format("%.2f", cost));
        } catch (IllegalArgumentException e) {
            System.out.println("[Error] " + e.getMessage());
        }
    }

    /**
     * Helper method to read a non-empty string from console.
     */
    private static String readNonEmptyString(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = scanner.nextLine().trim();
            if (!input.isEmpty()) {
                return input;
            }
            System.out.println("[Error] Input cannot be empty. Please enter a valid value.");
        }
    }

    /**
     * Helper method to read a positive double value safely from console.
     */
    private static double readPositiveDouble(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = scanner.nextLine().trim();
            try {
                double value = Double.parseDouble(input);
                if (value > 0) {
                    return value;
                } else {
                    System.out.println("[Error] Value must be greater than 0.");
                }
            } catch (NumberFormatException e) {
                System.out.println("[Error] Invalid number. Please enter a valid numeric value.");
            }
        }
    }
}
