import { SubjectsService } from '../../services/SubjectsService.js';

export default defineEventHandler((event) => SubjectsService.findOne(getRouterParam(event, 'id')));
