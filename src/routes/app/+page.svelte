<script lang="ts">
    import JEntriesWindow from '$lib/journal_table/JEntriesWindow.svelte';
    import JEntry from '$lib/journal_table/JEntry.svelte';
    import { journalStore } from '$lib/stores/journal.store.j4.svelte';
    import { storeManager } from '$lib/stores/store.j4.svelte';
    import type { EntrySchema } from '$lib/types/j4_types';
    import { onMount } from 'svelte';
    import SideBar from './component/SideBar.svelte';
    import { DateTime } from 'luxon';
    //import Row from './Row.svelte';

    //let entries: JEntry[] = [];
    let journal = $derived(journalStore.journal);

    let order = $state('dateSince');
    let orderAsc = $state(true);

    let view: EntrySchema[] = $derived.by(() => {
        const entries = Object.values(journalStore.journal).flatMap(p => p.entries);
        // if (order === 'dateSince' && orderDir === 'asc') {
        //     return journalStore.journal;
        // } else
        if (order === 'dateSince' && !orderAsc) {
            return entries.sort((a, b) => b.dateSince.localeCompare(a.dateSince));
        } //else {
        //     return journalStore.journal;
        // }
        console.log('View updated', entries);
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
            tags: [],
            status: 'active'
        });
    }

    function del(evt: CustomEvent) {
        //     $entries = $entries.filter(e => e !== evt.detail.entry);
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
                    <JEntry bind:entry={view[i]}
                            partitionId={entry.dateSince.substring(0, 6)}
                            onpartitionchange={()=>{}} />
                {/each}
            </div>

            <br><br>
        </div>

        <SideBar />

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
            padding: 0;
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
        box-sizing: border-box;
    }

    .x-main {
        flex: 1 0 0;
        overflow: auto;
        box-sizing: border-box;
    }

    .x-status-bar {
        flex: 0 0 0;
        box-sizing: border-box;
        font-size: 11px;
        padding: 3px 6px;
        border-top: 1px solid #aaa;
        color: #888;
    }

</style>