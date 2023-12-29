import {writable} from "svelte/store";

function createLoadingStore() {
    const {subscribe, set} = writable(true)

    return {
        subscribe,
        set
    }
}

export const replaceLastLiUl = /<\/ul>/gs
export const tooltipExtension = `<li><div class="datapoint-tooltip"><div class="label"><p>#1</p></div></li></ul>`

export const loadingStore = createLoadingStore()