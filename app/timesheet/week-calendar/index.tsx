import { TeamWeekCalendar } from "@/components/timesheet";
import { EventDetailModal } from "@/components/timesheet/EventDetailModal";
import { EventItem, OnEventResponse } from "@howljs/calendar-kit";
import { useState } from "react";

export default function WeekCalendar() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>();

  const onCloseModal = () => setOpenModal(false);
  const onOpenModal = () => setOpenModal(true);

  const onEventSelected = (event: OnEventResponse) => {
    console.log("Selected Event:", event); // Debugging line
    // onOpenModal();
    // setSelectedEvent(event);
  };
  return (
    <>
      <TeamWeekCalendar onEventSelected={onEventSelected} />
      {openModal && <EventDetailModal event={selectedEvent} onClose={onCloseModal} />}
    </>
  );
}
