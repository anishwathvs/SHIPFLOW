import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

/**
 * Manages database connectivity to Supabase PostgreSQL using JDBC.
 * Reads connection credentials securely from environment variables or local .env file.
 * Enforces SSL and avoids exposing sensitive credentials.
 */
public class DatabaseConnection {

    // Environment variable keys
    public static final String ENV_DB_URL = "SUPABASE_DB_URL";
    public static final String ENV_DB_USER = "SUPABASE_DB_USER";
    public static final String ENV_DB_PASSWORD = "SUPABASE_DB_PASSWORD";

    private static final Map<String, String> dotEnvProperties = new HashMap<>();

    // Load PostgreSQL Driver & check local .env
    static {
        try {
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("[DatabaseConnection] PostgreSQL JDBC Driver not found on classpath.");
        }
        loadDotEnv();
    }

    /**
     * Loads key-value pairs from .env if present in root or working directory.
     */
    private static void loadDotEnv() {
        File[] possibleFiles = new File[] {
            new File(".env"),
            new File("../.env")
        };

        for (File f : possibleFiles) {
            if (f.exists() && f.isFile()) {
                try (BufferedReader reader = new BufferedReader(new FileReader(f))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#")) {
                            continue;
                        }
                        int idx = line.indexOf('=');
                        if (idx > 0) {
                            String key = line.substring(0, idx).trim();
                            String val = line.substring(idx + 1).trim();
                            // Strip enclosing quotes if present
                            if ((val.startsWith("\"") && val.endsWith("\"")) || (val.startsWith("'") && val.endsWith("'"))) {
                                val = val.substring(1, val.length() - 1);
                            }
                            dotEnvProperties.put(key, val);
                        }
                    }
                } catch (IOException ignored) {
                }
                break;
            }
        }
    }

    /**
     * Retrieves a configuration setting from System Environment first, then .env file.
     */
    public static String getProperty(String key) {
        String sysVal = System.getenv(key);
        if (sysVal != null && !sysVal.trim().isEmpty()) {
            return sysVal.trim();
        }
        return dotEnvProperties.getOrDefault(key, null);
    }

    /**
     * Checks whether all required connection properties are set and non-empty.
     * 
     * @return true if SUPABASE_DB_URL, SUPABASE_DB_USER, and SUPABASE_DB_PASSWORD are set
     */
    public static boolean isConfigured() {
        String url = getProperty(ENV_DB_URL);
        String user = getProperty(ENV_DB_USER);
        String password = getProperty(ENV_DB_PASSWORD);

        return url != null && !url.trim().isEmpty() &&
               user != null && !user.trim().isEmpty() &&
               password != null && !password.trim().isEmpty();
    }

    /**
     * Creates and returns a new JDBC Connection to Supabase PostgreSQL.
     * Enforces SSL for secure cloud connectivity.
     * 
     * @return active java.sql.Connection object
     * @throws SQLException if connection fails or credentials are missing
     */
    public static Connection getConnection() throws SQLException {
        if (!isConfigured()) {
            throw new SQLException("Database credentials not configured. Please set " + 
                                  ENV_DB_URL + ", " + ENV_DB_USER + ", and " + ENV_DB_PASSWORD + " in environment or .env file.");
        }

        String dbUrl = getProperty(ENV_DB_URL);
        String user = getProperty(ENV_DB_USER);
        String password = getProperty(ENV_DB_PASSWORD);

        // Ensure JDBC prefix is present
        if (!dbUrl.startsWith("jdbc:postgresql://")) {
            if (dbUrl.startsWith("postgresql://")) {
                dbUrl = "jdbc:" + dbUrl;
            } else {
                dbUrl = "jdbc:postgresql://" + dbUrl;
            }
        }

        Properties props = new Properties();
        props.setProperty("user", user);
        props.setProperty("password", password);
        props.setProperty("ssl", "true");
        props.setProperty("sslmode", "require");
        props.setProperty("connectTimeout", "5"); // 5s connection timeout to fail fast

        return DriverManager.getConnection(dbUrl, props);
    }

    /**
     * Actively tests the database connection by executing a lightweight query.
     * 
     * @return true if database responds to query, false otherwise
     */
    public static boolean testConnection() {
        if (!isConfigured()) {
            return false;
        }

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT 1");
             ResultSet rs = stmt.executeQuery()) {
            return rs.next();
        } catch (SQLException e) {
            return false;
        }
    }

    /**
     * Executes the SQL schema script to ensure tables exist in Supabase.
     */
    public static boolean executeSchema(String sqlFilePath) {
        if (!isConfigured()) {
            return false;
        }

        File sqlFile = new File(sqlFilePath);
        if (!sqlFile.exists()) {
            return false;
        }

        StringBuilder sb = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new FileReader(sqlFile))) {
            String line;
            while ((line = br.readLine()) != null) {
                sb.append(line).append("\n");
            }
        } catch (IOException e) {
            System.err.println("[DatabaseConnection] Error reading schema file: " + e.getMessage());
            return false;
        }

        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement()) {
            stmt.execute(sb.toString());
            return true;
        } catch (SQLException e) {
            System.err.println("[DatabaseConnection] Error executing schema: " + e.getMessage());
            return false;
        }
    }
}
