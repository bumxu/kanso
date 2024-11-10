<script lang="ts">
    import Ic from '$lib/components/Ic.svelte';

    type Props = {
        value: string,
        active: boolean
    }
    let { value = $bindable(), active = $bindable(true) }: Props = $props();
    let isRegex = $derived(value.startsWith('/'));

    function handleToggleActive() {
        active = !active;
    }

    function handleClearFilter() {
        value = '';
        active = true;
    }
</script>

<div class="cell-content">
    <Ic iconclass="{active ? 'fas' : 'far'} fa-sm fa-filter"
        label="Filtro {active ? 'activo' : 'inactivo'}"
        onclick={handleToggleActive} />
    <input type="text" placeholder="Filtro rápido"
           spellcheck="false"
           bind:value={value} class="flex-1 min-w-0"
           class:x-rx={isRegex}
           class:ff-mono={isRegex}>
    <Ic iconclass="fad fa-sm fa-delete-left"
        label="Limpiar"
        onclick={handleClearFilter} />
</div>

<style lang="scss">
    .cell-content {
        overflow: hidden;
        flex: 1 1 auto;
        display: flex;
        min-width: 0;
        column-gap: 2px;
        align-items: center;
        padding: 0 4px;
        box-sizing: border-box;
    }
    input {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &.x-rx {
            color: var(--color-regexp);
        }
    }
</style>