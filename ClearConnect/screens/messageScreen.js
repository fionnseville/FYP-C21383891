import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

export default function MessagesScreen({ navigation }) {
  //sample chats
  const chats = [
    { id: '1', name: 'John Doe', latestMessage: 'Hey, how are you?' },
    { id: '2', name: 'Jane Smith', latestMessage: 'Let’s meet tomorrow!' },
    { id: '3', name: 'Chris Evans', latestMessage: 'Check this out!' },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate('ChatScreen', { chatId: item.id, name: item.name })}
          >
            <Text style={styles.chatName}>{item.name}</Text>
            <Text style={styles.latestMessage}>{item.latestMessage}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc',
    padding: 10,
  },
  chatItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chatName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  latestMessage: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
  },
});
