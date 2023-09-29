import actions from "../../ducks/shared/site_health/actions";

export default function eccubeReduxEventHistory(storeAPI) {
    return function wrapDispatch(next) {
        return function handleAction(action) {
            if (action.type.includes('SITE_HEALTH') === false) {
                //@TODO: 未来にECCUBEクローム拡張機能のために、全エベントを記録する。今は、REQUESTのみを記録する。
                //storeAPI.dispatch(actions.addToSiteHistory(action))
                if (action.type.endsWith('REQUEST')) {
                    storeAPI.dispatch(actions.addRequestOnlyToSiteHistory(action))
                }
            }
            return next(action)
        }
    }
}
