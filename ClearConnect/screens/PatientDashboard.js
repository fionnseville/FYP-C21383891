import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig';
import { AuthContext } from '../AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';

export default function PatientDashboardScreen() {
  const { user } = useContext(AuthContext); 
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [appointments, setAppointments] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(''); // for linking a doctor
  const navigation = useNavigation();

  //if (!user) {
    // Prevent rendering anything if the user is null
    //return null;
  //}
  /*if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No user found. Please log in.</Text>
      </SafeAreaView>
    );
  }*/

  
    useEffect(() => {
      if (!user || !user.id) return; // checks user and user ID exist before proceeding
    
      const fetchDetails = async () => {
        try {
          setLoading(true);
    
          // Fetch current user data
          const userDoc = await getDoc(doc(db, 'users', user.id));
          if (!userDoc.exists()) {
            Alert.alert('Error', 'User not found');
            setLoading(false);
            return;
          }
          const userData = userDoc.data();
    
          // fetch linked doctor details if a doctor is linked
          if (userData.doctorId) {
            const doctorDoc = await getDoc(doc(db, 'users', userData.doctorId));
            if (doctorDoc.exists()) {
              const doctorData = doctorDoc.data();
              setDoctorDetails({
                id: doctorDoc.id,
                firstname: doctorData?.firstname || 'Unknown',
                surname: doctorData?.surname || 'Unknown',
                email: doctorData?.email || 'Unknown',
              });
            } else {
              setDoctorDetails(null); // explicitly set doctorDetails to null if doctor is not found
            }
          } else {
            setDoctorDetails(null); // if no doctorId is found, ensure doctorDetails is null
          }
    
          //fetch appointments for the current user
          const appointmentsQuery = query(
            collection(db, 'appointments'),
            where('patientid', '==', user.id)
          );
          const appointmentsSnap = await getDocs(appointmentsQuery);
    
          let appointmentsData = appointmentsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
    
          // add appointments with doctors if available
          for (let i = 0; i < appointmentsData.length; i++) {
            const appointment = appointmentsData[i];
            if (appointment.doctorid) {
              const doctorDoc = await getDoc(doc(db, 'users', appointment.doctorid));
              if (doctorDoc.exists()) {
                const doctorData = doctorDoc.data();
                appointmentsData[i].doctorName = `Dr. ${doctorData.firstname || 'Unknown'} ${doctorData.surname || 'Unknown'}`;
              } else {
                appointmentsData[i].doctorName = 'Unknown Doctor';
              }
            }
          }
    
          //filter upcoming appointments
          const today = new Date();
          appointmentsData = appointmentsData.filter((appt) => {
            const [day, month, year] = appt.date.split('/');
            return new Date(`${year}-${month}-${day}`) >= today;
          });
    
          //sort appointments by date
          appointmentsData.sort((a, b) => {
            const [dayA, monthA, yearA] = a.date.split('/');
            const [dayB, monthB, yearB] = b.date.split('/');
            return new Date(`${yearA}-${monthA}-${dayA}`) - new Date(`${yearB}-${monthB}-${dayB}`);
          });
    
          setAppointments(appointmentsData);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          Alert.alert('Error', 'Something went wrong. Please try again.');
          setLoading(false);
        }
      };
    
      fetchDetails();
    }, [user]);
    
   
  const handleSearchAndLink = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter a valid email.');
      return;
    }
    if (!user || !user.id) return;
    try {
      const doctorsRef = collection(db, 'users');
      const doctorQuery = query(
        doctorsRef,
        where('email', '==', email.trim().toLowerCase()), // needs to match exact email
        where('role', '==', 1) // checks the user is a doctor
      );
      const querySnapshot = await getDocs(doctorQuery);

      if (!querySnapshot.empty) {
        const doctorDoc = querySnapshot.docs[0];
        const doctorData = doctorDoc.data();

        await updateDoc(doc(db, 'users', user.id), {
          doctorId: doctorDoc.id, // add the doctorid to patient users data for future access
        });

        Alert.alert(
          'Success',
          `You have successfully linked to Dr. ${doctorData.firstname.trim()} ${doctorData.surname.trim()}.`
        );

        setDoctorDetails({
          firstname: doctorData.firstname,
          surname: doctorData.surname,
          email: doctorData.email,
        });
      } else {
        Alert.alert('Error', 'No doctor found with this email.');
      }
    } catch (error) {
      console.error('Error linking doctor:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!doctorDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.linkDoctorContainer}>
          <Text style={styles.title}>Link to a Doctor</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter doctor's email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.searchButton} onPress={handleSearchAndLink}>
            <Text style={styles.searchButtonText}>Search and Link Doctor</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Patient Dashboard</Text>

          <View style={styles.detailsContainer}>
            <Text style={styles.detailsHeader}>Your Details:</Text>
            <Text style={styles.detailsText}>Name: {user?.firstname || 'Unknown'} {user?.surname || 'Unknown'}</Text>
            <Text style={styles.detailsText}>Email: {user?.email || 'Unknown'}</Text>
            <Text style={styles.detailsText}>Date of Birth: {user?.dob || 'Unknown'}</Text>
          </View>

          {doctorDetails && doctorDetails.firstname && (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsHeader}>Linked Doctor:</Text>
              <Text style={styles.detailsText}>Name: Dr. {doctorDetails.firstname} {doctorDetails.surname}</Text>
              <Text style={styles.detailsText}>Email: {doctorDetails.email}</Text>
            </View>
          )}



            <View style={styles.indicatorContainer}>
              <View style={[styles.indicator, { backgroundColor: '#b8ff7b' }]} />
              <Text style={styles.indicatorText}>Confirmed</Text>
              <View style={[styles.indicator, { backgroundColor: '#ffcccb' }]} />
              <Text style={styles.indicatorText}>Pending</Text>
            </View>

            

            <Text style={styles.centeredText}>Upcoming Appointments:</Text>
            {appointments.length === 0 && (
              <Text style={styles.noAppointments}>No upcoming appointments.</Text>
            )}
          </>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.appointmentItem,
              { backgroundColor: item.status ? '#e1ffc7' : '#ffcccb' }, // green for confirmed, red for pending
            ]}
          >
            <Text style={styles.appointmentDateTime}>Appointment on {item.date} {"\n"}At {item.time}</Text>
            <Text style={styles.appointmentText}>Doctor: {item.doctorName || "Unknown Doctor"}</Text>
            <Text style={styles.appointmentText}>Location: {item.address || "No address provided"}</Text>
            <Text style={styles.appointmentText}>Reason: {item.reason || "No reason provided"}</Text>
            <Text style={styles.appointmentText}>Status: {item.status ? 'Confirmed' : 'Pending'}</Text>
          </View>
        )}        
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5dc',
  },
  linkDoctorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#003366',
    textAlign: 'center', 
  },
  input: {
    width: '80%',
    height: 50,
    padding: 10,
    marginVertical: 10,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  searchButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#003366',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  searchButtonText: {
    color: '#f5f5dc',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 2,
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    width: '90%',
    alignSelf: 'center',
  },
  detailsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  centeredText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    marginVertical: 15,
  },
  noAppointments: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 10,
  },
  appointmentItem: {
    width: '90%',
    padding: 15,
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: '#e1ffc7',
    marginBottom: 10,
    alignSelf: 'center',
  },
  appointmentDateTime: {
    fontSize: 18,  
    fontWeight: 'bold',  
    color: '#000',  
    marginBottom: 5,
    textAlign: 'center', 
  },
  appointmentText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 3,
    //textAlign: 'center', 
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  indicator: {
    width: 15,
    height: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  indicatorText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
