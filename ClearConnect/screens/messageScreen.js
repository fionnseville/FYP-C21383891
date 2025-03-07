import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { collection, query, orderBy, onSnapshot, doc, getDoc,where ,or } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../AuthContext';
import { SafeAreaView } from 'react-native';



export default function MessagesScreen() {
  const [chats, setChats] = useState([]);
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);  
  const currentUserId = user?.id;  // retrieves user ID from session


  useEffect(() => {
    
    if (!currentUserId) return;  // checks currentUserId is available before fetching chats

    const fetchChats = () => {
      console.log('Setting up Firestore real-time listener for user:', currentUserId);

      const messagesRef = collection(db, 'messages');

      // listens for messages to or from user
      //const q = query(messagesRef, orderBy('timestamp', 'desc'));
      const q = query(
        messagesRef,
        or(
          where('senderId', '==', currentUserId),
          where('receiverId', '==', currentUserId)
        ),
        orderBy('timestamp', 'desc')
      );
      
      

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const allMessages = [];

        for (const messageDoc of snapshot.docs) {
          const data = messageDoc.data();
          console.log('Fetched message:', data);

          // finds the 2nd user in chat
          const chatPartnerId = data.senderId === currentUserId ? data.receiverId : data.senderId;

          // fetch 2nd user's details 
          const partnerRef = doc(db, 'users', chatPartnerId);
          const partnerSnap = await getDoc(partnerRef);

          let partnerName = 'Unknown';
          if (partnerSnap.exists()) {
            const partnerData = partnerSnap.data();
            partnerName = `${partnerData.firstname} ${partnerData.surname}`;
          }

          allMessages.push({
            id: messageDoc.id,
            chatPartnerId,
            chatPartnerName: partnerName,
            messageText: data.messageText,
            timestamp: data.timestamp ? data.timestamp.toDate() : new Date(0),
          });
        }

        // most recent message in each chat is shown
        const uniqueChats = allMessages.reduce((acc, chat) => {
          const existingChat = acc.find(
            (item) =>
              (item.chatPartnerId === chat.chatPartnerId)
          );

          if (!existingChat || existingChat.timestamp < chat.timestamp) {
            acc = acc.filter((item) => item.chatPartnerId !== chat.chatPartnerId);
            acc.push(chat);
          }
          return acc;
        }, []);

        setChats(uniqueChats);
        console.log('Chat list updated:', uniqueChats);
      });

      return () => unsubscribe();
    };

    fetchChats();
  }, [currentUserId]);

  return (
    <View style={styles.container}>
      {chats.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>No messages found</Text>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() => navigation.navigate('ChatScreen', { chatId: item.chatPartnerId, name: item.chatPartnerName })}
            >
              <Text style={styles.chatName}>{item.chatPartnerName}</Text>
              <Text style={styles.latestMessage}>{item.messageText}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc',
    padding: 10,
  },
  /*chatItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', 
  },*/
  chatItem: {
    padding: 15,
    marginVertical: 5, //adds spacing between text chains
    backgroundColor: '#fff', 
    borderRadius: 10, 
    borderWidth: 3, 
    borderColor: '#ccc', 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // shadow for android
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
