/**
 * API Service Entry Point
 */

// 1. API Servisini "apiService" takma adıyla dışarı aktar
import apiService from './api.service';
import noteService from './note.service';
import collectionService from './collection.service';
import trashService from './trash.service';

export { noteService, collectionService, trashService };
export default apiService;