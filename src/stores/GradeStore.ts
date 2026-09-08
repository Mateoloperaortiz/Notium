import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export const useGradeStore = defineStore('grade', (): { grade: Ref<GradeInterface[]> } => {
  const grade = ref<GradeInterface[]>([]);

  return { grade };
});
