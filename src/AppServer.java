/**
 * Dedicated server entry point to launch the REST API server.
 */
public class AppServer {

    public static final int DEFAULT_PORT = 8080;

    public static void main(String[] args) {
        int port = DEFAULT_PORT;
        if (args.length > 0) {
            try {
                port = Integer.parseInt(args[0]);
            } catch (NumberFormatException e) {
                System.out.println("Invalid port provided. Using default port: " + DEFAULT_PORT);
            }
        }

        ShipmentService service = new ShipmentService();
        ShipmentController controller = new ShipmentController(service);

        try {
            controller.startServer(port);
            System.out.println("[AppServer] Ready to accept frontend requests.");
        } catch (Exception e) {
            System.err.println("[AppServer] Failed to start server: " + e.getMessage());
        }
    }
}
