import { StyleSheet, Text, View } from "react-native";

interface ProfileProps {
  name: string;
  age: number;
}

export default function Profile({ name, age }: ProfileProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Nama saya {name}, umur saya {age} tahun
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  text: {
    fontSize: 16,
  },
});