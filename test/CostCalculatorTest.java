import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests verifying tiered tariff calculation rules in CostCalculator.
 */
class CostCalculatorTest {

    @ParameterizedTest(name = "Weight {0} kg should cost Rs. {1}")
    @CsvSource({
        "0.5, 50.0",
        "1.0, 50.0",
        "3.0, 90.0",
        "5.0, 130.0",
        "7.0, 160.0",
        "10.0, 205.0",
        "12.0, 225.0"
    })
    @DisplayName("Should accurately calculate tiered freight cost across all weight slabs")
    void testValidWeightCostCalculation(double weight, double expectedCost) {
        double actualCost = CostCalculator.calculateCost(weight);
        assertEquals(expectedCost, actualCost, 0.001);
    }

    @ParameterizedTest(name = "Invalid weight: {0}")
    @ValueSource(doubles = {0.0, -1.0, -15.5})
    @DisplayName("Should throw IllegalArgumentException on zero or negative weights")
    void testInvalidWeightThrowsException(double invalidWeight) {
        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> CostCalculator.calculateCost(invalidWeight)
        );
        assertTrue(ex.getMessage().contains("greater than 0"));
    }
}
