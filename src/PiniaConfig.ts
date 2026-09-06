import { gradeSeeder } from './seeders/gradeseeder.js';
import { semesterSeeder } from './seeders/semesterseeder.js';
import { subjectSeeder } from './seeders/subjectseeder.js';
import { userSeeder } from './seeders/userseeder.js';
import { createPinia, type Pinia } from 'pinia';
import { watch } from 'vue';

export default class PiniaConfig {
  public static init(): Pinia {
    const pinia = createPinia();

    const savedState = localStorage.getItem('piniaState');
    if (savedState) {
      pinia.state.value = JSON.parse(savedState);
    } else {
      // initialize the state with the seeders
      pinia.state.value = {
        user: {
          users: userSeeder,
        },
        semester: {
          semester: semesterSeeder,
        },
        subject: {
          subject: subjectSeeder,
        },
        grade: {
          grade: gradeSeeder,
        },
      };

      // save the initial state to localStorage
      localStorage.setItem('piniaState', JSON.stringify(pinia.state.value));
    }

    // watch for changes and save to localStorage
    watch(
      pinia.state,
      (state: typeof pinia.state.value): void => {
        localStorage.setItem('piniaState', JSON.stringify(state));
      },
      { deep: true },
    );

    return pinia;
  }
}
