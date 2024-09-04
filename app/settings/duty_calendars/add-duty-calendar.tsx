import { FormInput } from "@/components/FormInput";
import { FormMultiSelect } from "@/components/FormMultiSelect";
import { FormPickTime } from "@/components/FormPickTime";
import { FormSelect } from "@/components/FormSelect";
import { NunitoText } from "@/components/text/NunitoText";
import { useSession } from "@/contexts/ctx";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
const LeaveTypeIconLeft = require("@/assets/images/identify-card.png");

type CreateItem = {
  dutyTypeId: number;
  date: string;
  startTime: string;
  endTime: string;
  salaryCoefficientTypeId: number;
};
type THoliday = {
  id: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  name: string;
  date: string; // YYYY-MM-DD
  salaryCoefficientTypeId: number;
  activeOutsideWorkingTime: boolean;
};
type TSalaryCoefficientType = {
  id: number;
  name: string;
  coefficient: number;
};
type TDutyType = {
  id: number;
  name: string;
  teams: string[];
  createdAt: string;
  updatedAt: string;
};

export default function AddDutyCalendar() {
  const [holidays, setHolidays] = useState<THoliday[]>([]);
  const [salaryCoefficientTypes, setSalaryCoefficientTypes] = useState<TSalaryCoefficientType[]>([]);
  const [dutyTypes, setDutyTypes] = useState<TDutyType[]>([]);

  // calculate options
  const holidayOptions = holidays.map((holiday) => ({
    value: holiday.date,
    label: `${moment(holiday.date).format("DD/MM/YYYY")} - ${holiday.name}`,
  }));
  const salaryCoefficientTypeOptions = salaryCoefficientTypes.map((type) => ({
    value: type.id,
    label: type.name,
  }));
  const dutyTypeOptions = dutyTypes.map((dutyType) => ({ value: dutyType.id, label: dutyType.name }));

  // form and define handler
  const { control, handleSubmit } = useForm<CreateItem>({ defaultValues: {} });
  const { session } = useSession();
  const router = useRouter();

  const onCreate = async (data: CreateItem) => {
    const bodyData: CreateItem = {
      ...data,
      startTime: moment(data.startTime).format("HH:mm"),
      endTime: moment(data.startTime).format("HH:mm"),
    };
    console.log(bodyData);
  };

  const fetchHolidays = async () => {
    const token = `Bearer ${session}` ?? "xxx";

    const baseUrl = "http://13.228.145.165:8080/api/v1";
    const endpoint = "/holidays?year=2024";
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
      credentials: "include",
    });
    const responseJson = await response.json();

    if (responseJson.statusCode === 200) {
      setHolidays(responseJson.data.holidays);
    } else {
      MyToast.error(responseJson.error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHolidays();
    }, [])
  );

  const fetchSalaryCoefTypes = async () => {
    const token = `Bearer ${session}` ?? "xxx";

    const baseUrl = "http://13.228.145.165:8080/api/v1";
    const endpoint = "/salary-coefficient-types";
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
      credentials: "include",
    });
    const responseJson = await response.json();

    if (responseJson.statusCode === 200) {
      setSalaryCoefficientTypes(responseJson.data.salaryCoefficientTypes);
    } else {
      MyToast.error(responseJson.error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSalaryCoefTypes();
    }, [])
  );

  const fetchDutyTypes = async () => {
    const token = `Bearer ${session}` ?? "xxx";

    const baseUrl = "http://13.228.145.165:8080/api/v1";
    const endpoint = "/duty-types/all";
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
      credentials: "include",
    });
    const responseJson = await response.json();

    if (responseJson.statusCode === 200) {
      setDutyTypes(responseJson.data.dutyTypes);
    } else {
      MyToast.error(responseJson.error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDutyTypes();
    }, [])
  );
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Your scrollable form inputs go here */}
        <FormSelect
          useControllerProps={{ control: control, name: "date" }}
          options={holidayOptions}
          label="Ngày trực"
          required
          placeholder="Chọn ngày trong danh sách"
        />
        <FormSelect
          useControllerProps={{ control: control, name: "salaryCoefficientTypeId" }}
          options={salaryCoefficientTypeOptions}
          label="Loại ngoài giờ"
          required
          placeholder="Chọn loại ngoài giờ"
        />
        <FormSelect
          useControllerProps={{ control: control, name: "dutyTypeId" }}
          options={dutyTypeOptions}
          label="Loại trực"
          required
          placeholder="Chọn loại trực"
        />
        <FormPickTime
          useControllerProps={{ control: control, name: "startTime" }}
          label="Giờ bắt đầu trực"
          required
          leftIconImage={LeaveTypeIconLeft}
        />
        <FormPickTime
          useControllerProps={{ control: control, name: "endTime" }}
          label="Giờ kết thúc trực"
          required
          leftIconImage={LeaveTypeIconLeft}
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
