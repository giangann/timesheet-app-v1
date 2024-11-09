import { fetchDutyTypes } from "@/api/setting";
import { TDutyType } from "@/api/setting/type";
import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { UNIT_DIMENSION, _mockDutyTypes } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { getUserSummaryString } from "@/helper/common";
import { MyToast } from "@/ui/MyToast";
import { NoData } from "@/ui/NoData";
import Entypo from "@expo/vector-icons/Entypo";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native";
const AddNewIconImage = require("@/assets/images/add-new-icon.png");
const FilterIconImage = require("@/assets/images/filter-icon.png");

export default function DutyTypeList() {
  const [dutyTypes, setDutyTypes] = useState<TDutyType[]>([]);
  const { session } = useSession();

  const onFetchDutyTypes = async () => {
    const responseJson = await fetchDutyTypes(session);
    if (responseJson.statusCode === 200) {
      setDutyTypes(responseJson.data.dutyTypes);
    } else {
      MyToast.error(responseJson.error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      onFetchDutyTypes();
    }, [session])
  );

  return (
    <View style={styles.container}>
      <ToolBar />
      <FlatList
        data={dutyTypes}
        renderItem={({ item }) => <DutyTypeItem dutyType={item} />}
        ListEmptyComponent={<NoData message="Chưa có loại trực được tạo, hãy tạo mới" />}
        contentContainerStyle={{ gap: 20, paddingBottom: 32 }}
      />
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

type DutyTypeItemProps = { dutyType: TDutyType };
const DutyTypeItem: React.FC<DutyTypeItemProps> = ({ dutyType }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const { dutyTypeName, teams } = dutyType;

  // caculate by add totalUsers in each team of teams
  const numTotalUserOfDutyType = useMemo(() => {
    let res = 0;
    teams.forEach((team) => (res += team.users.length));
    return res;
  }, [dutyType]);

  return (
    <View style={styles.dutyTypeItemBox}>
      <View style={styles.dutyTypeItemContainer}>
        <View style={styles.dutyTypeInfo}>
          <NunitoText type="body2" style={styles.dutyTypeName}>
            {dutyTypeName} ({numTotalUserOfDutyType})
          </NunitoText>

          <View style={styles.dutyTypeTeamsContainer}>
            {teams.map((team) => (
              <View key={team.id}>
                <View style={styles.dutyTypeTeamNameContainer}>
                  <View style={styles.bulletBox}>
                    <View style={styles.bullet} />
                  </View>
                  <NunitoText type="body2" style={styles.dutyTypeTeamName}>
                    P.{team.name} ({team.users.length})
                  </NunitoText>
                </View>

                <View style={styles.dutyTypeTeamUserSummaryBox}>
                  <NunitoText type="body4" style={styles.dutyTypeTeamUserSummary}>
                    {getUserSummaryString(team.users)}
                  </NunitoText>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Press ThreeDot icon to open Menu*/}
      <TouchableOpacity onPress={() => {}} style={styles.iconThreeDots}>
        <Entypo name="dots-three-vertical" size={18} color="black" />
      </TouchableOpacity>

      {/* Menu */}
      
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
    justifyContent: "flex-end",
    gap: 4,
    marginBottom: 20 * UNIT_DIMENSION,
  },
  dutyTypeItemBox: {
    position: "relative",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: `#0B3A82${OPACITY_TO_HEX["15"]}`,
    borderRadius: 8,
  },
  iconThreeDots: {
    position: "absolute",
    right: 8,
    top: 9,
  },
  dutyTypeItemContainer: {
    flexDirection: "column",
    gap: 12,
  },

  dutyTypeInfo: {
    gap: 8,
  },
  dutyTypeName: {
    color: "black",
    textTransform: "uppercase",
  },
  dutyTypeTeamsContainer: {
    gap: 4,
  },
  dutyTypeTeamNameContainer: {
    flexDirection: "row",
    gap: 4,
  },
  bulletBox: {
    position: "relative",
    top: 2,
  },
  bullet: {
    width: 3,
    height: 14,
    backgroundColor: `#0B3A82`,
    borderRadius: 1,
  },
  dutyTypeTeamName: {
    color: `#0B3A82`,
  },
  dutyTypeTeamUserSummaryBox: {
    paddingLeft: 8,
  },
  dutyTypeTeamUserSummary: {
    color: "black",
  },
});
