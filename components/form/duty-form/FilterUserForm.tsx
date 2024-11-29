import { TDutySuggestedUserFilterParams, TDutySuggestedUserFilterParamsFormFields } from "@/api/form/types";
import { FormPickDate } from "@/components/FormPickDate";
import { MySlideModal } from "@/components/MySlideModal";
import moment from "moment";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, IconButton, useTheme } from "react-native-paper";

type Props = {
  onApply: (params: TDutySuggestedUserFilterParams) => void;
  defaultFilterParmas: TDutySuggestedUserFilterParams;
};

export const FilterUserForm: React.FC<Props> = ({ onApply, defaultFilterParmas }) => {
  const [openFilterUserModal, setOpenFilterUserModal] = useState(false);

  const onOpenFilterUserModal = () => setOpenFilterUserModal(true);
  const onCloseFilterUserModal = () => setOpenFilterUserModal(false);

  const { control, handleSubmit, reset, getValues } = useForm<TDutySuggestedUserFilterParamsFormFields>({
    defaultValues: {
      date: new Date(defaultFilterParmas.date),
      startDate: new Date(defaultFilterParmas.startDate),
      endDate: new Date(defaultFilterParmas.endDate),
      dutyTypeId: defaultFilterParmas.dutyTypeId,
    },
  });
  const theme = useTheme();

  const onResetPressed = useCallback(() => {
    reset();
    onCloseFilterUserModal();

    const values = getValues();
    const filterParams: TDutySuggestedUserFilterParams = {
      ...values,
      date: moment(values.date).format("YYYY-MM-DD"),
      startDate: moment(values.startDate).format("YYYY-MM-DD"),
      endDate: moment(values.endDate).format("YYYY-MM-DD"),
    };
    onApply(filterParams);
  }, [reset, onCloseFilterUserModal]);

  const onApplyPressed = useCallback(
    (value: TDutySuggestedUserFilterParamsFormFields) => {
      const filterParams: TDutySuggestedUserFilterParams = {
        ...value,
        date: moment(value.date).format("YYYY-MM-DD"),
        startDate: moment(value.startDate).format("YYYY-MM-DD"),
        endDate: moment(value.endDate).format("YYYY-MM-DD"),
      };
      onCloseFilterUserModal();
      onApply(filterParams);
    },
    [onApply, onCloseFilterUserModal]
  );

  return (
    <>
      <View style={styles.filterIconWrapper}>
        <IconButton
          style={{ margin: 0 }}
          icon="tune-variant"
          size={24}
          mode="outlined"
          rippleColor={"grey"}
          onPress={onOpenFilterUserModal}
          animated
        />
        {_isNotDefault(defaultFilterParmas, getValues()) && <View style={styles.filterBadge} />}
      </View>

      {openFilterUserModal && (
        <MySlideModal onClose={onCloseFilterUserModal}>
          <View style={{ gap: 16 }}>
            <View style={{ gap: 8 }}>
              <FormPickDate label="Từ ngày" useControllerProps={{ control, name: "startDate" }} />
              <FormPickDate label="Đến ngày" useControllerProps={{ control, name: "endDate" }} />
            </View>

            <View style={styles.flexContainer}>
              <View style={styles.flexItem}>
                <Button onPress={onResetPressed} buttonColor={theme.colors.secondary} mode="contained">
                  Đặt lại
                </Button>
              </View>
              <View style={styles.flexItem}>
                <Button onPress={handleSubmit(onApplyPressed)} buttonColor={theme.colors.primary} mode="contained">
                  Áp dụng
                </Button>
              </View>
            </View>
          </View>
        </MySlideModal>
      )}
    </>
  );
};

const _isNotDefault = (defaultParams: TDutySuggestedUserFilterParams, nowParams: TDutySuggestedUserFilterParamsFormFields) => {
  console.log({ defaultParams, nowParams });

  if (!moment(defaultParams.startDate).isSame(nowParams.startDate, "date")) return true;
  if (!moment(defaultParams.endDate).isSame(nowParams.endDate, "date")) return true;

  return false;
};

const styles = StyleSheet.create({
  filterIconWrapper: {
    position: "relative",
  },
  filterBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,

    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#C84851",
  },
  flexContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  flexItem: {
    flexGrow: 1,
  },
});
