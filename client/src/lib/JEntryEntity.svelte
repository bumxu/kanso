<script lang="ts">

    import { SERVER_HOST } from '$lib/constants';
    import { EntitiesService } from '$lib/services/EntitiesService';
    import { onMount } from 'svelte';

    export let entryId: number;
    export let linkedEntity: any;

    let isNew: boolean;
    let dirty:boolean = false;

    let domInput: HTMLSpanElement;
    let focused = false;

    // Texto introducido por el usuario
    let userInput = '';
    // Entidades que coinciden con la entidad introducida por el usuario
    let matches: any[] = [];
    // Si se muestra el dropdown con las entidades sugeridas
    let matchesVisible = false;
    // Índice de la entidad seleccionada en el dropdown
    let matchesSelectedIndex = -1;

    let userInputEntity = '';
    entityFromInput(userInput);

    onMount(() => {
        dirty = linkedEntity.entity == null;
        userInput = linkedEntity.entity != null ? entityToStr(linkedEntity) : '';
    });

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
        if (userInput.length > 0 && userInputEntity != null) {
            const inputEntity = entityFromInput(userInput);
            matches = EntitiesService.getInstance().getSuggestions(userInputEntity);
            if (matches.length > 0) {
                matchesSelectedIndex = 0;
            } else {
                matchesSelectedIndex = -1;
            }
            matchesVisible = true;
        } else {
            matchesVisible = false;
        }
    }

    async function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            e.preventDefault();
            // if (tagInput.length > 0) {
            //     if (matchesSelectedIndex === -1) {
            //         const tag = await create(tagInput);
            //         if (tag)
            //             await link(tag);
            //     } else {
            //         const tag = tagMatches[matchesSelectedIndex];
            //         await link(tag);
            //     }
            //     tagInput = '';
            //     domInput.blur();
            // }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            matchesSelectedIndex = Math.min(matchesSelectedIndex + 1, matches.length - 1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            matchesSelectedIndex = Math.max(matchesSelectedIndex - 1, -1);
        } else if (e.key === 'Escape') {
            domInput.blur();
        }
    }

    function entityToStr(entityLnk: any) {
        let str = '';
        const lnkMetadata = JSON.parse(entityLnk.metadata);

        if (lnkMetadata.prefix != null) {
            str += lnkMetadata.prefix + ' ';
        }

        str += entityLnk.entity.extId;

        if (lnkMetadata.suffix != null) {
            str += ' ' + lnkMetadata.suffix;
        }

        return str;
    }

    function strToEntity(str: string) {
        str = str.trim();

        if (/^[TMC]\d{3,8}/.test(str)) {
            // Egipto

        } else if (/^R \d+/.test(str)) {
            // Remedy

        } else if (/^T \d+/.test(str)) {

        } else if (/^O \d+/.test(str)) {

        } else {
            return {entity: str};
        }
    }

    function entityFromInput(input: string) {
        const splt = input.trim().split(/\s+/);
        if (splt.length == 1) {
            return splt[0];
        } else if (splt.length >= 2) {
            return splt[1];
        } else {
            return null;
        }
    }

</script>

<div>
    <div class="x-input"
         role="textbox"
         contenteditable="true"
         tabindex="0"
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
                >{tag.extId}</span>
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
    }

    .x-tag-matches {
        position: absolute;
        background: white;
        border-radius: 2px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        z-index: 100;
        min-width: calc(100% - 4px);

        .x-tag-match {
            display: block;
            padding: 2px 4px;
            cursor: pointer;
            font-weight: 600;

            &:hover, &.selected {
                background: rgba(0, 0, 0, 0.04);
                color: #000;
            }
        }
    }
</style>