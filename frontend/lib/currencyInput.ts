/**
 * Currency input formatting utilities for Brazilian Real (BRL)
 * Treats the last 2 digits as decimals automatically
 */

/**
 * Formats a string of digits to BRL currency format
 * Last 2 digits are always treated as decimals
 * @param digits - String containing only digits
 * @returns Formatted string (e.g., "1.234,56")
 * @example
 * formatDigitsToBrl("1234") // "12,34"
 * formatDigitsToBrl("123456") // "1.234,56"
 * formatDigitsToBrl("50") // "0,50"
 */
export function formatDigitsToBrl(digits: string): string {
  if (!digits) return "";

  // Remove any non-digit characters
  const sanitized = digits.replace(/\D/g, "");
  
  if (sanitized === "") return "";

  // Treat last 2 digits as decimals
  if (sanitized.length <= 2) {
    // 1-2 digits: 0,0X or 0,XY
    return `0,${sanitized.padStart(2, "0")}`;
  } else {
    // 3+ digits: split last 2 as decimals
    const intPart = sanitized.slice(0, -2);
    const decPart = sanitized.slice(-2);
    
    // Remove leading zeros from integer part
    const intPartClean = parseInt(intPart, 10).toString();
    
    // Add thousands separator (dot)
    const formattedInt = intPartClean.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      "."
    );
    
    return `${formattedInt},${decPart}`;
  }
}

/**
 * Converts a string of digits to a numeric value
 * Last 2 digits are treated as decimals
 * @param digits - String containing only digits
 * @returns Numeric value
 * @example
 * digitsToNumber("1234") // 12.34
 * digitsToNumber("50") // 0.50
 */
export function digitsToNumber(digits: string): number {
  if (!digits) return 0;
  
  const sanitized = digits.replace(/\D/g, "");
  if (sanitized === "") return 0;
  
  return parseInt(sanitized, 10) / 100;
}

/**
 * Extracts only digits from input string
 * @param input - Input string
 * @returns String containing only digits
 */
export function extractDigits(input: string): string {
  return input.replace(/\D/g, "");
}

