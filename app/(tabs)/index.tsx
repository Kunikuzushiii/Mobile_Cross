import Counter from "@/components/Counter";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function HomeScreen() {
  const [age, setAge] = useState(0);
  const [name, setName] = useState("");

  const [finalName, setFinalName] = useState("Anonymous");
  const [finalAge, setFinalAge] = useState(0);

  const handleIncrement = () => {
    setAge(age + 1);
  };

  const handleDecrement = () => {
    setAge(age - 1);
  };

  const handlePassValue = () => {
    setFinalName(name === "" ? "Anonymous" : name);
    setFinalAge(age);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Halo nama ku, {finalName}!</Text>
      <Text style={styles.text}>Umur ku, {finalAge} tahun</Text>

      <Counter
        value={age}
        handleIncrement={handleIncrement}
        handleDecrement={handleDecrement}
        handlePassValue={handlePassValue}
      />

      <TextInput
        style={styles.input}
        placeholder="Input your name here"
        value={name}
        onChangeText={setName}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    width: 220,
    padding: 10,
    marginTop: 20,
  },
});