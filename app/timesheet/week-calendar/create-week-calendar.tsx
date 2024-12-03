import { NunitoText } from "@/components/text/NunitoText";
import { WeekCalendarCreate } from "@/components/week-calendar";
import { WeekCalendarCreateProvider } from "@/providers/WeekCalendarCreateProvider";

export default function CreateWeekCalendar (){
    return (
        <WeekCalendarCreateProvider>
            <WeekCalendarCreate/>
        </WeekCalendarCreateProvider>
    )
}