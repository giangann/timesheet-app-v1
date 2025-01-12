import { memo } from "react";
import { ScrollView, View } from "react-native";
import { NunitoText } from "../text/NunitoText";
import { DebugPushNoti } from "./DebugPushNoti";

export const DebugPage: React.FC = memo(() => {
  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <NunitoText>DebugScreen</NunitoText>

      <DebugPushNoti />

      <NunitoText>Update image 12/01/25</NunitoText>
    </ScrollView>
  );
});
