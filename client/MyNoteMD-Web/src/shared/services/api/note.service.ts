import apiService from './api.service';

/**
 * Note related API operations
 */
export const noteService = {
  /**
   * Get a paginated list of notes
   */
  list: (params: { cursor?: string | null; search?: string } = {}) => 
    apiService.get('/notes', { params }),

  /**
   * Get a single note by ID
   */
  getById: (id: string) => 
    apiService.get(`/notes/${id}`),

  /**
   * Create a new note
   */
  create: (data: { title: string; collectionId: string }) => 
    apiService.post('/notes', data),

  /**
   * Update a note (e.g. content)
   */
  update: (id: string, data: { content?: string; title?: string }, config = {}) => 
    apiService.patch(`/notes/${id}`, data, config),

  /**
   * Delete a note
   */
  delete: (id: string) => 
    apiService.delete(`/notes/${id}`),

  /**
   * Publish a draft note to public
   */
  publish: (id: string) => 
    apiService.post(`/notes/${id}/publish`, {}),

  /**
   * Toggle note visibility (public/private)
   */
  toggleVisibility: (id: string) => 
    apiService.post(`/notes/${id}/toggle-visibility`, {}),

  /**
   * Move note to a different collection
   */
  move: (id: string, targetCollectionId: string) => 
    apiService.patch(`/notes/${id}/move`, { targetCollectionId })
};

export default noteService;
