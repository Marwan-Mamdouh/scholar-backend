/**
 * Canonical matcher mapping raw company name strings to tracked company IDs.
 * Used for aggregating company job statistics.
 */
export function matchCompanyId(companyName?: string | null): string | null {
  if (!companyName) return null;
  const name = companyName.trim();
  const lower = name.toLowerCase();

  // 1. Siemens entities
  if (lower.includes("siemens energy")) return "siemens-energy";
  if (lower.includes("siemens gamesa")) return "siemens-gamesa";
  if (
    lower.includes("siemens digital industries") ||
    lower.includes("siemens dis") ||
    lower.includes("siemens eda") ||
    lower.includes("mentor graphics")
  ) {
    return "siemens-dis";
  }
  if (lower.includes("siemens")) return "siemens";

  // 2. STMicroelectronics
  if (lower.includes("stmicro") || lower.includes("st micro")) {
    return "stmicroelectronics";
  }

  // 3. MediaTek
  if (lower.includes("mediatek")) return "mediatek";

  // 4. Analog Devices (ADI)
  if (lower.includes("analog devices") || /\badi\b/i.test(name)) {
    return "analog-devices";
  }

  // 5. Intel Corporation
  if (/\bintel\b/i.test(name)) return "intel";

  // 6. Texas Instruments (TI)
  if (lower.includes("texas instruments") || /\bti\b/i.test(name)) {
    return "texas-instruments";
  }

  // 7. Infineon Technologies
  if (lower.includes("infineon")) return "infineon";

  // 8. Capgemini
  if (lower.includes("capgemini")) return "capgemini";

  // 9. Cisco
  if (/\bcisco\b/i.test(name)) return "cisco";

  // 10. InfiniLink
  if (lower.includes("infinilink")) return "infinilink";

  // 11. Valeo
  if (/\bvaleo\b/i.test(name)) return "valeo";

  // 12. Dell Technologies
  if (/\bdell\b/i.test(name)) return "dell";

  // 13. Vodafone
  if (lower.includes("vodafone") || /\b_?vois\b/i.test(name)) {
    return "vodafone";
  }

  // 14. ISS INTERNATIONAL
  if (lower.includes("iss international")) return "iss-international";

  // 15. Mixel
  if (lower.includes("mixel")) return "mixel";

  return null;
}
