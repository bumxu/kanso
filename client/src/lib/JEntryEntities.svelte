<script lang="ts">
    import JEntryEntity from '$lib/JEntryEntity.svelte';
    import JEntryUpdate from '$lib/JEntryUpdate.svelte';
    import { onMount } from 'svelte';

    export let entry: number | undefined;
    export let entities: [] = [];

    let searchResults: [] = [];

    onMount(async () => {

    });

    function add() {
        //updates = [...updates, {body: ''}];
    }

    function search() {
        searchResults = [
            {extId: 'M135904'},
            {extId: '9546453'}
        ];
    }
</script>

<div class="x-cell-wrapper">
    <div class="x-entities">
        {#each entities as entity}
            <!--    <div>{entity.entity.extId}</div>-->
            <JEntryEntity rawEntryEntity={entity} />
        {/each}

        <div class="x-entities-completions-wrapper" style="display: none">
            <input type="text" on:input={search}>
            <div class="x-entities-completions">
                {#each searchResults as result}
                    <div>
                        {result.extId}
                    </div>
                {/each}
            </div>
        </div>
    </div>
    <button on:click={add}>
        <i class="fas fa-caret-down fa-sm" />
    </button>
</div>

<style lang="scss">
    .x-cell-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
    }

    .x-entities {
        flex-grow: 1;
    }

    button {
        display: block;
        position: relative;
        width: 100%;
        height: 10px;
        padding: 0;
        line-height: 10px;
        border: none;
        cursor: pointer;
    }
</style>