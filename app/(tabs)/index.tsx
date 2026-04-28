import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import React, { useState } from "react";
import { Alert, Button, Image, Text, View } from "react-native";
import { styles } from "../styles";

export default function Index() {
  const [image, setImage] = useState<string | null>(null);

  // FUNGSI BUKA KAMERA
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Izin kamera diperlukan!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // FUNGSI BUKA GALERI
  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Izin galeri diperlukan!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // FUNGSI SIMPAN GAMBAR
  const saveImage = async () => {
    if (!image) {
      Alert.alert("Gagal", "Belum ada gambar yang dipilih atau diambil!");
      return;
    }

    try {
      await MediaLibrary.saveToLibraryAsync(image);
      Alert.alert("Berhasil!", "Gambar telah tersimpan di galeri kamu.");
    } catch (error) {
      console.error(error);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        await MediaLibrary.saveToLibraryAsync(image);
        Alert.alert("Berhasil!", "Gambar tersimpan.");
      } else {
        Alert.alert("Error", "Izin ditolak oleh sistem.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Qonita Azalia - 00000093589</Text>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="OPEN CAMERA" onPress={openCamera} color="#2196F3" />
        </View>

        <View style={styles.buttonWrapper}>
          <Button title="OPEN GALLERY" onPress={openGallery} color="#4CAF50" />
        </View>

        {/* Tombol Simpan muncul hanya jika ada gambar */}
        {image && (
          <View style={styles.buttonWrapper}>
            <Button title="SAVE IMAGE" onPress={saveImage} color="#FF9800" />
          </View>
        )}
      </View>

      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <View
          style={[
            styles.image,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text style={{ color: "#888" }}>Belum ada foto</Text>
        </View>
      )}
    </View>
  );
}
