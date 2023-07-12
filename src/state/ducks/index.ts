import {
    entryReducer as entry,
    entryState,
    entryWatcherSagas
} from './front/entry'
import {
    loginReducer as login,
    loginState,
    loginWatcherSagas
} from "./front/login";

import {all, call, spawn} from 'redux-saga/effects';


/***
 * ///////////////////////////////////////////////
 * REDUCKSメインファイル 🦆
 * ---------------------------
 *
 * これは、reduxの子グループを束ねるreducksのメインファイルです。
 * これで、ステイツ、リデューサー、レドゥーサガが結ばれる。
 *
 * reducksの詳細と、新しいreduxグループの追加については、以下のリンクをご参照ください。
 * reducksのテンプレート化の例 :  https://github.com/alexnm/re-ducks#enter-re-ducks
 * //////////////////////////////////////////////
 */


/**
 * すべての子のreduxステートを束ねる
 */
export const StoreState = {
    entryState: entryState as object,
    loginState: loginState as object
};

/**
 * すべてのリデューサーイベントを束ねる
 */
export const reducers = {
    entry,
    login
};

/**
 * すべてのサガ・ウォッチャーを束ね、束ねられたウォッチャーの呼び出しに成功した場合、グローバル・キャッチを設定します。
 */
export function* rootSaga() {
    const watchers = [
        ...entryWatcherSagas,
        ...loginWatcherSagas
    ];

    yield all(
        watchers.map((saga) =>
            spawn(function* () {
                while (true) {
                    try {
                        yield call(saga);
                        break;
                    } catch (ex) {
                        console.log(ex);
                    }
                }
            }),
        ),
    );
}
