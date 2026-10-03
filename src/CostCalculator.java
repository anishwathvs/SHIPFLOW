/**
 * Calculates the shipping cost based on the weight of the package.
 * Demonstrates the Single Responsibility Principle (SRP) by isolating
 * business/pricing calculations from data models and UI logic.
 */
public class CostCalculator {

    /**
     * Calculates the shipping cost based on tiered weight slabs.
     * 
     * Slab Rules:
     * - Up to 1 kg        : Rs. 50
     * - Above 1 to 5 kg   : Rs. 50 + Rs. 20 per kg above 1 kg
     * - Above 5 to 10 kg  : Rs. 130 + Rs. 15 per kg above 5 kg
     * - Above 10 kg       : Rs. 205 + Rs. 10 per kg above 10 kg
     * 
     * @param weight Weight in kilograms (must be > 0)
     * @return Calculated shipping cost in Rupees
     * @throws IllegalArgumentException if weight <= 0
     */
    public static double calculateCost(double weight) {
        // Validation: weight must be strictly positive
        if (weight <= 0) {
            throw new IllegalArgumentException("Weight must be greater than 0 kg.");
        }

        // Slab 1: Up to 1 kg
        if (weight <= 1.0) {
            return 50.0;
        } 
        // Slab 2: Above 1 kg up to 5 kg
        else if (weight <= 5.0) {
            return 50.0 + ((weight - 1.0) * 20.0);
        } 
        // Slab 3: Above 5 kg up to 10 kg
        else if (weight <= 10.0) {
            return 130.0 + ((weight - 5.0) * 15.0);
        } 
        // Slab 4: Above 10 kg
        else {
            return 205.0 + ((weight - 10.0) * 10.0);
        }
    }
}
