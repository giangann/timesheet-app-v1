import FontAwesome from "@expo/vector-icons/FontAwesome";
import { FormPickTime } from "@/components/FormPickTime";
import { FormSelect } from "@/components/FormSelect";
import { FormSelectV2 } from "@/components/FormSelectV2";
import { NunitoText } from "@/components/text/NunitoText";
import { useSession } from "@/contexts/ctx";
import { getDayOfWeekNameInVietnamese } from "@/helper/date";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { OPACITY_TO_HEX } from "@/constants/Colors";
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

  // Calculate options
  // filter holidays that fall within the next week's Monday to Sunday
  const holidaysInRange = filterHolidaysInRange(holidays);
  // add extra Sartuday and Sunday
  const holidayOptions = holidaysToOptions(holidaysInRange);
  const salaryCoefficientTypeOptions = salaryCoefficientTypes.map((type) => ({
    value: type.id,
    label: type.name,
  }));
  const dutyTypeOptions = dutyTypes.map((dutyType) => ({ value: dutyType.id, label: dutyType.name }));

  // form and define handler
  const { control, handleSubmit, watch, setValue, resetField } = useForm<CreateItem>({ defaultValues: {} });
  const { session } = useSession();
  const router = useRouter();

  const onHolidayOptSelect = (opt: TOption) => {
    // {value: string <YYYY-MM-DD> , label: string <MM/DD/YYYY - __DayOfWeekName__> }
    const { value, label } = opt;

    /**
     * Check if opt in holidayInRange[] or not
     * 1. If opt in holidayInRange (value in holidayInRange.id[])
     *    Get holiday = getHolidayById(value)
     *    Update salaryCoefficientTypeId value: setValue ('salaryCoefficientTypeId',holiday.salaryCoefficientTypeId)
     *
     * 2. If opt not in holidayInRange (value not in holidayInRange.id[])
     *    Reset value for salaryCoefficientTypeId field
     */

    const isOptJustWeekend = !holidaysInRange.some((hol) => hol.date === value); // check if value in holiday.id

    if (!isOptJustWeekend) {
      const holiday = holidaysInRange.filter((hol) => hol.date === value)[0];
      setValue("salaryCoefficientTypeId", holiday.salaryCoefficientTypeId);
    }
    if (isOptJustWeekend) {
      resetField("salaryCoefficientTypeId");
    }
  };

  const isDisabledSalaryCoef = () => {
    const date = watch("date");
    if (!date) return false;

    const isOptJustWeekend = !holidaysInRange.some((hol) => hol.date === date); // check if value in holiday.id
    const disabled = !isOptJustWeekend;
    return disabled;
  };

  const onCreate = async (data: CreateItem) => {
    try {
      const bodyData: CreateItem = {
        ...data,
        startTime: moment(data.startTime).format("HH:mm:ss"),
        endTime: moment(data.startTime).format("HH:mm:ss"),
      };
      console.log("bodyData", bodyData);

      // const token = `Bearer ${session}` ?? "xxx";
      // const baseUrl = "http://13.228.145.165:8080/api/v1";
      // const endpoint = "/duty-calendars";
      // const url = `${baseUrl}${endpoint}`;

      // const response = await fetch(url, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json", Authorization: token },
      //   body: JSON.stringify(bodyData),
      //   credentials: "include",
      // });
      // const responseJson = await response.json();

      // if (responseJson.statusCode === 200) {
      //   MyToast.success("Thành công");
      // } else {
      //   MyToast.error(responseJson.error);
      // }
    } catch (error: any) {
      MyToast.error(error.message);
    } finally {
      router.back();
    }
  };

  const fetchHolidays = async () => {
    const token = `Bearer ${session}` ?? "xxx";

    const baseUrl = "http://13.228.145.165:8080/api/v1";
    const queryString = `?year=2024&sort=date,asc`;
    const endpoint = "/holidays";
    const url = `${baseUrl}${endpoint}${queryString}`;

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
        <FormSelectV2
          useControllerProps={{ control: control, name: "date" }}
          options={holidayOptions}
          onSelect={onHolidayOptSelect}
          label="Ngày trực"
          required
          placeholder="Chọn ngày trong danh sách"
          leftIcon={<FontAwesome name="list-alt" size={18} color={`#000000${OPACITY_TO_HEX["50"]}`} />}
        />
        <FormSelectV2
          useControllerProps={{ control: control, name: "salaryCoefficientTypeId" }}
          options={salaryCoefficientTypeOptions}
          label="Loại ngoài giờ"
          required
          placeholder="Chọn loại ngoài giờ"
          disabled={isDisabledSalaryCoef()}
        />
        <FormSelectV2
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

type TOption = {
  value: number | string;
  label: string;
};

function filterHolidaysInRange(holidays: THoliday[]): THoliday[] {
  // Calculate next week's Monday and Sunday
  const nextWeekMonday = moment().startOf("isoWeek").add(7, "days").format("YYYY-MM-DD");
  const nextWeekSunday = moment().startOf("isoWeek").add(13, "days").format("YYYY-MM-DD");

  const dateRange = { start: nextWeekMonday, end: nextWeekSunday };
  const holidaysInRange = holidays.filter((hol) => hol.date >= dateRange.start && hol.date <= dateRange.end);
  return holidaysInRange;
}

function holidaysToOptions(holidays: THoliday[]): TOption[] {
  // Calculate next week's Saturday and Sunday
  const nextWeekSaturday = moment().startOf("isoWeek").add(12, "days").format("YYYY-MM-DD");
  const nextWeekSunday = moment().startOf("isoWeek").add(13, "days").format("YYYY-MM-DD");

  // Map holidays to options with formatted label
  const holidayOptions = holidays.map((holiday) => ({
    value: holiday.date,
    label: `${moment(holiday.date).format("DD/MM/YYYY")} - ${holiday.name} (${getDayOfWeekNameInVietnamese(holiday.date)})`,
  }));

  // Check if Saturday is in the holiday list, if not, add it
  const hasSaturday = holidays.some((holiday) => holiday.date === nextWeekSaturday);
  if (!hasSaturday) {
    holidayOptions.push({
      value: nextWeekSaturday,
      label: `${moment(nextWeekSaturday).format("DD/MM/YYYY")} - Thứ Bảy`,
    });
  }

  // Check if Sunday is in the holiday list, if not, add it
  const hasSunday = holidays.some((holiday) => holiday.date === nextWeekSunday);
  if (!hasSunday) {
    holidayOptions.push({
      value: nextWeekSunday,
      label: `${moment(nextWeekSunday).format("DD/MM/YYYY")} - Chủ Nhật`,
    });
  }

  return holidayOptions;
}
