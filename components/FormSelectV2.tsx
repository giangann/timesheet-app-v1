import { FieldValues, UseControllerProps, useController } from "react-hook-form";
import { View, StyleSheet, Pressable, ViewStyle, TextStyle, ImageStyle } from "react-native";
import { NunitoText } from "./text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { useState } from "react";

type TOption = {
  label: string;
  value: string | number;
};

type Props<T extends FieldValues> = {
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  options?: TOption[];
  onSelect?: (option: TOption) => void;
} & {
  useControllerProps: UseControllerProps<T>;
};

export function FormSelectV2<T extends FieldValues>({
  label,
  placeholder,
  required,
  error,
  disabled,
  options,
  onSelect,
  useControllerProps,
}: Props<T>) {
  const [openModal, setOpenModal] = useState(false);
  const [labelOfSelectedValue, setLabelOfSelectedValue] = useState<TOption["label"] | null>(null); // ts lookup type
  const onToggleOpenModal = () => setOpenModal(!openModal);

  const { field } = useController(useControllerProps);
  const { value: fieldValue, onChange } = field;

  const isEmptyOpt = !options || options?.length === 0;

  const onSelectOpt = (option: TOption) => {
    onSelect?.(option);

    onChange(option.value);

    setLabelOfSelectedValue(option.label);

    setOpenModal(false);
  };

  let showChooseValueBoxStyle: any;
  if (disabled) showChooseValueBoxStyle = styles.showChooseValueBoxDisabled;
  if (!disabled && !openModal) showChooseValueBoxStyle = styles.showChooseValueBox
  if (!disabled && openModal) showChooseValueBoxStyle = styles.showChooseValueBoxFocus

  return (
    <View style={styles.container}>
      <NunitoText type="body2">Base Select</NunitoText>
      <Pressable onPress={onToggleOpenModal} disabled={disabled}>
        <View style={showChooseValueBoxStyle}>
          {!labelOfSelectedValue && (
            <NunitoText type="body3" style={{ opacity: 0.5 }}>
              {placeholder}
            </NunitoText>
          )}
          {labelOfSelectedValue && <NunitoText type="body3">{labelOfSelectedValue}</NunitoText>}
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
            options.map((opt) => (
              <Pressable key={opt.value} onPress={() => onSelectOpt(opt)}>
                <View style={opt.value === fieldValue ? styles.optionBoxSelected : styles.optionBox}>
                  <NunitoText type="body3">{opt.label}</NunitoText>
                </View>
              </Pressable>
            ))}
        </View>
      )}
    </View>
  );
}

const showChooseValueBoxBaseStyles: ViewStyle | TextStyle | ImageStyle = {
  padding: 10,
  borderWidth: 1,
  height: 44,

  borderRadius: 4,

  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
};

const styles = StyleSheet.create({
  container: {},
  showChooseValueBox: {
    ...showChooseValueBoxBaseStyles,
    borderColor: `#000000${OPACITY_TO_HEX["20"]}`,
    gap: 8,
  },
  showChooseValueBoxDisabled: {
    ...showChooseValueBoxBaseStyles,
    borderColor: `#000000${OPACITY_TO_HEX["20"]}`,
    gap: 8,
    backgroundColor: `#000000${OPACITY_TO_HEX["10"]}`,
  },
  showChooseValueBoxFocus: {
    ...showChooseValueBoxBaseStyles,

    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: `#000000`,
    gap: 8,
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

    gap: 12,
  },
  emptyBox: {},
  optionBox: {},
  optionBoxSelected: {
    paddingLeft: 10,
    paddingVertical: 10,
    borderRadius: 4,

    backgroundColor: `#000000${OPACITY_TO_HEX["10"]}`,
  },
});
