import { includes } from '$lib/helpers/runtime.helper';
import { entitiesStore } from '$lib/stores/entities.store.j4.svelte';
import { entityTypesStore } from '$lib/stores/entitytypes.store.j4.svelte';
import { filtersStore } from '$lib/stores/filters.store.j4.svelte';
import { journalStore } from '$lib/stores/journal.store.j4.svelte';
import { prioritiesStore } from '$lib/stores/priorities.store.j4.svelte';
import { statusesStore } from '$lib/stores/statuses.store.j4.svelte';
import { tagsStore } from '$lib/stores/tags.store.j4.svelte';
import type { EntrySchema } from '$lib/types/j4_types';
import { untrack } from 'svelte';

function getDateUpdated(entry: EntrySchema) {
    if (entry.dateClosed != null) {
        return entry.dateClosed;
    }
    return entry.dateUpdated ?? entry.dateSince;
}

export function buildFilteredView(qFilterTopic: string, qFilterUpdates: string, qFilterEntities: string, qFilterTags: string, qFilterPriority: string, qFilterStatus: string, filters: any) {
    let entries = untrack(() => journalStore.entries);

    console.log('Aplicando filtros y ordenamiento...');

    untrack(() => {
        // Aplicar filtros rápidos
        if (qFilterTopic) {
            console.debug('Aplicando filtro rápido en "asunto"...');
            entries = entries.filter(entry => includes(entry.subject, qFilterTopic));
        }
        if (qFilterUpdates) {
            console.debug('Aplicando filtro rápido en "actualizaciones"...');
            entries = entries.filter(entry => {
                return entry.updates.data.some(update => includes(update.body, qFilterUpdates));
            });
        }
        if (qFilterEntities) {
            console.debug('Aplicando filtro rápido en "entidades"...');
            entries = entries.filter(entry => {
                return entry.entities.some(entryEntity => {
                    const entity = entitiesStore.entities[entryEntity.entityId];
                    const desplayName = entityTypesStore.getDisplayFn(entity.type)(entity.id, entity.raw);
                    console.debug('Comparando ' + desplayName + ' con ' + qFilterEntities);
                    if (includes(desplayName, qFilterEntities)) {
                        return true;
                    }
                });
            });
        }
        if (qFilterTags) {
            console.debug('Aplicando filtro rápido en "etiquetas"...');
            entries = entries.filter(entry => {
                return entry.tags.some(tagId => {
                    const tag = tagsStore.tags[tagId];
                    if (includes(tag.name, qFilterTags)) {
                        return true;
                    }
                });
            });
        }
        if (qFilterPriority) {
            console.debug('Aplicando filtro rápido en "prioridad"...');
            entries = entries.filter(entry => {
                const priority = entry.priority != null ? prioritiesStore.get(entry.priority) : null;
                return includes(priority?.name, qFilterPriority);
            });
        }
        if (qFilterStatus) {
            console.debug('Aplicando filtro rápido en "estado"...');
            entries = entries.filter(entry => {
                const status = entry.status != null ? statusesStore.get(entry.status) : null;
                return includes(status?.name, qFilterStatus);
            });
        }

        // Aplicar filtros personalizados
        entries = entries.filter(entry => {
            for (const filter of filtersStore.filters) {
                if (filter.active) {
                    console.debug(`Aplicando filtro básico "${filter.desc}"...`);
                    const filterFn = new Function('return ' + filter.filterFn)();
                    if (!filterFn(entry)) {
                        return false;
                    }
                }
            }
            return true;
        });
    });

    return entries;
}

export function buildSortedView(entries: EntrySchema[], order: string, orderAsc: boolean) {
    console.log('Aplicando ordenamiento...');
    entries = [...entries];

    // Orden
    if (order === 'dateSince' && orderAsc) {
        console.debug('Aplicando orden por "fecha de inicio" ascendente...');
        entries.sort((a, b) => a.dateSince.localeCompare(b.dateSince));
    } else if (order === 'dateSince' && !orderAsc) {
        console.debug('Aplicando orden por "fecha de inicio" descendente...');
        entries.sort((a, b) => b.dateSince.localeCompare(a.dateSince));
    } else if (order === 'dateUpdated' && orderAsc) {
        console.debug('Aplicando orden por "fecha de actualización" ascendente...');
        entries.sort((a, b) => getDateUpdated(a).localeCompare(getDateUpdated(b)));
    } else if (order === 'dateUpdated' && !orderAsc) {
        console.debug('Aplicando orden por "fecha de actualización" descendente...');
        entries.sort((a, b) => getDateUpdated(b).localeCompare(getDateUpdated(a)));
    } else if (order === 'priority' && orderAsc) {
        console.debug('Aplicando orden por "prioridad" ascendente...');
        entries.sort((a, b) => {
            const pa = a.priority ? (prioritiesStore.get(a.priority)?.name ?? '') : '';
            const pb = b.priority ? (prioritiesStore.get(b.priority)?.name ?? '') : '';
            return pa.localeCompare(pb);
        });
    } else if (order === 'priority' && !orderAsc) {
        console.debug('Aplicando orden por "prioridad" descendente...');
        entries.sort((a, b) => {
            const pa = a.priority ? (prioritiesStore.get(a.priority)?.name ?? '') : '';
            const pb = b.priority ? (prioritiesStore.get(b.priority)?.name ?? '') : '';
            return pb.localeCompare(pa);
        });
    } else if (order === 'dateDue' && orderAsc) {
        console.debug('Aplicando orden por "fecha de vencimiento" ascendente...');
        entries.sort((a, b) => (a.dateDue || '999999999999').localeCompare(b.dateDue || '999999999999'));
    } else if (order === 'dateDue' && !orderAsc) {
        console.debug('Aplicando orden por "fecha de vencimiento" descendente...');
        entries.sort((a, b) => (b.dateDue || '999999999999').localeCompare(a.dateDue || '999999999999'));
    }

    return entries;
}