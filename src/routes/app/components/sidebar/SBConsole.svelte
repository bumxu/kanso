<script lang="ts">

    import { tick } from 'svelte';

    let content = $state('');
    let domInput: HTMLTextAreaElement;

    $effect(async () => {
        content = window.consoleBuffer;
        await tick();
        domInput.scrollTop = domInput.scrollHeight;
    });

</script>

<div class="x-sb-section">
    <div class="x-sb-header">
        <i class="fad fa-fw fa-sm fa-terminal"></i>
        Salida de consola
    </div>

    <textarea class="x-textarea ff-mono" bind:value={content} readonly bind:this={domInput}></textarea>
</div>

<style lang="scss">
    .x-sb-section {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .x-sb-header{
        flex: 0 0 auto;
    }

    .x-textarea {
        font-size: 9px;
        font-weight: 400;
        flex: 1 0 0px;
        width: 100%;
        box-sizing: border-box;
        border: none;
        resize: none;
        outline: none;
        //white-space: pre;
    }
</style>
