<script lang="ts">
    import { tippyAction } from "$lib/actions/tippy.action";
    import Button from "$lib/components/Button.svelte";
    import Ic from "$lib/components/Ic.svelte";
    import { buildFilteredView, buildSortedView } from "$lib/helpers/journal.helper.svelte";
    import { entitiesStore } from "$lib/stores/entities.store.j4.svelte";
    import { entityTypesStore } from "$lib/stores/entitytypes.store.j4.svelte";
    import { filtersStore } from "$lib/stores/filters.store.j4.svelte";
    import { journalStore } from "$lib/stores/journal.store.j4.svelte";
    import { prioritiesStore } from "$lib/stores/priorities.store.j4.svelte";
    import { statusesStore } from "$lib/stores/statuses.store.j4.svelte";
    import { storeManager } from "$lib/stores/store.j4.svelte";
    import { tagsStore } from "$lib/stores/tags.store.j4.svelte";
    import type { EntrySchema } from "$lib/types/j4_types";
    import { DateTime } from "luxon";
    import { onDestroy, onMount, tick } from "svelte";
    import { flip } from "svelte/animate";
    import { appStore } from "./appstate.store.svelte";
    import JEntry from "./components/journal/JEntry.svelte";
    import JQuickFilter from "./components/journal/JQuickFilter.svelte";
    import SBConsole from "./components/sidebar/SBConsole.svelte";
    import SbEntities from "./components/sidebar/SBEntities.svelte";
    import SBEntityTypes from "./components/sidebar/SBEntityTypes.svelte";
    import SBFilters from "./components/sidebar/SBFilters.svelte";
    import SBPriorities from "./components/sidebar/SBPriorities.svelte";
    import SBStatuses from "./components/sidebar/SBStatuses.svelte";
    import SBTags from "./components/sidebar/SBTags.svelte";

    import "../../tailwind.css";
    import "../../scss/main.scss";

    let sbOpen = $state(false);
    let sbTool: string | null = $state(null);

    let domEntryCtxMenu: HTMLElement | null = null;
    let entryCtxMenuVisible = $state(false);
    let entryCtxMenuPos = $state({ x: 0, y: 0 });
    let entryCtxMenuEntry: EntrySchema | null = $state(null);

    let order = $state("dateSince");
    let orderAsc = $state(true);

    let focusEntryNextTick = null;

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

    onMount(async () => {
        console.log("Iniciando Kanso...");
        // storeManager.loadFromLS();
    });

    onDestroy(() => {
        console.log("Deteniendo Kanso...");
        try {
            clearInterval(autosaveInterval);
        } catch (e) {}
    });

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

    function handleGlobalKeyDown(e: KeyboardEvent) {
        if (e.key === "Control" && !e.repeat) {
            appStore.ctrlKeyPressed = true;
            console.debug("Tecla Ctrl pulsada");
        }
    }

    function handleGlobalKeyUp(e: KeyboardEvent) {
        if (e.key === "Control") {
            appStore.ctrlKeyPressed = false;
            console.debug("Tecla Ctrl soltada");
        }
    }

    function handleGlobalClick(e: MouseEvent) {
        if (
            sbOpen &&
            e.target instanceof HTMLElement &&
            !e.target.closest(".x-sb-floating") &&
            !e.target.closest(".x-sb-menu")
        ) {
            sbOpen = false;
        }
        if (entryCtxMenuVisible && domEntryCtxMenu && !domEntryCtxMenu.contains(e.target as Node)) {
            entryCtxMenuVisible = false;
        }
    }

    function handleGlobalFocus(e: GenericInputEvent) {
        if (e.target && appStore.focusedElement !== e.target) {
            appStore.focusedElement = e.target;
            console.debug(
                `Tiene el foco -> ${e.target.tagName.toLowerCase()}.${[...e.target.classList].join(".")}` /*, e*/,
            );
        }
    }

    async function handleGlobalBlur(e: GenericInputEvent) {
        // Retrasamos el evento para procesarlo solo si el blur
        // no se ha producido por el enfoque de otro elemento
        setTimeout(() => {
            if (appStore.focusedElement === e.target) {
                appStore.focusedElement = null;
                console.debug("Tiene el foco -> NULL");
            }
        }, 50);
    }

    function add() {
        console.log("Añadiendo nuevo registro...");
        const entry = journalStore.add({
            dateSince: DateTime.local().toFormat("yyyyMMddHHmm"),
            subject: "",
            entities: [],
            updates: { nid: "0", data: [] },
            tags: [],
        });
        filteredView.push(entry);

        // Enfocar el nuevo registro
        focusEntryNextTick = entry.id;
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

    function toggleSb(sbId: string) {
        if (sbOpen && sbTool === sbId) {
            sbOpen = false;
        } else {
            sbOpen = true;
            sbTool = sbId;
        }
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

    function loadFromLS() {
        applyFilters();
        storeManager.loadFromLS();
    }
    function saveToLS() {
        storeManager.saveToLS();
    }

    function saveToDownload() {
        storeManager.saveToDownload();
    }

    function loadFromFileHandler() {
        applyFilters();
        storeManager.loadFromFile();
    }
    function saveToFileHandler() {
        storeManager.saveToFileHandler();
        autosaveLastSaved = DateTime.now();
    }

    let autosaveEnabled = $state(false);
    let autosaveInterval: number | null = null;
    let autosaveLastSaved = $state<DateTime | null>(null);
    function toggleAutosave() {
        if (!autosaveEnabled) {
            if (!storeManager.isFileHandled) {
                alert("No se ha abierto o seleccionado ningún archivo de datos local.");
                return;
            }
            storeManager.saveToLS();
            autosaveEnabled = true;
            autosaveInterval = setInterval(() => {
                storeManager.saveToFileHandler();
                autosaveLastSaved = DateTime.now();
            }, 60000) as unknown as number;
        } else {
            autosaveEnabled = false;
            if (autosaveInterval) {
                clearInterval(autosaveInterval);
            }
            autosaveInterval = null;
        }
    }

    function handleShowEntryContextMenu(ev: MouseEvent, entry: EntrySchema) {
        ev.stopPropagation();
        entryCtxMenuVisible = true;
        entryCtxMenuEntry = entry;
        // Position where mouse, but bot outside the window
        entryCtxMenuPos = { x: ev.clientX, y: ev.clientY };
        tick().then(() => {
            entryCtxMenuPos.x = Math.min(entryCtxMenuPos.x, document.body.clientWidth - domEntryCtxMenu.offsetWidth);
            entryCtxMenuPos.y = Math.min(entryCtxMenuPos.y, document.body.clientHeight - domEntryCtxMenu.offsetHeight);
            //console.log(window.innerWidth, domEntryCtxMenu.offsetWidth);
        });
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
        <h1><i class="fas fa-face-explode mr-2.5"></i>Gestor de tareas</h1>
        <div class="x-logo" use:tippyAction={{ content: "A web tool by bumxu / ©2026" }}></div>
    </header>
    <nav class="x-mainmenu-bar">
        <div class="flex items-center">
            <Button icon="fas fa-circle-plus" onclick={add}>Añadir</Button>
            <!--        <button onclick={() => journalStore.serialize()}>Serialize</button>-->
            <div class="mr-1.5"></div>
            <Button icon="fas fa-arrow-down-from-arc" onclick={loadFromLS} disabled={storeManager.isFileHandled}
                >Cargar (LS)</Button
            >
            <Button icon="fas fa-arrow-up-to-arc" onclick={saveToLS}>Guardar (LS)</Button>
            <!--        <button onclick={() => storeManager.saveWithSSR()}>Save (SSR)</button>-->
            <!--        <button onclick={() => storeManager.loadWithSSR()}>Load (SSR)</button>-->
            <div class="mr-1.5"></div>
            <Button icon="fas fa-download" onclick={saveToDownload}>Descargar</Button>
            <div class="mr-1.5"></div>
            <Button icon="fas fa-folder-open" onclick={loadFromFileHandler}>
                Usar archivo local
                {#if storeManager.isFileHandled}&nbsp;<i class="fas fa-check-circle mx-0.5" style="color: #4ca67b"
                    ></i>{/if}
            </Button>
            <Button icon="fas fa-save" onclick={saveToFileHandler}>Guardar a local</Button>
            <Button icon="fas fa-robot" onclick={toggleAutosave}>
                Autoguardado
                <i
                    class="fas"
                    class:fa-toggle-off={!autosaveEnabled}
                    class:fa-toggle-on={autosaveEnabled}
                    style:color={autosaveEnabled ? "#4ca67b" : null}
                ></i>
            </Button>
            {#if autosaveEnabled}
                <span class="ml-1 text-xs text-gray-400">
                    (Última vez: {autosaveLastSaved
                        ? autosaveLastSaved.toLocaleString(DateTime.TIME_WITH_SECONDS)
                        : "nunca"})
                </span>
            {/if}
        </div>
    </nav>
    <div class="x-container">
        <div class="x-main">
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
                            onshowctxmenu={handleShowEntryContextMenu}
                        />
                    </div>
                {/each}
            </div>

            <br /><br />
        </div>

        {#if sbOpen}
            <div class="x-sidebar x-sb-floating">
                {#if sbTool === "etypes"}
                    <SBEntityTypes bind:entityTypes={entityTypesStore.entityTypes} />
                {/if}
                {#if sbTool === "entities"}
                    <SbEntities entities={entitiesStore.entities} />
                {/if}
                {#if sbTool === "tags"}
                    <SBTags bind:tags={tagsStore.tags} />
                {/if}
                {#if sbTool === "statuses"}
                    <SBStatuses bind:statuses={statusesStore.statuses} />
                {/if}
                {#if sbTool === "priorities"}
                    <SBPriorities bind:priorities={prioritiesStore.priorities} />
                {/if}
                {#if sbTool === "filters"}
                    <SBFilters bind:basicFilters={filtersStore.filters} />
                {/if}
                {#if sbTool === "console"}
                    <SBConsole />
                {/if}
            </div>
        {/if}

        <div class="x-sb-menu">
            <ul>
                <li>
                    <button
                        onclick={() => toggleSb("etypes")}
                        aria-label="Tipos de entidad"
                        use:tippyAction={{ placement: "left", content: "Tipos de entidad" }}
                    >
                        <i class="fad fa-cube"></i>
                    </button>
                </li>
                <li>
                    <button
                        onclick={() => toggleSb("entities")}
                        aria-label="Entidades"
                        use:tippyAction={{ placement: "left", content: "Entidades" }}
                    >
                        <i class="fad fa-cubes-stacked"></i>
                    </button>
                </li>
                <li>
                    <button
                        onclick={() => toggleSb("tags")}
                        aria-label="Tags"
                        use:tippyAction={{ placement: "left", content: "Tags" }}
                    >
                        <i class="fad fa-tag"></i>
                    </button>
                </li>
                <li>
                    <button
                        onclick={() => toggleSb("statuses")}
                        aria-label="Estados"
                        use:tippyAction={{ placement: "left", content: "Estados" }}
                    >
                        <i class="fad fa-percent"></i>
                    </button>
                </li>
                <li>
                    <button
                        onclick={() => toggleSb("priorities")}
                        aria-label="Prioridades"
                        use:tippyAction={{ placement: "left", content: "Prioridades" }}
                    >
                        <i class="fad fa-fire"></i>
                    </button>
                </li>
                <li>
                    <button
                        onclick={() => toggleSb("filters")}
                        aria-label="Filtros básicos"
                        use:tippyAction={{ placement: "left", content: "Filtros básicos" }}
                    >
                        <i class="fad fa-filters"></i>
                    </button>
                </li>
                <li>
                    <button
                        onclick={() => toggleSb("console")}
                        aria-label="Consola"
                        use:tippyAction={{ placement: "left", content: "Consola" }}
                    >
                        <i class="fad fa-terminal"></i>
                    </button>
                </li>
            </ul>
        </div>
    </div>
    <footer class="x-status-bar">
        Kanso es una aplicación estática y no almacena ni envía datos fuera del equipo del usuario.
    </footer>

    <div
        class="x-ctxmenu text-center"
        class:visible={entryCtxMenuVisible}
        bind:this={domEntryCtxMenu}
        style:top={entryCtxMenuPos.y + "px"}
        style:left={entryCtxMenuPos.x + "px"}
    >
        <ul>
            <li>
                <i class="fas fa-hashtag fa-fw fa-sm"></i>
                {entryCtxMenuEntry?.id}
            </li>
            <li>
                <button><i class="fad fa-fw fa-hand-back-point-left"></i> Tocar</button>
            </li>
            <li>
                <button><i class="fad fa-fw fa-copy"></i> Duplicar</button>
            </li>
            <li>
                <button><i class="fad fa-fw fa-trash"></i> Eliminar</button>
            </li>
        </ul>
    </div>
</div>

<style lang="scss">
    .x-logo {
        width: 22px;
        background: url("https://www.bumxu.com/g/logo-preview.svg") no-repeat center center;
        background-size: contain;
        filter: saturate(0.4);
        opacity: 0.5;
        position: absolute;
        right: 15px;
        top: 0;
        bottom: 0;
    }

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
        position: relative;

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
        padding: 5px;

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

    .x-ctxmenu {
        position: absolute;
        top: 0;
        left: 0;
        display: none;
        background: #fff;
        border: 1px solid #aaa;
        border-radius: 2px;
        box-shadow: 0 0 2px 1px rgba(#000, 0.2);
        z-index: 1000;

        &.visible {
            display: block;
        }

        ul {
            list-style: none;
            padding: 0;
            margin: 0;

            li {
                button {
                    width: 100%;
                    padding: 4px 8px;
                    border: none;
                    background: none;
                    align-items: center;
                    cursor: pointer;
                    text-align: left;
                    display: flex;
                    flex-wrap: nowrap;
                }
            }
        }
    }
</style>
