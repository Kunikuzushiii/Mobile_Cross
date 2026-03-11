import React from "react";
import { Text, TextInput, View } from "react-native";
import { globalStyles } from "./styles";

interface CustomProps {
  onChange: (val: string) => void;
  input: string;
}

export const CustomTextInput = ({ input, onChange }: CustomProps) => {
  return (
    <View style={globalStyles.inputWrapper}>
      <Text style={globalStyles.label}>Nama Lengkap</Text>
      <TextInput
        placeholder="Input your name"
        style={globalStyles.input}
        onChangeText={onChange}
        value={input}
      />
    </View>
  );
};

export const NIMInput = ({ input, onChange }: CustomProps) => {
  return (
    <View style={globalStyles.inputWrapper}>
      <Text style={globalStyles.label}>NIM</Text>
      <TextInput
        placeholder="Input your NIM/Student ID"
        style={globalStyles.input}
        onChangeText={onChange}
        keyboardType="numeric"
        value={input}
      />
    </View>
  );
};
