// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
    type GenericInputEvent = Event & {
        target: EventTarget & HTMLInputElement;
        currentTarget: EventTarget & HTMLInputElement;
    };

    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export {};
