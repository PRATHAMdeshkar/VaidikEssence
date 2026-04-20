import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { getStoredUser } from "../../storage/authStorage";
import { logoutUser } from "../../services/authService";

interface UserInfo {
  name: string;
  email: string;
  phone: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getStoredUser();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await logoutUser();
              router.replace("/(auth)/login");
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Failed to logout");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No user data found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      <View style={styles.infoCard}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user.name}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{user.phone}</Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.logoutButtonPressed,
        ]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 30,
  },
  infoCard: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  logoutButton: {
    width: "100%",
    backgroundColor: "#ff4444",
    borderRadius: 8,
    padding: 14,
    marginTop: 20,
    alignItems: "center",
  },
  logoutButtonPressed: {
    backgroundColor: "#cc0000",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
