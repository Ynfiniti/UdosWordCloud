import {writable} from "svelte/store";

function createLoadingStore() {
    const {subscribe, set} = writable(true)

    return {
        subscribe,
        set
    }
}

export const replaceGroupText = "Group"

export const loadingStore = createLoadingStore()