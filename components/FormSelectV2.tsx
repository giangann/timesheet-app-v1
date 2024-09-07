import { Colors, OPACITY_TO_HEX } from "@/constants/Colors";
import Entypo from "@expo/vector-icons/Entypo";
import { memo, useMemo, useState } from "react";
import { FieldValues, UseControllerProps, useController } from "react-hook-form";
import { ImageStyle, Pressable, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { NunitoText } from "./text/NunitoText";

type TOption = {
  label: string;
  value: string | number | boolean;
};

type Props<T extends FieldValues> = {
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  value?: TOption["value"];
  options?: TOption[];
  onSelect?: (option: TOption) => void;
} & {
  useControllerProps: UseControllerProps<T>;
};

function RawFormSelectV2<T extends FieldValues>({
  label,
  placeholder,
  required,
  error,
  disabled,
  leftIcon = <Entypo name="list" size={18} color={Colors.light.inputIconNone} />,
  rightIcon,
  value,
  options,
  onSelect,
  useControllerProps,
}: Props<T>) {
  const [openModal, setOpenModal] = useState(false);
  const onToggleOpenModal = () => setOpenModal(!openModal);

  const { field } = useController(useControllerProps);
  const { value: fieldValue, onChange } = field;

  const labelDisplay = useMemo(() => options?.filter((opt) => opt.value === fieldValue)?.[0]?.label, [fieldValue]);
  const isEmptyOpt = !options || options?.length === 0;

  const onSelectOpt = (option: TOption) => {
    // call onSelect callback props
    onSelect?.(option);

    // update field value
    onChange(option.value);

    // close modal
    setOpenModal(false);
  };

  let showChooseValueBoxStyle: any;
  if (disabled) showChooseValueBoxStyle = styles.showChooseValueBoxDisabled;
  if (!disabled && !openModal) showChooseValueBoxStyle = styles.showChooseValueBox;
  if (!disabled && openModal) showChooseValueBoxStyle = styles.showChooseValueBoxFocus;

  return (
    <View style={styles.container}>
      {/* label */}
      <View style={styles.labelWrapper}>
        {label && (
          <NunitoText type="body2" style={{ marginRight: 6 }}>
            {label}
          </NunitoText>
        )}
        {required && <NunitoText style={{ color: "red" }}>*</NunitoText>}
      </View>

      <View>
        {/* select button*/}
        <Pressable onPress={onToggleOpenModal} disabled={disabled}>
          <View style={showChooseValueBoxStyle}>
            <View style={styles.valueBoxLeft}>
              {/* left icon */}
              {leftIcon}

              {/* label display */}
              {!labelDisplay && (
                <NunitoText type="body3" style={{ opacity: 0.5 }}>
                  {placeholder}
                </NunitoText>
              )}
              {labelDisplay && <NunitoText type="body3">{labelDisplay}</NunitoText>}
            </View>

            {/* right icon */}
            {rightIcon ?? <Entypo name={openModal ? "chevron-up" : "chevron-down"} size={18} color={Colors.light.inputIconNone} />}
          </View>
        </Pressable>
        {openModal && (
          <View style={styles.modal}>
            {isEmptyOpt && (
              <View style={styles.emptyBox}>
                <NunitoText type="body3">No options</NunitoText>
              </View>
            )}

            {!isEmptyOpt &&
              options.map((opt, index) => (
                <Pressable key={index} onPress={() => onSelectOpt(opt)}>
                  <View style={opt.value === fieldValue ? styles.optionBoxSelected : styles.optionBox}>
                    <NunitoText type="body3">{opt.label}</NunitoText>
                  </View>
                </Pressable>
              ))}
          </View>
        )}
      </View>
    </View>
  );
}
export const FormSelectV2 = memo(RawFormSelectV2) as typeof RawFormSelectV2;

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
  emptyBox: {},
  optionBox: {
    paddingLeft: 10,
    paddingVertical: 10,
    borderRadius: 4,
  },
  optionBoxSelected: {
    paddingLeft: 10,
    paddingVertical: 10,
    borderRadius: 4,

    backgroundColor: `#000000${OPACITY_TO_HEX["10"]}`,
  },
});
