<script lang="ts">

    import * as cmAutocomplete from '@codemirror/autocomplete';
    import * as cmCommands from '@codemirror/commands';
    import { javascript } from '@codemirror/lang-javascript';
    import * as cmLanguage from '@codemirror/language';
    import { json } from '@codemirror/lang-json';
    import * as cmLint from '@codemirror/lint';
    import * as cmSearch from '@codemirror/search';
    import { EditorState } from '@codemirror/state';
    import * as cmView from '@codemirror/view';
    import { EditorView } from '@codemirror/view';
    import { onMount } from 'svelte';
    import { noctisLilac } from 'thememirror';
    //import {cmPlaceholder} from "$lib/codemirror/placeholder.svelte";
    import { tomorrow as theme } from 'thememirror';

    let {
        value = $bindable(),
        width = 'auto',
        height = '100px',
        readonly = false,
        placeholder = '',
        oninput
    }: {
        value: string,
        width: string,
        height: string,
        readonly: boolean,
        placeholder: string,
        oninput: (value: string) => void
    } = $props();

    let domContainer: HTMLDivElement;
    let editorView: EditorView;

    onMount(() => {
        if (!editorView) {

            editorView = new EditorView({
                doc: value,
                extensions: [
                    cmView.lineNumbers(),
                    cmView.highlightActiveLineGutter(),
                    cmView.highlightSpecialChars(),
                    cmCommands.history(),
                    cmLanguage.foldGutter(),
                    cmView.drawSelection(),
                    cmView.dropCursor(),
                    EditorState.allowMultipleSelections.of(true),
                    cmLanguage.indentOnInput(),
                    cmLanguage.syntaxHighlighting(cmLanguage.defaultHighlightStyle, { fallback: true }),
                    cmLanguage.bracketMatching(),
                    // autocomplete.closeBrackets(),
                    // autocomplete.autocompletion(),
                    cmView.rectangularSelection(),
                    cmView.crosshairCursor(),
                    cmView.highlightActiveLine(),
                    // search.highlightSelectionMatches(),
                    theme,
                    javascript(),
                    //json(),
                    cmView.placeholder(placeholder),
                    cmView.keymap.of([
                        ...cmAutocomplete.closeBracketsKeymap,
                        ...cmCommands.defaultKeymap,
                        ...cmSearch.searchKeymap,
                        ...cmCommands.historyKeymap,
                        ...cmLanguage.foldKeymap,
                        ...cmAutocomplete.completionKeymap,
                        ...cmLint.lintKeymap
                    ])
                ],
                parent: domContainer,
                dispatch: (tr) => {
                    editorView.update([tr]);
                    if (tr.docChanged) {
                        value = editorView.state.doc.toString();
                        if (oninput) oninput(value);
                    }
                }
            });

            resizeEditor();
        }

        $effect(() => {
            if (editorView) {
                // Solo se actualiza si el valor es diferente, es decir, si el cambio proviene del exterior
                const currentValue = editorView.state.doc.toString();
                if (currentValue !== value) {
                    // Guardar posición del cursor
                    const { from, to } = editorView.state.selection.main;
                    // Actualizar valor del editor
                    editorView.dispatch({ changes: { from: 0, to: editorView.state.doc.length, insert: value } });
                    // Restaurar posición del cursor (deselecciona si hubise texto seleccionado)
                    editorView.dispatch({ selection: { anchor: from, head: from } });
                }
            }
        });

        $effect(() => {
            // const newState = editorView.state.reconfigure({
            //     extensions: [
            //         EditorState.readOnly.of(!readonly),
            //     ]
            // });

            // Actualiza el estado del editor con la nueva configuración
            // editorView.setState(newState);
        });

        window.addEventListener('resize', resizeEditor);

        return () => {
            if (editorView != null) {
                editorView.destroy();
            }
        };
    });

    function resizeEditor() {
        if (editorView) {
            editorView.scrollDOM.style.height = height;
            editorView.scrollDOM.style.width = width;
        }
    }

</script>

<div bind:this={domContainer} class="ff-mono" style="width: {width}; height: {height}"></div>

<style lang="scss">
    :global(.cm-editor) {
        font-size: 10px;
    }
    :global(.ͼ1 .cm-scroller) {
        font-family: inherit;
    }
    :global(.ͼ1 .cm-activeLine) {
        background: #EFEFEF44;
    }
</style>