import React, { useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { CustomTextInput, NIMInput } from "../input";
import { globalStyles } from "../styles";

export default function Index() {
  const [name, setName] = useState("");
  const [nim, setNim] = useState("");

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={{ alignItems: "center", width: "100%" }}>
        <Text style={globalStyles.resultText}>
          {name || "..."} - {nim || "..."}
        </Text>

        <View style={{ height: 30 }} />

        <CustomTextInput input={name} onChange={(val) => setName(val)} />

        <NIMInput input={nim} onChange={(val) => setNim(val)} />
      </View>
    </SafeAreaView>
  );
}
