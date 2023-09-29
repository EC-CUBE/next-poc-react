/***
 * /////////////////////////////////////////
 * REDUCERS (リデューサー)
 * -------------------
 *
 * すべてのリアクトのマネージャーアカウントの一時的なデータが保存される領域。
 * アプリケーションのどこでもデータを使用することができます。
 *
 * Reducerイベントは、ステートへのセッター命令のみを **実行すべき** です。
 *
 * このReducerのステートは、/src/state/ducks/index.jsに設定されているrequestsグループに束縛されています。
 * //////////////////////////////////////////
 */
import types from "./types";

export const siteHealthState = {
    is_404: false,
    global_error: {},
    event_history: [],
    request_only_event_history: [],
    is_offline: false,
    retry_event: {}
}

export default function siteHealthStateReducer(state = siteHealthState, action) {

    switch (action.type) {
        case types.SITE_HEALTH_404_ERROR:
            return {
                ...state,
                is_404: state.is_404 = action.payload.is_404,
                global_error: state.global_error = action.payload.global_error
            }
        case types.SITE_HEALTH_SITE_HISTORY_ADD:
            return {
                ...state,
                event_history: state.event_history.concat([action.payload.event])
            }
        case types.SITE_HEALTH_REQUEST_ONLY_SITE_HISTORY_ADD:
            return {
                ...state,
                request_only_event_history: state.request_only_event_history.concat([action.payload.event])
            }
        case types.SITE_HEALTH_TURN_OFFLINE:
            return {
                ...state,
                is_offline: state.is_offline = action.payload.is_offline,
                retry_event: state.retry_event = action.payload.event
            }
        case types.SITE_HEALTH_TURN_ONLINE:
            return {
                ...state,
                is_offline: state.is_offline = action.payload.is_offline
            }
        default:
            return state;
    }
}
