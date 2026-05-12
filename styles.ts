import { Dimensions, StyleSheet } from "react-native";

const { height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    paddingBottom: 40,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    color: "#333",
  },
  mapContainer: {
    height: height * 0.4,
    width: "100%",
    marginBottom: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  infoContainer: {
    padding: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  buttonWrapper: {
    width: 250,
    borderRadius: 8,
    overflow: "hidden",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 15,
    backgroundColor: "#ddd",
    resizeMode: "cover",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
});
