class AppStateStore {
    public ctrlKeyPressed: boolean = $state(false);
    public focusedElement: HTMLElement | null = $state(null);

    public persistent: any = $state({
        qFilterTopic: '',
        qFilterTopicActive: true,
        qFilterUpdates: '',
        qFilterUpdatesActive: true,
        qFilterEntities: '',
        qFilterEntitiesActive: true,
        qFilterTags: '',
        qFilterTagsActive: true,
        qFilterPriority: '',
        qFilterPriorityActive: true,
        qFilterStatus: '',
        qFilterStatusActive: true
    });
}

export const appStore = new AppStateStore();