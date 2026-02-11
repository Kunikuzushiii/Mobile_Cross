import { Image } from "expo-image";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>

      <View style={styles.container}>
        <Image
          source={require("@/assets/images/foto1.jpg")}
          style={styles.image}
          contentFit="cover"
        />
        <Text style={styles.name}>Qonita Azalia</Text>
        <Text>00000093589</Text>
      </View>

      <View style={styles.container}>
        <Image
          source={require("@/assets/images/foto3.jpg")}
          style={styles.image}
          contentFit="cover"
        />
        <Text style={styles.name}>Phainon</Text>
        <Text>00000012345</Text>
      </View>

      <View style={styles.container}>
        <Image
          source={require("@/assets/images/foto4.png")}
          style={styles.image}
          contentFit="cover"
        />
        <Text style={styles.name}>Mydeimos</Text>
        <Text>0000006789</Text>
      </View>

      <View style={styles.container}>
        <Image
          source={require("@/assets/images/foto2.jpg")}
          style={styles.image}
          contentFit="cover"
        />
        <Text style={styles.name}>Olivia Karissa</Text>
        <Text>00000093508</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#ffffff",
    paddingTop: 20,
    paddingBottom: 20,
  },
  container: {
    alignItems: "center",
    marginBottom: 30,             // jarak antar profile
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 8,
  },
  name: {
    fontWeight: "bold",
  },
});