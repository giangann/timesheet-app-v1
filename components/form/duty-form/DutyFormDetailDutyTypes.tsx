import { TDutyFormDetailDutyType } from "@/api/form/types";
import { NunitoText } from "@/components/text/NunitoText";
import { NoData } from "@/ui/NoData";
import { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  formDutyTypes: TDutyFormDetailDutyType[];
};
export const DutyFormDetailDutyTypes: React.FC<Props> = memo(({ formDutyTypes }) => {
  return (
    <View style={styles.dutyTypeGroup}>
      {formDutyTypes.map((selectedDutyType, index) => (
        <DutyType key={selectedDutyType.id} dutyTypeInfo={selectedDutyType} />
      ))}
    </View>
  );
});

type DutyTypeProps = {
  dutyTypeInfo: TDutyFormDetailDutyType;
};
const DutyType: React.FC<DutyTypeProps> = memo(({ dutyTypeInfo }) => {
  // Variables
  const isNoUser = useMemo(() => dutyTypeInfo.users.length <= 0, [dutyTypeInfo]);

  return (
    <View style={styles.dutyTypeItemBox}>
      <View style={styles.dutyTypeItemContainer}>
        {/* Duty name */}
        <View style={styles.dutyTypeNameContainer}>
          <View style={styles.bulletBox}>
            <View style={styles.bullet} />
          </View>
          <NunitoText type="body2" style={styles.dutyTypeName}>
            {dutyTypeInfo.dutyTypeName}
          </NunitoText>
        </View>

        {/* Duty users */}
        {isNoUser && (
          <View>
            <NoData message="Chưa có thành viên được chọn" />
          </View>
        )}

        {!isNoUser && (
          <View style={styles.dutyTypeUserContainer}>
            {dutyTypeInfo.users.map((user) => (
              <View style={styles.dutyTypeUser} key={user.id}>
                <NunitoText type="body3" style={styles.dutyTypeUserName}>
                  {`${user.name} - ${user.roleName}`}
                </NunitoText>
                <NunitoText type="body4" style={styles.dutyTypeUserTeam}>
                  {user.teamName}
                </NunitoText>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  dutyTypeGroup: {
    gap: 8,
  },
  dutyTypeItemBox: {
    position: "relative",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: `#CADCE8`,
    borderRadius: 4,
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
  dutyTypeItemContainer: {
    flexDirection: "column",
    gap: 10,
  },

  dutyTypeName: {
    color: "black",
  },
  dutyTypeNameContainer: {
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
  dutyTypeUserContainer: {
    gap: 10,
    paddingLeft: 16,
  },
  dutyTypeUser: {},
  dutyTypeUserName: {
    color: "black",
  },
  dutyTypeUserTeam: {
    color: "black",
    opacity: 0.75,
  },
});
