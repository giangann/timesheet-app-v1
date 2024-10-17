import { fetchListDutyCalendarByDateRange } from "@/api/setting";
import { TDutyCalendar } from "@/api/setting/type";
import FormPickDateRange from "@/components/FormPickDateRange";
import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { UNIT_DIMENSION } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { getDayOfWeekShortNameInVietnamese, sortByDate } from "@/helper/date";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
import { useCallback, useState } from "react";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
const AddNewIconImage = require("@/assets/images/add-new-icon.png");

export default function DutyCalendarList() {
  const [dutyCalendars, setDutyCalendars] = useState<TDutyCalendar[]>([]);
  const { session } = useSession();

  const onFetchDutyCalendars = async () => {
    const responseJson = await fetchListDutyCalendarByDateRange(session, { startDate: '2024-01-01', endDate: '2025-12-30' });
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
      <ToolBar />
      <FlatList
        data={dutyCalendars}
        renderItem={({ item }) => <Item calendar={item} />}
        keyExtractor={(item) => item.dutyFormId.toString()}
      />
    </View>
  );
}
const ToolBar = () => {
  const router = useRouter();
  return (
    <View style={styles.toolbar}>
      {/* Left: PickDateRange */}
      <View>
        <TouchableOpacity>
          <View style={styles.dateRangeFilter}>
            <NunitoText type="body3" style={{ color: "#0B3A82" }}>01/01/2024 - 30/12/2025</NunitoText>
          </View>
        </TouchableOpacity>
      </View>

      {/* Right: Filter and Create */}
      <View style={styles.toolbarRight}>
        <Pressable onPress={() => router.push("/settings/duty_calendars/add-duty-calendar")}>
          <Image source={AddNewIconImage} />
        </Pressable>
      </View>
    </View>
  );
};


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
  },
  dateRangeFilter: {
    borderWidth: 1,
    borderColor: "#0B3A82",
    borderRadius: 12,

    paddingHorizontal: 10,
    paddingVertical: 4,
  }
  , toolbarRight: {
    gap: 4,
    flexDirection: "row",
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
});
