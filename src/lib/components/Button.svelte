<script lang="ts">
    type Props = {
        variant?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link',
        tooltip?: string | null,
        sm?: boolean,
        icon?: string,
        minWidthHideLabel?: number,
        children: any,
        [key: string]: any
    }

    let {
        variant = 'primary',
        tooltip = '',
        sm = false,
        icon,
        minWidthHideLabel,
        children,
        ...othProps
    }: Props = $props();

    let domLabel: HTMLSpanElement;
    let selfText: string | null = $derived.by(() => domLabel?.textContent);
    let selfHtml: string | null = $derived.by(() => domLabel?.innerText);

    let windowWidth = $state();
    let iconOnly = $derived.by(() => icon != null && (children == null || minWidthHideLabel != null && windowWidth < minWidthHideLabel));

    // $effect(() => {
    //     //     tooltip = tooltip || selfText;
    //     console.debug(windowWidth);
    // });

    // $: selfText = domLabel?.textContent;
    // $: selfHtml = domLabel?.innerText;
    // $: if (tooltip == null && selfText != null) {
    //     tooltip = selfText;
    // }


</script>

<svelte:window bind:innerWidth={windowWidth}/>

<button class="btn {variant ? 'btn-' + variant : ''} inline-flex flex-row items-center"
        class:sm={sm}
        class:btn-ic={icon != null}
        class:btn-ic-only={iconOnly}
        {...othProps}
        title={tooltip}>
    {#if icon}
      <span class="btn-icon">
         <i class="{icon}" class:fa-fw={icon != null && children == null}></i>
      </span>
    {/if}

    {#if children && !iconOnly}
        <span class="btn-label" bind:this={domLabel}>{@render children()}</span>
    {/if}
</button>