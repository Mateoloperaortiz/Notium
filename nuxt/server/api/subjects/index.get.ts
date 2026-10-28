import { SubjectsService } from '#server/services/SubjectsService.js';

export default defineEventHandler(() => SubjectsService.findAll());
