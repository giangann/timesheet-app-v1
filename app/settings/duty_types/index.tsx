import { fetchDutyTypes } from "@/api/setting";
import { TDutyType } from "@/api/setting/type";
import { UNIT_DIMENSION } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { MyToast } from "@/ui/MyToast";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
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

type ItemProps = TDutyType;

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
});
