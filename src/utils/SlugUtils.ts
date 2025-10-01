/**
 * Utility functions for creating and parsing URL slugs
 */

// Mapping Vietnamese characters to non-accented characters
const vietnameseMap: Record<string, string> = {
  à: "a",
  á: "a",
  ạ: "a",
  ả: "a",
  ã: "a",
  â: "a",
  ầ: "a",
  ấ: "a",
  ậ: "a",
  ẩ: "a",
  ẫ: "a",
  ă: "a",
  ằ: "a",
  ắ: "a",
  ặ: "a",
  ẳ: "a",
  ẵ: "a",
  è: "e",
  é: "e",
  ẹ: "e",
  ẻ: "e",
  ẽ: "e",
  ê: "e",
  ề: "e",
  ế: "e",
  ệ: "e",
  ể: "e",
  ễ: "e",
  ì: "i",
  í: "i",
  ị: "i",
  ỉ: "i",
  ĩ: "i",
  ò: "o",
  ó: "o",
  ọ: "o",
  ỏ: "o",
  õ: "o",
  ô: "o",
  ồ: "o",
  ố: "o",
  ộ: "o",
  ổ: "o",
  ỗ: "o",
  ơ: "o",
  ờ: "o",
  ớ: "o",
  ợ: "o",
  ở: "o",
  ỡ: "o",
  ù: "u",
  ú: "u",
  ụ: "u",
  ủ: "u",
  ũ: "u",
  ư: "u",
  ừ: "u",
  ứ: "u",
  ự: "u",
  ử: "u",
  ữ: "u",
  ỳ: "y",
  ý: "y",
  ỵ: "y",
  ỷ: "y",
  ỹ: "y",
  đ: "d",
  À: "A",
  Á: "A",
  Ạ: "A",
  Ả: "A",
  Ã: "A",
  Â: "A",
  Ầ: "A",
  Ấ: "A",
  Ậ: "A",
  Ẩ: "A",
  Ẫ: "A",
  Ă: "A",
  Ằ: "A",
  Ắ: "A",
  Ặ: "A",
  Ẳ: "A",
  Ẵ: "A",
  È: "E",
  É: "E",
  Ẹ: "E",
  Ẻ: "E",
  Ẽ: "E",
  Ê: "E",
  Ề: "E",
  Ế: "E",
  Ệ: "E",
  Ể: "E",
  Ễ: "E",
  Ì: "I",
  Í: "I",
  Ị: "I",
  Ỉ: "I",
  Ĩ: "I",
  Ò: "O",
  Ó: "O",
  Ọ: "O",
  Ỏ: "O",
  Õ: "O",
  Ô: "O",
  Ồ: "O",
  Ố: "O",
  Ộ: "O",
  Ổ: "O",
  Ỗ: "O",
  Ơ: "O",
  Ờ: "O",
  Ớ: "O",
  Ợ: "O",
  Ở: "O",
  Ỡ: "O",
  Ù: "U",
  Ú: "U",
  Ụ: "U",
  Ủ: "U",
  Ũ: "U",
  Ư: "U",
  Ừ: "U",
  Ứ: "U",
  Ự: "U",
  Ử: "U",
  Ữ: "U",
  Ỳ: "Y",
  Ý: "Y",
  Ỵ: "Y",
  Ỷ: "Y",
  Ỹ: "Y",
  Đ: "D",
};

/**
 * Convert Vietnamese text to non-accented text
 */
export const removeVietnameseAccents = (str: string): string => {
  return str
    .split("")
    .map((char) => vietnameseMap[char] || char)
    .join("");
};

/**
 * Create URL slug from subject name only
 * Format: "subject-name"
 */
export const createSubjectSlug = (name: string): string => {
  return removeVietnameseAccents(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

/**
 * Subject slug to ID mapping
 * In a real app, this would be stored in a database or cache
 */
const subjectSlugToIdMap: Record<string, string> = {};
const subjectIdToSlugMap: Record<string, string> = {};

/**
 * Store mapping between subject slug and ID
 */
export const storeSubjectMapping = (name: string, id: string): void => {
  const slug = createSubjectSlug(name);
  subjectSlugToIdMap[slug] = id;
  subjectIdToSlugMap[id] = slug;
};

/**
 * Get subject ID from slug
 */
export const getSubjectIdFromSlug = (slug: string): string | null => {
  return subjectSlugToIdMap[slug] || null;
};

/**
 * Get subject slug from ID
 */
export const getSubjectSlugFromId = (id: string): string | null => {
  return subjectIdToSlugMap[id] || null;
};

/**
 * Clear all subject mappings (useful for testing or reset)
 */
export const clearSubjectMappings = (): void => {
  Object.keys(subjectSlugToIdMap).forEach(
    (key) => delete subjectSlugToIdMap[key]
  );
  Object.keys(subjectIdToSlugMap).forEach(
    (key) => delete subjectIdToSlugMap[key]
  );
};

/**
 * Create organization slug from name only
 */
export const createOrganizationSlug = (name: string): string => {
  return removeVietnameseAccents(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Parse organization slug to extract ID
 */
export const parseOrganizationSlug = (slug: string): string | null => {
  if (!slug) return null;

  const parts = slug.split("-");
  const lastPart = parts[parts.length - 1];

  if (lastPart && lastPart.length === 24 && /^[a-f\d]{24}$/i.test(lastPart)) {
    return lastPart;
  }

  return null;
};
