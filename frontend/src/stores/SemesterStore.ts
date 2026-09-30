import type { SemesterInterface } from '@/interfaces/SemesterInterface.js';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

/** Holds every semester; only SemesterService reads or writes it. */
export const useSemesterStore = defineStore(
  'semester',
  (): { semesters: Ref<SemesterInterface[]> } => {
    const semesters = ref<SemesterInterface[]>([]);

    return { semesters };
  },
);
