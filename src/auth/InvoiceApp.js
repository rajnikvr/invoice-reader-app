import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import DynamicDataRenderer from "../../DynamicDataRenderer";

const BASE_URL = "http://ai.codefriend.in:6000";

export default function InvoiceApp({ token, setToken }) {
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (res.canceled) return;

      const file = res.assets[0];
      uploadFile(file);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to pick document");
    }
  };

    const uploadFile = async (file) => {
    setLoading(true);
    try {
        const formData = new FormData();
        formData.append("file", {
        uri: file.uri,
        name: file.name || "unknown_file",
        type: file.mimeType || "application/octet-stream",
        });

        const response = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
        headers: {
            Authorization: `Bearer ${token}`, // do NOT set Content-Type
        },
        });

        if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Upload failed (status ${response.status})`);
        }

        const json = await response.json();
        console.log("Uploaded:", json);
        fetchInvoices();
    } catch (err) {
        console.error("Upload error:", err);
        Alert.alert("Upload Error", err.message);
    } finally {
        setLoading(false);
    }
    };


    const fetchInvoices = async () => {
    setRefreshing(true);
    try {
        if (!token) throw new Error("User not logged in");

        const response = await fetch(`${BASE_URL}/invoices`, {
        headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Failed to fetch invoices (status ${response.status})`);
        }

        const data = await response.json();
        setInvoices(data);
    } catch (err) {
        console.error("Fetch invoices error:", err);
        Alert.alert("Fetch Error", err.message);
    } finally {
        setRefreshing(false);
    }
    };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const reFetchInvoices = () => {
    fetchInvoices();
  };

  const renderInvoiceCard = ({ item }) => {
    const data = item.structuredData;
    if (!data) {
      return (
        <View style={styles.card}>
          <Text style={styles.title}>{item.fileName}</Text>
          <Text style={styles.errorText}>No structured data found.</Text>
        </View>
      );
    }

    const sections = Object.keys(data);

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.fileName}</Text>
        {sections.map((sectionKey) => (
          <View key={sectionKey} style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>{sectionKey.toUpperCase()}</Text>
            <DynamicDataRenderer data={data[sectionKey]} />
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Invoice Reader</Text>

          <TouchableOpacity
            onPress={reFetchInvoices}
            style={styles.refreshButton}
            disabled={refreshing}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.refreshIcon}>↻</Text>
            )}
          </TouchableOpacity>
        </View>

        <Button title="Upload Document" onPress={pickDocument} />
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={{ marginVertical: 20 }}
        />
      )}

      <FlatList
        data={invoices}
        keyExtractor={(item) => item.fileName + item.uploadedAt}
        renderItem={renderInvoiceCard}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshing={refreshing}
        onRefresh={reFetchInvoices}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f5" },

  headerContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  header: { fontSize: 28, fontWeight: "bold", color: "#333" },

  refreshButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  refreshIcon: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 15,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },

  title: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 10,
    color: "#0056b3",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },

  sectionContainer: { marginTop: 10 },

  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#495057",
    marginBottom: 5,
  },

  errorText: {
    color: "red",
    fontStyle: "italic",
  },
});
