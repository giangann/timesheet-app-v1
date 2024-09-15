import { FormInput } from "@/components/FormInput";
import { FormSelectV2 } from "@/components/FormSelectV2";
import FormUploadImage from "@/components/FormUploadImage";
import { NunitoText } from "@/components/text/NunitoText";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/contexts/ctx";
import { hasNullishValue } from "@/helper/common";
import { getDayOfWeekNameInVietnamese, sortByDate } from "@/helper/date";
import { MyToast } from "@/ui/MyToast";
import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

type CreateItemForm = {
  dutyCalendarId: number;
  userIdentifyCard: string;
  userApproveIdentifyCard: number;
  attachFile: File;
  note: string;
};

type TDutyCalendar = {
  dutyFormId: number;
  date: string; // YYYY-MM-DD
  dutyType: string;
  dayOfWeek: string;
};
type TUserApprove = {
  identifyCard: number;
  name: string;
};

type TDutyCalendarDetail = {
  id: number;
  startTime: string;
  endTime: string;
  date: string;
  dutyType: {
    id: number;
    name: string;
  };
  salaryCoefficientType: {
    id: number;
    name: string;
    coefficient: number;
  };
};

type TExtraForm = {
  salaryCoefficientId: number;
  dutyTypeId: number;
  startTime: number;
  endTime: number;
};

export default function CreateDutyForm() {
  const [userApproves, setUserApproves] = useState<TUserApprove[]>([]);
  const [dutyCalendars, setDutyCalendars] = useState<TDutyCalendar[]>([]);
  const [selectedDutyCalendar, setSelectedDutyCalendar] = useState<TDutyCalendarDetail | null>(null);

  const { session, userInfo } = useSession();
  const router = useRouter();

  const { control, handleSubmit } = useForm<CreateItemForm>({
    defaultValues: { userIdentifyCard: userInfo?.identifyCard },
  });
  const { control: control2 } = useForm<TExtraForm>();

  const dutyCalendarInRanges = filterDutyCalendarsInRange(dutyCalendars);
  const dutyCalendarOpts = dutyCalendarInRanges.map((calendar) => ({
    value: calendar.dutyFormId,
    label: `${moment(calendar.date).format("DD/MM/YYYY")} - (${getDayOfWeekNameInVietnamese(calendar.date)})`,
  }));
  const userApproveOpts = userApproves.map((user) => ({ value: user.identifyCard, label: user.name }));

  const getDutyCalendarDetail = useCallback(async (calendarId: number) => {
    const token = `Bearer ${session}` ?? "xxx";
    const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
    const endpoint = `/duty-calendars/${calendarId}`;
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
      credentials: "include",
    });
    const responseJson = await response.json();

    if (responseJson.statusCode === 200) {
      setSelectedDutyCalendar(responseJson.data.dutyCalendar);
    } else {
      MyToast.error(responseJson.error);
    }
  }, []);

  const onCreate = async (value: CreateItemForm) => {
    try {
      if (hasNullishValue(value)) return;
      const bodyData: CreateItemForm = {
        ...value,
      };

      const formData = new FormData();

      Object.entries(bodyData).forEach(([k, v]) => {
        if (typeof v === "number") formData.append(k, v.toString());
        else if (v instanceof Date) {
          const formattedDate = v.toISOString().slice(0, 19); // 'yyyy-MM-ddTHH:mm:ss'<=>(2024-09-11T23:25:00) if dont slice the format be like: '2024-09-11T23:25:00.000Z'
          formData.append(k, formattedDate);
        } else formData.append(k, v as File);
      });

      const token = `Bearer ${session}` ?? "xxx";
      const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
      const endpoint = "/duty-forms";
      const url = `${baseUrl}${endpoint}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        }, // do not set content-type for formData, let browser do it automatically
        body: formData,
        credentials: "include",
      });

      const responseJson = await response.json();
      console.log(responseJson);

      if (responseJson.statusCode === 200) {
        MyToast.success("Thành công");
        router.back();
      } else {
        MyToast.error(responseJson.error);
        console.log(responseJson);
      }
    } catch (error: any) {
      MyToast.error(error.message);
      console.log(error);
    }
  };

  const fetchDutyTypes = async () => {
    const token = `Bearer ${session}` ?? "xxx";

    const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
    const endpoint = "/duty-calendars/get-calendar";
    const queryString = "?startDate=2024-05-07&endDate=2024-12-30";
    const url = `${baseUrl}${endpoint}${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
      credentials: "include",
    });
    const responseJson = await response.json();
    if (responseJson.statusCode === 200) {
      const dutyCalendarsSorted = sortByDate<TDutyCalendar>(responseJson.data.dutyCalendar, "ASC");
      setDutyCalendars(dutyCalendarsSorted);
    } else {
      MyToast.error(responseJson.error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDutyTypes();
    }, [])
  );

  const fetchUserApproves = async () => {
    const token = `Bearer ${session}` ?? "xxx";

    const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
    const endpoint = "/users/list-user-by-role?role=TEAM_DIRECTOR";
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
      credentials: "include",
    });
    const responseJson = await response.json();

    if (responseJson.statusCode === 200) {
      setUserApproves(responseJson.data.users);
    } else {
      MyToast.error(responseJson.error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserApproves();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FormSelectV2
          useControllerProps={{ control: control, name: "dutyCalendarId" }}
          options={dutyCalendarOpts}
          onSelect={(opt) => {
            getDutyCalendarDetail(opt.value as number);
          }}
          label="Chọn ngày trực"
          required
          placeholder="Chọn ngày trong danh sách"
          leftIcon={<FontAwesome name="list-alt" size={18} color={Colors.light.inputIconNone} />}
        />

        <View style={styles.timeContainer}>
          <View style={styles.timeItem}>
            <FormSelectV2
              label="Giờ bắt đầu"
              placeholder={selectedDutyCalendar?.startTime ?? "_ _ : _ _"}
              useControllerProps={{ control: control2, name: "dutyTypeId" }}
              disabled
            />
          </View>
          <View style={styles.timeItem}>
            <FormSelectV2
              label="Giờ kết thúc"
              placeholder={selectedDutyCalendar?.endTime ?? "_ _ : _ _"}
              useControllerProps={{ control: control2, name: "dutyTypeId" }}
              disabled
            />
          </View>
        </View>

        <FormSelectV2
          label="Loại trực"
          placeholder={selectedDutyCalendar?.dutyType.name ?? "_ _ _ _ _"}
          useControllerProps={{ control: control2, name: "dutyTypeId" }}
          disabled
        />
        <FormSelectV2
          label="Loại ngoài giờ"
          placeholder={`${selectedDutyCalendar?.salaryCoefficientType.name ?? "_ _ _ _ _"} (x${
            selectedDutyCalendar?.salaryCoefficientType.coefficient.toFixed(2) ?? "_ _ _"
          })`}
          useControllerProps={{ control: control2, name: "salaryCoefficientId" }}
          disabled
        />

        <FormSelectV2
          useControllerProps={{ control: control, name: "userApproveIdentifyCard" }}
          options={userApproveOpts}
          label="Lãnh đạo phê duyệt"
          required
          placeholder="Chọn lãnh đạo phê duyệt"
          leftIcon={<MaterialCommunityIcons name="human-queue" size={18} color={Colors.light.inputIconNone} />}
        />

        <FormUploadImage label="Ảnh đính kèm" required useControllerProps={{ control: control, name: "attachFile" }} />

        <FormInput formInputProps={{ control: control, name: "note" }} label="Ghi chú" placeholder="Nhập ghi chú..." />
      </ScrollView>
      <TouchableOpacity onPress={handleSubmit(onCreate)} activeOpacity={0.8} style={styles.buttonContainer}>
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
  timeContainer: {
    flexDirection: "row",
    gap: 10,
  },
  timeItem: {
    flexBasis: 1,
    flexGrow: 1,
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

function filterDutyCalendarsInRange(dutyCalendars: TDutyCalendar[]): TDutyCalendar[] {
  // Calculate next week's Monday and Sunday
  const nextWeekMonday = moment().startOf("isoWeek").add(7, "days").format("YYYY-MM-DD");
  const nextWeekSunday = moment().startOf("isoWeek").add(13, "days").format("YYYY-MM-DD");

  const dateRange = { start: nextWeekMonday, end: nextWeekSunday };
  const dutyCalendarsInRange = dutyCalendars.filter((hol) => hol.date >= dateRange.start && hol.date <= dateRange.end);
  return dutyCalendarsInRange;
}
