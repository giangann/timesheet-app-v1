import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { UNIT_DIMENSION } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
const AddNewIconImage = require("@/assets/images/add-new-icon.png");
const FilterIconImage = require("@/assets/images/filter-icon.png");
const LeaveTypeIconLeft = require("@/assets/images/identify-card.png");

type TSalaryCoefficientType = {
  id: number;
  name: string;
  coefficient: number;
};

export default function OutOfWorkingTimeType() {
  const [salaryCoefficientTypes, setSalaryCoefficientTypes] = useState<TSalaryCoefficientType[]>([]);
  const { session } = useSession();

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
      MyToast.error(responseJson.error)
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSalaryCoefTypes();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ToolBar />
      <ScrollView contentContainerStyle={styles.listBox}>
        <List salaryCoefficientTypes={salaryCoefficientTypes} />
      </ScrollView>
    </View>
  );
}

const ToolBar = () => {
  const router = useRouter();
  return (
    <View style={styles.toolbar}>
      <Pressable onPress={() => {}}>
        <Image source={FilterIconImage} />
      </Pressable>
      <Pressable onPress={() => router.push("/settings/out_of_working_time_types/add-out-of-working-time-type")}>
        <Image source={AddNewIconImage} />
      </Pressable>
    </View>
  );
};

type ListProps = {
  salaryCoefficientTypes: TSalaryCoefficientType[];
};
const List: React.FC<ListProps> = ({ salaryCoefficientTypes }) => {
  return (
    <>
      {salaryCoefficientTypes.map((leaveType) => (
        <Item key={leaveType.id} {...leaveType} />
      ))}
    </>
  );
};

type ItemProps = TSalaryCoefficientType;
const Item: React.FC<ItemProps> = ({ id, name, coefficient }) => {
  return (
    <View style={styles.itemBox}>
      {/* left */}
      <View style={styles.itemBoxLeft}>
        <View style={styles.indexBox}>
          <NunitoText type="body2" lightColor="white">
            {addPrefix(id)}
          </NunitoText>
        </View>
        <NunitoText type="body2"> {name}</NunitoText>
      </View>
      {/* right */}
      <View style={styles.chipBox}>
        <View style={styles.chip}>
          <NunitoText lightColor="white" type="body2">
            {"x "}
            {coefficient.toPrecision(3)}
          </NunitoText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
    minHeight: "100%",
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
    marginBottom: 20 * UNIT_DIMENSION,
  },
  listBox: {
    gap: 20 * UNIT_DIMENSION,
  },
  itemBox: {
    backgroundColor: `#0B3A82${OPACITY_TO_HEX["15"]}`,
    paddingHorizontal: 16 * UNIT_DIMENSION,
    paddingVertical: 12 * UNIT_DIMENSION,
    borderRadius: 8 * UNIT_DIMENSION,

    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  itemBoxLeft: {
    flexBasis: "60%",
    flexDirection: "row",
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
  chipBox: {},
  chip: {
    borderRadius: 16 * UNIT_DIMENSION,
    backgroundColor: `#0B3A82`,
    paddingLeft: 10 * UNIT_DIMENSION,
    paddingRight: 12 * UNIT_DIMENSION,
    paddingVertical: 6 * UNIT_DIMENSION,
  },
});

function addPrefix(num: number) {
  return num < 10 ? "0" + num : num;
}
