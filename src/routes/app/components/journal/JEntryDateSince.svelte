<script lang="ts">
    import JDateTime from '$lib/journal_table/JDateTime.svelte';
    import { DateTime } from 'luxon';
    import type { SvelteComponent } from 'svelte';
    import { appStore } from '../../appstate.store.svelte';
    import { tippyAction } from '$lib/actions/tippy.action';

    type Props = { entry: any; }
    let { entry }: Props = $props();

    let svDateSince: SvelteComponent;
    let showDateUpdated = $derived(
        appStore.ctrlKeyPressed || appStore.focusedElement?.closest('.x-date-updated') != null);

    let dateSinceFocused = $state(false);
    let dateUpdatedFocused = $state(false);
    let showLines = $derived(showDateUpdated || dateSinceFocused || dateUpdatedFocused);

    function updateDateUpdated(ev) {
        ev.preventDefault();
        entry.dateUpdated = DateTime.local().toFormat('yyyyMMddHHmm');
    }

    function handleClickCell(ev: GenericInputEvent) {
        if (ev.currentTarget === ev.target) {
            svDateSince.focus();
        }
    }
</script>

<div class="x-cmp" class:x-complex-design={showLines} role="none" onclick={handleClickCell}>
    <div class="x-date-wrapper x-date-since flex items-center" class:x-focused={dateSinceFocused}>
        <div class="flex-auto">
            <i class="fas fa-fw fa-xs fa-plus"></i>
        </div>
        <div class="flex-1">
            <JDateTime bind:value={entry.dateSince}
                       bind:this={svDateSince}
                       onfocus={() => dateSinceFocused = true}
                       onblur={() => dateSinceFocused = false} />
        </div>
    </div>
    {#if showDateUpdated}
        <div class="x-date-wrapper x-date-updated flex items-center" class:x-focused={dateUpdatedFocused}>
            <div class="flex-auto">
                <i class="far fa-fw fa-xs fa-pen flex-auto cursor-pointer"
                   onclick={updateDateUpdated}></i>
            </div>
            <div class="flex-1">
                <JDateTime bind:value={entry.dateUpdated}
                           onfocus={() => dateUpdatedFocused = true}
                           onblur={() => dateUpdatedFocused = false} />
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    .x-cmp {
        height: 100%;
        cursor: text;

        &.x-complex-design, &:hover {
            .x-date-wrapper {
                border-bottom: 1px dotted var(--table-sep-color);
            }
        }
    }

    .x-date-wrapper {
        text-wrap: nowrap;
        line-height: 13px;
        transition: background-color 0.2s, color 0.2s;
        color: #333;

        &:hover {
            background-color: var(--color-hovered);
        }

        &.x-focused {
            background-color: var(--color-focused);
        }
    }

    i {
        margin: 0 0 0 2px;
        color: #aaa;
    }

    .x-date-updated {
        color: #ddd;

        i {
            color: inherit;

            &:hover::before {
                content: '\f021';
            }
        }

        &.x-focused, &:hover {
            color: #aaa;
        }
    }
</style>