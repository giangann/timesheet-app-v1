import { MyModal } from "@/components/MyModal";
import { NunitoText } from "@/components/text/NunitoText";
import { OPACITY_TO_HEX } from "@/constants/Colors";
import { UNIT_DIMENSION } from "@/constants/Misc";
import { useSession } from "@/contexts/ctx";
import { useDeleteTeam } from "@/hooks/setting";
import { MyToast } from "@/ui/MyToast";
import { Entypo } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, TouchableHighlight, View } from "react-native";
import { Menu } from "react-native-paper";
const AddNewIconImage = require("@/assets/images/add-new-icon.png");
const FilterIconImage = require("@/assets/images/filter-icon.png");
const LeaveTypeIconLeft = require("@/assets/images/identify-card.png");

type TTeam = {
  id: number;
  name: string;
  code: string | null;
};

export default function TeamList() {
  const [teams, setTeams] = useState<TTeam[]>([]);
  const { session } = useSession();

  const fetchTeams = async () => {
    const token = `Bearer ${session}`;

    const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
    const endpoint = "/teams";
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
      credentials: "include",
    });
    const responseJson = await response.json();

    if (responseJson.statusCode === 200) {
      setTeams(responseJson.data.teams);
    } else {
      MyToast.error(responseJson.error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTeams();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ToolBar />
      <ScrollView contentContainerStyle={styles.listBox}>
        <List teams={teams} refetch={fetchTeams} />
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
      <Pressable onPress={() => router.push("/settings/teams/add-team")}>
        <Image source={AddNewIconImage} />
      </Pressable>
    </View>
  );
};

type ListProps = {
  teams: TTeam[];
  refetch: () => void;
};
const List: React.FC<ListProps> = ({ teams, refetch }) => {
  return (
    <>
      {teams.map((team) => (
        <Item key={team.id} refetch={refetch} team={team} />
      ))}
    </>
  );
};

type ItemProps = {
  refetch: () => void;
  team: TTeam;
};
const Item: React.FC<ItemProps> = ({ team, refetch }) => {
  const { id, name } = team;

  const [visible, setVisible] = useState(false);
  const [openCfModal, setOpenCfModal] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const { onDeleteTeam } = useDeleteTeam();

  const onPressDelete = useCallback(() => {
    setOpenCfModal(true);
    setVisible(false);
  }, [setOpenCfModal, setVisible]);

  const onConfirmDelete = useCallback(() => {
    onDeleteTeam(id);
    refetch();
  }, [id, onDeleteTeam, refetch]);
  return (
    <>
      {/* Info */}
      <View style={styles.itemBox}>
        <View style={styles.indexBox}>
          <NunitoText type="body2" lightColor="white" darkColor="white">
            {addPrefix(id)}
          </NunitoText>
        </View>
        <NunitoText type="body2"> {name}</NunitoText>

        {/* Menu */}
        <View style={styles.iconThreeDotsAbsBox}>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <TouchableHighlight underlayColor={`#000000${OPACITY_TO_HEX["15"]}`} onPress={openMenu} style={styles.iconThreeDotsBtn}>
                <Entypo name="dots-three-vertical" size={18} color="black" />
              </TouchableHighlight>
            }
          >
            <Menu.Item onPress={onPressDelete} title="Xóa" />
          </Menu>
        </View>

        {/* Modal */}
        {openCfModal && (
          <MyModal
            title={"Xác nhận xóa phòng ban"}
            onClose={() => setOpenCfModal(false)}
            cb={onConfirmDelete}
            modalProps={{ animationType: "fade", transparent: true }}
          >
            <View>
              <NunitoText type="body3">Xóa phòng ban: {name}?</NunitoText>
            </View>
          </MyModal>
        )}
      </View>
    </>
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
    marginBottom: 20,
  },
  listBox: {
    paddingBottom: 16,
    gap: 20,
  },
  itemBox: {
    backgroundColor: `#0B3A82${OPACITY_TO_HEX["15"]}`,
    paddingHorizontal: 16 * UNIT_DIMENSION,
    paddingVertical: 12 * UNIT_DIMENSION,
    borderRadius: 8 * UNIT_DIMENSION,

    flexDirection: "row",
    alignItems: "center",

    position: "relative",
  },
  indexBox: {
    backgroundColor: `#0B3A82`,
    padding: 10 * UNIT_DIMENSION,
    borderRadius: 8 * UNIT_DIMENSION,
    marginRight: 12 * UNIT_DIMENSION,
  },
  iconThreeDotsAbsBox: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  iconThreeDotsBtn: {
    padding: 12,
    borderRadius: 20,
  },
});

function addPrefix(num: number) {
  return num < 10 ? "0" + num : num;
}
