<script lang="ts">
    //import 'simplebar'; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
    import 'simplebar/dist/simplebar.css';
    import SimpleBar from 'simplebar';
    import { onMount } from 'svelte';

    type Props = {
        autohide?: boolean;
        tabindex?: string | 'false';
        children: any;
    }
    let { children, autohide = true, tabindex = '0' }: Props = $props();

    // onMount(() => {
    //     new SimpleBar(children);
    // });

</script>

{#if children}
    <div data-simplebar data-simplebar-auto-hide={autohide} style="height: 100%;" data-simplebar-tab-index={tabindex}>
        {@render children()}
    </div>
{/if}