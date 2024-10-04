import { Colors, OPACITY_TO_HEX } from "@/constants/Colors";
import Entypo from "@expo/vector-icons/Entypo";
import { createContext, memo, useState } from "react";
import { ImageStyle, Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { MyModalFullscreen } from "./MyModalFullscreen";
import { NunitoText } from "./text/NunitoText";
import { FieldValues, Path, PathValue, UseControllerProps, useController } from "react-hook-form";

export type FormSelectContextProps<T extends FieldValues> = {
  onSelectOption: (value: PathValue<T, Path<T>>, label: string) => void;
  fieldValue: PathValue<T, Path<T>>;
};
export const FormSelectContext = createContext<FormSelectContextProps<any>>({
  onSelectOption: () => {},
  fieldValue: "", // or provide an appropriate default value based on your use case
});
type Props<T extends FieldValues, K extends keyof T> = {
  modalChildren?: React.ReactNode;
  label?: string;
  placeholder?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  onSelect?: (newValue: T[K]) => void; // This ensures the newValue matches the field type
} & {
  useControllerProps: UseControllerProps<T>;
};
function RawFormSelectFullscreenModal<T extends FieldValues, K extends keyof T>({
  useControllerProps,
  onSelect,
  modalChildren,
  label,
  placeholder,
  required,
  disabled,
  leftIcon = <Entypo name="list" size={18} color={Colors.light.inputIconNone} />,
  rightIcon,
}: Props<T, K>) {
  const [openModal, setOpenModal] = useState(false);
  const { field } = useController(useControllerProps);
  const { value: fieldValue, onChange } = field;
  const [labelOfSelectedValue, setLabelOfSelectedValue] = useState<string>(placeholder ?? "Chọn");

  const onToggleOpenModal = () => setOpenModal(!openModal);

  let showChooseValueBoxStyle: ViewStyle = {};
  if (disabled) showChooseValueBoxStyle = styles.showChooseValueBoxDisabled;
  if (!disabled && !openModal) showChooseValueBoxStyle = styles.showChooseValueBox;
  if (!disabled && openModal) showChooseValueBoxStyle = styles.showChooseValueBoxFocus;

  const onSelectOption = (value: PathValue<T, Path<T>>, label: string) => {
    // call onSelect callback props
    onSelect?.(value);

    // update field value
    onChange(value);

    // update label
    setLabelOfSelectedValue(label);

    // close modal
    setOpenModal(false);
  };

  return (
    <FormSelectContext.Provider value={{ onSelectOption, fieldValue }}>
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
            <View style={showChooseValueBoxStyle}>
              <View style={styles.valueBoxLeft}>
                {/* left icon */}
                {leftIcon}

                {/* label display */}
                <NunitoText type="body3">{labelOfSelectedValue}</NunitoText>
              </View>

              {/* right icon */}
              {rightIcon ?? <Entypo name={openModal ? "chevron-up" : "chevron-down"} size={18} color={Colors.light.inputIconNone} />}
            </View>
          </Pressable>
          {openModal && <MyModalFullscreen onClose={onToggleOpenModal}>{modalChildren}</MyModalFullscreen>}
        </View>
      </View>
    </FormSelectContext.Provider>
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
  showChooseValueBox: {
    ...showChooseValueBoxBaseStyles,
    borderColor: `#000000${OPACITY_TO_HEX["20"]}`,
  },
  showChooseValueBoxDisabled: {
    ...showChooseValueBoxBaseStyles,
    borderColor: `#000000${OPACITY_TO_HEX["20"]}`,
    backgroundColor: `#000000${OPACITY_TO_HEX["10"]}`,
  },
  showChooseValueBoxFocus: {
    ...showChooseValueBoxBaseStyles,

    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: `#000000`,
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
