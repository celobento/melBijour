/**
 * PIX EMV QR Code Generator
 * Generates proper PIX payment codes following Brazilian PIX standards
 */

export interface PixPaymentData {
    pixKey: string;
    amount: number;
    merchantName: string;
    merchantCity: string;
    description?: string;
  }
  
  export function generatePixCode(data: PixPaymentData): string {
    const { pixKey, amount, merchantName, merchantCity, description } = data;
    
    // Format amount to 2 decimal places
    const formattedAmount = amount.toFixed(2);
    console.log(description);
    const descriptionOnlyNumbersAndLetters = description?.replace(/[^a-zA-Z0-9]/g, '');
    console.log(descriptionOnlyNumbersAndLetters);
    // Build EMV QR Code payload
    const payload = [
      "000201", // Payload Format Indicator
      `26${4+"0014br.gov.bcb.pix".length+pixKey.length}0014br.gov.bcb.pix`, // Point of Initiation Method
      `01${pixKey.length}${pixKey}`, // PIX Key (ID 01)
      "520400005303986", // Merchant Category Code (ID 52)
      `540${formattedAmount.length}${formattedAmount}`, // Transaction Amount (ID 54)
      "5802BR", // Transaction Currency (ID 58)
      `59${merchantName.replace(/[^a-zA-Z0-9]/g, '').length.toString().padStart(2, '0')}${merchantName.replace(/[^a-zA-Z0-9]/g, '')}`, // Merchant Name (ID 59)
      `60${merchantCity.replace(/[^a-zA-Z0-9]/g, '').length.toString().padStart(2, '0')}${merchantCity.replace(/[^a-zA-Z0-9]/g, '') }`, // Merchant City (ID 60)
      descriptionOnlyNumbersAndLetters ? `62${(descriptionOnlyNumbersAndLetters.length+4).toString().padStart(2, '0')}05${(descriptionOnlyNumbersAndLetters.length).toString().padStart(2, '0')}${descriptionOnlyNumbersAndLetters}` : "", // Additional Data (ID 62)
      "6304" // CRC16 (ID 63)
    ].filter(Boolean).join("");
  
    // description only number and letters
    
  
    // Calculate CRC16 checksum
    const crc = calculateCRC16(payload);
    
    return payload + crc.toString(16).padStart(4, '0').toUpperCase();
  }
  
  /**
   * Calculate CRC16 checksum for EMV QR Code
   * Uses the correct CRC16-CCITT algorithm for PIX
   */
  function calculateCRC16(data: string): number {
    let crc = 0xFFFF;
    
    for (let i = 0; i < data.length; i++) {
      crc ^= data.charCodeAt(i) << 8;
      
      for (let j = 0; j < 8; j++) {
        if (crc & 0x8000) {
          crc = (crc << 1) ^ 0x1021;
        } else {
          crc = crc << 1;
        }
      }
    }
    
    return crc & 0xFFFF;
  }
  
  /**
   * Validate PIX key format
   */
  export function isValidPixKey(pixKey: string): boolean {
    if (!pixKey || pixKey.length < 5) return false;
    
    // Check if it's an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(pixKey)) return true;
    
    // Check if it's a phone number (Brazilian format)
    const phoneRegex = /^\+?55\d{10,11}$/;
    if (phoneRegex.test(pixKey.replace(/\D/g, ''))) return true;
    
    // Check if it's a CPF/CNPJ
    const cpfCnpjRegex = /^\d{11}$|^\d{14}$/;
    if (cpfCnpjRegex.test(pixKey.replace(/\D/g, ''))) return true;
    
    // Check if it's a random key (UUID-like)
    const randomKeyRegex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
    if (randomKeyRegex.test(pixKey)) return true;
    
    return false;
  }
  