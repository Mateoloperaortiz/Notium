import { gradeSeeder } from './seeders/gradeseeder.js';
import { semesterSeeder } from './seeders/semesterseeder.js';
import { subjectSeeder } from './seeders/subjectseeder.js';
import { userSeeder } from './seeders/userseeder.js';
import { createPinia, type Pinia } from 'pinia';
import { watch } from 'vue';

/** Creates Pinia and keeps its state in localStorage between visits. */
export default class PiniaConfig {
  /** Restores the saved state or loads the seeders on the first run, then saves every change. */
  public static init(): Pinia {
    const pinia = createPinia();

    const savedState = localStorage.getItem('piniaStateV2');
    if (savedState) {
      pinia.state.value = JSON.parse(savedState);
    } else {
      pinia.state.value = {
        user: {
          users: userSeeder,
        },
        semester: {
          semesters: semesterSeeder,
        },
        subject: {
          subjects: subjectSeeder,
        },
        grade: {
          grades: gradeSeeder,
        },
      };

      localStorage.setItem('piniaStateV2', JSON.stringify(pinia.state.value));
    }

    watch(
      pinia.state,
      (state: typeof pinia.state.value): void => {
        localStorage.setItem('piniaStateV2', JSON.stringify(state));
      },
      { deep: true },
    );

    return pinia;
  }
}
