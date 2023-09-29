/***
 * //////////////////////////////////////////////////////////////
 * TYPES (タイプ)
 * ----------------------
 *
 * タイプは、アクション、リデューサ、saga(または他の)ミドルウェアで使用するための定数です。
 * Typeはアクションの中で、ミドルウェアやリデューサーに命令を伝えるために使われます。
 * 全てのアクションタイプは、グループ化しやすいように以下の配列に格納され、選択されます。
 * //////////////////////////////////////////////////////////////
 */
export const SITE_HEALTH_404_ERROR: string = "SITE_HEALTH_404_ERROR";
export const SITE_HEALTH_SITE_HISTORY_ADD: string = "SITE_HEALTH_SITE_HISTORY_ADD";
export const SITE_HEALTH_REQUEST_ONLY_SITE_HISTORY_ADD: string = "SITE_HEALTH_REQUEST_ONLY_SITE_HISTORY_ADD";
export const SITE_HEALTH_TURN_OFFLINE: string = "SITE_HEALTH_TURN_OFFLINE";
export const SITE_HEALTH_TURN_ONLINE: string = "SITE_HEALTH_TURN_ONLINE";

const types = {
    SITE_HEALTH_404_ERROR,
    SITE_HEALTH_SITE_HISTORY_ADD,
    SITE_HEALTH_REQUEST_ONLY_SITE_HISTORY_ADD,
    
    SITE_HEALTH_TURN_OFFLINE,
    SITE_HEALTH_TURN_ONLINE
}

export default types;
