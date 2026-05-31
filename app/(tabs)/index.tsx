import { decode } from "base64-arraybuffer";
import Constants from "expo-constants";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Image,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  incrementFail,
  incrementSuccess,
} from "../../store/notification.slice";

import { styles } from "../../styles";
import { supabase } from "../../utils/supabase";

// 1. Konfigurasi Handler Notifikasi
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// 2. Fungsi untuk mengirim Push Notification
async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: title,
    body: body,
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

// 3. Fungsi untuk mendaftarkan dan mendapatkan Token Push Notification
async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert(
      "Error",
      "Permission not granted to get push token for push notification!",
    );
    return;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    Alert.alert("Error", "Project ID not found");
    return;
  }

  try {
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
    return pushTokenString;
  } catch (e: unknown) {
    Alert.alert("Error", String(e));
  }
}

type Coordinates = {
  latitude: number;
  longitude: number;
};

export default function Index() {
  // REDUX STATE & DISPATCH
  const dispatch = useAppDispatch();
  const { successCount, failCount } = useAppSelector(
    (state) => state.notification,
  );

  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [expoPushToken, setExpoPushToken] = useState<string>("");

  useEffect(() => {
    getLocation();
    registerForPushNotificationsAsync().then((token) => {
      if (token) setExpoPushToken(token);
    });
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
      const base64 = await FileSystem.readAsStringAsync(image, {
        encoding: "base64",
      });
      const fileName = `photo-${Date.now()}.jpg`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("camera")
        .upload(fileName, decode(base64), {
          contentType: "image/jpeg",
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("camera")
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;

      const { error: dbError } = await supabase.from("photo").insert([
        {
          latitude: String(location.latitude),
          longitude: String(location.longitude),
          image_url: publicUrl,
        },
      ]);

      if (dbError) throw dbError;

      // SUCCESS BLOCK
      dispatch(incrementSuccess()); // Update state redux
      const newSuccessCount = successCount + 1; // Kalkulasi untuk di pass ke notif saat ini

      Alert.alert("Sukses!", "Foto dan Geolokasi berhasil disimpan.");

      if (expoPushToken) {
        await sendPushNotification(
          expoPushToken,
          "Data share: Sent files", // Disesuaikan dengan mockup tugas
          `${newSuccessCount} successful, ${failCount} unsuccessful`,
        );
      }
      setImage(null);
    } catch (error: any) {
      console.error(error);

      // FAILED BLOCK
      dispatch(incrementFail()); // Update state redux
      const newFailCount = failCount + 1; // Kalkulasi untuk di pass ke notif saat ini

      Alert.alert("Gagal", error?.message || "Terjadi kesalahan.");

      if (expoPushToken) {
        await sendPushNotification(
          expoPushToken,
          "Data share: Sent files", // Disesuaikan dengan mockup tugas
          `${successCount} successful, ${newFailCount} unsuccessful`,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.headerText}>
        Integrasi Kamera, Map, Supabase & Redux
      </Text>

      {/* Menampilkan Status Redux di UI */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginVertical: 10,
        }}
      >
        <Text style={{ color: "green", fontWeight: "bold" }}>
          Sukses: {successCount}
        </Text>
        <Text style={{ color: "red", fontWeight: "bold" }}>
          Gagal: {failCount}
        </Text>
      </View>

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
              title={loading ? "MENYIMPAN..." : "SIMPAN DATA"}
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
