// User

export interface IUser {
    id: number // Auto Increment (Local ID)
    first_name: string,
    last_name: string,
    theme_preference: "light" | "dark" | "system"
}

// ---- Interfaces for Pagination-Compatible Storage Infrastructure ----

export interface IContextMetadata {
    contextId: string; // PK
    nextCursor: string | null;
    totalItems: number; // Number of records saved
    lastSync: number;
}

export interface IPaginatedItem {
    id: string; // UUIDv7 coming from backend response
    contextId: string; // The context to which it belongs
    index: number;
    dataId: string; // FK
    itemType: 'note' | 'collection';
    createdAt: number; // Timestamp for cache invalidation
}

// Confirmation Modal User Preference

export interface UserConfirmationPreferences {
  id: string;      // Context ID of the Confirmation Dialog
  skipped: boolean; // Indicates whether the dialog will be shown again later
}