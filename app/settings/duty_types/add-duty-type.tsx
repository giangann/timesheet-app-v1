import { createDutyType, fetchAllTeamWithUsers } from "@/api/setting";
import { TDutyTypeCreate, TTeamUserSort } from "@/api/setting/type";
import { TTeamUser } from "@/api/team/type";
import { FormInput } from "@/components/FormInput";
import { CustomListAccordionWithCheckbox, CustomListItemWithCheckbox } from "@/components/accordion";
import { NunitoText } from "@/components/text/NunitoText";
import { useSession } from "@/contexts/ctx";
import { hasNullishValue, pickProperties } from "@/helper/common";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { List, Checkbox } from "react-native-paper";

type CreateItem = {
  dutyTypeName: string | undefined;
  userIds: number[];
};
type TTeam = {
  id: number;
  name: string;
  code: string | null;
};

export default function AddDutyType() {
  const [teamsWithUsers, setTeamsWithUsers] = useState<(TTeam & { users: TTeamUserSort[] })[]>([]);
  const { control, handleSubmit } = useForm<CreateItem>({ defaultValues: { userIds: [] } });
  const { session } = useSession();
  const router = useRouter();

  const onCreate = async (fieldValues: CreateItem) => {
    try {
      console.log(fieldValues);

      // Process form fieldsValues
      const requiredValues = pickProperties(fieldValues, ["dutyTypeName", "userIds"]);
      if (hasNullishValue(requiredValues)) {
        MyToast.error("Hãy nhập đủ các thông tin yêu cầu");
        return;
      }
      if (!fieldValues.dutyTypeName) return;

      // map `fieldValues` to a `TDutyTypeCreate` object
      const dutyTypeData: TDutyTypeCreate = {
        dutyTypeName: fieldValues.dutyTypeName,
        userIds: fieldValues.userIds,
      };

      // Make request
      const responseJson = await createDutyType(session, dutyTypeData);

      if (responseJson.statusCode === 200) {
        MyToast.success("Thành công");
        router.back();
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    }
  };

  const onFetchAllTeamsWithUsers = async () => {
    try {
      const responseJson = await fetchAllTeamWithUsers(session);

      if (responseJson.statusCode === 200) {
        setTeamsWithUsers(responseJson.data.teams);
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      onFetchAllTeamsWithUsers();
    }, [session])
  );

  const [checked, setChecked] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Your scrollable form inputs go here */}
        <FormInput formInputProps={{ control: control, name: "dutyTypeName" }} label="Tên loại trực" required placeholder="Nhập tên loại trực..." />

        {/* Accordions */}
        <List.AccordionGroup>
          {teamsWithUsers.map((team) => (
            <CustomListAccordionWithCheckbox
              checkboxProps={{
                status: checked ? "checked" : "unchecked",
                onPress: () => setChecked(!checked),
              }}
              title={team.name}
              id={team.id}
              key={team.id}
            >
              {team.users.map((user) => (
                <CustomListItemWithCheckbox
                  title={user.name}
                  checkboxProps={{
                    status: checked ? "checked" : "unchecked",
                    onPress: () => setChecked(!checked),
                  }}
                  key={user.id}
                />
              ))}
            </CustomListAccordionWithCheckbox>
          ))}
        </List.AccordionGroup>
        {/* Add more FormInput components as needed */}
      </ScrollView>
      <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit(onCreate)} style={styles.buttonContainer}>
        <View style={styles.button}>
          <NunitoText type="body3" style={{ color: "white" }}>
            Tạo mới
          </NunitoText>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const CheckboxPlaceholder = () => (
  <View style={{ opacity: 0 }}>
    <Checkbox status="unchecked" />
  </View>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  scrollContent: {
    gap: 20,
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
