import { Colors, OPACITY_TO_HEX } from "@/constants/Colors";
import Entypo from "@expo/vector-icons/Entypo";
import { memo, useState } from "react";
import { ImageStyle, Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { MyModalFullscreen } from "./MyModalFullscreen";
import { NunitoText } from "./text/NunitoText";


type Props = {
  label?: string;
  placeholder?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  disabled?: boolean;
  modalChildren?: React.ReactNode;
};
function RawFormSelectFullscreenModal({
  modalChildren,
  label,
  placeholder,
  required,
  disabled,
  leftIcon = <Entypo name="list" size={18} color={Colors.light.inputIconNone} />,
  rightIcon,
}: Props) {
  const [openModal, setOpenModal] = useState(false);
  const onToggleOpenModal = () => setOpenModal(!openModal);

  return (
    <View style={styles.container}>
      {/* label */}
      <View style={styles.labelWrapper}>
        {label && (
          <NunitoText type="body2" style={{ marginRight: 6 }}>
            {label}
          </NunitoText>
        )}
        {required && (
          <NunitoText type="body1" style={{ color: "red" }}>
            *
          </NunitoText>
        )}
      </View>

      <View>
        {/* select button*/}
        <Pressable onPress={onToggleOpenModal} disabled={disabled}>
          <View style={showChooseValueBoxBaseStyles}>
            <View style={styles.valueBoxLeft}>
              {/* left icon */}
              {leftIcon}

              {/* label display */}
              {/* {!labelDisplay && (
                <NunitoText type="body3" style={{ opacity: 0.5 }}>
                  {placeholder}
                </NunitoText>
              )}
              {labelDisplay && <NunitoText type="body3">{labelDisplay}</NunitoText>} */}
            </View>

            {/* right icon */}
            {rightIcon ?? <Entypo name={openModal ? "chevron-up" : "chevron-down"} size={18} color={Colors.light.inputIconNone} />}
          </View>
        </Pressable>
        {openModal && <MyModalFullscreen onClose={onToggleOpenModal}>{modalChildren}</MyModalFullscreen>}
      </View>
    </View>
  );
}
export const FormSelectFullscreenModal = memo(RawFormSelectFullscreenModal) as typeof RawFormSelectFullscreenModal;

const showChooseValueBoxBaseStyles: ViewStyle | TextStyle | ImageStyle = {
  padding: 10,
  paddingLeft: 12,
  height: 44,

  borderWidth: 1,
  borderRadius: 4,

  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
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
  valueBoxLeft: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 12,
    flexShrink: 1,
    overflow: "hidden",
    alignItems: "center",
  },

  modal: {
    padding: 10,
    backgroundColor: `#000000${OPACITY_TO_HEX["10"]}`,

    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: `#000000`,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,

    gap: 0,
  },
});
