import { connect } from 'react-redux';
import {
  doFetchFileInfo,
  doFetchCostInfoForUri,
  doResolveUri,
  doSendTip,
  doToast,
  makeSelectIsUriResolving,
  makeSelectCostInfoForUri,
  makeSelectFileInfoForUri,
  makeSelectChannelForClaimUri,
  makeSelectClaimForUri,
  makeSelectContentTypeForUri,
  makeSelectMetadataForUri,
  selectBalance,
  selectBlackListedOutpoints,
} from 'lbry-redux';
import { selectRewardContentClaimIds } from 'lbryinc';
import { doDeleteFile, doPurchaseUri, doStopDownloadingFile } from 'redux/actions/file';
import FilePage from './view';

const select = (state, props) => {
  const selectProps = { uri: props.navigation.state.params.uri };
  return {
    balance: selectBalance(state),
    blackListedOutpoints: selectBlackListedOutpoints(state),
    claim: makeSelectClaimForUri(selectProps.uri)(state),
    isResolvingUri: makeSelectIsUriResolving(selectProps.uri)(state),
    contentType: makeSelectContentTypeForUri(selectProps.uri)(state),
    costInfo: makeSelectCostInfoForUri(selectProps.uri)(state),
    metadata: makeSelectMetadataForUri(selectProps.uri)(state),
    //obscureNsfw: !selectShowNsfw(state),
    //tab: makeSelectCurrentParam('tab')(state),
    fileInfo: makeSelectFileInfoForUri(selectProps.uri)(state),
    rewardedContentClaimIds: selectRewardContentClaimIds(state, selectProps),
    channelUri: makeSelectChannelForClaimUri(selectProps.uri, true)(state),
  };
};

const perform = dispatch => ({
  deleteFile: (fileInfo, deleteFromDevice, abandonClaim) => {
    dispatch(doDeleteFile(fileInfo, deleteFromDevice, abandonClaim));
  },
  fetchFileInfo: uri => dispatch(doFetchFileInfo(uri)),
  fetchCostInfo: uri => dispatch(doFetchCostInfoForUri(uri)),
  notify: data => dispatch(doToast(data)),
  purchaseUri: (uri, failureCallback) => dispatch(doPurchaseUri(uri, null, failureCallback)),
  resolveUri: uri => dispatch(doResolveUri(uri)),
  sendTip: (amount, claimId, uri, successCallback, errorCallback) => dispatch(doSendTip(amount, claimId, uri, successCallback, errorCallback)),
  stopDownload: (uri, fileInfo) => dispatch(doStopDownloadingFile(uri, fileInfo)),
});

export default connect(select, perform)(FilePage);
