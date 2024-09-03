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

type TDutyType = {
  id: number;
  name: string;
  teams: string[];
  createdAt: string;
  updatedAt: string;
};
export default function DutyTypeList() {
  const [dutyTypes, setDutyTypes] = useState<TDutyType[]>([]);
  const { session } = useSession();

  const router = useRouter();

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
      <ToolBar />
      <ScrollView contentContainerStyle={styles.listBox}>
        <List dutyTypes={dutyTypes} />
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
      <Pressable onPress={() => router.push("/settings/duty_types/add-duty-type")}>
        <Image source={AddNewIconImage} />
      </Pressable>
    </View>
  );
};

type ListProps = {
  dutyTypes: TDutyType[];
};
const List: React.FC<ListProps> = ({ dutyTypes }) => {
  return (
    <>
      {dutyTypes.map((leaveType) => (
        <Item key={leaveType.id} {...leaveType} />
      ))}
    </>
  );
};

type ItemProps = TDutyType;
const Item: React.FC<ItemProps> = ({ id, name, teams, createdAt, updatedAt }) => {
  return (
    <View style={styles.itemBox}>
      {/* left */}
      <View style={styles.itemBoxLeft}>
        <View style={styles.indexBoxWrapper}>
          <View style={styles.indexBox}>
            <NunitoText type="body2" lightColor="white">
              {addPrefix(id)}
            </NunitoText>
          </View>
        </View>
        <View style={{ gap: 4 }}>
          <NunitoText type="body2"> {name}</NunitoText>
          <View>
            <NunitoText style={{ fontSize: 12, fontWeight: 300, opacity: 0.75 }}> Ngày tạo</NunitoText>
            <NunitoText type="body4">{createdAt}</NunitoText>
          </View>
          <View>
            <NunitoText style={{ fontSize: 12, fontWeight: 300, opacity: 0.75 }}> Ngày cập nhật</NunitoText>
            <NunitoText type="body4">{updatedAt}</NunitoText>
          </View>
        </View>
      </View>
      {/* right */}
      <View style={styles.chipBox}>
        {teams.map((teamName) => (
          <View style={styles.chip}>
            <NunitoText lightColor="white" type="body4">
              {teamName}
            </NunitoText>
          </View>
        ))}
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
  indexBoxWrapper:{
    justifyContent:'flex-start'
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

function addPrefix(num: number) {
  return num < 10 ? "0" + num : num;
}
