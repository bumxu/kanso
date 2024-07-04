<script lang="ts">
    import { entityTypesStore } from '$lib/stores/entitytypes.store.j4.svelte';
    import { tagsStore } from '$lib/stores/tags.store.j4.svelte';
    import SBEntityTypes from './SBEntityTypes.svelte';
    import SBTags from './SBTags.svelte';

</script>

<SBEntityTypes bind:entityTypes={entityTypesStore.entityTypes} />

<SBTags bind:tags={tagsStore.tags} />