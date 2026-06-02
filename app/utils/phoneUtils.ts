import {
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumber,
  AsYouType,
  CountryCode,
} from "libphonenumber-js";

/**
 * Get all supported countries with their metadata
 * Uses libphonenumber-js as the single source of truth
 * @returns Array of countries with code, name, and dial code
 */
export function getSupportedCountries() {
  const countries = getCountries();
  return countries
    .map((code) => {
      try {
        const dialCode = `+${getCountryCallingCode(code)}`;
        // Get country name from Intl API
        const regionNames = new Intl.DisplayNames(["en"], {
          type: "region",
        });
        const name = regionNames.of(code) || code;

        return {
          code,
          name,
          dial_code: dialCode,
        };
      } catch (error) {
        // Skip countries that can't be retrieved
        return null;
      }
    })
    .filter((country) => country !== null) as Array<{
    code: string;
    name: string;
    dial_code: string;
  }>;
}

/**
 * Get max phone number length for a country
 * Returns a reasonable max length for phone input based on country
 * @param countryCode - ISO country code (e.g., 'US')
 * @returns Maximum length for national phone number (without dial code)
 */
export function getMaxPhoneLengthForCountry(countryCode: string): number {
  // Mapping of countries to max phone lengths based on their national formats
  // Most countries have phone numbers between 7-15 digits
  const lengthMap: Record<string, number> = {
    // North America
    US: 10,
    CA: 10,
    MX: 10,
    // Europe
    GB: 10,
    FR: 9,
    DE: 11,
    IT: 10,
    ES: 9,
    // Asia
    CN: 11,
    IN: 10,
    JP: 10,
    KR: 10,
    // Australia/Oceania
    AU: 9,
    NZ: 9,
    // Use 15 as safe default for unlisted countries
  };

  return lengthMap[countryCode] || 15;
}

/**
 * Format phone number as user types
 * @param phoneNumber - The phone number input
 * @param countryCode - ISO country code (e.g., 'US')
 * @returns Formatted phone number
 */
export function formatPhoneNumberAsYouType(
  phoneNumber: string,
  countryCode: string
): string {
  const formatter = new AsYouType(countryCode as CountryCode);
  return formatter.input(phoneNumber);
}

/**
 * Validate a phone number for a given country
 * @param phoneNumber - The phone number to validate (without dial code)
 * @param dialCode - The dial code (e.g., '+1')
 * @param countryCode - ISO country code (e.g., 'US')
 * @returns True if valid, false otherwise
 */
export function validatePhoneNumber(
  phoneNumber: string,
  dialCode: string,
  countryCode: string
): boolean {
  if (!phoneNumber || !dialCode || !countryCode) {
    return false;
  }

  const fullPhoneNumber = `${dialCode}${phoneNumber}`;
  return isValidPhoneNumber(fullPhoneNumber, countryCode as CountryCode);
}

/**
 * Parse a phone number to get its components
 * @param phoneNumber - Full phone number with dial code
 * @param countryCode - ISO country code fallback
 * @returns Parsed phone number object or null
 */
export function parsePhone(phoneNumber: string, countryCode?: string) {
  try {
    const parsed = parsePhoneNumber(
      phoneNumber,
      countryCode as CountryCode | undefined
    );
    return parsed
      ? {
          nationalNumber: parsed.nationalNumber,
          countryCallingCode: parsed.countryCallingCode,
          country: parsed.country,
          isValid: parsed.isValid(),
          formatInternational: parsed.formatInternational(),
          formatNational: parsed.formatNational(),
        }
      : null;
  } catch (error) {
    return null;
  }
}

/**
 * Get dial code for a country code
 * @param countryCode - ISO country code (e.g., 'US')
 * @returns Dial code including + (e.g., '+1')
 */
export function getDialCodeForCountry(countryCode: string): string {
  try {
    return `+${getCountryCallingCode(countryCode as CountryCode)}`;
  } catch (error) {
    return "";
  }
}
