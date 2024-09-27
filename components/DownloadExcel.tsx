import { MyToast } from "@/ui/MyToast";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import * as Progress from "react-native-progress";
import { NunitoText } from "./text/NunitoText";
import { useSession } from "@/contexts/ctx";
import { _mockExcelDownloadLink } from "@/constants/Misc";

type Props = {
  month: number;
  year: number;
};

export const DownloadExcel: React.FC<Props> = ({ month, year }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useSession();

  const downloadFile = async () => {
    try {
      setIsSubmitting(true);
      const token = `Bearer ${session}` ?? "xxx";
      const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
      const endpoint = "/users/export-user-overtime-working";
      const queryString = `month=${month}&year=${year}`;
      const url = `${baseUrl}${endpoint}?${queryString}`;
      // const url = _mockExcelDownloadLink

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: token ?? "" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const fileUri = FileSystem.documentDirectory + "overtime-report.xlsx";
      const base64 = await blobToBase64(blob);
      await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });

      // Notify the user of successful download
      const msg = `Download complete. Preparing to export...`;
      MyToast.success(msg);
      console.log(msg);

      // Export the file based on platform
      exportFile(fileUri);
    } catch (error: any) {
      console.error("Error downloading file:", error);
      MyToast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportFile = async (fileUri: string) => {
    try {
      if (Platform.OS === "android") {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          const base64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const uri = await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            "overtime-report.xlsx",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );

          await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
          MyToast.success(`File saved to: ${uri}`);
        } else {
          MyToast.error("Storage permission not granted");
        }
      } else {
        // For iOS, use Sharing API
        await Sharing.shareAsync(fileUri);
      }
    } catch (error: any) {
      console.error("Error exporting file:", error);
      MyToast.error(error.message);
    }
  };

  // Helper function to convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <TouchableOpacity onPress={downloadFile} activeOpacity={0.8} style={styles.buttonContainer} disabled={isSubmitting}>
      <View style={styles.button}>
        {isSubmitting && <Progress.Circle indeterminate size={14} />}
        <NunitoText type="body3" style={{ color: "white" }}>
          Tải file
        </NunitoText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "white", // Optional: To give the button a distinct background
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B3A82",
    height: 44,
    borderRadius: 4,
    gap: 8,
  },
});
