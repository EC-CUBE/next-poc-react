import React from 'react';
import {Provider as ReduxProvider} from "react-redux";
import {App} from './views/App';
import configureStore from "./state/store";
import {BrowserRouter} from "react-router-dom";
import common_jp from "./translations/jp/common.json";
import common_en from "./translations/en/common.json";
import i18next from "i18next";
import {I18nextProvider} from "react-i18next";
import storeProvider from "./StoreProvider";
import './App.scss';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import EccubeSessionContainer from "./views/containers/share/EccubeSessionManager";
import EccubeErrorCatcherContainer from "./views/containers/share/EccubeErrorCatcherContainer";
import EccubeOfflineMode from "./views/containers/share/EccubeOfflineMode";

/***
 * /////////////////////////////////////
 * コアREACTファイル
 * ------------------
 *
 * reactアプリケーションフローの始まり
 * すべての初期ライブラリがここで読み込まれます。
 * ここで読み込まれるライブラリは
 * * dotenv (環境変数について)
 * * i18next (翻訳について)
 * * Redux (グローバルなステート管理のために)
 * ////////////////////////////////////
 */

declare global {
    interface Window {
        REDUX_INITIAL_DATA?: typeof store;
    }
}

// 翻訳機能も追加。※ デフォルトは日本語
i18next.init({
    interpolation: {escapeValue: false},
    lng: 'jp',
    resources: {
        en: {
            common: common_en
        },
        jp: {
            common: common_jp
        },
    },
});

const configureStores = () => configureStore(window.REDUX_INITIAL_DATA);
storeProvider.init(configureStores)
const store = storeProvider.getStore();
const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    // <React.StrictMode>
    <ReduxProvider store={store}>
        <I18nextProvider i18n={i18next}>
            <BrowserRouter>
                <EccubeErrorCatcherContainer>
                    <EccubeSessionContainer>
                        <EccubeOfflineMode>
                            <App/>
                        </EccubeOfflineMode>
                    </EccubeSessionContainer>
                </EccubeErrorCatcherContainer>
            </BrowserRouter>
        </I18nextProvider>
    </ReduxProvider>
    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
