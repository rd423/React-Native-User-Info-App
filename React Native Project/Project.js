import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, ActivityIndicator, StyleSheet } from 'react-native';

const API_URL = 'https://random-data-api.com/api/users/random_user?size=80';

const App = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const user = users[currentIndex];

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <Text style={styles.text}>ID: {user.id}</Text>
      <Text style={styles.text}>UID: {user.uid}</Text>
      <Text style={styles.text}>Password: {user.password}</Text>
      <Text style={styles.text}>Name: {user.first_name} {user.last_name}</Text>
      <Text style={styles.text}>Username: {user.username}</Text>
      <Text style={styles.text}>Email: {user.email}</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="Previous" onPress={() => setCurrentIndex(prev => Math.max(prev - 1, 0))} disabled={currentIndex === 0} />
        <Button title="Next" onPress={() => setCurrentIndex(prev => Math.min(prev + 1, users.length - 1))} disabled={currentIndex === users.length - 1} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
});

export default App;