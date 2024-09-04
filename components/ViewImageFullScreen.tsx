import ImageModal from "react-native-image-modal";

export function ViewImageFullScreen({ imagePath }: { imagePath: string }) {
  return (
    <ImageModal
      resizeMode="contain"
      imageBackgroundColor="#000000"
      style={{
        width: 250,
        height: 250,
      }}
      source={{
        uri: imagePath,
      }}
    />
  );
}
