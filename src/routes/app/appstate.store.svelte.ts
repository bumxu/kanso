class AppStateStore {
    public ctrlKeyPressed: boolean = $state(false);
    public focusedElement: HTMLElement | null = $state(null);
}

export const appStore = new AppStateStore();