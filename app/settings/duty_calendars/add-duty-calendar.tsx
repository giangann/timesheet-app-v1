import { THoliday, TSalaryCoefficientType } from "@/api/setting/type";
import { FormPickDateFullscreenModal } from "@/components/FormPickDateFullscreenModal";
import { FormPickTime } from "@/components/FormPickTime";
import { FormSelectV2 } from "@/components/FormSelectV2";
import { NunitoText } from "@/components/text/NunitoText";
import { Colors } from "@/constants/Colors";
import { useSession } from "@/contexts/ctx";
import { getDayOfWeekShortNameInVietnamese, isWeekend } from "@/helper/date";
import { MyToast } from "@/ui/MyToast";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { MarkedDates } from "react-native-calendars/src/types";

type CreateItem = {
  dutyTypeId: number;
  date: string;
  startTime: string;
  endTime: string;
  salaryCoefficientTypeId: number;
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
  const holidaysMap = useMemo(() => holidaysToMap(holidays), [holidays]);
  const salaryCoefTypesMap = useMemo(() => salaryCoefficientTypesToMap(salaryCoefficientTypes), [salaryCoefficientTypes]);

  // Calculate options
  // filter holidays that fall within the next week's Monday to Sunday
  // const holidaysInRange = filterHolidaysInRange(holidays);
  const holidaysInRange = useMemo(() => holidays, [holidays]);

  const salaryCoefficientTypeOptions = useMemo(
    () =>
      salaryCoefficientTypes.map((type) => ({
        value: type.id,
        label: type.name,
      })),
    [salaryCoefficientTypes]
  );
  const dutyTypeOptions = useMemo(() => dutyTypes.map((dutyType) => ({ value: dutyType.id, label: dutyType.name })), [dutyTypes]);

  const markedHolidays = useMemo(() => holidaysToMarkedDates(holidays), [holidays]);

  // form and define handler
  const { control, handleSubmit, watch, setValue, resetField } = useForm<CreateItem>({ defaultValues: {} });
  const { session } = useSession();
  const router = useRouter();

  const onDateSelect = useCallback(
    (dateString: string) => {
      const isOptHoliday = holidaysInRange.some((hol) => hol.date === dateString); // check if value in holiday.id

      if (isOptHoliday) {
        const holiday = holidaysInRange.filter((hol) => hol.date === dateString)[0];
        setValue("salaryCoefficientTypeId", holiday.salaryCoefficientTypeId);
      }
      if (!isOptHoliday) {
        resetField("salaryCoefficientTypeId");
      }
    },
    [holidaysInRange]
  );

  const isDisabledSalaryCoef = useMemo(() => {
    const date = watch("date");
    if (!date) return false;

    const isOptJustWeekend = !holidaysInRange.some((hol) => hol.date === date); // check if value in holiday.id
    const disabled = !isOptJustWeekend;
    return disabled;
  }, [watch("date"), holidaysInRange]);

  const renderHolidayInfo = useCallback(
    (dateString: string): React.ReactNode => {
      const holiday = holidaysMap[dateString];
      const isDateWeekend = isWeekend(dateString);
      const holidaySalaryCoefTypeId = holiday?.salaryCoefficientTypeId;
      const holidaySalaryCoefType = salaryCoefTypesMap[holidaySalaryCoefTypeId];

      return (
        <>
          {/* 1 */}
          <View style={styles.holidayInfo}>
            <NunitoText lightColor="black" darkColor="black" type="body2">{`${moment(dateString).format(
              "DD/MM/YYYY"
            )} (${getDayOfWeekShortNameInVietnamese(dateString)})`}</NunitoText>
            {!holiday ? (
              isDateWeekend ? (
                <NunitoText lightColor="black" darkColor="black" type="body2">
                  Ngày cuối tuần
                </NunitoText>
              ) : (
                <NunitoText lightColor="black" darkColor="black" type="body2">
                  Ngày thường
                </NunitoText>
              )
            ) : null}
            {!holiday && <NunitoText lightColor="black" darkColor="black">{`__`}</NunitoText>}
            {holiday && (
              <>
                <NunitoText lightColor="black" darkColor="black">{`${holiday.name}`}</NunitoText>
                <NunitoText lightColor="black" darkColor="black" type="body3">{`${
                  holidaySalaryCoefType?.name
                } (x${holidaySalaryCoefType?.coefficient.toFixed(2)})`}</NunitoText>
              </>
            )}
          </View>
         
        </>
      );
    },
    [holidaysMap, salaryCoefTypesMap]
  );

  const onCreate = useCallback(async (data: CreateItem) => {
    try {
      const bodyData: CreateItem = {
        ...data,
        startTime: moment(data.startTime).format("HH:mm:ss"),
        endTime: moment(data.endTime).format("HH:mm:ss"),
      };
      console.log("bodyData", bodyData);

      const token = `Bearer ${session}`;
      const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
      const endpoint = "/duty-calendars";
      const url = `${baseUrl}${endpoint}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify(bodyData),
        credentials: "include",
      });
      const responseJson = await response.json();

      if (responseJson.statusCode === 200) {
        MyToast.success("Thành công");
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    } finally {
      router.back();
    }
  }, []);

  const fetchHolidays = async () => {
    const token = `Bearer ${session}`;

    const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
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
    const token = `Bearer ${session}`;

    const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
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
    const token = `Bearer ${session}`;

    const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
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
        <FormPickDateFullscreenModal
          useControllerProps={{ control: control, name: "date" }}
          onSelect={onDateSelect}
          renderDateInfo={renderHolidayInfo}
          rnCalendarProps={{ markedDates: markedHolidays }}
          label="Ngày trực"
          placeholder="Chọn ngày"
          required
        />

        <FormSelectV2
          useControllerProps={{ control: control, name: "salaryCoefficientTypeId" }}
          options={salaryCoefficientTypeOptions}
          label="Loại ngoài giờ"
          required
          placeholder="Chọn loại ngoài giờ"
          disabled={isDisabledSalaryCoef}
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
          placeholder="Chọn giờ"
          required
          leftIcon={<MaterialCommunityIcons name="clock-start" size={18} color={Colors.light.inputIconNone} />}
        />
        <FormPickTime
          useControllerProps={{ control: control, name: "endTime" }}
          label="Giờ kết thúc trực"
          placeholder="Chọn giờ"
          required
          leftIcon={<MaterialCommunityIcons name="clock-end" size={18} color={Colors.light.inputIconNone} />}
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
  holidayInfo: {
    gap: 8,

    paddingHorizontal: 12,
    paddingVertical: 8,

    borderRadius: 4,
    borderWidth: 1,
    borderColor: "black",
  },
});

type THolidaysMap = Record<string, THoliday>;
function holidaysToMap(holidays: THoliday[]): THolidaysMap {
  const holidaysMap: THolidaysMap = {};

  for (const hol of holidays) {
    holidaysMap[hol.date] = hol;
  }

  return holidaysMap;
}

type TSalaryCoefficientTypesMap = Record<number, TSalaryCoefficientType>;
function salaryCoefficientTypesToMap(salaryCoefficientTypes: TSalaryCoefficientType[]): TSalaryCoefficientTypesMap {
  const salaryCoefficientTypesMap: TSalaryCoefficientTypesMap = {};

  for (const type of salaryCoefficientTypes) {
    salaryCoefficientTypesMap[type.id] = type;
  }

  return salaryCoefficientTypesMap;
}

function holidaysToMarkedDates(holidays: THoliday[]): MarkedDates {
  const markedDates: MarkedDates = {};

  for (const hol of holidays) {
    markedDates[hol.date] = { marked: true, dotColor: "green" };
  }

  return markedDates;
}
