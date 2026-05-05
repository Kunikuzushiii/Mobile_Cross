import * as Location from "expo-location";
import React, { useState } from "react";
import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Region, UrlTile } from "react-native-maps";

type Coordinates = {
  latitude: number;
  longitude: number;
};

// Mendapatkan tinggi layar perangkat
const { height } = Dimensions.get("window");

export default function App() {
  const [location, setLocation] = useState<Coordinates | null>(null);

  // Fungsi untuk mengambil lokasi pengguna saat ini
  const getLocation = async (): Promise<void> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied! Please allow location access.");
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  };

  // Update lokasi saat map di-tap atau marker di-drag
  const handleLocationChange = (event: any) => {
    const newCoordinate = event.nativeEvent.coordinate;
    setLocation({
      latitude: newCoordinate.latitude,
      longitude: newCoordinate.longitude,
    });
  };

  // Mendefinisikan region peta
  const region: Region | undefined = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : undefined;

  return (
    <View style={styles.container}>
      {!location ? (
        <View style={styles.center}>
          <Button title="Get Geo Location" onPress={getLocation} />
        </View>
      ) : (
        <>
          <MapView
            style={styles.map}
            initialRegion={region}
            onPress={handleLocationChange} // Tap pada peta untuk pindah marker
          >
            {/* OpenStreetMap Tile */}
            <UrlTile
              urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
            />

            {/* Marker */}
            <Marker
              coordinate={location}
              title="My Location"
              draggable // Membuat marker bisa di-drag
              onDragEnd={handleLocationChange} // Update koordinat setelah selesai drag
            />
          </MapView>

          <View style={styles.info}>
            <Text>Latitude: {location.latitude}</Text>
            <Text>Longitude: {location.longitude}</Text>
            <Button title="Refresh Location" onPress={getLocation} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    height: height * 0.5,
    width: "100%",
  },
  info: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
});
