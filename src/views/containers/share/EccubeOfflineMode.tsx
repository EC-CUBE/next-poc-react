import React from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {withTranslation} from "react-i18next";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid} from "@mui/material";
import {siteHealthOperations} from "../../../state/ducks/shared/site_health";

const mapStateToProps = state => {
    return {
        is_offline: state.siteHealth.is_offline as boolean
    }
}

/**
 * Reduxアクション（これもコンポーネントのパラメータに挿入されます。)
 */
const mapEventToProps = {
    turnOnline: siteHealthOperations.turnOnline,
}

const _EccubeOfflineMode = ({
                                t,
                                is_offline,
                                turnOnline,
                                ...props
                            }) => {
    return (
        <>
            {props.children}
            <Dialog
                open={is_offline}
            >
                <DialogTitle id="alert-dialog-title">
                    オフラインモード
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        EC-サイトに接続できません。ネットワーク接続を確認してください。
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => turnOnline()} autoFocus>
                        再接続
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

const EccubeOfflineMode = compose<any, any, any>(
    connect(mapStateToProps, mapEventToProps),
    withTranslation('common'))(_EccubeOfflineMode)

export default EccubeOfflineMode;
