<script lang="ts">
    let { children } = $props();
</script>

<svelte:head>
    <title>Kanso - Gestor de tareas offline</title>
    <meta name="description" content="Gestor de tareas offline apra la mejora de productividad." />
    <link rel="icon" type="image/png" href="favicon.ico" />
</svelte:head>

{@render children()}
