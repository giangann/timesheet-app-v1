import { fetchDutyTypes } from "@/api/setting";
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
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
const AddNewIconImage = require("@/assets/images/add-new-icon.png");
const FilterIconImage = require("@/assets/images/filter-icon.png");

type TDutyCalendar = {
  dutyFormId: number;
  date: string; // YYYY-MM-DD
  dutyType: string;
  dayOfWeek: string;
};
export default function DutyCalendarList() {
  const [dutyCalendars, setDutyCalendars] = useState<TDutyCalendar[]>([]);
  const { session } = useSession();

  const onFetchDutyTypes = async () => {
    const responseJson = await fetchDutyTypes(session, { startDate: '2024-01-01', endDate: '2025-12-30' });
    if (responseJson.statusCode === 200) {
      const dutyCalendarsSorted = sortByDate<TDutyCalendar>(responseJson.data.dutyCalendar, "ASC");
      setDutyCalendars(dutyCalendarsSorted);
    } else {
      MyToast.error(responseJson.error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      onFetchDutyTypes();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ToolBar />
      <ScrollView contentContainerStyle={styles.listBox}>
        <List dutyCalendars={dutyCalendars} />
      </ScrollView>
    </View>
  );
}
const ToolBar = () => {
  const router = useRouter();
  return (
    <View style={styles.toolbar}>
      {/* Left: PickDateRange */}
      <View>
        <FormPickDateRange />
      </View>

      {/* Right: Filter and Create */}
      <View style={styles.toolbarRight}>
        <Pressable onPress={() => { }}>
          <Image source={FilterIconImage} />
        </Pressable>
        <Pressable onPress={() => router.push("/settings/duty_calendars/add-duty-calendar")}>
          <Image source={AddNewIconImage} />
        </Pressable>
      </View>
    </View>
  );
};

type ListProps = {
  dutyCalendars: TDutyCalendar[];
};
const List: React.FC<ListProps> = ({ dutyCalendars }) => {
  return (
    <>
      {dutyCalendars.map((dutyCalendar) => (
        <Item key={dutyCalendar.dutyFormId} {...dutyCalendar} />
      ))}
    </>
  );
};

type ItemProps = TDutyCalendar;
const Item: React.FC<ItemProps> = ({ dutyFormId, date, dutyType, dayOfWeek }) => {
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
  toolbarRight: {
    gap: 4,
    flexDirection: "row",
  },
  listBox: {
    paddingBottom: 16,
    gap: 20 * UNIT_DIMENSION,
  },
  itemBox: {
    backgroundColor: `#0B3A82${OPACITY_TO_HEX["15"]}`,
    paddingHorizontal: 16 * UNIT_DIMENSION,
    paddingVertical: 12 * UNIT_DIMENSION,
    borderRadius: 8 * UNIT_DIMENSION,

    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
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
