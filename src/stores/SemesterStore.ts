import type { SemesterInterface } from '@/interfaces/SemesterInterface.js';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export const useSemesterStore = defineStore(
  'semester',
  (): { semester: Ref<SemesterInterface[]> } => {
    const semester = ref<SemesterInterface[]>([]);

    return { semester };
  },
);
