import { OPACITY_TO_HEX } from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useMemo, useState } from "react";
import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NunitoText } from "./text/NunitoText";
import * as Progress from "react-native-progress";
import { extractFileName, fileNameToUri } from "@/helper/file-handler";
import { useSession } from "@/contexts";
import * as FileSystem from "expo-file-system";
import { isEmpty } from "./mocks/helper";

const AddImageIcon = require("@/assets/images/add-image.png");
const ClearImageIcon = require("@/assets/images/x-close_white.png");

type FormUploadImageProps<T extends FieldValues> = {
  label?: string;
  required?: boolean;
  useControllerProps: UseControllerProps<T>;
  defaultUri?: string;
  disabled?: boolean;
};

export default function FormUploadImage<T extends FieldValues>({
  label,
  required,
  useControllerProps,
  defaultUri,
  disabled,
}: FormUploadImageProps<T>) {
  // Stores any error message
  const [error, setError] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [loading, setLoading] = useState(true);

  const { field } = useController(useControllerProps);
  const { onChange } = field;

  const { session } = useSession();

  const [fileUri, setFileUri] = useState<string | null>(null);

  // Calculate the path
  const path = useMemo(
    () => fileNameToUri(extractFileName(defaultUri ?? "")),
    [defaultUri]
  );

  useEffect(() => {
    console.log({ defaultUri });
    // if (isEmpty(defaultUri)) return;
    if (!defaultUri) {
      setLoading(false);
      return;
    }

    const fetchImage = async () => {
      try {
        console.log("fetch image started");
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

            setFileUri(localUri);
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
  }, [path, session, defaultUri]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Function to pick an image from
  //the device's media library
  const pickImage = async () => {
    setIsWaiting(true);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setIsWaiting(false);

    if (status !== "granted") {
      // If permission is denied, show an alert
      Alert.alert(
        "Permission Denied",
        `Sorry, we need camera 
                 roll permission to upload images.`
      );
    } else {
      // Launch the image library and get
      // the selected image
      setIsWaiting(true);
      const result: ImagePicker.ImagePickerResult =
        await ImagePicker.launchImageLibraryAsync();
      setIsWaiting(false);

      if (!result.canceled) {
        // If an image is selected (not cancelled),
        // update the file state variable

        const fileUri = result.assets[0].uri;
        setFileUri(fileUri);

        // update form value
        onChange(uriToFormDataValidImage(fileUri));

        // Clear any previous errors
        setError(null);
      }
    }
  };

  const clearImage = () => setFileUri(null);

  return (
    <View style={styles.container}>
      {/* label */}
      <View style={styles.labelWrapper}>
        {label && (
          <NunitoText type="body2" style={{ marginRight: 6 }}>
            {label}
          </NunitoText>
        )}
        {required && <Text style={{ color: "red" }}>*</Text>}
      </View>
      {/* Button to choose an image */}
      <View style={styles.waitingWrapper}>
        {isWaiting && (
          <View style={styles.waitingLoading}>
            <Progress.Bar indeterminate style={{ width: "100%" }} />
          </View>
        )}
        {!fileUri && (
          <TouchableOpacity onPress={pickImage}>
            <View style={[styles.imageBox, disabled && styles.disabled]}>
              <View style={styles.placeholderWrapper}>
                <Image source={AddImageIcon} />
                <NunitoText type="body3">Bấm để chọn file</NunitoText>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {fileUri && (
          <View style={styles.imageBox}>
            <Image source={{ uri: fileUri }} style={styles.image} />
            <View style={styles.clearBox}>
              <Pressable onPress={clearImage}>
                <Image source={ClearImageIcon} />
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const uriToFormDataValidImage = (uri: string): File | null => {
  const fileName = uri.split("/").pop();
  if (!fileName) return null;

  const fileType = fileName.split(".").pop();

  return {
    uri,
    name: fileName,
    type: `image/${fileType}`,
  } as any;
};

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  labelWrapper: {
    flexDirection: "row",
    alignContent: "flex-start",
    alignItems: "center",
  },
  imageBox: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    borderWidth: 1,
    borderColor: `#000000${OPACITY_TO_HEX["20"]}`,
    borderRadius: 4,
  },
  placeholderWrapper: {
    alignItems: "center",
    gap: 6,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  clearBox: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
    borderRadius: 4,
    backgroundColor: "#C84851",
  },
  waitingWrapper: {
    position: "relative",
  },
  waitingLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: `#000000${OPACITY_TO_HEX["15"]}`,
  },
  disabled: {
    borderColor: `#000000${OPACITY_TO_HEX["20"]}`,
    backgroundColor: `#000000${OPACITY_TO_HEX["10"]}`,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
