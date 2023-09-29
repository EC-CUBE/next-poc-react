import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import {reducers, rootSaga} from './ducks';
import createSagaMiddleware from 'redux-saga';
import MiddlewareHub from "./middleware/global";

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

/***
 * ////////////////////////////////////////////
 * コアREDUX作成ファイル
 * --------------------------
 *
 * 他の redux MIDDLEWARE および STORES|REDUCERS をここにバインドします。
 * SAGA MIDDLEWAREとREDUCERSのみがここに読み込まれます。
 * ////////////////////////////////////////////
 */

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(REDUX_INITIAL_DATA: any | undefined) {
    const middlewares = [];
    // サーガミドルウェアを追加
    middlewares.push(sagaMiddleware);
    
    // ECCUBE自作ミドルウェアを追加
    for (const middleware of MiddlewareHub) {
        middlewares.push(middleware);
    }
    
    const rootReducer = combineReducers(reducers);

    const composeEnhancer = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            // @ts-ignore
            trace: true,
            // @ts-ignore
            traceLimit: 25
        })) || compose;
    const store = createStore(
        rootReducer,
        composeEnhancer(applyMiddleware(...middlewares))
    );
    sagaMiddleware.run(rootSaga)
    return store;
}
