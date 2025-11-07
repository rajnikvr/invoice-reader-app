import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";

const BASE_URL = "http://ai.codefriend.in:6000";

export default function AuthScreen({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

const handleAuth = async () => {
  const endpoint = isRegister ? "register" : "login";
  try {
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    // Read the body as text first
    const text = await res.text();

    // Try to parse JSON, fallback to raw text
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }

    if (!res.ok) throw new Error(data.error || JSON.stringify(data) || "Something went wrong");

    Alert.alert("Success", data.message || "Success");
    if (!isRegister && data.token) setToken(data.token);

  } catch (err) {
    Alert.alert("Error", err.message);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegister ? "Register" : "Login"}</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={isRegister ? "Register" : "Login"} onPress={handleAuth} />
      <Text
        style={styles.toggle}
        onPress={() => setIsRegister(!isRegister)}
      >
        {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:"center", padding:20 },
  title: { fontSize:24, fontWeight:"bold", marginBottom:20, textAlign:"center" },
  input: { borderWidth:1, borderColor:"#ccc", padding:10, marginBottom:15, borderRadius:6 },
  toggle: { color:"#007BFF", textAlign:"center", marginTop:15 },
});
