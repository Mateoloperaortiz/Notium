import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export const useGradeStore = defineStore('grade', (): { grades: Ref<GradeInterface[]> } => {
  const grades = ref<GradeInterface[]>([]);

  return { grades };
});
