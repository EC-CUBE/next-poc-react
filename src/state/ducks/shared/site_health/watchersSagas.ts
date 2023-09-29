import {takeLeading} from "redux-saga/effects";
import types from "./types";
import { turnOnline } from "./sagas";

/**
 * //////////////////////////////////////////
 * SAGA WATCHERS (サガ・ウォッチャー)
 * --------------------
 * actions.jsからのすべてのアクションは、ここで読み込まれてからreducerに送られます。
 * イベントタイプが一致した場合、下記の第2パラメータの関数が呼び出され、任意のアクションデータを使用することができます。
 * ////////////////////////////////////////////
 */
export function* fetchRequests() {
    yield takeLeading(types.SITE_HEALTH_TURN_ONLINE, turnOnline);
}
