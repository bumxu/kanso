<script lang="ts">
    type Props = {
        class?: string,
        iconclass: string,
        iconclasshover?: string,
        inheritcolor?: boolean,
        label?: string,
        onclick?: (ev: MouseEvent) => void,
    }
    let {
        class: clazz = '',
        iconclass = '',
        iconclasshover = '',
        inheritcolor = false,
        label,
        onclick
    }: Props = $props();

    let isHoveredOrFocused = $state(false);

    function handleMouseEnter() { isHoveredOrFocused = true; }
    function handleMouseLeave() { isHoveredOrFocused = false; }

</script>

{#if onclick}
    <button class="x-ic {clazz}"
            onclick={onclick}
            onmouseenter={handleMouseEnter}
            onmouseleave={handleMouseLeave}
            title={label}
            aria-label={label}>
        <i class={(isHoveredOrFocused && iconclasshover) ? iconclasshover : iconclass} class:inheritcolor></i>
    </button>
{:else}
    <i class="{iconclass} {clazz} inheritcolor"></i>
{/if}

<style lang="scss">
    button {
        background: none;
        border: none;
        cursor: pointer;
        display: inline;
        padding: 0;
        outline: none;
        color: inherit;

        i {
            color: #888;
            transition: color 0.1s;
        }
        i.inheritcolor {
            color: inherit;
        }

        &:hover i, &:focus i {
            color: var(--color-icon-hover) !important;
        }
    }
</style>