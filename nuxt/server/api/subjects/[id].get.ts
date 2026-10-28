import { SubjectsService } from '#server/services/SubjectsService.js';

export default defineEventHandler((event) =>
  SubjectsService.findOne(Number(getRouterParam(event, 'id'))),
);
