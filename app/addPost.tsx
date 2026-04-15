import { router } from "expo-router";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { postData } from "../services/api";

export default function AddPost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = () => {
    if (!title || !body) {
      Alert.alert("Error", "Title dan Body tidak boleh kosong!");
      return;
    }

    const payload = {
      title: title,
      body: body,
      userId: 1, // Default userId untuk API simulasi
    };

    // Menggunakan fungsi POST
    postData(payload)
      .then((res) => {
        if (res.status === 201) {
          // jsonplaceholder mengembalikan 201 Created
          Alert.alert("Success", "Post berhasil dibuat!");
          router.back(); // Kembali ke halaman sebelumnya [cite: 222]
        }
      })
      .catch((err) => {
        Alert.alert("Error", "Gagal membuat post");
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan judul post..."
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Body</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Masukkan isi post..."
        value={body}
        onChangeText={setBody}
        multiline
        numberOfLines={4}
      />

      <View style={styles.buttonContainer}>
        <Button title="Cancel" color="red" onPress={() => router.back()} />
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white" },
  label: { fontWeight: "bold", marginBottom: 5, marginTop: 15 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5 },
  textArea: { height: 100, textAlignVertical: "top" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
});
