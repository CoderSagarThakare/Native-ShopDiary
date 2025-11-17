// src/components/pull-to-refresh-wrapper.js
import React from 'react';
import { ScrollView, RefreshControl } from 'react-native';

export default function PullToRefreshWrapper({
  children,
  refreshing,
  onRefresh,
  style,
}) {
  return (
    <ScrollView
      // eslint-disable-next-line react-native/no-inline-styles
      style={[{ flex: 1 }, style]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#227b22']} // Green spinner
          tintColor="#227b22"
          title="Loading latest data..."
          titleColor="#666"
          progressBackgroundColor="#ffffff"
        />
      }
    >
      {children}
    </ScrollView>
  );
}
