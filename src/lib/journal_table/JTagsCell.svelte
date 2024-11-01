<script lang="ts">
    import { tagsStore } from '$lib/stores/tags.store.j4.svelte';
    import type { SuggestionsSchema, TagSchema } from '$lib/types/j4_types';
    import { tick } from 'svelte';

    type Props = { entryId: string, tagsIds: string[] };

    let {
        entryId,
        tagsIds = $bindable()
    }: Props = $props();

    let domInput: HTMLSpanElement;
    let focused = $state(false);

    let tagInput = $state('');
    let tagMatches: SuggestionsSchema<TagSchema> = $state([]);
    let tagMatchesVisible = $state(false);
    let tagMatchesSelectedIndex = $state(-1);

    let tags = $derived.by(() => {
        return tagsIds.map((tagId: string) => tagsStore.getById(tagId) ?? { id: tagId, name: '#' + tagId + '?' });
    });

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
            tagMatches = tagsStore.getSuggestions(term);
            console.debug(tagMatches);

            if (tagMatches.length > 0) {
                tagMatchesSelectedIndex = 0;
            } else {
                tagMatchesSelectedIndex = -1;
            }

            tagMatchesVisible = true;
        } else {
            tagMatches = [];
            tagMatchesVisible = false;
        }
    }

    function link(tag: TagSchema) {
        if (!tagsIds.includes(tag.id)) {
            console.debug(`Tag ${tag.id} "${tag.name}" añadida al registro`);
            tagsIds.push(tag.id);
            tagMatchesVisible = true;
        }
    }

    function unlink(tag: TagSchema) {
        tagsIds = tagsIds.filter((tagId) => tagId !== tag.id);
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (tagInput.length > 0) {
                let tag;
                if (tagMatchesSelectedIndex === -1) {
                    tag = tagsStore.add({ name: tagInput });
                } else {
                    tag = tagMatches[tagMatchesSelectedIndex].item;
                }
                link(tag);
                tagInput = '';
                //domInput.blur();
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            tagMatchesSelectedIndex = tagMatchesSelectedIndex + 1;
            if (tagMatchesSelectedIndex >= tagMatches.length) {
                tagMatchesSelectedIndex = -1;
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            tagMatchesSelectedIndex = tagMatchesSelectedIndex - 1;
            if (tagMatchesSelectedIndex < -1) {
                tagMatchesSelectedIndex = tagMatches.length - 1;
            }
        } else if (e.key === 'Escape') {
            domInput.blur();
        }
    }

    async function handleClickCell() {
        focused = true;
        await tick();
        domInput.focus();
    }

    function handleClickUnlink(ev: MouseEvent, tag: TagSchema) {
        ev.stopPropagation();
        unlink(tag);
    }

</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->

<div class="x-cell-wrapper x-input-wrapper"
     onclick={handleClickCell}>
    <link rel="stylesheet" href="https://unpkg.com/simplebar@latest/dist/simplebar.css" />
    <script src="https://unpkg.com/simplebar@latest/dist/simplebar.min.js"></script>

    <div class="x-cell" style="overflow: auto">
        {#each tags as tag}
            <span class="x-tag" style:background-color={tag.bgColor} style:color={tag.color}>
                {tag ? tag.name : '?'}
                <i class="fas fa-fw fa-sm fa-times" style="cursor: pointer"
                   aria-label="Quitar" title="Quitar"
                   onclick={(ev) => handleClickUnlink(ev,tag)}></i>
            </span>
        {/each}

        <span class="x-tag x-new"
              role="textbox"
              contenteditable="true"
              tabindex="0"
              class:hidden={!focused && tagInput.length === 0}
              bind:this={domInput}
              bind:textContent={tagInput}
              oninput={handleInput}
              onfocus={handleFocus}
              onblur={handleBlur}
              onkeydown={handleKeyDown}
        ></span>
        <div style="clear: both" />
    </div>

    {#if tagMatchesVisible}
        <div class="x-tag-matches">
            {#each tagMatches as tagMatch, i}
                <span class="x-tag-match"
                      class:selected={tagMatchesSelectedIndex === i}
                >{tagMatch.item.name}</span>
            {/each}
            <span class="x-tag-match"
                  class:selected={tagMatchesSelectedIndex === -1}>
                {tagInput} (nueva)
            </span>
        </div>
    {/if}

</div>

<style lang="scss">
    .x-cell-wrapper {
        width: 100%;
        overflow: visible;
        position: relative;
        padding: 2px 2px 0;
        box-sizing: border-box;
        padding-bottom: 8px;

        &::after {
            content: '';
            display: block;
            background: red;
            pointer-events: none;
            height: 15px;
            left: 0;
            right: 0;
            position: absolute;
            bottom: 0;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 100%);
        }
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
        padding: 0 3px;
        border-radius: 1px;
        background: #ddd;
        margin-right: 2px;
        margin-bottom: 2px;
        font-size: 0.6rem;
        font-weight: 600;
        text-rendering: optimizeLegibility;
        color: #555;
        border: 1px solid rgba(0, 0, 0, 0.25);

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