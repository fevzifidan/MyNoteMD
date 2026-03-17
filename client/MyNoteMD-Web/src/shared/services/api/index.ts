/**
 * API Service Entry Point
 */

// 1. Export API Service as "apiService"
import apiService from './api.service';
import noteService from './note.service';
import collectionService from './collection.service';
import trashService from './trash.service';

export { noteService, collectionService, trashService };
export default apiService;