<script lang="ts">
    import Button from '$lib/components/Button.svelte';
    import { appStore } from './appstate.store.svelte';
    import JEntry from './components/journal/JEntry.svelte';
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
    import { onMount, tick } from 'svelte';
    import SBConsole from './components/sidebar/SBConsole.svelte';
    import SbEntities from './components/sidebar/SBEntities.svelte';
    import SBEntityTypes from './components/sidebar/SBEntityTypes.svelte';
    import SBFilters from './components/sidebar/SBFilters.svelte';
    import SBPriorities from './components/sidebar/SBPriorities.svelte';
    import SBStatuses from './components/sidebar/SBStatuses.svelte';
    import SBTags from './components/sidebar/SBTags.svelte';
    import { tippyAction } from '$lib/actions/tippy.action';

    import '../../scss/main.scss';

    //let entries: JEntry[] = [];
    //let journal = $derived(Object.values(journalStore._entryIndex));

    let sbOpen = $state(false);
    let sbTool: string | null = $state(null);

    let order = $state('dateSince');
    let orderAsc = $state(true);

    let qFilterTopic = $state('');
    let qFilterEntities = $state('');
    let qFilterTags = $state('');

    function getDateUpdated(entry: EntrySchema) {
        if (entry.dateClosed != null) {
            return entry.dateClosed;
        }
        return entry.dateUpdated ?? entry.dateSince;
    }

    let view: EntrySchema[] = $derived.by(() => {
        let entries = Object.values(journalStore.journal).flatMap(p => p.entries);

        // Orden
        if (order === 'dateSince' && orderAsc) {
            console.debug('Aplicando orden por "fecha de inicio" ascendente...');
            entries.sort((a, b) => a.dateSince.localeCompare(b.dateSince));
        } else if (order === 'dateSince' && !orderAsc) {
            console.debug('Aplicando orden por "fecha de inicio" descendente...');
            entries.sort((a, b) => b.dateSince.localeCompare(a.dateSince));
        } else if (order === 'dateUpdated' && orderAsc) {
            console.debug('Aplicando orden por "fecha de actualización" ascendente...');
            entries.sort((a, b) => getDateUpdated(a).localeCompare(getDateUpdated(b)));
        } else if (order === 'dateUpdated' && !orderAsc) {
            console.debug('Aplicando orden por "fecha de actualización" descendente...');
            entries.sort((a, b) => getDateUpdated(b).localeCompare(getDateUpdated(a)));
        }
        //     return journalStore.journal;
        // }

        // Aplicar filtros rápidos
        if (qFilterTopic) {
            console.debug('Aplicando filtro rápido en "asunto"...');
            entries = entries.filter(entry => entry.subject.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(qFilterTopic.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')));
        }
        if (qFilterEntities) {
            console.debug('Aplicando filtro rápido en "entidades"...');
            entries = entries.filter(entry => {
                return entry.entities.some(entryEntity => {
                    const entity = entitiesStore.entities[entryEntity.entityId];
                    const desplayName = entityTypesStore.getDisplayFn(entity.type)(entity.id, entity.raw);
                    console.debug('Comparando ' + desplayName + ' con ' + qFilterEntities);
                    if (desplayName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(qFilterEntities.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) {
                        return true;
                    }
                });
            });
        }
        if (qFilterTags) {
            console.debug('Aplicando filtro rápido en "etiquetas"...');
            entries = entries.filter(entry => {
                return entry.tags.some(tagId => {
                    const tag = tagsStore.tags[tagId];
                    if (tag.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(qFilterTags.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) {
                        return true;
                    }
                });
            });
        }

        // Aplicar filtros personalizados
        entries = entries.filter(entry => {
            for (const filter of filtersStore.filters) {
                if (filter.active) {
                    console.debug(`Aplicando filtro básico "${filter.desc}"...`);
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

        storeManager.loadFromLS();
    });

    function handleGlobalKeyDown(e: KeyboardEvent) {
        if (e.key === 'Control' && !e.repeat) {
            appStore.ctrlKeyPressed = true;
            console.debug('Tecla Ctrl pulsada');
        }
    }

    function handleGlobalKeyUp(e: KeyboardEvent) {
        if (e.key === 'Control') {
            appStore.ctrlKeyPressed = false;
            console.debug('Tecla Ctrl soltada');
        }
    }

    function handleGlobalClick(e: MouseEvent) {
        if (sbOpen && e.target instanceof HTMLElement && !e.target.closest('.x-sb-floating') && !e.target.closest('.x-sb-menu')) {
            sbOpen = false;
        }
    }

    function handleGlobalFocus(e: GenericInputEvent) {
        if (e.target && appStore.focusedElement !== e.target) {
            appStore.focusedElement = e.target;
            console.debug(`Tiene el foco -> ${e.target.tagName.toLowerCase()}.${[...e.target.classList].join('.')}`/*, e*/);
        }
    }

    async function handleGlobalBlur(e: GenericInputEvent) {
        // Retrasamos el evento para procesarlo solo si el blur
        // no se ha producido por el enfoque de otro elemento
        setTimeout(() => {
            if (appStore.focusedElement === e.target) {
                appStore.focusedElement = null;
                console.debug('Tiene el foco -> NULL');
            }
        }, 50);
    }

    function add() {
        console.log('Añadiendo nuevo registro...');
        journalStore.add({
            dateSince: DateTime.local().toFormat('yyyyMMddHHmm'),
            subject: '',
            entities: [],
            updates: [],
            tags: []
        });
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
        if (order === 'dateSince' && orderAsc) {
            orderAsc = false;
        } else if (order === 'dateSince' && !orderAsc) {
            order = 'dateUpdated';
            orderAsc = true;
        } else if (order === 'dateUpdated' && orderAsc) {
            orderAsc = false;
        } else if (order === 'dateUpdated' && !orderAsc) {
            order = 'dateSince';
            orderAsc = true;
        }
        console.log(`Reordenando por "${order}" (${orderAsc ? 'asc' : 'desc'})...`);
    }

</script>

<svelte:window
        onclick={handleGlobalClick}
        onkeydown={handleGlobalKeyDown}
        onkeyup={handleGlobalKeyUp}
        onfocusin={handleGlobalFocus}
        onfocusout={handleGlobalBlur}
/>

<div class="x-app">
    <header class="x-title-bar">
        <h1>K Gestor de tareas</h1>
    </header>
    <nav class="x-mainmenu-bar">
        <div class="flex">
            <!--        <button onclick={() => journalStore.serialize()}>Serialize</button>-->
            <Button icon="fas fa-arrow-down-from-arc" onclick={() => storeManager.loadFromLS()}>Cargar (LS)</Button>
            <Button icon="fas fa-arrow-up-to-arc" onclick={() => storeManager.saveToLS()}>Guardar (LS)</Button>
            <!--        <button onclick={() => storeManager.saveWithSSR()}>Save (SSR)</button>-->
            <!--        <button onclick={() => storeManager.loadWithSSR()}>Load (SSR)</button>-->
            <Button icon="fas fa-download" onclick={() => storeManager.saveToDownload()}>Descargar</Button>
            <Button icon="fas fa-folder-open" onclick={() => storeManager.loadFromFile()}>
                Usar archivo local
                {#if storeManager.isFileHandled}&nbsp;&nbsp;<i class="fas fa-check"></i>{/if}
            </Button>
            <Button icon="fas fa-save" onclick={() => storeManager.saveToFileHandler()}>Guardar a local</Button>
        </div>
        <div class="flex">
            <Button icon="fas fa-circle-plus" onclick={add}>Añadir</Button>
        </div>
    </nav>
    <div class="x-container">
        <div class="x-main">
            <div class="x-table x-journal">
                <div class="x-headers">
                    <div class="x-row x-header">
                        <div class="x-cell"><span class="x-label">#</span></div>
                        <div class="x-cell flex items-center" onclick={handleOrderByDateSince}>
                            <span class="x-label flex-1">Fechas</span>
                            {#if order === 'dateSince'}
                                <i class="fas fa-fw fa-xs fa-add" style="opacity: 0.5"></i>
                            {/if}
                            {#if order === 'dateUpdated'}
                                <i class="far fa-fw fa-xs fa-pen" style="opacity: 0.5"></i>
                            {/if}
                            <i class="fas fa-fw" class:fa-caret-up={orderAsc} class:fa-caret-down={!orderAsc}></i>
                        </div>
                        <div class="x-cell"><span class="x-label">Asunto</span></div>
                        <div class="x-cell"><span class="x-label">Actualizaciones</span></div>
                        <div class="x-cell"><span class="x-label">Entidades</span></div>
                        <div class="x-cell"><span class="x-label">Tags</span></div>
                        <div class="x-cell"><span class="x-label">Prioridad</span></div>
                        <div class="x-cell"><span class="x-label">Estado</span></div>
                        <div class="x-cell"><span class="x-label">*</span></div>
                    </div>

                    <div class="x-row x-header">
                        <div class="x-cell"></div>
                        <div class="x-cell"></div>
                        <div class="x-cell flex items-center">
                            <i class="fas fa-fw fa-xs fa-filter"></i>
                            <input type="text" placeholder="Filtro rápido" bind:value={qFilterTopic} class="flex-1" class:x-rx={qFilterTopic.startsWith('/')}></div>
                        <div class="x-cell"></div>
                        <div class="x-cell flex items-center">
                            <i class="fas fa-fw fa-xs fa-filter"></i>
                            <input type="text" placeholder="Filtro rápido" class="flex-1" bind:value={qFilterEntities}></div>
                        <div class="x-cell flex items-center">
                            <i class="fas fa-fw fa-xs fa-filter"></i>
                            <input type="text" placeholder="Filtro rápido" class="flex-1" bind:value={qFilterTags}></div>
                        <div class="x-cell"></div>
                        <div class="x-cell"></div>
                        <div class="x-cell"></div>
                    </div>

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
                            aria-label="Tipos de entidad"
                            use:tippyAction={{placement: 'left', content: 'Tipos de entidad'}}>
                        <i class="fad fa-cube"></i>
                    </button>
                </li>
                <li>
                    <button onclick={()=>toggleSb('entities')}
                            aria-label="Entidades"
                            use:tippyAction={{placement: 'left', content: 'Entidades'}}>
                        <i class="fad fa-cubes-stacked"></i>
                    </button>
                </li>
                <li>
                    <button onclick={()=>toggleSb('tags')}
                            aria-label="Tags"
                            use:tippyAction={{placement: 'left' , content: 'Tags'}}>
                        <i class="fad fa-tag"></i>
                    </button>
                </li>
                <li>
                    <button onclick={()=>toggleSb('statuses')}
                            aria-label="Estados"
                            use:tippyAction={{placement: 'left', content: 'Estados'}}>
                        <i class="fad fa-percent"></i>
                    </button>
                </li>
                <li>
                    <button onclick={()=>toggleSb('priorities')}
                            aria-label="Prioridades"
                            use:tippyAction={{placement: 'left', content: 'Prioridades'}}>
                        <i class="fad fa-fire"></i>
                    </button>
                </li>
                <li>
                    <button onclick={()=>toggleSb('filters')}
                            aria-label="Filtros básicos"
                            use:tippyAction={{placement: 'left', content: 'Filtros básicos'}}>
                        <i class="fad fa-filters"></i>
                    </button>
                </li>
                <li>
                    <button onclick={()=>toggleSb('console')}
                            aria-label="Consola"
                            use:tippyAction={{placement: 'left', content: 'Consola'}}>
                        <i class="fad fa-terminal"></i>
                    </button>
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

        & > div {
            gap: 4px;
        }

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


    .x-status-bar {
        flex: 0 0 0;
        box-sizing: border-box;
        font-size: 11px;
        padding: 3px 6px;
        border-top: 1px solid #aaa;
        color: #888;
    }

    .x-rx {
        color: #00f;
    }


</style>