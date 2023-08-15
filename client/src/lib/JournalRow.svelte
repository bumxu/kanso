<script lang="ts">
    import {DateTime} from "luxon";
    import autosize from "autosize";

    export let item: { createdAt: string; topic: string; updatedAt: string }|undefined = {
        createdAt: "2021-08-01T00:00:00.000Z",
        topic: "Topic",
        updatedAt: "2021-08-01T00:00:00.000Z"
    };

    let isNew = item != null;
    let isUnsaved = false;

    let createdAt = DateTime.fromISO(item.createdAt).toFormat("dd/MM/yyyy HH:mm");
    let sources = "T Jose David\nR 266014";
    let locations = "M326014 2h\nAR-4657\nR#213";
    let updatedAt = DateTime.fromISO(item.updatedAt).toFormat("dd/MM/yyyy HH:mm");

    $: {
        ((ooo) => {
            console.log(ooo);
        })(createdAt);
    }

    function parseUserDate(raw: string) {
        let date, time;
        let rawDate, rawTime;
        const rawSplt = raw.split(' ');
        if (rawSplt.length === 1) {

        } else if (rawSplt.length === 2) {
            rawDate = rawSplt[0];
            rawTime = rawSplt[1];
        } else {
            return null;
        }

        const dateNow = new Date();

        if (rawTime != null) {
            // 01:00, 10:00, 1:00, 1.00, 10.00, 1000, 100
            if (/^[01]?[0-9]([:.]?[0-5][0-9])?$/.test(raw)) {
                const timeSpl = raw.split(/[:.]/);
            }
        }

        if (rawDate != null) {
            // 210523, 21052023
            if (/^\d{1,2}$/.test(raw)) {
                const day = Number.parseInt(raw);
            } else if (/^\d{4}$/.test(raw)) {
                const month = Number.parseInt(raw.substring(2, 4));
                const day = Number.parseInt(raw.substring(0, 2));
            } else if (/^\d{6}$/.test(raw)) {
                const year = Number.parseInt(raw.substring(4, 6));
                const month = Number.parseInt(raw.substring(2, 4));
                const day = Number.parseInt(raw.substring(0, 2));
            } else if (/^\d{8}$/.test(raw)) {
                const year = Number.parseInt(raw.substring(4, 8));
                const month = Number.parseInt(raw.substring(2, 4));
                const day = Number.parseInt(raw.substring(0, 2));
            } else if (/^\d{1,2}[/.,-]\d{1,2}([/.,-]\d{2,4})?$/.test(raw)) {
                const dateSpl = raw.split(/[/.,-]/);
                const day =Number.parseInt( dateSpl[0])
                const month = Number.parseInt(dateSpl[1])
                const year = dateSpl.length === 3 ? Number.parseInt(dateSpl[2]) : dateNow.getFullYear();
            } else {
                return null;
            }
        }

        if (rawTime != null) {
            // day: 01, 1, 31; month: 01, 1, 12 (optional); year: 2021, 21 (optional); separator: /, .
            if (/^([0-2][0-9]|3[01])[\/.](0[1-9]|1[012]|[1-9])([\/.](\d{2}|\d{4}))?$/.test(raw)) {
                const dateSpl = raw.split(/[\/.]/);
            }
        }

        return DateTime.fromISO(raw).toFormat("dd/MM/yyyy HH:mm");
    }
</script>

<tr>
    <td><input class="date" bind:value="{createdAt}" on:focus={(evt) => evt.target.select()}></td>
    <td>
        <div class="textarea-wrapper">
            <textarea bind:value={sources}></textarea>
        </div>
    </td>
    <td>
        <div class="textarea-wrapper">
            <textarea>{item.topic}</textarea>
        </div>
    </td>
    <td>
        <div class="textarea-wrapper">
            <textarea>updates...</textarea>
        </div>
    </td>
    <td>
        <div class="textarea-wrapper">
            <textarea bind:value={locations}></textarea>
        </div>
    </td>
    <td></td>
    <td><input class="date" bind:value="{updatedAt}"></td>
</tr>

<style>

    input, textarea {
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        font-size: 11px;
    }

    .textarea-wrapper {
        width: 100%;
        height: 100%;
    }

    textarea {
        width: 100%;
        height: 100%;
        display: block;
        resize: none;
        box-sizing: border-box;
    }

    input, textarea {
        padding: 2px 4px;
        border: 1px solid transparent;
        border-radius: 2px;
        outline: 0;
    }
    input:hover, textarea:hover {
        background: #fafafa;
    }
    input:focus, textarea:focus {
        background: #f5f5f5;
        border: 1px solid rgba(0,0,0,0.15);
    }

    input.date {
        font-family: 'Roboto Mono', monospace;
        font-weight: 600;
        font-size: 11px;
        width: 112px
    }

    tr {
        font-weight: 700;
        text-align: left;
    }

    td {
        padding: 1px;
        border: 1px solid #bbb;
    }
</style>