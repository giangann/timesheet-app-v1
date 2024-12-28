import { TTeam, TTeamCreate, TTeamDetail, TTeamEdit } from "@/api/team/type";
import { FormInput } from "@/components/FormInput";
import { NunitoText } from "@/components/text/NunitoText";
import { dirtyValues, hasNullishValue, pickProperties } from "@/helper/common";
import { useCreateTeam, useEditTeam, useTeamDetail } from "@/hooks/setting";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect } from "expo-router";
import { memo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  teamId?: number;
};
type CreateItem = {
  name: string | undefined;
  hotline: string | undefined;
};
export const TeamCreateOrEdit: React.FC<Props> = memo(({ teamId }) => {
  const {
    control,
    handleSubmit,
    formState: { dirtyFields },
    setValue,
  } = useForm<CreateItem>({ defaultValues: { name: "" } });

  const { onCreateTeam } = useCreateTeam();
  const { onEditTeam } = useEditTeam();
  const { onFetchTeamDetail } = useTeamDetail();

  const onCreate = async (fieldValues: CreateItem) => {
    try {
      const requiredValues = pickProperties(fieldValues, ["name"]);
      if (hasNullishValue(requiredValues)) {
        MyToast.error("Hãy nhập đủ các thông tin yêu cầu");
        return;
      }

      const bodyData: TTeamCreate = {
        name: fieldValues.name ?? "",
      };
      if (fieldValues.hotline) bodyData.hotline = fieldValues.hotline;

      onCreateTeam(bodyData);
    } catch (error: any) {
      MyToast.error(error.message);
    }
  };

  const onEdit = async (fieldValues: CreateItem) => {
    try {
      if (!teamId) throw new Error("Không có teamId, hãy khởi động lại ứng dụng");

      const dirtyFieldValues = dirtyValues(fieldValues, dirtyFields);

      onEditTeam(teamId, dirtyFieldValues);
    } catch (error: any) {
      MyToast.error(error.message);
    }
  };

  const onSubmit = useCallback(
    (fieldValues: CreateItem) => {
      if (teamId) {
        onEdit(fieldValues);
      } else {
        onCreate(fieldValues);
      }
    },
    [onCreate, onEdit]
  );

  useFocusEffect(
    useCallback(() => {
      async function fetchDetail() {
        if (teamId) {
          const teamDetail: TTeamDetail = await onFetchTeamDetail(teamId);

          setValue("name", teamDetail.name);
          setValue("hotline", teamDetail.hotline ?? undefined);
        }
      }

      fetchDetail();
    }, [teamId])
  );
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Your scrollable form inputs go here */}
        <FormInput formInputProps={{ control: control, name: "name" }} label="Tên phòng ban" required placeholder="Nhập tên phòng ban..." />
        <FormInput formInputProps={{ control: control, name: "hotline" }} label="Liên hệ phòng ban" placeholder="Nhập sđt liên hệ..." />

        {/* Add more FormInput components as needed */}
      </ScrollView>
      <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit(onSubmit)} style={styles.buttonContainer}>
        <View style={styles.button}>
          <NunitoText type="body3" style={{ color: "white" }}>
            Tạo mới
          </NunitoText>
        </View>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Space at the bottom to prevent overlap with the button
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "white", // Optional: To give the button a distinct background
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B3A82",
    height: 44,
    borderRadius: 4,
  },
});
