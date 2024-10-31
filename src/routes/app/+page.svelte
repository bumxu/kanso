<script lang="ts">
    import JEntry from '$lib/journal_table/JEntry.svelte';
    import { entitiesStore } from '$lib/stores/entities.store.j4.svelte';
    import { entityTypesStore } from '$lib/stores/entitytypes.store.j4.svelte';
    import { filtersStore } from '$lib/stores/filters.store.j4.svelte';
    import { journalStore } from '$lib/stores/journal.store.j4.svelte';
    import { prioritiesStore } from '$lib/stores/priorities.store.j4.svelte';
    import { statusesStore } from '$lib/stores/statuses.store.j4.svelte';
    import { storeManager } from '$lib/stores/store.j4.svelte';
    import { tagsStore } from '$lib/stores/tags.store.j4.svelte';
    import type { EntrySchema } from '$lib/types/j4_types';
    import { DateTime } from 'luxon';
    import { onMount } from 'svelte';
    import SBConsole from './component/SBConsole.svelte';
    import SbEntities from './component/SBEntities.svelte';
    import SBEntityTypes from './component/SBEntityTypes.svelte';
    import SBFilters from './component/SBFilters.svelte';
    import SBPriorities from './component/SBPriorities.svelte';
    import SBStatuses from './component/SBStatuses.svelte';
    import SBTags from './component/SBTags.svelte';

    //let entries: JEntry[] = [];
    let journal = $derived(Object.values(journalStore._entryIndex));

    let sbOpen = $state(false);
    let sbTool: string | null = $state(null);

    let order = $state('dateSince');
    let orderAsc = $state(true);

    let view: EntrySchema[] = $derived.by(() => {
        let entries = Object.values(journalStore.journal).flatMap(p => p.entries);

        // Orden
        if (order === 'dateSince' && orderAsc) {
            entries.sort((a, b) => a.dateSince.localeCompare(b.dateSince));
        } else if (order === 'dateSince' && !orderAsc) {
            entries.sort((a, b) => b.dateSince.localeCompare(a.dateSince));
        } //else {
        //     return journalStore.journal;
        // }

        // Aplicar filtros
        entries = entries.filter(entry => {
            for (const filter of filtersStore.filters) {
                if (filter.active) {
                    const filterFn = new Function('return ' + filter.filterFn)();
                    if (!filterFn(entry)) {
                        return false;
                    }
                }
            }
            return true;
        });

        return entries;
    });

    onMount(async () => {
        console.log('Iniciando Kanso...');

        //storeManager.loadToLS();
        //await storeManager.loadWithSSR();

        // const response = await fetch(SERVER_HOST + '/api/journal/entries');
        // $entries = [...await response.json()];
        // console.log('Obtenidos ' + $entries.length + ' registros');
        //
        // const response2 = await fetch(SERVER_HOST + '/api/journal/tags');
        // const tags = [...await response2.json()];
        // $ztags = tags;
        // console.log('Obtenidas ' + tags.length + ' tags');
        //
        // const response3 = await fetch(SERVER_HOST + '/api/journal/entities');
        // const entities = [...await response3.json()];
        // $zentities = entities;
        // console.log('Obtenidas ' + entities.length + ' entidades');
        //
        // console.log(entries);

    });

    function add() {
        //     $entries = [...$entries, {
        //         createdAt: Utils.formatDateServer(DateTime.now())!,
        //         createdAtShowsTime: true,
        //         closedAtShowsTime: false,
        //         priority: null,
        //         topic: '',
        //         updates: [],
        //         entities: [],
        //         tags: []
        //     }];
        journalStore.add({
            dateSince: DateTime.local().toFormat('yyyyMMddHHmm'),
            subject: 'Nuevo ' + Math.random(),
            updates: [],
            tags: []
        });
    }

    function del(evt: CustomEvent) {
        //     $entries = $entries.filter(e => e !== evt.detail.entry);
    }

    function toggleSb(sbId: string) {
        if (sbOpen && sbTool === sbId) {
            sbOpen = false;
        } else {
            sbOpen = true;
            sbTool = sbId;
        }
    }

    function handleOrderByDateSince() {
        orderAsc = order === 'dateSince' ? !orderAsc : true;
        order = 'dateSince';
    }

    function handlePartitionChange(entry: EntrySchema, srcPartId: string) {
        entry = $state.snapshot(entry);

        console.log('Partition change', entry, srcPartId);
        const dstPartId = entry.dateSince.substring(0, 6);

        // Remove from old partition
        journalStore.journal[srcPartId].entries = journalStore.journal[srcPartId].entries.filter(e => e.id !== entry.id);

        // Add to new partition
        if (!journalStore.journal[dstPartId]) {
            journalStore.journal[dstPartId] = { id: dstPartId, entries: [] };
        }
        journalStore.journal[dstPartId].entries.push(entry);
        journalStore.journal[dstPartId].entries.sort((a, b) => a.dateSince.localeCompare(b.dateSince));
    }
</script>

<div class="x-app">
    <header class="x-title-bar">
        <h1>K Gestor de tareas</h1>
    </header>
    <nav class="x-mainmenu-bar">
        <!--        <button onclick={() => journalStore.serialize()}>Serialize</button>-->
        <button onclick={() => storeManager.loadFromLS()}><i class="fas fa-fw fa-file-export"></i> Cargar (LS)</button>
        <button onclick={() => storeManager.saveToLS()}><i class="fas fa-fw fa-file-import"></i> Guardar (LS)</button>
        <!--        <button onclick={() => storeManager.saveWithSSR()}>Save (SSR)</button>-->
        <!--        <button onclick={() => storeManager.loadWithSSR()}>Load (SSR)</button>-->
        <button onclick={() => storeManager.saveToDownload()}><i class="fas fa-fw fa-download"></i> Descargar</button>
        <button onclick={() => storeManager.loadFromFile()}><i class="fas fa-fw fa-folder-open"></i> Usar archivo local ({storeManager.isFileHandled ? '✔️' : ''})</button>
        <button onclick={() => storeManager.saveToFileHandler()}><i class="fas fa-fw fa-save"></i> Guardar a local</button>
        <br>
        <button onclick={add}><i class="fas fa-fw fa-circle-plus"></i> Añadir</button>
    </nav>
    <div class="x-container">
        <div class="x-main">
            <div class="x-table x-journal">
                <div class="x-row x-header">
                    <div>#</div>
                    <div onclick={handleOrderByDateSince}>Fechas
                        {#if order === 'dateSince'}
                            <i class="fas fa-fw" class:fa-caret-up={orderAsc} class:fa-caret-down={!orderAsc}></i>
                        {/if}
                    </div>
                    <div>Asunto</div>
                    <div>Actualizaciones</div>
                    <div>Entidades</div>
                    <div>Tags</div>
                    <div>Prioridad</div>
                    <div>Estado</div>
                    <div>*</div>
                </div>
                <!--{#each Object.keys(journal) as partId, partIdx (partId)}-->
                <!--    <JEntriesWindow bind:entriesWindow={journal[partId]}-->
                <!--                    onpartitionchange={handlePartitionChange}-->
                <!--    />-->
                <!--{/each}-->
                {#each view as entry, i (entry.id)}
                    <JEntry entry={view[i]}
                    />
                {/each}
            </div>

            <br><br>
        </div>

        <!--        <SideBar />-->

        {#if sbOpen}
            <div class="x-sidebar x-sb-floating">
                {#if sbTool === 'etypes'}
                    <SBEntityTypes bind:entityTypes={entityTypesStore.entityTypes} />
                {/if}
                {#if sbTool === 'entities'}
                    <SbEntities entities={entitiesStore.entities} />
                {/if}
                {#if sbTool === 'tags'}
                    <SBTags bind:tags={tagsStore.tags} />
                {/if}
                {#if sbTool === 'statuses'}
                    <SBStatuses bind:statuses={statusesStore.statuses} />
                {/if}
                {#if sbTool === 'priorities'}
                    <SBPriorities bind:priorities={prioritiesStore.priorities} />
                {/if}
                {#if sbTool === 'filters'}
                    <SBFilters bind:basicFilters={filtersStore.filters} />
                {/if}
                {#if sbTool === 'console'}
                    <SBConsole />
                {/if}
            </div>
        {/if}

        <div class="x-sb-menu">
            <ul>
                <li>
                    <button onclick={()=>toggleSb('etypes')}
                            title="Tipos de entidad"><i class="fas fa-cube"></i></button>
                </li>
                <li>
                    <button onclick={()=>toggleSb('entities')}
                            title="Entidades"><i class="fas fa-cubes-stacked"></i></button>
                </li>
                <li>
                    <button onclick={()=>toggleSb('tags')}
                            title="Tags"><i class="fas fa-tag"></i></button>
                </li>
                <li>
                    <button onclick={()=>toggleSb('statuses')}
                            title="Estados"><i class="fas fa-percent"></i></button>
                </li>
                <li>
                    <button onclick={()=>toggleSb('priorities')}
                            title="Prioridades"><i class="fas fa-fire"></i></button>
                </li>
                <li>
                    <button onclick={()=>toggleSb('filters')}
                            title="Filtros básicos"><i class="fas fa-filters"></i></button>
                </li>
                <li>
                    <button onclick={()=>toggleSb('console')}
                            title="Consola"><i class="fas fa-terminal"></i></button>
                </li>
            </ul>
        </div>

    </div>
    <footer class="x-status-bar">
        Kanso es una aplicación estática y no almacena ni envía datos fuera del equipo del usuario.
    </footer>
</div>

<style lang="scss">
    .x-app {
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
        box-sizing: border-box;
    }

    .x-title-bar {
        padding: 8px 10px 5px;
        border-bottom: 1px solid #aaa;

        h1 {
            font-size: 20px;
            font-weight: 400;
            color: #333;
            padding: 0;
            margin: 0;
            text-shadow: 0 0 2px rgba(#333, 0.5);
        }
    }

    .x-mainmenu-bar {
        border-bottom: 1px solid #aaa;
        padding: 4px 10px;

        button {
            margin: 0;
            display: inline;
            border: 1px solid #aaa;
            border-radius: 2px;
            padding: 1px 5px;
            background: #ddd;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            color: #555;
        }
    }

    .x-container {
        flex: 1 0 0;
        display: flex;
        flex-direction: row;
        overflow: auto;
        width: 100vw;
        position: relative;
        box-sizing: border-box;
    }

    .x-main {
        flex: 1 0 0;
        overflow: auto;
        box-sizing: border-box;
    }

    .x-sb-menu {
        flex: 0 0 40px;
        background: #f7f7f7;
        z-index: 100;
        border-left: 1px solid #aaa;

        ul, li {
            margin: 0;
            padding: 0;
            list-style: none;
        }

        button {
            width: 100%;
            height: 40px;
            color: #333;
            margin-bottom: 1px;
            border: 0;
            font-size: 15px;
            background-color: rgba(0, 0, 0, 0);
            cursor: pointer;
            transition: 0.08s linear 0s background-color;
            &:hover {
                background-color: rgba(0, 0, 0, 0.06);
            }
        }
    }

    .x-sb-floating {
        background: #f7f7f7;
        position: absolute;
        right: 41px;
        top: 0;
        bottom: 0;
        width: 400px;
        z-index: 50;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
    }

    .x-status-bar {
        flex: 0 0 0;
        box-sizing: border-box;
        font-size: 11px;
        padding: 3px 6px;
        border-top: 1px solid #aaa;
        color: #888;
    }



    .x-sidebar {
        //flex: 0 0 300px;
        //height: 100%;
        //min-width: 300px;
        overflow: auto;
        //display: flex;
        //flex-direction: column;
    }

    .x-sidebar :global(.x-sb-section) {
        flex: 1 1;
        min-height: 300px;
        overflow: auto;
    }


    .x-sidebar :global(.x-sb-header) {
        background: #333;
        padding: 5px;
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.85);
    }

    .x-sidebar :global(.x-no-selection) {
        font-size: 0.85rem;
        color: #666;
        pointer-events: none;
    }
    .x-sidebar :global(.x-form) {
        padding: 10px;
    }
    .x-sidebar :global(.x-form label) {
        display: block;
        font-size: 0.75rem;
        font-weight: 600;
        margin-top: 5px;
    }

</style>