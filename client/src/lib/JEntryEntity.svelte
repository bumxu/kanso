<script lang="ts">

    import { SERVER_HOST } from '$lib/constants';

    export let entryId: number;
    export let entity: any;

    let domInput: HTMLSpanElement;
    let focused = false;

    // Texto introducido por el usuario
    let userInput = entity.entity.extId;
    // Entidades que coinciden con la entidad introducida por el usuario
    let matches: any[] = [];
    // Si se muestra el dropdown con las entidades sugeridas
    let matchesVisible = false;
    // Índice de la entidad seleccionada en el dropdown
    let matchesSelectedIndex = -1;

    function handleFocus() {
        focused = true;
        if (userInput.length > 0) {
            matchesVisible = true;
        }
    }

    function handleBlur() {
        focused = false;
        matchesVisible = false;
    }

    async function handleInput(event: any) {
        // const response = await fetch(`${SERVER_HOST}/api/journal/entities?q=${inputStr}`, {
        //     method: 'GET'
        // });
        // if (response.ok) {
        //     const data = await response.json();
        //
        //     console.log('response ok', data);
        // }
    }

    async function handleKeyDown(e: KeyboardEvent) {
        // if (e.key === 'Enter') {
        //     e.preventDefault();
        //     if (tagInput.length > 0) {
        //         if (tagMatchesSelectedIndex === -1) {
        //             const tag = await create(tagInput);
        //             if (tag)
        //                 await link(tag);
        //         } else {
        //             const tag = tagMatches[tagMatchesSelectedIndex];
        //             await link(tag);
        //         }
        //         tagInput = '';
        //         domInput.blur();
        //     }
        // } else if (e.key === 'ArrowDown') {
        //     e.preventDefault();
        //     tagMatchesSelectedIndex = Math.min(tagMatchesSelectedIndex + 1, tagMatches.length - 1);
        // } else if (e.key === 'ArrowUp') {
        //     e.preventDefault();
        //     tagMatchesSelectedIndex = Math.max(tagMatchesSelectedIndex - 1, -1);
        // } else if (e.key === 'Escape') {
        //     domInput.blur();
        // }
    }

    function entityToStr() {

    }

    function strToEntity(str: string) {
        if (/^[TMC]\d{3,8}/.test(str)) {
            // Egipto

        } else if (/^R \d+/.test(str)) {
            // Remedy

        } else if (/^T \d+/.test(str)) {

        } else if (/^O \d+/.test(str)) {

        } else if (/^REQ \d+/.test(str)) {

        } else if (/^CRQ \d+/.test(str)) {

        } else if (/^TAS \d+/.test(str)) {

        }
    }

    function entityFromInput(input: string) {
        if (/\s/.test(input)) {

        } else {
            return input;
        }
    }

</script>

<div>
    <div class="x-input"
         role="textbox"
         contenteditable="true"
         tabindex="0"
         class:hidden={!focused && userInput.length === 0}
         bind:this={domInput}
         bind:textContent={userInput}
         on:input={handleInput}
         on:focus={handleFocus}
         on:blur={handleBlur}
         on:keydown={handleKeyDown}
    />

    {#if matchesVisible}
        <div class="x-tag-matches">
            <span class="x-tag-match"
                  class:selected={matchesSelectedIndex === -1}>
                {userInput} (nueva)
            </span>
            {#each matches as tag, i}
                <span class="x-tag-match"
                      class:selected={matchesSelectedIndex === i}
                >{tag.name}</span>
            {/each}
        </div>
    {/if}
</div>

<style lang="scss">
    .x-input {
        display: block;
        padding: 0 3px;
        border-radius: 2px;
        height: 18px;
        font-size: 0.68rem;
        line-height: 18px;
        text-rendering: optimizeLegibility;
        border-bottom: 1px dashed #eee;

        &:focus {
            background-color: #ffffD6;
            outline: none;
            white-space: nowrap;
        }

        &.hidden {
            display: none;
        }
    }
</style>