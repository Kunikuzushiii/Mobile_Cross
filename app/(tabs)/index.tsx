import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Alert, Button, Image, ScrollView, Text, View } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";

import { styles } from "../../styles";
import { supabase } from "../../utils/supabase";

type Coordinates = {
  latitude: number;
  longitude: number;
};

export default function Index() {
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fungsi Get Location otomatis saat aplikasi dibuka
  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Izin lokasi diperlukan!");
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  };

  const handleLocationChange = (event: any) => {
    const newCoordinate = event.nativeEvent.coordinate;
    setLocation({
      latitude: newCoordinate.latitude,
      longitude: newCoordinate.longitude,
    });
  };

  // Fungsi Buka Kamera
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Izin kamera diperlukan!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Fungsi Simpan ke Supabase
  const saveToSupabase = async () => {
    if (!image) {
      Alert.alert("Error", "Ambil foto terlebih dahulu!");
      return;
    }
    if (!location) {
      Alert.alert("Error", "Lokasi belum didapatkan!");
      return;
    }

    setLoading(true);
    try {
      // Konversi file gambar ke Base64 agar bisa diupload via Supabase API
      const base64 = await FileSystem.readAsStringAsync(image, {
        encoding: "base64",
      });

      // Bikin nama file unik berdasarkan timestamp
      const fileName = `photo-${Date.now()}.jpg`;

      // Upload ke Storage Supabase bucket 'camera'
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("camera")
        .upload(fileName, decode(base64), {
          contentType: "image/jpeg",
        });

      if (uploadError) throw uploadError;

      // Dapatkan Public URL dari Storage
      const { data: publicUrlData } = supabase.storage
        .from("camera")
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;

      // Insert Data ke Tabel 'photo' (sesuai struktur tabel dari Modul)
      const { error: dbError } = await supabase.from("photo").insert([
        {
          latitude: String(location.latitude), // Disimpan sebagai text di db
          longitude: String(location.longitude), // Disimpan sebagai text di db
          image_url: publicUrl,
        },
      ]);

      if (dbError) throw dbError;

      Alert.alert(
        "Sukses!",
        "Foto dan Geolokasi berhasil disimpan ke Supabase.",
      );

      // Bersihkan state gambar setelah berhasil upload
      setImage(null);
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Gagal",
        error?.message || "Terjadi kesalahan saat menyimpan data.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.headerText}>Integrasi Kamera, Map & Supabase</Text>

      {/*Map*/}
      <View style={styles.mapContainer}>
        {location ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={handleLocationChange}
          >
            <UrlTile
              urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
            />
            <Marker
              coordinate={location}
              title="Lokasi Foto"
              draggable
              onDragEnd={handleLocationChange}
            />
          </MapView>
        ) : (
          <View
            style={[
              styles.map,
              styles.placeholder,
              { backgroundColor: "#e0e0e0" },
            ]}
          >
            <Text>Mengambil lokasi...</Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text>Lat: {location?.latitude}</Text>
        <Text>Lon: {location?.longitude}</Text>
        <Button title="Refresh Lokasi" onPress={getLocation} />
      </View>

      {/*Foto*/}
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={{ color: "#888" }}>Belum ada foto</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            title="AMBIL FOTO"
            onPress={openCamera}
            color="#2196F3"
            disabled={loading}
          />
        </View>

        {image && location && (
          <View style={styles.buttonWrapper}>
            <Button
              title={loading ? "MENYIMPAN..." : "SIMPAN KE SUPABASE"}
              onPress={saveToSupabase}
              color="#FF9800"
              disabled={loading}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}
