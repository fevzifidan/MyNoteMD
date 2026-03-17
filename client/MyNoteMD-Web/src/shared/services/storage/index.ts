/**
 * Storage Service Entry Point
 */

// 1. Export all type definitions
export * from './types';

// 2. Export database instance
// (This is required for using liveQuery in components)
export { db } from './db';

// 3. Export Pagination Service as "storage"
import { paginationStorage as storage } from './pagination-storage.service';

export default storage;