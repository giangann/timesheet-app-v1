import { fetchListDutyCalendarByDateRange } from "@/api/setting";
import { TDutyCalendar, TDutyCalendarFilterParams } from "@/api/setting/type";
import { FormPickDate } from "@/components/FormPickDate";
import { MyFilterModal } from "@/components/MyFilterModal";
import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { UNIT_DIMENSION } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { omitNullishValues } from "@/helper/common";
import { getDayOfWeekShortNameInVietnamese, sortByDate } from "@/helper/date";
import { MyToast } from "@/ui/MyToast";
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";


export default function DutyCalendarList() {
  const [dutyCalendars, setDutyCalendars] = useState<TDutyCalendar[]>([]);
  const { session } = useSession();
  const filterParamsRef = useRef<TDutyCalendarFilterParams>(getDefaultDateRangeString())

  const onFilterFieldsChange = (newFilterParams: Partial<TDutyCalendarFilterParams>) => {
    // update filter params
    filterParamsRef.current = { ...newFilterParams };

    // refetch data
    reFetchListCalendarWithFilter(filterParamsRef.current)
  };

  const reFetchListCalendarWithFilter = async (fitlerParams: TDutyCalendarFilterParams) => {
    try {
      const responseJson = await fetchListDutyCalendarByDateRange(session, fitlerParams);
      if (responseJson.statusCode === 200) {
        const dutyCalendarsSorted = sortByDate<TDutyCalendar>(responseJson.data.dutyCalendar, "ASC");
        setDutyCalendars(dutyCalendarsSorted);
      } else {
        MyToast.error(responseJson.error);
      }
    } catch (error: any) {
      MyToast.error(error.message);
    }
  }

  const onFetchDutyCalendars = async () => {
    const responseJson = await fetchListDutyCalendarByDateRange(session, filterParamsRef.current);
    if (responseJson.statusCode === 200) {
      const dutyCalendarsSorted = sortByDate<TDutyCalendar>(responseJson.data.dutyCalendar, "ASC");
      setDutyCalendars(dutyCalendarsSorted);
    } else {
      MyToast.error(responseJson.error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      onFetchDutyCalendars();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ToolBar filterParams={filterParamsRef.current} onFilterFieldsChange={onFilterFieldsChange} />
      <FlatList
        data={dutyCalendars}
        renderItem={({ item }) => <Item calendar={item} />}
        keyExtractor={(item) => item.dutyFormId.toString()}
      />
    </View>
  );
}

type ToolBarProps = FilterFieldsFormProps
const ToolBar: React.FC<ToolBarProps> = ({ filterParams, onFilterFieldsChange }) => {
  const router = useRouter();

  const filterFieldsExcludeNullishValue = omitNullishValues(filterParams)
  const showFilterInfo = Object.keys(filterFieldsExcludeNullishValue).length > 0

  const filterInfo = {
    startDate: filterParams.startDate ? moment(filterParams.startDate).format('DD/MM/YYYY') : 'Khởi đầu',
    endDate: filterParams.endDate ? moment(filterParams.endDate).format('DD/MM/YYYY') : 'Hiện tại'
  }

  return (
    <View style={styles.toolbar}>
      {/* Left: Filter Info */}
      {!showFilterInfo && <View />}
      {showFilterInfo &&
        <View>
          <TouchableOpacity>
            <View style={styles.dateRangeFilter}>
              <NunitoText type="body3" style={{ color: "#0B3A82" }}>{`${filterInfo.startDate} - ${filterInfo.endDate}`}</NunitoText>
            </View>
          </TouchableOpacity>
        </View>
      }

      {/* Right: Filter and Create */}
      <View style={styles.toolbarRight}>
        <FilterFields filterParams={filterParams} onFilterFieldsChange={onFilterFieldsChange} />
        <TouchableOpacity onPress={() => router.push("/settings/duty_calendars/add-duty-calendar")}>
          <FontAwesome5 name="calendar-plus" size={22} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};


type FilterFieldsFormProps = {
  onFilterFieldsChange: (newFilterParams: Partial<TDutyCalendarFilterParams>) => void;
  filterParams: TDutyCalendarFilterParams;
};
const FilterFields: React.FC<FilterFieldsFormProps> = ({ filterParams, onFilterFieldsChange }) => {
  const [open, setOpen] = useState(false);

  const onClose = () => setOpen(false);
  const onOpen = () => setOpen(true);

  const filterFieldsExcludeNullishValue = omitNullishValues(filterParams)
  const showFilterBadge = Object.keys(filterFieldsExcludeNullishValue).length > 0

  return (
    <>
      {/* Filter Fields Button */}
      <TouchableOpacity onPress={onOpen}>
        <View style={styles.filterIconWrapper}>
          <Ionicons name="filter" size={24} color="black" />
          {showFilterBadge && <View style={styles.filterBadge} />}
        </View>
      </TouchableOpacity>
      {/* Filter Fields Modal */}
      {open && (
        <MyFilterModal onClose={onClose} title="Bộ lọc" modalContainerStyles={{ height: 300 }}>
          <FilterFiledsForm filterParams={filterParams} onFilterFieldsChange={onFilterFieldsChange} />
        </MyFilterModal>
      )}
    </>
  )
}

type TFormFieldsValue = {
  startDate?: Date,
  endDate?: Date
}
const FilterFiledsForm: React.FC<FilterFieldsFormProps> = ({ filterParams, onFilterFieldsChange }) => {
  const { control, handleSubmit, reset, setValue } = useForm<TFormFieldsValue>();

  const onFieldsReset = () => {
    reset();
    onFilterFieldsChange({});
  };


  const onFilterApply = (newFilterParams: TDutyCalendarFilterParams) => {
    onFilterFieldsChange(newFilterParams);
  };

  const onFormSubmit = (values: TFormFieldsValue) => {
    let newFilterParams: TDutyCalendarFilterParams = {}

    if (values.startDate)
      newFilterParams.startDate = moment(values.startDate).format('YYYY-MM-DD')

    if (values.endDate)
      newFilterParams.endDate = moment(values.endDate).format('YYYY-MM-DD')

    onFilterApply(newFilterParams)
  }

  useEffect(() => {
    if (filterParams.startDate)
      setValue("startDate", new Date(filterParams.startDate));
    if (filterParams.endDate)
      setValue("endDate", new Date(filterParams.endDate));
  }, [filterParams]);

  return (
    <View style={styles.modalContent}>
      <View style={styles.modalFields}>
        <FormPickDate useControllerProps={{ control: control, name: "startDate" }} label="Ngày bat dau:" placeholder="Chọn ngày" />
        <FormPickDate useControllerProps={{ control: control, name: "endDate" }} label="Ngày ket thuc:" placeholder="Chọn ngày" />
      </View>

      <View style={styles.buttonModalContainer}>
        <TouchableOpacity onPress={onFieldsReset} activeOpacity={0.8} style={styles.buttonItem}>
          <View style={styles.buttonOutlined}>
            <NunitoText type="body3" style={{ color: "#0B3A82" }}>
              Đặt lại
            </NunitoText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSubmit(onFormSubmit)} activeOpacity={0.8} style={styles.buttonItem}>
          <View style={styles.buttonContained}>
            <NunitoText type="body3" style={{ color: "white" }}>
              Áp dụng
            </NunitoText>
          </View>
        </TouchableOpacity>
      </View>
    </View>

  )
}


type ItemProps = {
  calendar: TDutyCalendar
};
const Item: React.FC<ItemProps> = ({ calendar }) => {
  const { date, dutyType } = calendar
  return (
    <View style={styles.itemBox}>
      <View style={styles.indexBox}>
        <NunitoText type="body2" lightColor="white" darkColor="white">
          {getDayOfWeekShortNameInVietnamese(date)}
        </NunitoText>
      </View>
      <View>
        <NunitoText type="body2"> {dutyType}</NunitoText>
        <NunitoText type="subtitle2"> {moment(date).format("DD/MM/YYYY")}</NunitoText>
      </View>
    </View>
  );
};

function getDefaultDateRangeString(): TDutyCalendarFilterParams {
  // Calculate next week's Monday and Sunday
  const nextWeekMonday = moment().startOf("isoWeek").add(7, "days").format("YYYY-MM-DD");
  const nextWeekSunday = moment().startOf("isoWeek").add(13, "days").format("YYYY-MM-DD");

  const dateRange: TDutyCalendarFilterParams = { startDate: nextWeekMonday, endDate: nextWeekSunday };

  return dateRange;
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 0,
    backgroundColor: "white",
    minHeight: "100%",
    height: "100%",
    /**
     * if not set height 100%, container will overflow screen,
     * so scrollView will fill container => scrollView also overflow screen
     * => can't see all element inside scrollView
     */
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20 * UNIT_DIMENSION,
    alignItems:'flex-start'
  },
  dateRangeFilter: {
    borderWidth: 1,
    borderColor: "#0B3A82",
    borderRadius: 12,

    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  toolbarRight: {
    gap: 8,
    flexDirection: "row",
    alignItems:'center'
  },
  itemBox: {
    backgroundColor: `#0B3A82${OPACITY_TO_HEX["15"]}`,
    paddingHorizontal: 16 * UNIT_DIMENSION,
    paddingVertical: 12 * UNIT_DIMENSION,
    borderRadius: 8 * UNIT_DIMENSION,

    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",

    marginBottom: 20,
  },
  itemBoxLeft: {
    flexBasis: "60%",
    flexDirection: "row",
  },
  indexBoxWrapper: {
    justifyContent: "flex-start",
  },
  indexBox: {
    backgroundColor: `#0B3A82`,
    padding: 10 * UNIT_DIMENSION,
    borderRadius: 8 * UNIT_DIMENSION,
    marginRight: 12 * UNIT_DIMENSION,
  },
  nameBox: {
    flexBasis: "60%",
  },
  chipBox: {
    gap: 4,
  },
  chip: {
    borderRadius: 16 * UNIT_DIMENSION,
    backgroundColor: `#0B3A82`,
    paddingLeft: 12 * UNIT_DIMENSION,
    paddingRight: 12 * UNIT_DIMENSION,
    paddingVertical: 6 * UNIT_DIMENSION,
  },

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
  modalContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  modalFields: {},
  buttonModalContainer: {
    flexDirection: "row",
    gap: 6,
  },
  buttonItem: {
    flexGrow: 1,
  },
  buttonContained: {
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    backgroundColor: "#0B3A82",
    borderRadius: 4,
  },
  buttonOutlined: {
    justifyContent: "center",
    alignItems: "center",
    height: 44,
    borderColor: "#0B3A82",
    borderWidth: 1,
    borderRadius: 4,
  },
});
