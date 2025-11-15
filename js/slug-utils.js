// ========================================
// Slug Generation Utilities
// ========================================

/**
 * Generates a URL-friendly slug from a title
 * @param {string} title - The property title
 * @returns {string} URL-friendly slug
 */
function generateSlug(title) {
    return title
        .toLowerCase()
        .normalize('NFD') // Normalize to decomposed form
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Checks if a slug already exists in Firestore
 * @param {string} slug - The slug to check
 * @param {string} excludeId - Property ID to exclude from check (for updates)
 * @returns {Promise<boolean>} True if slug exists
 */
async function slugExists(slug, excludeId = null) {
    try {
        const snapshot = await firebaseDB
            .collection('properties')
            .where('slug', '==', slug)
            .get();

        if (snapshot.empty) {
            return false;
        }

        // If editing, exclude current property
        if (excludeId) {
            return snapshot.docs.some(doc => doc.id !== excludeId);
        }

        return true;
    } catch (error) {
        console.error('Error checking slug:', error);
        return false;
    }
}

/**
 * Generates a unique slug by appending a number if necessary
 * @param {string} title - The property title
 * @param {string} excludeId - Property ID to exclude from check (for updates)
 * @returns {Promise<string>} Unique slug
 */
async function generateUniqueSlug(title, excludeId = null) {
    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    // Keep incrementing counter until we find a unique slug
    while (await slugExists(slug, excludeId)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
}

/**
 * Gets property data by slug
 * @param {string} slug - The property slug
 * @returns {Promise<Object|null>} Property data with ID or null if not found
 */
async function getPropertyBySlug(slug) {
    try {
        const snapshot = await firebaseDB
            .collection('properties')
            .where('slug', '==', slug)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data()
        };
    } catch (error) {
        console.error('Error fetching property by slug:', error);
        return null;
    }
}
