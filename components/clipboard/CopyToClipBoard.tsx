import { MyToast } from "@/ui/MyToast";
import Feather from "@expo/vector-icons/Feather";
import * as ExpoClipboard from "expo-clipboard";
import { memo, useCallback } from "react";
import { View } from "react-native";
import { MyIconButton } from "../button";
type Props = {
  content: string | undefined | null;
};
export const CopyToClipBoard: React.FC<Props> = memo(({ content }) => {
  const onCopy = useCallback(async () => {
    try {
      const copyResult = await ExpoClipboard.setStringAsync(content ?? "");
      MyToast.notify(`Copied: ${copyResult ? "true" : "false"}`, {
        duration: 1000,
      });
    } catch (error: any) {
      MyToast.error(error.message);
    }
  }, [content]);

  return (
    <View>
      <MyIconButton
        onPressed={onCopy}
        iconElement={<Feather name="clipboard" size={24} color="black" />}
      />
    </View>
  );
});
