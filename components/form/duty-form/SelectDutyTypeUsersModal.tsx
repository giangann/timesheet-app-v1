import { TDutySuggestedUser } from "@/api/form/types";
import { Delayed } from "@/components/Delayed";
import { MySlideModal } from "@/components/MySlideModal";
import { NunitoText } from "@/components/text/NunitoText";
import { useDutyFormCreateContext } from "@/contexts";
import { useSuggestDutyUsers } from "@/hooks/form";
import { TDutyFormAttendanceInfo } from "@/types";
import { NoData } from "@/ui/NoData";
import { SkeletonRectangleLoader } from "@/ui/skeletons";
import { AntDesign } from "@expo/vector-icons";
import { memo, useEffect, useMemo, useState } from "react";
import { FlatList, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { AnimatedFAB, IconButton, SegmentedButtons, TextInput } from "react-native-paper";
import { SuggestUserCard } from "./SuggestdUserCard";

type SelectDutyTypeUsersModalProps = {
  onClose: () => void;
  dutyType: {
    dutyTypeId: number;
    dutyTypeName: string;
  };
  fieldArrayIndex: number;
};
type TFilterCheckStatus = "checked" | "all";
type TUserWithCheckStatus = TDutySuggestedUser & { isChecked: boolean };
export const SelectDutyTypeUsersModal: React.FC<SelectDutyTypeUsersModalProps> = memo(({ onClose, dutyType, fieldArrayIndex }) => {
  const { formDutyTypes } = useDutyFormCreateContext();
  const { users: suggestedUsers, isLoading: isFetchingUsers, onFetchDutySuggestedUsers } = useSuggestDutyUsers();

  const [filterCheckStatus, setFilterCheckStatus] = useState<TFilterCheckStatus>("all");
  const [text, setText] = useState("");
  const [openFilterUserModal, setOpenFilterUserModal] = useState(false);

  const onOpenFilterUserModal = () => setOpenFilterUserModal(true);
  const onCloseFilterUserModal = () => setOpenFilterUserModal(false);

  const usersWithCheckStatus: TUserWithCheckStatus[] = useMemo(() => suggestedUsers.map((user) => ({ ...user, isChecked: false })), [suggestedUsers]);
  const selectedUsers: TDutyFormAttendanceInfo[] = useMemo(() => {
    const users: TDutyFormAttendanceInfo[] = [];
    formDutyTypes.forEach((dutyType) => {
      dutyType.dutyTypeUsers.forEach((user) => users.push(user));
    });
    return users;
  }, [formDutyTypes]);

  const users: TDutyFormAttendanceInfo[] = useMemo(
    () => (filterCheckStatus === "all" ? usersWithCheckStatus : selectedUsers),
    [selectedUsers, usersWithCheckStatus, filterCheckStatus]
  );

  useEffect(() => {
    onFetchDutySuggestedUsers(
      { page: 0, size: 50 },
      { date: "1970-01-01", dutyTypeId: dutyType.dutyTypeId, startDate: "2024-01-01", endDate: "2024-12-30" }
    );
  }, [onFetchDutySuggestedUsers]);

  return (
    <Modal transparent animationType="slide">
      <View style={styles.modalContainer}>
        <Delayed waitBeforeShow={100}>
          <>
            {/* Title */}
            <View style={styles.modalTitleWrapper}>
              <NunitoText type="heading2" style={styles.modalTitle}>
                {dutyType.dutyTypeName} - chọn người tham gia
              </NunitoText>
              <TouchableOpacity onPress={onClose}>
                <AntDesign name="close" size={20} color="black" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <FlatList
              data={users}
              renderItem={({ item: user }) => (
                <SuggestUserCard
                  fieldArrayIndex={fieldArrayIndex}
                  isChecked={user.isChecked}
                  key={user.id}
                  user={user}
                  onCardPressed={(user) => console.log("press", { user })}
                />
              )}
              ListHeaderComponent={
                <>
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
                    <IconButton
                      style={{ margin: 0 }}
                      icon="tune-variant"
                      size={24}
                      mode="outlined"
                      rippleColor={"grey"}
                      onPress={onOpenFilterUserModal}
                      animated
                    />
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
                </>
              }
              ListEmptyComponent={
                isFetchingUsers ? <SkeletonRectangleLoader height={400} /> : <NoData message="Không có nhân viên thuộc loại trực" />
              }
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

            {openFilterUserModal && (
              <MySlideModal onClose={onCloseFilterUserModal}>
                <NunitoText>Filter users modal</NunitoText>
              </MySlideModal>
            )}
          </>
        </Delayed>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    position: "relative",
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
    flex: 1,
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
