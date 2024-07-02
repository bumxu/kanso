<script lang="ts">
    import { entityTypesStore } from '$lib/stores/entitytypes.store.j4.svelte';
import SBEntityTypes from './SBEntityTypes.svelte';

    let entityTypes = entityTypesStore.entityTypes;
</script>

<SBEntityTypes bind:entityTypes={entityTypes} />