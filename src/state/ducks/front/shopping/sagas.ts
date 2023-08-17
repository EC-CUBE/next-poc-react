/***
 * ////////////////
 * SAGA MIDDLEWARE (SAGAミドルウェア)
 * ---------------
 *
 * SAGAミドルウェアは、アクションとリデューサ間のアクションを解析し、アクションのTYPEに基づいてAPI関数を処理します。
 * すべてのSAGAミドルウェアは、<i>watchersSagas.js</i>から呼び出されます。
 * ////////////////
 */
import {call, put, select} from "redux-saga/effects";
import actions from "./actions";
import {oAuthSelectors} from "../../shared/oauth";
import {orderMutationAPI} from "./api";

export function* mutateAndFetchOrder(data) {
    yield put(actions.mutateAndFetchOrderLoading())
    const access_token = yield select(oAuthSelectors.getOAuthCredentials);
    try {
        const order = yield call(orderMutationAPI, access_token?.access_token);
        yield put(actions.mutateAndFetchOrderSuccess(order?.data?.orderMutation));
    } catch (e) {
        console.log(e);
        yield put(actions.mutateAndFetchOrderFailure(e));
    }
}
