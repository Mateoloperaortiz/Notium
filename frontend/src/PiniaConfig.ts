import { createPinia, type Pinia } from 'pinia';
import { watch } from 'vue';

/** Creates Pinia and keeps the session state in localStorage between visits. */
export default class PiniaConfig {
  /** Restores the saved session on load, then persists every change. */
  public static init(): Pinia {
    const pinia = createPinia();

    const savedState = localStorage.getItem('piniaStateV2');

    if (savedState) {
      pinia.state.value = JSON.parse(savedState);
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
