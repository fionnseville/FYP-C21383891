import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function UserGuideScreen() {
  return (
    <View style={styles.container}>
      <Text>User Guide</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5dc',
    borderColor: '#000',
    borderWidth: 2,
  },
});
