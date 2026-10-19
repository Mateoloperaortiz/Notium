import { SubjectsService } from '../../services/SubjectsService.js';

export default defineEventHandler(() => SubjectsService.findAll());
