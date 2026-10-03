import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DatabaseConnectionTest {

    @Test
    @DisplayName("Verify Supabase PostgreSQL connection with configured credentials")
    void testSupabaseConnection() {
        assertTrue(DatabaseConnection.isConfigured(), "Database should be configured via .env");
        boolean connected = DatabaseConnection.testConnection();
        assertTrue(connected, "Real connection to Supabase PostgreSQL should succeed");
    }
}
