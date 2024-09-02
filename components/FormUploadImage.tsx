import { OPACITY_TO_HEX } from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { FieldValues, UseControllerProps, useController } from "react-hook-form";
import { Alert, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NunitoText } from "./text/NunitoText";
import * as Progress from 'react-native-progress';
const AddImageIcon = require("@/assets/images/add-image.png");
const ClearImageIcon = require("@/assets/images/x-close_white.png");

type FormUploadImageProps<T extends FieldValues> = {
  label?: string;
  required?: boolean;
  useControllerProps: UseControllerProps<T>;
};

export default function FormUploadImage<T extends FieldValues>({ label, required, useControllerProps }: FormUploadImageProps<T>) {
  const [fileUri, setFileUri] = useState<string | null>(null);
  // Stores any error message
  const [error, setError] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);

  const { field } = useController(useControllerProps);
  const { onChange } = field;

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
      const result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync();
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
        {isWaiting &&
          <View style={styles.waitingLoading}>
            <Progress.Bar indeterminate style={{width:'100%'}} />
          </View>
        }
        {!fileUri && (
          <TouchableOpacity onPress={pickImage}>
            <View style={styles.imageBox}>
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
});
