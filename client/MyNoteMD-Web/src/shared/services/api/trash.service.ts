import apiService from './api.service';

/**
 * Trash related API operations
 */
export const trashService = {
  /**
   * Get a paginated list of items in trash
   */
  list: (params: { cursor?: string | null; limit?: number } = {}) => 
    apiService.get('/trash', { params }),

  /**
   * Permanently delete an item from trash
   */
  permanentDelete: (type: string, id: string) => 
    apiService.delete(`/trash/${type}/${id}`),

  /**
   * Restore a deleted item from trash
   */
  restore: (type: string, id: string) => 
    apiService.post(`/trash/${type}/${id}/restore`, {})
};

export default trashService;
