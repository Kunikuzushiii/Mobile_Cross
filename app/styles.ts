import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    gap: 10, // Memberikan jarak antar tombol
    marginBottom: 20,
  },
  buttonWrapper: {
    width: 200,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 15,
    marginTop: 20,
    backgroundColor: "#ddd",
    resizeMode: "cover",
  },
});
