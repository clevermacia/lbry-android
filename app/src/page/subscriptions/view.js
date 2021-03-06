import React from 'react';
import NavigationActions from 'react-navigation';
import {
  ActivityIndicator,
  AsyncStorage,
  FlatList,
  NativeModules,
  SectionList,
  Text,
  View
} from 'react-native';
import { buildURI } from 'lbry-redux';
import { uriFromFileInfo } from 'utils/helper';
import moment from 'moment';
import Colors from 'styles/colors';
import discoverStyle from 'styles/discover';
import subscriptionsStyle from 'styles/subscriptions';
import FloatingWalletBalance from 'component/floatingWalletBalance';
import FileItem from 'component/fileItem';
import SuggestedSubscriptions from 'component/suggestedSubscriptions';
import UriBar from 'component/uriBar';

class SubscriptionsPage extends React.PureComponent {
  componentWillMount() {
    const {
      doFetchMySubscriptions,
      doFetchRecommendedSubscriptions,
      pushDrawerStack,
    } = this.props;

    pushDrawerStack();
    doFetchMySubscriptions();
    doFetchRecommendedSubscriptions();
  }

  render() {
    const {
      subscribedChannels,
      allSubscriptions,
      loading,
      viewMode,
      doSetViewMode,
      loadingSuggested,
      firstRunCompleted,
      doCompleteFirstRun,
      doShowSuggestedSubs,
      showSuggestedSubs,
      unreadSubscriptions,
      navigation
    } = this.props;
    const numberOfSubscriptions = subscribedChannels ? subscribedChannels.length : 0;
    const hasSubscriptions = numberOfSubscriptions > 0;

    return (
      <View style={subscriptionsStyle.container}>

      {hasSubscriptions && !loading &&
        <FlatList
          style={subscriptionsStyle.scrollContainer}
          contentContainerStyle={subscriptionsStyle.scrollPadding}
          renderItem={ ({item}) => (
            <FileItem
              style={subscriptionsStyle.fileItem}
              mediaStyle={discoverStyle.fileItemMedia}
              key={item}
              uri={uriFromFileInfo(item)}
              navigation={navigation} />
            )
          }
          data={allSubscriptions.sort((a, b) => {
            return b.height - a.height;
          })}
          keyExtractor={(item, index) => uriFromFileInfo(item)} />}

      {hasSubscriptions && loading &&
        <View style={subscriptionsStyle.busyContainer}>
          <ActivityIndicator size="large" color={Colors.LbryGreen} style={subscriptionsStyle.loading} />
        </View>
      }

      {!hasSubscriptions &&
        <View style={subscriptionsStyle.container}>
          <Text style={subscriptionsStyle.infoText}>
            You are not subscribed to any channels at the moment. Here are some channels that we think you might enjoy.
          </Text>
          {loadingSuggested && <ActivityIndicator size="large" colors={Colors.LbryGreen} style={subscriptionsStyle.loading} />}
          {!loadingSuggested && <SuggestedSubscriptions navigation={navigation} />}
        </View>}

        <FloatingWalletBalance navigation={navigation} />
        <UriBar navigation={navigation} />
      </View>
    )
  }
}

export default SubscriptionsPage;
