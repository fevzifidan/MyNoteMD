import apiService from './api.service';

/**
 * Collection related API operations
 */
export const collectionService = {
  /**
   * Get a paginated list of collections
   */
  list: (params: { cursor?: string | null; search?: string } = {}) => 
    apiService.get('/collections', { params }),

  /**
   * Get a paginated list of notes within a specific collection
   */
  getNotes: (id: string, params: { cursor?: string | null; search?: string } = {}) => 
    apiService.get(`/collections/${id}/notes`, { params }),

  /**
   * Get collection lookup data for dropdowns
   */
  lookup: () => 
    apiService.get('/collections/lookup'),

  /**
   * Get note lookup data within a specific collection
   */
  getNotesLookup: (id: string) => 
    apiService.get(`/collections/${id}/notes/lookup`),

  /**
   * Create a new collection
   */
  create: (data: { name: string }) => 
    apiService.post('/collections', data),

  /**
   * Update a collection (e.g. rename)
   */
  update: (id: string, data: { name: string }) => 
    apiService.patch(`/collections/${id}`, data),

  /**
   * Delete a collection
   */
  delete: (id: string) => 
    apiService.delete(`/collections/${id}`)
};

export default collectionService;
