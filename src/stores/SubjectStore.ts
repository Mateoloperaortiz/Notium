import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export const useSubjectStore = defineStore('subject', (): { subjects: Ref<SubjectInterface[]> } => {
  const subjects = ref<SubjectInterface[]>([]);

  return { subjects };
});
