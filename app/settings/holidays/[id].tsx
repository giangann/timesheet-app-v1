import { HolidayCreateOrEdit } from "@/components/setting";
import { NunitoText } from "@/components/text/NunitoText";
import { useLocalSearchParams } from "expo-router";

export default function EditHoliday (){
    const local = useLocalSearchParams();
    const holidayId = parseInt(local.id as string);
  
    return (
        <>
            <HolidayCreateOrEdit holidayId={holidayId}/>
        </>
    )
}