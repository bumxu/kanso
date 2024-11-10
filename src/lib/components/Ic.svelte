<script lang="ts">
    type Props = {
        iconclass: string,
        label?: string,
        onclick?: (ev: MouseEvent) => void
    }
    let {
        iconclass = '',
        label,
        onclick
    }: Props = $props();
</script>

{#if onclick}
    <button class="x-ic"
            onclick={onclick}
            title={label}
            aria-label={label}>
        <i class={iconclass}></i>
    </button>
{:else}
    <i class={iconclass}></i>
{/if}

<style lang="scss">
    button {
        background: none;
        border: none;
        cursor: pointer;
        display: inline;
        padding: 0;
        outline: none;

        i {
            color: #888;
            transition: color 0.1s;
        }

        &:hover i, &:focus i {
            color: var(--color-icon-hover);
        }
    }
</style>