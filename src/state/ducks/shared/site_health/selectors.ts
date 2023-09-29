import types from "./types";

/**
 * ////////////////////////////////////////
 * SELECTORS (セレクタ)
 * -----------------
 *
 * リデューサーの生データをフィルタリングして、ビューにきれいな結果を提供するために使用されます。
 * ///////////////////////////////////////
 */

function getLastSimilarEvent(state, event_name: string): string {
    return state.siteHealth.request_only_event_history.filter((event) => {
        return event_name.includes(event.type);
    }).slice(-1)[0];
}

function getFailedEvent(state) {
    return state.siteHealth.retry_event;
}

const selectors = {
    getLastSimilarEvent,
    getFailedEvent
}

export default selectors;
