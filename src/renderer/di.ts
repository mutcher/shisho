import { AppViewModel } from './AppViewModel';

export const APP_VIEW_MODEL_KEY = 'APP_VM';

export type ServiceKeys = typeof APP_VIEW_MODEL_KEY;

const injectables = new Map<ServiceKeys, unknown>();

export function inject<T>(key: ServiceKeys): T {
  if (!injectables.has(key)) {
    let injectable: unknown;
    switch (key) {
      case APP_VIEW_MODEL_KEY:
        injectable = new AppViewModel(window.electron.shishoService);
        break;

      default:
        throw new Error('Unknown key');
    }

    injectables.set(key, injectable);
  }

  return injectables.get(key) as T;
}
