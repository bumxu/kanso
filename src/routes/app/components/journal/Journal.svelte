<script lang="ts">
    import { DateTime } from "luxon";
    import { appStore } from "../../appstate.store.svelte";
    import JQuickFilter from "./JQuickFilter.svelte";
    import { filtersStore } from "$lib/stores/filters.store.j4.svelte";
    import { buildFilteredView, buildSortedView } from "$lib/helpers/journal.helper.svelte";
    import type { EntrySchema } from "$lib/types/j4_types";
    import { browser } from "$app/environment";
    import { journalStore } from "$lib/stores/journal.store.j4.svelte";
    import JEntry from "./JEntry.svelte";
    import { flip } from "svelte/animate";
    import Ic from "$lib/components/Ic.svelte";

    let order = $state("dateSince");
    let orderAsc = $state(true);

    let focusEntryNextTick: string = null;

    // let view: EntrySchema[] = $derived(buildJournalView(order, orderAsc,
    //     qFilterTopic, qFilterUpdates, qFilterEntities, qFilterTags, qFilterPriority,
    //     filtersStore.filters
    // ));

    let filteredView: EntrySchema[] = $state([]);
    $effect(() => {
        // console.log('Aplicando filtros...', filtersStore.filters);
        applyFilters();
    });
    let sortedView: EntrySchema[] = $derived(buildSortedView(filteredView, order, orderAsc));

    function applyFilters() {
        filteredView = buildFilteredView(
            appStore.persistent.qFilterTopicActive ? appStore.persistent.qFilterTopic : "",
            appStore.persistent.qFilterUpdatesActive ? appStore.persistent.qFilterUpdates : "",
            appStore.persistent.qFilterEntitiesActive ? appStore.persistent.qFilterEntities : "",
            appStore.persistent.qFilterTagsActive ? appStore.persistent.qFilterTags : "",
            appStore.persistent.qFilterPriorityActive ? appStore.persistent.qFilterPriority : "",
            appStore.persistent.qFilterStatusActive ? appStore.persistent.qFilterStatus : "",
            filtersStore.filters,
        );
    }

    function handleOrderByDateSince() {
        if (order === "dateSince" && orderAsc) {
            orderAsc = false;
        } else if (order === "dateSince" && !orderAsc) {
            order = "dateUpdated";
            orderAsc = true;
        } else if (order === "dateUpdated" && orderAsc) {
            orderAsc = false;
        } else {
            order = "dateSince";
            orderAsc = true;
        }
        console.log(`Reordenando por "${order}" (${orderAsc ? "asc" : "desc"})...`);
    }

    function handleOrderByPriority() {
        if (order === "priority" && orderAsc) {
            orderAsc = false;
        } else if (order === "priority" && !orderAsc) {
            order = "dateDue";
            orderAsc = true;
        } else if (order === "dateDue" && orderAsc) {
            orderAsc = false;
        } else {
            order = "priority";
            orderAsc = true;
        }
        console.log(`Reordenando por "${order}" (${orderAsc ? "asc" : "desc"})...`);
    }

    function handleClearAllFilters() {
        appStore.persistent.qFilterTopic = "";
        appStore.persistent.qFilterTopicActive = true;
        appStore.persistent.qFilterUpdates = "";
        appStore.persistent.qFilterUpdatesActive = true;
        appStore.persistent.qFilterEntities = "";
        appStore.persistent.qFilterEntitiesActive = true;
        appStore.persistent.qFilterTags = "";
        appStore.persistent.qFilterTagsActive = true;
        appStore.persistent.qFilterPriority = "";
        appStore.persistent.qFilterPriorityActive = true;
        appStore.persistent.qFilterStatus = "";
        appStore.persistent.qFilterStatusActive = true;
    }

    function handleDuplicateEntry(entry: EntrySchema) {
        console.log("Duplicando registro...");
        const newEntry = journalStore.add({
            dateSince: DateTime.local().toFormat("yyyyMMddHHmm"),
            subject: entry.subject,
            // entities: entry.entities,
            // updates: entry.updates,
            // tags: entry.tags,
            priority: entry.priority,
        });
        filteredView.push(newEntry);

        // Enfocar el nuevo registro
        focusEntryNextTick = newEntry.id;
        tick().then(() => {
            focusEntryNextTick = null;
        });
    }

    function del(entryId: string) {
        console.log("Borrando registro...");
        journalStore.del(entryId);
        // Quitar de la vista
        filteredView = filteredView.filter((e) => e.id !== entryId);
    }
</script>

<div class="x-table x-journal">
    <div class="x-headers">
        <!-- Cabecera de la tabla -->
        <div class="x-row x-header x-header-main">
            <div class="x-cell flex items-center" onclick={handleOrderByDateSince}>
                <span class="x-label flex-1">Fechas</span>
                {#if order === "dateSince"}
                    <i class="fas fa-fw fa-xs fa-add" style="opacity: 0.5"></i>
                {/if}
                {#if order === "dateUpdated"}
                    <i class="far fa-fw fa-xs fa-pen" style="opacity: 0.5"></i>
                {/if}
                {#if order === "dateSince" || order === "dateUpdated"}
                    <i class="fas fa-fw" class:fa-sort-up={orderAsc} class:fa-sort-down={!orderAsc}></i>
                {:else}
                    <i class="fas fa-fw fa-sort opacity-30"></i>
                {/if}
            </div>
            <div class="x-cell"><span class="x-label">Asunto</span></div>
            <div class="x-cell"><span class="x-label">Actualizaciones</span></div>
            <div class="x-cell"><span class="x-label">Entidades</span></div>
            <div class="x-cell"><span class="x-label">Tags</span></div>
            <div class="x-cell flex items-center" onclick={handleOrderByPriority}>
                <span class="x-label flex-1">Prioridad</span>
                {#if order === "priority"}
                    <i class="fad fa-fw fa-xs fa-fire" style="opacity: 0.5"></i>
                {/if}
                {#if order === "dateDue"}
                    <i class="fad fa-fw fa-xs fa-flag-checkered" style="opacity: 0.5"></i>
                {/if}
                {#if order === "priority" || order === "dateDue"}
                    <i class="fas fa-fw" class:fa-sort-up={orderAsc} class:fa-sort-down={!orderAsc}></i>
                {:else}
                    <i class="fas fa-fw fa-sort opacity-30"></i>
                {/if}
            </div>
            <div class="x-cell"><span class="x-label">Estado</span></div>
            <div class="x-cell">
                <span class="x-label"><Ic iconclass="fas fa-fw fa-sm fa-ellipsis" /></span>
            </div>
        </div>

        <!-- Filtros rápidos -->
        <div class="x-row x-header x-header-quickfilters">
            <div class="x-cell"></div>
            <div class="x-cell flex">
                <JQuickFilter
                    bind:value={appStore.persistent.qFilterTopic}
                    bind:active={appStore.persistent.qFilterTopicActive}
                />
            </div>
            <div class="x-cell flex">
                <JQuickFilter
                    bind:value={appStore.persistent.qFilterUpdates}
                    bind:active={appStore.persistent.qFilterUpdatesActive}
                />
            </div>
            <div class="x-cell flex">
                <JQuickFilter
                    bind:value={appStore.persistent.qFilterEntities}
                    bind:active={appStore.persistent.qFilterEntitiesActive}
                />
            </div>
            <div class="x-cell flex">
                <JQuickFilter
                    bind:value={appStore.persistent.qFilterTags}
                    bind:active={appStore.persistent.qFilterTagsActive}
                />
            </div>
            <div class="x-cell flex">
                <JQuickFilter
                    bind:value={appStore.persistent.qFilterPriority}
                    bind:active={appStore.persistent.qFilterPriorityActive}
                />
            </div>
            <div class="x-cell flex">
                <JQuickFilter
                    bind:value={appStore.persistent.qFilterStatus}
                    bind:active={appStore.persistent.qFilterStatusActive}
                />
            </div>
            <div class="x-cell flex">
                <Ic
                    iconclass="fas fa-sm fa-delete-left"
                    class="flex-1"
                    label="Limpiar todos los filtros rápidos"
                    onclick={handleClearAllFilters}
                />
            </div>
        </div>
    </div>

    {#each sortedView as entry, i (entry.id)}
        <div style="display: block" animate:flip={{ duration: 200 }}>
            <JEntry
                entry={sortedView[i]}
                autofocus={focusEntryNextTick === sortedView[i].id}
                ondelete={() => del(sortedView[i].id)}
                
            /><!--x_onshowctxmenu={handleShowEntryContextMenu}-->
        </div>
    {/each}
</div>
