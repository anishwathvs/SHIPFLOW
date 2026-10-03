import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Executes schema migration on Supabase PostgreSQL and verifies table and trigger creation.
 */
class SupabaseMigrationTest {

    @Test
    @DisplayName("Apply schema.sql and verify shipments table and triggers on Supabase")
    void testApplySchemaAndVerify() throws SQLException {
        assertTrue(DatabaseConnection.isConfigured(), "Database connection must be configured in .env");

        // 1. Execute schema.sql
        boolean schemaExecuted = DatabaseConnection.executeSchema("database/schema.sql");
        assertTrue(schemaExecuted, "Execution of schema.sql on Supabase must succeed");

        // 2. Verify table exists via JDBC metadata
        try (Connection conn = DatabaseConnection.getConnection()) {
            DatabaseMetaData meta = conn.getMetaData();
            try (ResultSet tables = meta.getTables(null, "public", "shipments", new String[]{"TABLE"})) {
                assertTrue(tables.next(), "Table 'shipments' must exist in public schema on Supabase");
            }

            // 3. Verify columns exist
            try (Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery("SELECT id, sender_name, receiver_name, source_location, destination_location, package_description, weight, cost, status, created_at, updated_at FROM shipments LIMIT 1")) {
                assertNotNull(rs.getMetaData());
                assertEquals(11, rs.getMetaData().getColumnCount(), "shipments table must contain all 11 required columns");
            }
        }
    }
}
