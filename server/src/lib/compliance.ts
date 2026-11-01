// Ecozza Green Centralized Compliance & Regulatory Constants
// Strict adherence to Indian Fertilizer (Control) Order and advertising rules

export const COMPLIANCE_CONFIG = {
  BRAND_NAME: "Ecozza Green",
  LOCATION: "Gujarat, India",
  TAGLINE: "Carbon-Rich Soil, Built to Last",
  CLASSIFICATION: "Granular Biochar Soil Conditioner",

  // Mandatory disclaimers (Strictly enforced)
  GENERAL_DISCLAIMER:
    "Ecozza Green is a granular biochar soil conditioner designed to enhance soil moisture and nutrient retention. It is NOT a fertilizer and does NOT replace chemical or organic fertilizers. Results vary by soil type, existing organic carbon, and agricultural practices.",

  DOSE_DISCLAIMER:
    "Starting recommendation only. Results vary by soil texture, organic matter levels, and crop stage. Test on a small patch first.",

  LAB_DATA_PENDING: "Awaiting lab data for current production batch",

  LEGAL_PLACEHOLDER_NOTICE:
    "DRAFT POLICY — Subject to final legal review for Ecozza Green. For informational reference only.",

  // Statutory product packaging guidelines
  PACKAGING_SCOOP_NOTE: "Standard scoop size: approx. 50 grams.",
} as const;

export const PROHIBITED_WORDS = [
  "cure",
  "miracle",
  "guaranteed yield",
  "100% yield increase",
  "replaces all fertilizer",
  "sewage sludge",
] as const;

/**
 * Validates text against prohibited marketing claims
 */
export function validateClaim(text: string): { isClean: boolean; violations: string[] } {
  const violations: string[] = [];
  const lower = text.toLowerCase();
  for (const word of PROHIBITED_WORDS) {
    if (lower.includes(word)) {
      violations.push(word);
    }
  }
  return {
    isClean: violations.length === 0,
    violations,
  };
}
