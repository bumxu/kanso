<script lang="ts">
    import SimpleBar from '$lib/components/SimpleBar.svelte';
    import { tagsStore } from '$lib/stores/tags.store.j4.svelte.js';
    import type { SuggestionsSchema, TagSchema } from '$lib/types/j4_types';
    import { tick } from 'svelte';
    import { fade, slide } from 'svelte/transition';

    type Props = { entryId: string, tagsIds: string[] };

    let {
        entryId,
        tagsIds = $bindable()
    }: Props = $props();

    let domInput: HTMLSpanElement;
    let focused = $state(false);

    let tagInput = $state('');
    let tagMatches: SuggestionsSchema<TagSchema> = $state([]);
    let tagMatchesSelectedIndex = $state(-1);

    let tagMatchesVisible = $derived(focused && tagMatches.length > 0 && tagInput.trim().length > 0);

    let tags = $derived.by(() => {
        return tagsIds.map((tagId: string) => tagsStore.getById(tagId) ?? { id: tagId, name: '#' + tagId + '?' });
    });

    function handleFocus() { focused = true; }
    function handleBlur() { focused = false; }

    async function handleInput(e: any) {
        const term = e.target?.innerText?.trim();
        if (term.length > 0) {
            tagMatches = tagsStore.getSuggestions(term);
            console.debug('Etiquetas coincidentes:', $state.snapshot(tagMatches).map((tag) => tag.item.name));

            if (tagMatches.length > 0) {
                tagMatchesSelectedIndex = 0;
            } else {
                tagMatchesSelectedIndex = -1;
            }
        } else {
            tagMatches = [];
        }
    }

    function link(tag: TagSchema) {
        if (!tagsIds.includes(tag.id)) {
            console.debug(`Tag ${tag.id} "${tag.name}" añadida al registro`);
            tagsIds.push(tag.id);
            tagMatches = [];
        }
    }

    function unlink(tag: TagSchema) {
        tagsIds = tagsIds.filter((tagId) => tagId !== tag.id);
    }

    function handleChooseMatch(matchIndex: number) {
        console.debug('handleChooseMatch', matchIndex);
        const tag = matchIndex === -1
            ? tagsStore.add({ name: tagInput })
            : tagMatches[matchIndex].item;
        link(tag);
        tagInput = '';
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (tagInput.length > 0) {
                handleChooseMatch(tagMatchesSelectedIndex);
            }
        } else if (e.key === 'Tab') {
            if (tagInput.length > 0) {
                let tag;
                if (tagMatchesSelectedIndex === -1) {
                    tag = tagsStore.add({ name: tagInput });
                } else {
                    tag = tagMatches[tagMatchesSelectedIndex].item;
                }
                link(tag);
                tagInput = '';
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
            tagMatches = [];
            tagMatchesSelectedIndex = -1;
            tagInput = '';
            //domInput.blur();
        }
    }

    async function handleClickCell() {
        focused = true;
        await tick();
        domInput.focus();
        domInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function handleClickUnlink(ev: MouseEvent, tag: TagSchema) {
        ev.stopPropagation();
        unlink(tag);
    }

</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="x-cell-wrapper" role="none" onclick={handleClickCell}>

    <SimpleBar>
        <div class="x-tags">
            {#each tags as tag}
            <span class="x-tag"
                  style:background-color={tag.bgColor}
                  style:color={tag.color}
                  transition:slide={{axis: 'x', duration: 120}}>
                {tag ? tag.name : '?'}
                <i class="fas fa-fw fa-sm fa-times" style="cursor: pointer"
                   aria-label="Quitar" title="Quitar"
                   onclick={(ev) => handleClickUnlink(ev,tag)}></i>
            </span>
            {/each}

            {#if focused || tagInput.length > 0}
            <span class="x-tag x-new"
                  role="textbox"
                  contenteditable="true"
                  tabindex="0"
                  transition:fade={{duration: 120}}
                  bind:this={domInput}
                  bind:textContent={tagInput}
                  oninput={handleInput}
                  onfocus={handleFocus}
                  onblur={handleBlur}
                  onkeydown={handleKeyDown}
            ></span>
            {/if}
        </div>
    </SimpleBar>

    {#if tagMatchesVisible}
        <div class="x-tag-matches">
            {#each tagMatches as tagMatch, i}
                <span class="x-tag-match"
                      class:selected={tagMatchesSelectedIndex === i}
                      onclick={() => handleChooseMatch(i)}>
                    {tagMatch.item.name}
                </span>
            {/each}
            <span class="x-tag-match"
                  class:selected={tagMatchesSelectedIndex === -1}
                  onclick={() => handleChooseMatch(-1)}>
                {tagInput} (nueva)
            </span>
        </div>
    {/if}

</div>

<style lang="scss">
    .x-cell-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        box-sizing: border-box;
        cursor: text;
        transition: background-color 0.2s;

        &:hover {
            background-color: var(--color-hovered);
            transition: background-color 0.15s;

            .x-tag {
                border: 1px solid rgba(0, 0, 0, 0.2);
                transition: border 0.15s;
            }
        }
    }

    .x-tags {
        display: flex;
        flex-wrap: wrap;
        padding: 2px;
    }

    .x-tag {
        display: block;
        flex: 0 0 auto;
        padding: 0 3px;
        border-radius: 1px;
        background: #eee;
        margin-right: 3px;
        margin-bottom: 3px;
        font-size: 10px;
        white-space: nowrap;
        line-height: 1.45;
        font-weight: 500;
        text-rendering: optimizeLegibility;
        color: #444;
        border: 1px solid rgba(0, 0, 0, 0.1);

        &.x-new {
            background-color: var(--color-focused);
            outline: none;
            white-space: nowrap;
            min-width: 10px;
            height: calc(10px * 1.45);
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
        max-height: 125px;
        overflow: auto;

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