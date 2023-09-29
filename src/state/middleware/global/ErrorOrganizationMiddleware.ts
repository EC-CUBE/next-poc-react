import actions, {turnOffline} from "../../ducks/shared/site_health/actions";
import {select} from "redux-saga/effects";
import {siteHealthSelectors} from "../../ducks/shared/site_health";

export default function ErrorOrganizationMiddleware(storeAPI) {
    return function wrapDispatch(next) {
        return function handleAction(action) {
            if (action.type.includes('REQUEST_FAILURE')) {
                // ネットワークエラーの場合 //
                if (action.payload.errorData.networkError && action.payload.errorData.message === "Failed to fetch") {
                    // ネットワークエラー
                    const state = storeAPI.getState();
                    const eventName = action.type;
                    // 直近の同じイベントを取得
                    const result = siteHealthSelectors.getLastSimilarEvent(state, eventName);
                    if (result) {
                        // オフラインイベントを発行
                        storeAPI.dispatch(turnOffline(result));
                    } else {
                        // エベントが見つからない場合は、単純なネットワークエラーを発行
                        alert('ネットワークエラーが発生しました。');
                    }
                }
                // GraphQLエラーの場合 //
                else if (action.payload?.errorData?.graphQLErrors) {
                    // エラー処理                
                    action.payload.errorData = {
                        simple: {
                            ...action.payload.errorData.graphQLErrors.map((error) => {
                                    /** @todo: "FormValidation"を環境変数にする */
                                    const fieldsObj = (error.extensions.category === "FormValidation" ? error.extensions.errorDetails.reduce((errorDetail, item) => {
                                        return Object.assign(errorDetail, {[item.field]: item.message});
                                    }) : null);
                                    return {
                                        message: error.message,
                                        level: error.extensions.level,
                                        category: error.extensions.category,
                                        type: error.extensions?.type,
                                        fields: fieldsObj,
                                        generalErrorDetail: (error.extensions.category !== "FormValidation" ? error.extensions.errorDetails : null)
                                    }
                                }
                            ),
                        },
                        developer: {
                            ...action.payload.errorData
                        }
                    }
                    // 404エラーの場合 //
                    /** @todo: "ItemNotFound"を環境変数にする */
                    if (action.payload.errorData?.simple[0]?.type === "ItemNotFound") {
                        // 404 アクションを発行
                        console.log("404エラー");
                        storeAPI.dispatch(actions.raise404Error(action.payload.errorData?.simple[0]))
                    }
                }

            }
            return next(action)
        }
    }
}
