<script lang="ts">

    export let rawEntryEntity: any;

    let inputStr: string = '';

    async function handleInput(event: any) {
        const response = await fetch(`http://localhost:3000/journal/entities?q=${inputStr}`, {
            method: 'GET'
        });
        if (response.ok) {
            const data = await response.json();

            console.log('response ok', data);
        }
    }

</script>

<div>
    <textarea rows="1"
              bind:value={inputStr}
              on:input={handleInput} />
</div>