import { TDutySuggestedUser, TDutySuggestedUserFilterParams } from "@/api/form/types";
import { Delayed } from "@/components/Delayed";
import { NunitoText } from "@/components/text/NunitoText";
import { useDutyFormCreateContext } from "@/contexts";
import { useSuggestDutyUsers } from "@/hooks/form";
import { TDutyFormAttendanceInfo } from "@/types";
import { NoData } from "@/ui/NoData";
import { SkeletonRectangleLoader } from "@/ui/skeletons";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Modal, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import { AnimatedFAB, SegmentedButtons, TextInput } from "react-native-paper";
import { FilterUserForm } from "./FilterUserForm";
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
  const { formDutyTypes, dutyDate } = useDutyFormCreateContext();
  const { users: suggestedUsers, isLoading: isFetchingUsers, onFetchDutySuggestedUsers } = useSuggestDutyUsers();

  const [filterCheckStatus, setFilterCheckStatus] = useState<TFilterCheckStatus>("all");
  const [text, setText] = useState("");

  const selectedUsers: TDutyFormAttendanceInfo[] = useMemo(() => {
    const users: TDutyFormAttendanceInfo[] = [];
    formDutyTypes.forEach((dutyType) => {
      dutyType.dutyTypeUsers.forEach((user) => users.push({ ...user, isChecked: true }));
    });
    return users;
  }, [formDutyTypes]);

  const selectedUserIds: number[] = useMemo(() => {
    const userIds: number[] = [];
    formDutyTypes.forEach((dutyType) => {
      dutyType.dutyTypeUsers.forEach((user) => userIds.push(user.id));
    });
    return userIds;
  }, [formDutyTypes]);

  const usersWithCheckStatus: TUserWithCheckStatus[] = useMemo(
    () => suggestedUsers.map((user) => ({ ...user, isChecked: selectedUserIds.includes(user.id) ? true : false })),
    [suggestedUsers, selectedUsers]
  );

  const users: TDutyFormAttendanceInfo[] = useMemo(
    () => (filterCheckStatus === "all" ? usersWithCheckStatus : selectedUsers),
    [selectedUsers, usersWithCheckStatus, filterCheckStatus]
  );

  const searchedUsers = useMemo(() => {
    return users.filter((user) => user.name.toLowerCase().includes(text.toLowerCase()));
  }, [text, users]);

  const onFilterApply = useCallback((params: TDutySuggestedUserFilterParams) => {
    onFetchDutySuggestedUsers({ page: 0, size: 50 }, params);
  }, []);

  useEffect(() => {
    onFetchDutySuggestedUsers({ page: 0, size: 50 }, _defaultFilterParams(dutyType.dutyTypeId, moment(dutyDate).format("YYYY-MM-DD")));
  }, [onFetchDutySuggestedUsers, dutyType]);

  return (
    <Modal transparent animationType="slide">
      <SafeAreaView style={{ flex: 1 }}>
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
                data={searchedUsers}
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

                      <FilterUserForm
                        onApply={onFilterApply}
                        defaultFilterParmas={_defaultFilterParams(dutyType.dutyTypeId, moment(dutyDate).format("YYYY-MM-DD"))}
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
                  </View>
                }
                ListEmptyComponent={
                  isFetchingUsers ? <SkeletonRectangleLoader height={400} /> : <NoData message="Không có nhân viên thuộc loại trực" />
                }
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

const _defaultFilterParams = (dutyTypeId: number, dutyDate: string): TDutySuggestedUserFilterParams => ({
  date: dutyDate,
  startDate: moment().startOf("year").format("YYYY-MM-DD"),
  endDate: moment().endOf("year").format("YYYY-MM-DD"),
  dutyTypeId,
  sort: sortOpts[0].value,
});

export const sortOpts = [
  {
    label: "Số lần trực tăng dần",
    value: "numOnDuty,asc",
  },
  {
    label: "Số lần trực giảm dần",
    value: "numOnDuty,desc",
  },
];
