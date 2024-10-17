import { FormInput } from "@/components/FormInput";
import { FormMultiSelect } from "@/components/FormMultiSelect";
import { NunitoText } from "@/components/text/NunitoText";
import { useSession } from "@/contexts/ctx";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

type CreateItem = {
  dutyTypeName: string;
  teamIds: number[];
};
type TTeam = {
  id: number;
  name: string;
  code: string | null;
};

export default function AddDutyType() {
  const [teams, setTeams] = useState<TTeam[]>([]);
  const teamOptions = teams.map((team) => ({ value: team.id, label: team.name }));
  const { control, handleSubmit } = useForm<CreateItem>({ defaultValues: { dutyTypeName: "" } });
  const { session } = useSession();
  const router = useRouter();

  const onCreate = async (data: CreateItem) => {
    console.log(data);

    const token = `Bearer ${session}`;
    const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
    const endpoint = "/duty-types";
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify(data),
      credentials: "include",
    });
    const responseJson = await response.json();
    console.log(responseJson);
    if (responseJson.statusCode === 200) {
      MyToast.success("Thành công");
      router.back();
    } else {
      MyToast.error(responseJson.error);
    }
  };

  const fetchTeams = async () => {
    const token = `Bearer ${session}`;

    const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
    const endpoint = "/teams";
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
      credentials: "include",
    });
    const responseJson = await response.json();

    if (responseJson.statusCode === 200) {
      setTeams(responseJson.data.teams);
    } else {
      MyToast.error(responseJson.error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTeams();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Your scrollable form inputs go here */}
        <FormInput formInputProps={{ control: control, name: "dutyTypeName" }} label="Tên loại trực" required placeholder="Nhập tên loại trực..." />
        <FormMultiSelect
          useControllerProps={{ control: control, name: "teamIds" }}
          label="Phòng ban áp dụng"
          required
          placeholder="Chọn phòng ban..."
          options={teamOptions}
        />
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
