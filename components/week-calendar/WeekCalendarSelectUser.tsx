import { OPACITY_TO_HEX } from "@/constants/Colors";
import { useGroupUser } from "@/hooks/user";
import { useWeekCalendarCreateProvider } from "@/providers";
import { TWeekCalendarCreateFormFieldsUser } from "@/types";
import { NoData } from "@/ui/NoData";
import { SkeletonRectangleLoader } from "@/ui/skeletons";
import { AntDesign } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useMemo, useState } from "react";
import { FlatList, Modal, SafeAreaView, StyleSheet, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { AnimatedFAB, Button, SegmentedButtons, TextInput } from "react-native-paper";
import { Delayed } from "../Delayed";
import { NunitoText } from "../text/NunitoText";
import { GroupUserCard } from "./GroupUserCard";
import { MyModal } from "../MyModal";

type TFilterCheckStatus = "checked" | "all";

export const WeekCalendarSelectUser = () => {
  const [open, setOpen] = useState(false);
  const [filterCheckStatus, setFilterCheckStatus] = useState<TFilterCheckStatus>("all");
  const [text, setText] = useState("");

  const { useFieldArrayReturn } = useWeekCalendarCreateProvider();

  const onClose = () => setOpen(false);
  const onOpen = () => setOpen(true);

  const { users, isLoading: isFetchingUsers } = useGroupUser();

  const searchedUsers = useMemo(() => users.filter((user) => user.name.toLowerCase().includes(text.toLowerCase())), [users, text]);

  const selectedUsers = useMemo(
    () => searchedUsers.filter((user) => useFieldArrayReturn?.fields?.some((field) => field.userId === user.id)),
    [useFieldArrayReturn, searchedUsers]
  );

  const listUsers = useMemo(() => (filterCheckStatus === "all" ? searchedUsers : selectedUsers), [filterCheckStatus, searchedUsers, selectedUsers]);
  return (
    <>
      {/*  */}
      <FieldLabel />

      {/*  */}
      {useFieldArrayReturn?.fields.map((field, index) => (
        <UserItem key={field.id} userInfo={field} fieldArrayId={index} />
      ))}

      {/*  */}
      <Button style={[{ alignItems: "flex-start" }]} onPress={onOpen} textColor="#0B3A82">
        + thêm thành viên
      </Button>

      {/*  */}
      {open && (
        <Modal transparent animationType="slide">
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.modalContainer}>
              <Delayed waitBeforeShow={100}>
                <>
                  {/* Title */}
                  <View style={styles.modalTitleWrapper}>
                    <NunitoText type="heading2" style={styles.modalTitle}>
                      Chọn người tham gia
                    </NunitoText>
                    <TouchableOpacity onPress={onClose}>
                      <AntDesign name="close" size={20} color="black" />
                    </TouchableOpacity>
                  </View>

                  {/* Content */}
                  <FlatList
                    data={listUsers}
                    renderItem={({ item: user }) => {
                      const isChecked = useFieldArrayReturn?.fields?.some((field) => field.userId === user.id) ?? false;
                      return <GroupUserCard key={user.id} isChecked={isChecked} user={user} />;
                    }}
                    ListHeaderComponent={
                      <View style={{ gap: 2 }}>
                        <View style={styles.filterContainer}>
                          <View style={styles.filterItem}>
                            <SegmentedButtons
                              value={filterCheckStatus}
                              onValueChange={(value: string) => {
                                console.log({ value });
                                setFilterCheckStatus(value as TFilterCheckStatus);
                              }}
                              buttons={[
                                { value: "all", label: "Tất cả" },
                                { value: "checked", label: "Đã chọn" },
                              ]}
                              style={{ marginLeft: -1 }}
                            />
                          </View>
                        </View>
                        {/* Search */}
                        <TextInput
                          style={{ height: 36 }}
                          mode="outlined"
                          label="Tên thành viên"
                          value={text}
                          onChangeText={(text) => setText(text)}
                          placeholder="nhập tên để tìm kiếm "
                        />
                      </View>
                    }
                    ListEmptyComponent={isFetchingUsers ? <SkeletonRectangleLoader height={400} /> : <NoData message="Không có thanh vien" />}
                    contentContainerStyle={styles.modalContentContainer}
                  />

                  <AnimatedFAB
                    icon={"plus"}
                    label={"Label"}
                    extended={false}
                    onPress={() => {
                      onClose();
                    }}
                    visible={true}
                    animateFrom={"right"}
                    iconMode={"static"}
                    style={[styles.fabStyle]}
                  />
                </>
              </Delayed>
            </View>
          </SafeAreaView>
        </Modal>
      )}
    </>
  );
};

const FieldLabel: React.FC = () => (
  <View style={styles.labelWrapper}>
    <NunitoText type="body2" style={{ marginRight: 6 }}>
      Thành viên tham gia
    </NunitoText>
  </View>
);

const UserItem: React.FC<{ userInfo: TWeekCalendarCreateFormFieldsUser; fieldArrayId: number }> = ({ userInfo, fieldArrayId }) => {
  const [openCfModal, setOpenCfModal] = useState(false);
  const { useFieldArrayReturn } = useWeekCalendarCreateProvider();
  const onDelete = () => {
    useFieldArrayReturn?.remove(fieldArrayId);
  };

  const onDeletePressed = () => setOpenCfModal(true);
  return (
    <View style={styles.userItemBox}>
      {/* User info */}
      <View style={styles.userInfoContainer}>
        <NunitoText type="body3" style={styles.userName}>
          {`${userInfo.name} - ${userInfo.teamName}`}
        </NunitoText>
        <NunitoText type="body4" style={styles.userTeamName}>
          {userInfo.roleName}
        </NunitoText>
      </View>

      {/* Delete Button */}
      <View style={styles.deleteButtonAbsBox}>
        <TouchableHighlight underlayColor={`#000000${OPACITY_TO_HEX["15"]}`} onPress={onDeletePressed} style={styles.deleteButton}>
          <MaterialCommunityIcons name="delete" size={18} color="black" />
        </TouchableHighlight>
      </View>

      {/* Confirm Modal */}
      {openCfModal && (
        <MyModal
          title={"Xác nhận thao tác"}
          onClose={() => setOpenCfModal(false)}
          cb={onDelete}
          modalProps={{ animationType: "slide", transparent: true }}
        >
          <View>
            <NunitoText type="body3">Bạn muốn xóa thành viên {useFieldArrayReturn?.fields[fieldArrayId].name}?</NunitoText>
          </View>
        </MyModal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  userItemBox: {
    position: "relative",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: `#CADCE8`,
    borderRadius: 4,
  },
  userInfoContainer: {
    paddingLeft: 16,
  },
  userName: {
    color: "black",
  },
  userTeamName: {
    color: "black",
    opacity: 0.75,
  },
  deleteButtonAbsBox: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  deleteButton: {
    padding: 12,
    borderRadius: 20,
  },
  modalContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    position: "relative",
  },
  labelWrapper: {
    flexDirection: "row",
    alignContent: "flex-start",
    alignItems: "center",
  },
  modalTitleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  modalTitle: {
    color: "black",
  },

  modalContentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },

  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },

  filterItem: {
    flexGrow: 1,
  },
  fabStyle: {
    bottom: 16,
    right: 16,
    position: "absolute",
  },
});
