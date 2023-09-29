/*
 * SAGA MIDDLEWARE (SAGAミドルウェア)
 * ---------------
 *
 * SAGAミドルウェアは、アクションとリデューサ間のアクションを解析し、アクションのTYPEに基づいてAPI関数を処理します。
 * すべてのSAGAミドルウェアは、<i>watchersSagas.js</i>から呼び出されます。
 * ////////////////
 */

import {put, select} from "redux-saga/effects";
import actions from "./actions";
import { siteHealthSelectors } from ".";

export function* turnOnline(data) {
    const lastRequestEvent = yield select(siteHealthSelectors.getFailedEvent);
    // @TODO: 処理順番を検討する
    yield put(lastRequestEvent);
}
