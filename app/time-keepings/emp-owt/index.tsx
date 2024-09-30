import { DownloadExcel } from "@/components/DownloadExcel";
import { FormInput } from "@/components/FormInput";
import { FormSelectV2 } from "@/components/FormSelectV2";
import moment from "moment";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type TEmpOwtForm = {
  userIdentifyCard: number;
  month: number | null;
  year: number | null;
  fileName: string | null;
};
const startYear = 2024;
const currYear = moment(Date.now()).get("year");
const currMonth = moment(Date.now()).get("month") + 1;
const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const years = getAbleYears(startYear, currYear);

const baseUrl = "https://proven-incredibly-redbird.ngrok-free.app/api/v1";
const endpoint = "/users/export-user-overtime-working";

export default function EmpOwt() {
  const { control, watch, setValue } = useForm<TEmpOwtForm>({
    defaultValues: { year: currYear, month: currMonth, fileName: "ngoai-gio-ca-nhan" },
  });

  const yearOpts = years.map((year) => ({ label: year.toString(), value: year }));
  const monthOpts = months.map((month) => ({ label: `Tháng ${month}`, value: month }));

  const month = watch("month") ?? currMonth;
  const year = watch("year") ?? currYear;
  const queryString = `month=${month}&year=${year}`;

  const url = `${baseUrl}${endpoint}?${queryString}`;

  useEffect(() => {
    setValue("fileName", `ngoai-gio-ca-nhan-t${watch("month")}-${watch("year")}`);
  }, [watch("month"), watch("year")]);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent}>
        {/* Fields */}
        <FormSelectV2 useControllerProps={{ control: control, name: "userIdentifyCard" }} label="Cá nhân" placeholder="Chọn cá nhân" />

        <View style={styles.monthYearContainer}>
          <View style={styles.monthYearItem}>
            <FormSelectV2 useControllerProps={{ control: control, name: "year" }} label="Năm" placeholder="Chọn năm" required options={yearOpts} />
          </View>
          <View style={styles.monthYearItem}>
            <FormSelectV2
              useControllerProps={{ control: control, name: "month" }}
              label="Tháng"
              placeholder="Chọn tháng"
              required
              options={monthOpts}
            />
          </View>
        </View>
        <FormInput formInputProps={{ control: control, name: "fileName" }} label="Tên file" required />

        {/* Download Button */}
        <DownloadExcel
          month={watch("month") ?? currMonth}
          year={watch("year") ?? currYear}
          url={url}
          fileName={watch("fileName")}
          buttonContainerStyles={{ position: "static", paddingHorizontal: 0, paddingTop: 24 }}
        />
      </KeyboardAwareScrollView>
    </View>
  );
}

function getAbleYears(startYear: number, currYear: number) {
  const ableYears = [];
  for (let year = startYear; year <= currYear; year++) {
    ableYears.push(year);
  }
  return ableYears;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
  },

  monthYearContainer: {
    flexDirection: "row",
    gap: 12,
  },
  monthYearItem: {
    flexGrow: 1,
  },
});
