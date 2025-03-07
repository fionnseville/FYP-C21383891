import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { AuthContext } from '../AuthContext';




export default function ChatScreen({ route }) {
  const { chatId, name } = route.params; 
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  const { user } = useContext(AuthContext);  
  const currentUserId = user?.id;  // Retrieve user ID from session

  // fetches messages between users
  useEffect(() => {
    if (!currentUserId) return;  // checks currentUserId is available before querying

    const q = query(
      collection(db, 'messages'),
      where('senderId', 'in', [currentUserId, chatId]),
      where('receiverId', 'in', [currentUserId, chatId]),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(chatMessages);
    });

    return unsubscribe; 
  }, [currentUserId, chatId]);

  const sendMessage = async () => {
    if (input.trim()) {
      try {
        await addDoc(collection(db, 'messages'), {
          senderId: currentUserId,
          receiverId: chatId,
          messageText: input,
          timestamp: serverTimestamp(),  // timestamp in order to order messages
        });
        setInput('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }

    
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      keyboardVerticalOffset={90} //keyboardVerticalOffset={100}
    >
      <Text style={styles.chatHeader}>Chat with {name}</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.senderId === currentUserId ? styles.sentMessage : styles.receivedMessage]}>
            <Text>{item.messageText}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message"
          placeholderTextColor="#888"  
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc',
    padding: 10,
  },
  chatHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    maxWidth: '80%',
  },
  sentMessage: {
    backgroundColor: '#007bff',
    alignSelf: 'flex-end',
    color: '#fff',
    borderRadius: 12,
  },
  receivedMessage: {
    backgroundColor: '#e1ffc7',
    alignSelf: 'flex-start',
    borderRadius: 12,
  },
  /*inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 10,  
    borderRadius: 15
  },*/
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',  
    borderRadius: 20,  
    padding: 10,  
    borderWidth: 1,  
    borderColor: '#ccc',  
    shadowColor: "#000",  
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, //android shadow 
    marginBottom: 10,
  },    
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
