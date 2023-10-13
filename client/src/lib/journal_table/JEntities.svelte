<script lang="ts">
    import JEntryEntity from '$lib/JEntryEntity.svelte';
    import JEntryUpdate from '$lib/JEntryUpdate.svelte';
    import { onMount } from 'svelte';

    export let entryId: number | undefined;
    export let entities: [] = [];

    let domInput: HTMLSpanElement;
    let focused = false;



    onMount(async () => {

    });

    function add() {
        //updates = [...updates, {body: ''}];
    }

</script>

<div class="x-cell-wrapper">
    <div class="x-entities">
        {#each entities as entity}
        <!--    &lt;!&ndash;    <div>{entity.entity.extId}</div>&ndash;&gt;-->
            <JEntryEntity entryId={entryId} entity={entity} />
        {/each}


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