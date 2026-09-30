import type { SemesterInterface } from '@/interfaces/SemesterInterface.js';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export const useSemesterStore = defineStore(
  'semester',
  (): { semesters: Ref<SemesterInterface[]> } => {
    const semesters = ref<SemesterInterface[]>([]);

    return { semesters };
  },
);
