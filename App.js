import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthScreen from "./src/auth/AuthScreen";
import InvoiceApp from "./src/auth/InvoiceApp"; // your existing invoice code

export default function App() {
  const [token, setToken] = useState(null);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!token ? (
        <AuthScreen setToken={setToken} />
      ) : (
        <InvoiceApp token={token} setToken={setToken} />
      )}
    </SafeAreaView>
  );
}
