<script lang="ts">
    import { SERVER_HOST } from '$lib/constants';
    import type { JTagType } from '$lib/types/JTagType';
    import { tick } from 'svelte';
    import { ztags } from '$lib/stores/tags_store';

    export let entryId: number;
    export let tags: JTagType[] = [];

    let domInput: HTMLSpanElement;
    let focused = false;

    let tagInput = '';
    let tagMatches: JTagType[] = [];
    let tagMatchesVisible = false;
    let tagMatchesSelectedIndex = -1;

    function handleFocus() {
        focused = true;
        if (tagInput.length > 0) {
            tagMatchesVisible = true;
        }
    }

    function handleBlur() {
        focused = false;
        tagMatchesVisible = false;
    }

    async function handleInput(e: any) {
        const term = e.target.innerText;
        if (term.length > 0) {
            try {
                const response = await fetch(`${SERVER_HOST}/api/journal/tags?q=${term}`, {
                    method: 'GET'
                });
                if (response.ok) {
                    //console.debug(`Registro ${entry.id} eliminado con éxito`);
                    tagMatches = await response.json();
                    if (tagMatches.length > 0) {
                        tagMatchesSelectedIndex = 0;
                    } else {
                        tagMatchesSelectedIndex = -1;
                    }
                } /*else {
                const body = await response.text();
                throw new Error(`(${response.status}) ${body}`);
            }*/
            } catch (e) {
                console.error(`Error buscando tags para "${term}" -`, e);
            } finally {
                tagMatchesVisible = true;
            }
        } else {
            tagMatches = [];
            tagMatchesVisible = false;
        }
    }

    async function create(name: string): Promise<JTagType | null> {
        try {
            const response = await fetch(`${SERVER_HOST}/api/journal/tags`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name})
            });
            if (response.ok) {
                const tag = await response.json();
                console.debug(`Tag ${tag.id} "${tag.name}" creada con éxito`);
                $ztags = {...$ztags, [tag.id]: tag};
                return tag;
            } /*else {
                const body = await response.text();
                throw new Error(`(${response.status}) ${body}`);
            }*/
        } catch (e) {
            console.error(`Error creando el tag "${name}" -`, e);
            return null;
        } finally {
            tagMatchesVisible = true;
        }
    }

    async function link(tag: JTagType) {
        try {
            const response = await fetch(`${SERVER_HOST}/api/journal/entries/${entryId}/tags/${tag.id}`, {
                method: 'POST'
            });
            if (response.ok) {
                console.debug(`Tag ${tag.id} "${tag.name}" añadida al registro`);
                tags = [...tags, tag];
            } /*else {
                const body = await response.text();
                throw new Error(`(${response.status}) ${body}`);
            }*/
        } catch (e) {
            console.error(`Error añadiendo el tag ${tag.id} "${tag.name}" al registro -`, e);
        } finally {
            tagMatchesVisible = true;
        }
    }

    async function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (tagInput.length > 0) {
                if (tagMatchesSelectedIndex === -1) {
                    const tag = await create(tagInput);
                    if (tag)
                        await link(tag);
                } else {
                    const tag = tagMatches[tagMatchesSelectedIndex];
                    await link(tag);
                }
                tagInput = '';
                domInput.blur();
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            tagMatchesSelectedIndex = Math.min(tagMatchesSelectedIndex + 1, tagMatches.length - 1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            tagMatchesSelectedIndex = Math.max(tagMatchesSelectedIndex - 1, -1);
        } else if (e.key === 'Escape') {
            domInput.blur();
        }
    }

    async function handleClickCell() {
        focused = true;
        await tick();
        domInput.focus();
    }

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="x-cell-wrapper x-input-wrapper"
     on:click={handleClickCell}
>

    {#each tags.map(t => t.name) as tag}
        <span class="x-tag">{tag}</span>
    {/each}

    <span class="x-tag x-new"
          role="textbox"
          contenteditable="true"
          tabindex="0"
          class:hidden={!focused && tagInput.length === 0}
          bind:this={domInput}
          bind:textContent={tagInput}
          on:input={handleInput}
          on:focus={handleFocus}
          on:blur={handleBlur}
          on:keydown={handleKeyDown}
    />
    <div style="clear: both" />

    {#if tagMatchesVisible}
        <div class="x-tag-matches">
            <span class="x-tag-match"
                  class:selected={tagMatchesSelectedIndex === -1}>
                {tagInput} (nueva)
            </span>
            {#each tagMatches as tag, i}
                <span class="x-tag-match"
                      class:selected={tagMatchesSelectedIndex === i}
                >{tag.name}</span>
            {/each}
        </div>
    {/if}

</div>

<style lang="scss">
    .x-cell-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        padding: 2px 2px 0;
        box-sizing: border-box;
    }

    .x-input-wrapper {
        cursor: text;
        &:hover {
            background: rgba(0, 0, 0, 0.03);
        }
    }

    .x-tag {
        display: block;
        float: left;
        padding: 0 2px;
        border-radius: 2px;
        background: #ddd;
        margin-right: 2px;
        margin-bottom: 2px;
        font-size: 0.6rem;
        font-weight: 700;
        text-rendering: optimizeLegibility;
        color: #555;
        border: 1px solid #ccc;

        &.x-new {
            background-color: #ffffD6;
            outline: none;
            white-space: nowrap;
        }

        &.hidden {
            display: none;
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