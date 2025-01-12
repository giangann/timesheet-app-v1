import React, { useState, useEffect, useMemo } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import * as FileSystem from "expo-file-system";
import ImageModal from "react-native-image-modal";
import { useSession } from "@/contexts";
import { extractFileName, fileNameToUri } from "@/helper/file-handler";

export function ViewImageFullScreen({ imagePath }: { imagePath: string }) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Calculate the path
  const path = useMemo(
    () => fileNameToUri(extractFileName(imagePath)),
    [imagePath]
  );

  const { session } = useSession();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const token = `Bearer ${session}`;
        const localUri = `${FileSystem.cacheDirectory}${extractFileName(path)}`;

        const response = await fetch(path, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }

        const blob = await response.blob();

        // Use FileReader to convert the Blob to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result?.toString().split(",")[1]; // Remove metadata prefix
          if (base64) {
            // Write the image to the file system
            await FileSystem.writeAsStringAsync(localUri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });

            setImageUri(localUri);
          }
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error fetching image:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [path, session]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ImageModal
      resizeMode="contain"
      imageBackgroundColor="#000000"
      style={styles.image}
      source={{
        uri: imageUri || undefined,
      }}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 250,
  },
});
