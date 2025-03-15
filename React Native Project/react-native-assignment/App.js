import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Button,
  ActivityIndicator,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';

const API_URL = 'https://random-data-api.com/api/users/random_user?size=80';

const App = () => {
  // State variables
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch user data
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      // Check if data is valid
      if (Array.isArray(data) && data.length > 0) {
        // Add a unique image URL for each user
        const usersWithImages = data.map((user, index) => ({
          ...user,
          imageUrl: `https://picsum.photos/seed/${user.id}/200/200?animal`, // Unique image for each user
        }));
        setUsers(usersWithImages);
        setCurrentIndex(0); // Reset to the first user
      } else {
        setError('No users found. Please try again.');
      }
    } catch (err) {
      setError('Failed to fetch data. Check your internet connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  // Function to shorten UID (capital letters and numbers only)
  const shortenUID = (uid) => {
    return uid
      .replace(/[^A-Z0-9]/g, '') // Remove non-capital letters and non-numbers
      .substring(0, 12); // Limit to 12 characters
  };

  // Render loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={fetchUsers} />
      </View>
    );
  }

  // Get the current user
  const user = users[currentIndex];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Display user details */}
      {user && (
        <>
          {/* Display unique animal/bird image */}
          <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
          <Text style={styles.text}>ID: {user.id}</Text>
          <Text style={styles.text}>UID: {shortenUID(user.uid)}</Text>
          <Text style={styles.text}>Password: {user.password}</Text>
          <Text style={styles.text}>First Name: {user.first_name}</Text>
          <Text style={styles.text}>Last Name: {user.last_name}</Text>
          <Text style={styles.text}>Username: {user.username}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
        </>
      )}

      {/* Navigation buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Previous"
          onPress={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentIndex === 0}
        />
        <Button
          title="Next"
          onPress={() =>
            setCurrentIndex((prev) => Math.min(prev + 1, users.length - 1))
          }
          disabled={currentIndex === users.length - 1}
        />
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#000',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 20,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
  },
});

export default App;