<script lang="ts">
    import Ic from '$lib/components/Ic.svelte';
    import JDateTime from '$lib/components/JDateTime.svelte';
    import type { EntrySchema } from '$lib/types/j4_types';
    import { DateTime } from 'luxon';
    import type { SvelteComponent } from 'svelte';
    import { appStore } from '../../appstate.store.svelte';

    type Props = {
        /** La entrada del diario a la que pertenece la fecha. */
        entry: EntrySchema;
        /** Un listener que se ejecutará cuando se modifique cualquiera de los campos. Opcional. */
        onchange?: () => void,
        /** Un listener que se ejecutará cuando se modifique el campo fecha inicial. Opcional. */
        onchangedatesince?: () => void,
        /** Un listener que se ejecutará cuando se modifique el campo fecha de actualización. Opcional. */
        onchangedateupdated?: () => void,
    };
    let { entry, onchange, onchangedatesince, onchangedateupdated }: Props = $props();

    /** Referencia al componente {@link JDateTime} de con la fecha inicial */
    let svDateSince: SvelteComponent;
    /** La fecha de actualización se muestra la tecla Ctrl está presionada, o alguna de ellas tiene el foco. */
    let showDateUpdated = $derived(
        appStore.ctrlKeyPressed || appStore.focusedElement?.closest('.x-date-updated') != null);

    /** Indica si el campo de fecha inicial tiene el foco. */
    let dateSinceFocused = $state(false);
    /** Indica si el campo de fecha de actualización tiene el foco. */
    let dateUpdatedFocused = $state(false);
    /** Si se cumple alguna de estas condiciones, se muestran líneas de separación en la celda. */
    let useComplexDesign = $derived(showDateUpdated || dateSinceFocused);

    /** Al hacer click en icono junto a la fecha de actualización, la actualiza a la fecha y hora actuales. */
    function handleClickUpdateDateUpdated(ev: MouseEvent) {
        ev.preventDefault();
        entry.dateUpdated = DateTime.local().toFormat('yyyyMMddHHmm');
    }

    /** Al hacer click en el espacio vacío de la celda, se enfocará el campo de fecha inicial. */
    function handleClickCell(ev: MouseEvent) {
        if (ev.currentTarget === ev.target) {
            svDateSince.focus();
        }
    }

    /** Al cambiar la fecha de actualización, se ejecutan los listeners correspondientes. */
    function handleChangeDateUpdated() {
        if (onchangedateupdated) onchangedateupdated();
        if (onchange) onchange();
    }

    /** Al cambiar la fecha inicial, se ejecutan los listeners correspondientes. */
    function handleChangeDateSince() {
        if (onchangedatesince) onchangedatesince();
        if (onchange) onchange();
    }

</script>

<div class="x-cmp" class:x-complex-design={useComplexDesign} role="none" onclick={handleClickCell}>
    <div class="x-date-wrapper x-date-since flex items-center" class:x-focused={dateSinceFocused}>
        <div class="flex-auto">
            <i class="fas fa-fw fa-xs fa-plus"></i>
        </div>
        <div class="flex-1">
            <JDateTime bind:value={entry.dateSince}
                       bind:this={svDateSince}
                       onchange={handleChangeDateSince}
                       onfocus={() => dateSinceFocused = true}
                       onblur={() => dateSinceFocused = false} />
        </div>
    </div>
    {#if showDateUpdated}
        <div class="x-date-wrapper x-date-updated flex items-center" class:x-focused={dateUpdatedFocused}>
            <Ic class="flex-auto"
                iconclass="far fa-fw fa-xs fa-pen"
                iconclasshover="fas fa-fw fa-xs fa-arrows-rotate"
                inheritcolor={true}
                label="Establecer fecha y hora actuales"
                onclick={handleClickUpdateDateUpdated} />
            <div class="flex-1">
                <JDateTime bind:value={entry.dateUpdated}
                           onchange={handleChangeDateUpdated}
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
        padding: 0 2px;

        &:hover {
            background-color: var(--color-hovered);
        }

        &.x-focused {
            background-color: var(--color-focused);
        }
    }

    .x-date-updated {
        color: #ddd;

        &.x-focused, &:hover {
            color: #aaa;
        }
    }
</style>