import { Button, StyleSheet, Text, View } from "react-native";

interface CounterProps {
  value: number;
  handleIncrement: () => void;
  handleDecrement: () => void;
  handlePassValue: () => void;
}

export default function Counter({
  value,
  handleIncrement,
  handleDecrement,
  handlePassValue,
}: CounterProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Umur: {value}</Text>

      <Button title="Increment" onPress={handleIncrement} />
      <Button title="Decrement" onPress={handleDecrement} />
      <Button title="Pass Value" onPress={handlePassValue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});