import { OPACITY_TO_HEX } from "@/constants/Colors";
import { useState } from "react";
import { FieldValues, UseControllerProps, useController } from "react-hook-form";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { NunitoText } from "./text/NunitoText";
const ArrowDownSelectIconImage = require("@/assets/images/arrow-down-select.png");
const LeaveTypeIconLeft = require("@/assets/images/identify-card.png");

type TOption = {
  value: any;
  label: string;
} & Record<string, unknown>;

type FormMultiSelectProps<T extends FieldValues> = {
  label?: string;
  required?: boolean;
  placeholder?: string;
  options: TOption[];
  optionRender?: (opt: TOption) => React.ReactNode;
} & {
  useControllerProps: UseControllerProps<T>;
};

export function FormMultiSelect<T extends FieldValues>({ useControllerProps, options, label, required, placeholder }: FormMultiSelectProps<T>) {
  const [openModal, setOpenModal] = useState(false);
  const [labelsOfValue, setLabelsOfValue] = useState<string[]>([]);
  const { field } = useController(useControllerProps);
  const { value: fieldValue, onChange } = field;

  const isShowPlacholder = fieldValue === null || fieldValue === undefined || ("length" in fieldValue && fieldValue.length <= 0);
  const isSelected = !isShowPlacholder;

  const onToggleOpenModal = () => setOpenModal(!openModal);

  const onSelect = (value: any, label: string) => {
    const isAlreadySelected = fieldValue ? fieldValue.includes(value) : false;
    // update value and label of value
    if (isAlreadySelected) {
      onChange(fieldValue.filter((val: any) => val !== value));
      setLabelsOfValue(labelsOfValue.filter((labl) => labl !== label));
    } else {
      onChange(fieldValue ? [...fieldValue, value] : [value]);
      setLabelsOfValue([...labelsOfValue, label]);
    }

    // close modal
    setOpenModal(false);
  };

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

      {/* select button*/}
      <View>
        <Pressable onPress={onToggleOpenModal}>
          <View style={[!openModal ? styles.showChooseValueBox : styles.showChooseValueBoxFocus, isSelected ? {} : { height: 44 }]}>
            {/* Left side: icon + value */}
            <View style={styles.selectBox}>
              {/* left icon */}
              <Image source={LeaveTypeIconLeft} style={{ ...imageStyles.icon }} />

              {/* value */}
              <>
                {isShowPlacholder && (
                  <NunitoText type="body3" style={{ opacity: 0.5 }}>
                    {placeholder}
                  </NunitoText>
                )}
                {!isShowPlacholder && (
                  <>
                    {labelsOfValue.map((labl: string, index: number) => (
                      <View style={styles.labelSelected} key={index}>
                        <NunitoText lightColor="white" type="body3">
                          {labl}
                        </NunitoText>
                      </View>
                    ))}
                  </>
                )}
              </>
            </View>

            {/* Right side: arrow icon*/}
            <Image source={ArrowDownSelectIconImage} style={{ ...imageStyles.icon }} />
          </View>
        </Pressable>

        {/* select modal */}
        {openModal && (
          // modal
          <View style={styles.modal}>
            {options.length <= 0 && <NunitoText type="body3">No options</NunitoText>}
            {options.length > 0 && (
              <>
                {options.map((opt, index) => (
                  //item
                  <Pressable key={index} onPress={() => onSelect(opt.value, opt.label)}>
                    <View style={fieldValue ? (fieldValue.includes(opt.value) ? styles.optItemSelected : styles.optItem) : styles.optItem}>
                      <NunitoText type="body3">{opt.label}</NunitoText>
                    </View>
                  </Pressable>
                ))}
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

/**
 * -------------------------------------------
 */

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  labelWrapper: {
    flexDirection: "row",
    alignContent: "flex-start",
    alignItems: "center",
  },
  labelSelected: {
    backgroundColor: `#000000${OPACITY_TO_HEX["50"]}`,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  showChooseValueBox: {
    padding: 10,
    borderWidth: 1,
    // height: 44,

    borderRadius: 4,
    borderColor: `#000000${OPACITY_TO_HEX["20"]}`,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  showChooseValueBoxFocus: {
    padding: 10,
    // height: 44,

    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderWidth: 1,
    borderColor: `#000000`,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  modal: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: `#000000${OPACITY_TO_HEX["10"]}`,

    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: `#000000`,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,

    gap: 8,
  },
  optItem: {
    paddingLeft: 10,
    paddingVertical: 10,
    borderRadius: 4,
  },
  optItemSelected: {
    paddingLeft: 10,
    paddingVertical: 10,
    borderRadius: 4,

    backgroundColor: `#000000${OPACITY_TO_HEX["10"]}`,
  },
});
/**
 * --------------------------------------------
 */

const imageStyles = StyleSheet.create({
  icon: {
    opacity: 0.5,
  },
});