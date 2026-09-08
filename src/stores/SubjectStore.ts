import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export const useSubjectStore = defineStore('subject', (): { subject: Ref<SubjectInterface[]> } => {
  const subject = ref<SubjectInterface[]>([]);

  return { subject };
});
