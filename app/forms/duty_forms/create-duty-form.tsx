import { createDutyForm, fetchDutySuggestedUsers, fetchListUserByRole } from "@/api/form";
import { TDutyFormCreate, TDutySuggestedUser, TDutySuggestedUserFilterParams, TUserApprove } from "@/api/form/types";
import { fetchDutyCalendarDetail, fetchListDutyCalendarByDateRange } from "@/api/setting";
import { TDutyCalendar, TDutyCalendarDetail, TDutyCalendarFilterParams } from "@/api/setting/type";
import { FormInput } from "@/components/FormInput";
import { FormPickDate } from "@/components/FormPickDate";
import { FormSelectContext, FormSelectContextProps, FormSelectFullscreenModal } from "@/components/FormSelectFullscreenModal";
import { FormSelectV2 } from "@/components/FormSelectV2";
import FormUploadImage from "@/components/FormUploadImage";
import { NunitoText } from "@/components/text/NunitoText";
import { Colors, OPACITY_TO_HEX } from "@/constants/Colors";
import { DEFAULT_PAGI_PARAMS, ROLE_CODE } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { hasNullishValue, pickProperties } from "@/helper/common";
import { getDayOfWeekShortNameInVietnamese, sortByDate } from "@/helper/date";
import { TPagiParams } from "@/types";
import { MyToast } from "@/ui/MyToast";
import { NoData } from "@/ui/NoData";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Progress from "react-native-progress";

export default function CreateDutyForm() {
  const [userApproves, setUserApproves] = useState<TUserApprove[]>([]);
  const [selectedCalendarInfo, setSelectedCalendarInfo] = useState<TDutyCalendarDetail | null>(null);
  const { session, userInfo } = useSession();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    resetField,
    reset
  } = useForm<TDutyFormCreate>({
    defaultValues: { userIdentifyCard: userInfo?.identifyCard },
  });

  const userApproveOpts = useMemo(() => userApproves.map((user) => ({ value: user.identifyCard, label: user.name })), [userApproves]);

  const onCalendarSelect = async (calendarId: TDutyFormCreate["dutyCalendarId"]) => {
    try {
      const responseJson = await fetchDutyCalendarDetail(session, calendarId);

      if (responseJson.statusCode === 200) {
        setSelectedCalendarInfo(responseJson.data.dutyCalendar);

        reset({ userIdentifyCard: undefined })
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    }
  };

  const onCreate = async (fieldValues: TDutyFormCreate) => {
    try {
      const requiredValues = pickProperties(fieldValues, ["dutyCalendarId", "userApproveIdentifyCard", "userApproveIdentifyCard"]);
      if (hasNullishValue(requiredValues)) {
        MyToast.error("Hãy nhập đủ các thông tin yêu cầu");
        return;
      }

      const formData = new FormData();
      Object.entries(fieldValues).forEach(([k, v]) => {
        if (v !== null && v !== undefined) {
          if (typeof v === "number") formData.append(k, v.toString());
          else if (v instanceof Date) {
            const formattedDate = v.toISOString().slice(0, 19); // 'yyyy-MM-ddTHH:mm:ss'<=>(2024-09-11T23:25:00) if dont slice the format be like: '2024-09-11T23:25:00.000Z'
            formData.append(k, formattedDate);
          } else formData.append(k, v as File);
        }
      });

      const responseJson = await createDutyForm(session, formData);

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

  const fetchUserApproves = async () => {
    const responseJson = await fetchListUserByRole(session, { role: ROLE_CODE.TEAM_DIRECTOR, teamId: userInfo?.team?.id ?? -1 });

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
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <FormSelectFullscreenModal<TDutyFormCreate, "dutyCalendarId">
            useControllerProps={{ control: control, name: "dutyCalendarId" }}
            modalChildren={<SelectDutyCalendarModalChildren />}
            onSelect={onCalendarSelect} // Now onSelect will infer correctly
            label={"Lịch trực"}
            placeholder={"Chọn lịch trực"}
            leftIcon={<FontAwesome name="list-alt" size={18} color={Colors.light.inputIconNone} />}
            modalChildrenContainerStyles={{ paddingHorizontal: 0, paddingVertical: 0 }}
            required
          />
          <DutyCalendarInfo selectedDutyCalendar={selectedCalendarInfo} />

          {userInfo?.roleCode === ROLE_CODE.ARCHIVIST && (
            <FormSelectFullscreenModal
              disabled={!Boolean(selectedCalendarInfo)}
              useControllerProps={{ control: control, name: "userApproveIdentifyCard" }}
              modalChildren={<SelectUserModalChildren calendarDate={selectedCalendarInfo?.date} />}
              modalChildrenContainerStyles={{ paddingHorizontal: 0, paddingVertical: 0 }}
              label="Nhân viên"
              placeholder="Chọn nhân viên (bỏ trống để tạo cho mình)"
              leftIcon={<FontAwesome name="list-alt" size={18} color={Colors.light.inputIconNone} />}
            />
          )}

          <FormSelectV2
            useControllerProps={{ control: control, name: "userApproveIdentifyCard" }}
            options={userApproveOpts}
            label="Lãnh đạo phê duyệt"
            required
            placeholder="Chọn lãnh đạo phê duyệt"
            leftIcon={<MaterialCommunityIcons name="human-queue" size={18} color={Colors.light.inputIconNone} />}
          />

          <FormInput formInputProps={{ control: control, name: "note" }} label="Ghi chú" placeholder="Nhập ghi chú..." />
          <FormUploadImage label="Ảnh đính kèm" useControllerProps={{ control: control, name: "attachFile" }} />

        </ScrollView>

        <TouchableOpacity onPress={handleSubmit(onCreate)} activeOpacity={0.8} style={styles.buttonContainer} disabled={isSubmitting}>
          <View style={styles.button}>
            {isSubmitting && <Progress.Circle indeterminate size={14} />}
            <NunitoText type="body3" style={{ color: "white" }}>
              Gửi duyệt
            </NunitoText>
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

type SelectDutyCalendarModalChildrenProps = {};
type TFilterFields = {
  startDate: Date;
  endDate: Date;
};
const SelectDutyCalendarModalChildren: React.FC<SelectDutyCalendarModalChildrenProps> = () => {
  const defaultFieldValues: TFilterFields = getDefaultDateRange();

  const [dutyCalendars, setDutyCalendars] = useState<TDutyCalendar[]>([]);
  const { session } = useSession();

  const { handleSubmit, control } = useForm<TFilterFields>({ defaultValues: defaultFieldValues });

  const { onSelectOption } = useContext(FormSelectContext) as FormSelectContextProps<Pick<TDutyFormCreate, "dutyCalendarId">>;

  const onApplyFilter = async (fieldValues: TFilterFields) => {
    fetchDutyCalendars(fieldValues);
  };

  const fetchDutyCalendars = useCallback(
    async (fieldValues: TFilterFields) => {
      try {
        const calendarFilterParams: TDutyCalendarFilterParams = {
          startDate: moment(fieldValues.startDate).format("YYYY-MM-DD"),
          endDate: moment(fieldValues.endDate).format("YYYY-MM-DD"),
        };
        const responseJson = await fetchListDutyCalendarByDateRange(session, calendarFilterParams);

        if (responseJson.statusCode === 200) {
          const dutyCalendarsSorted = sortByDate<TDutyCalendar>(responseJson.data.dutyCalendar, "ASC");
          setDutyCalendars(dutyCalendarsSorted);
        } else {
          MyToast.error(responseJson.error);
        }
      } catch (error: any) {
        MyToast.error(error.message);
      }
    },
    [session]
  );

  useEffect(() => {
    fetchDutyCalendars(defaultFieldValues);
  }, []);

  return (
    <View style={styles.modalContent}>
      {/* Filter Box */}
      <View style={styles.calendarFilterBox}>
        <NunitoText lightColor="black" darkColor="black" type="body2">
          Tìm kiếm trong khoảng thời gian
        </NunitoText>
        <View style={styles.dateRangeContainer}>
          <View style={styles.dateRangeItem}>
            <FormPickDate useControllerProps={{ control: control, name: "startDate" }} />
          </View>
          <View style={styles.dateRangeItem}>
            <FormPickDate useControllerProps={{ control: control, name: "endDate" }} />
          </View>
        </View>
        <TouchableOpacity style={styles.buttonOutlined} onPress={handleSubmit(onApplyFilter)}>
          <NunitoText type="body3" style={{ color: "#0B3A82" }}>
            Tìm lịch trực
          </NunitoText>
        </TouchableOpacity>
      </View>

      {/* List Options */}
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 20, gap: 10, paddingVertical: 24 }}
        data={dutyCalendars}
        renderItem={({ item }) => <CalendarItem calendar={item} onSelectOption={onSelectOption} />}
        ListEmptyComponent={<NoData message="Không có lịch trực" />}
      />
    </View>
  );
};
type CalendarItemProps = {
  calendar: TDutyCalendar;
  onSelectOption: (value: number, label: string) => void;
};
const CalendarItem: React.FC<CalendarItemProps> = ({ calendar, onSelectOption }) => {
  return (
    <TouchableOpacity onPress={() => onSelectOption(calendar.dutyFormId, `${calendar.date} - ${calendar.dutyType}`)}>
      <View key={calendar.dutyFormId} style={styles.calendarItemBox}>
        <NunitoText lightColor="black" darkColor="black" type="body2">
          {`${moment(calendar.date).format("DD/MM/YYYY")} (${getDayOfWeekShortNameInVietnamese(calendar.date)})`}
        </NunitoText>

        <View style={{ gap: 4 }}>
          <NunitoText lightColor="black" darkColor="black" type="body2">
            {calendar.dutyType}
          </NunitoText>
          <NunitoText lightColor="black" darkColor="black" type="body3">
            {`${calendar.salaryCoefficientName} (${calendar.salaryCoefficient.toFixed(2)})`}
          </NunitoText>
          <NunitoText lightColor="black" darkColor="black" type="body3">
            {`${calendar.startTime} - ${calendar.endTime}`}
          </NunitoText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

type SelectUserModalChildrenProps = {
  calendarDate: string | undefined
};

const SelectUserModalChildren: React.FC<SelectUserModalChildrenProps> = ({ calendarDate }) => {
  const { session } = useSession();
  const [dutySuggestedUsers, setDutySuggestedUsers] = useState<TDutySuggestedUser[]>([]);
  const pagiParamsRef = useRef<TPagiParams>({ size: 100, page: 0 })
  const filterParamsRef = useRef<TDutySuggestedUserFilterParams>({ date: calendarDate ?? moment(Date.now()).format('YYYY-MM-DD'), startDate: '2024-01-01', endDate: '2024-12-30', sort: 'numOnDuty,asc' })
  const { onSelectOption } = useContext(FormSelectContext) as FormSelectContextProps<Pick<TDutyFormCreate, "userIdentifyCard">>;


  const onFetchDutySuggestedUsers = useCallback(
    async (pagiParams: TPagiParams, filterParams: TDutySuggestedUserFilterParams) => {
      try {
        const responseJson = await fetchDutySuggestedUsers(session, pagiParams, filterParams);
        if (responseJson.statusCode === 200) {
          setDutySuggestedUsers(responseJson.data.users);
        } else {
          MyToast.error(responseJson.error);
        }
      } catch (error: any) {
        MyToast.error(error.message);
      }
    },
    [session]
  );

  const onFilterParamsChange = (newFilterParams: TDutySuggestedUserFilterParams) => {
    filterParamsRef.current = { ...newFilterParams }
    onFetchDutySuggestedUsers(pagiParamsRef.current, filterParamsRef.current)
  }

  useEffect(() => {
    onFetchDutySuggestedUsers(pagiParamsRef.current, filterParamsRef.current)
  }, [])

  return (
    <View style={styles.modalContent}>
      {/* Sorting container */}
      <FilterForm calendarDate={calendarDate} onFilterParamsChange={onFilterParamsChange} filterParams={filterParamsRef.current} />

      {/* User list */}
      <FlatList
        // ListHeaderComponent={<FilterForm calendarDate={calendarDate} onFilterParamsChange={onFilterParamsChange} filterParams={filterParamsRef.current} />}
        data={dutySuggestedUsers}
        renderItem={({ item }) => <SuggestedUserItem user={item} onSelectOption={onSelectOption} />}
        ListEmptyComponent={<NoData />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24, gap: 10 }}
      />
    </View>
  );
};

// props: onFetchSuggestedUser
type FilterFormProps = {
  onFilterParamsChange: (newFilterParams: TDutySuggestedUserFilterParams) => void,
  filterParams: TDutySuggestedUserFilterParams
} & SelectUserModalChildrenProps
type TDutySuggestedUserFilterFormFields = {
  date: string,
  startDate: Date,
  endDate: Date,
  sort?: string,
}
const FilterForm: React.FC<FilterFormProps> = ({ calendarDate, onFilterParamsChange, filterParams }) => {
  const { control, handleSubmit, getValues } = useForm<TDutySuggestedUserFilterFormFields>({ defaultValues: { date: calendarDate, startDate: new Date(filterParams.startDate), endDate: new Date(filterParams.endDate), sort: filterParams.sort } });

  const onSubmit = (fieldValues: TDutySuggestedUserFilterFormFields) => {
    const newParams: TDutySuggestedUserFilterParams = {
      startDate: moment(fieldValues.startDate).format('YYYY-MM-DD'),
      endDate: moment(fieldValues.endDate).format('YYYY-MM-DD'),
      date: moment(fieldValues.date).format('YYYY-MM-DD'),
      sort: fieldValues.sort
    }
    onFilterParamsChange(newParams)
  }
  return (
    <View style={styles.sortingContainer}>
      {/* Sorting container */}
      <View>
        <NunitoText type="body2">Sắp xếp theo số lần trực tăng dần trong khoảng thời gian</NunitoText>
        <View style={styles.dateRangeContainer}>
          <View style={styles.dateRangeItem}>
            <FormPickDate useControllerProps={{ control: control, name: 'startDate' }} />
          </View>
          <View style={styles.dateRangeItem}>
            <FormPickDate useControllerProps={{ control: control, name: 'endDate' }} />
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.buttonOutlined} onPress={handleSubmit(onSubmit)}>
        <NunitoText type="body3" style={{ color: "#0B3A82" }}>
          Thống kê
        </NunitoText>
      </TouchableOpacity>

    </View>

  )
}

type SuggestedUserItemProps = {
  user: TDutySuggestedUser,
  onSelectOption: (value: string, label: string) => void
}
const SuggestedUserItem: React.FC<SuggestedUserItemProps> = ({ user, onSelectOption }) => {
  return (
    <TouchableOpacity key={user.identifyCard} onPress={() => onSelectOption(user.identifyCard, `${user.name} (${user.roleName})`)}>

      <View style={styles.suggestedUserItem}>
        <NunitoText type="body2" style={{ color: 'black' }}>{user.name}</NunitoText>
        <View style={{ gap: 4 }}>
          <NunitoText type="body3">Chức vụ: {user.roleName}</NunitoText>
          <NunitoText type="body3">Phòng: {user.teamName}</NunitoText>
          <NunitoText type="body2">Số lần trực: {user.numOnDuty}</NunitoText>
        </View>
      </View>
    </TouchableOpacity>
  )
}

type DutyCalendarInfoProps = {
  selectedDutyCalendar: TDutyCalendarDetail | null;
};
export const DutyCalendarInfo: React.FC<DutyCalendarInfoProps> = ({ selectedDutyCalendar }) => {
  return (
    <>
      {selectedDutyCalendar && (
        <View style={styles.calendarInfoBox}>
          <NunitoText type="body2">{selectedDutyCalendar.dutyType.name}</NunitoText>
          <View style={styles.calendarInfo}>
            <NunitoText type="body3">{`${selectedDutyCalendar.salaryCoefficientType.name
              } (x${selectedDutyCalendar.salaryCoefficientType.coefficient.toFixed(2)})`}</NunitoText>
            <NunitoText type="body3">{`${selectedDutyCalendar.startTime} - ${selectedDutyCalendar.endTime}`}</NunitoText>
          </View>
        </View>
      )}
    </>
  );
};

function getDefaultDateRange(): TFilterFields {
  // Calculate next week's Monday and Sunday
  const nextWeekMonday = moment().startOf("isoWeek").add(7, "days").format("YYYY-MM-DD");
  const nextWeekSunday = moment().startOf("isoWeek").add(13, "days").format("YYYY-MM-DD");

  const dateRange: TFilterFields = { startDate: new Date(nextWeekMonday), endDate: new Date(nextWeekSunday) };

  return dateRange;
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
  buttonOutlined: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    borderColor: "#0B3A82",
    borderWidth: 1,
    height: 44,
    borderRadius: 4,

    gap: 8,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#0B3A82",
    height: 44,
    borderRadius: 4,

    gap: 8,
  },
  calendarFilterBox: {
    backgroundColor: "#EFF5FF",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  dateRangeContainer: {
    flexDirection: "row",
    gap: 10,
  },
  dateRangeItem: {
    flexGrow: 1,
  },
  filteredCalendarsScrollContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  calendarItemBox: {
    borderWidth: 1,
    borderColor: `#000000${OPACITY_TO_HEX["50"]}`,
    borderRadius: 4,

    paddingHorizontal: 12,
    paddingVertical: 8,

    gap: 8
  },
  calendarInfoBox: {
    backgroundColor: "#EFF5FF",
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  calendarInfo: {
    gap: 4,
  },

  // 
  modalContent: {
    flex: 1
  },
  sortingContainer: {
    backgroundColor: `#EFF5FF`,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 20,
  },
  suggestedUserItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,

    borderRadius: 4,
    borderWidth: 1,
    borderColor: `#000000${OPACITY_TO_HEX['50']}`,
    marginBottom: 0
  },
});
