import types from "./types";

export function raise404Error(payload) {
    return {
        type: types.SITE_HEALTH_404_ERROR,
        payload: {
            is_404: true,
            global_error: payload
        }
    }
}

// ==================================================
// エベント履歴
// ==================================================
export function addToSiteHistory(event) {
    return {
        type: types.SITE_HEALTH_SITE_HISTORY_ADD,
        payload: {
            event: event
        }
    }
}

export function addRequestOnlyToSiteHistory(event) {
    return {
        type: types.SITE_HEALTH_REQUEST_ONLY_SITE_HISTORY_ADD,
        payload: {
            event: event
        }
    }
}

// ==================================================
// オフラインモード
// ==================================================

export function turnOffline(event) {
    return {
        type: types.SITE_HEALTH_TURN_OFFLINE,
        payload: {
            is_offline: true,
            event: event
        }
    }
}

export function turnOnline() {
    return {
        type: types.SITE_HEALTH_TURN_ONLINE,
        payload: {
            is_offline: false
        }
    }
}



const actions = {
    raise404Error,
    addToSiteHistory,
    addRequestOnlyToSiteHistory,
    
    turnOffline,
    turnOnline
};

export default actions;
