import { createContext, useEffect, useState } from "react";
import { AddEventModal } from "./components/AddEventModal";
import { ShowEventsModal } from "./components/ShowEventsModal";
import { Calendar } from "./components/Calendar";

export type Event = {
  id: string;
  name: string;
  allDay: boolean;
  date: Date;
  startTime: string;
  endTime: string;
  color: string;
};

type ContextType = {
  events: Event[];
  addEvents: ({
    name,
    allDay,
    date,
    startTime,
    endTime,
    color,
  }: {
    name: string;
    allDay: boolean;
    date: Date;
    startTime: string;
    endTime: string;
    color: string;
  }) => void;
  editEvents: ({ event }: { event: Event }) => void;
  delEvents: ({ id }: { id: string }) => void;
};

export const EventsContext = createContext<ContextType | null>(null);

export default function App() {
  const [today, setToday] = useState(new Date());
  const [eventAddDate, setEventAddDate] = useState<Date>();
  const [showEventsDate, setShowEventsDate] = useState<Date>();
  const [events, setEvents] = useState<Event[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | undefined>();

  useEffect(() => {
    setToday(new Date());
  }, []);

  function addEvents({
    name,
    allDay,
    date,
    startTime,
    endTime,
    color,
  }: {
    name: string;
    allDay: boolean;
    date: Date;
    startTime: string;
    endTime: string;
    color: string;
  }) {
    setEvents((prevEvents) => {
      return [
        ...prevEvents,
        {
          id: crypto.randomUUID(),
          name,
          allDay,
          date,
          startTime,
          endTime,
          color,
        },
      ];
    });
  }

  function editEvents({ event }: { event: Event }) {
    const eventToEdit = events.find((prevEvent) => prevEvent.id == event.id);

    setEvents((prevEvents) => {
      return prevEvents.map((prevEvent) => {
        if (prevEvent == eventToEdit) {
          return event;
        }
        return prevEvent;
      });
    });
  }

  function delEvents({ id }: { id: string }) {
    setEvents((prevEvents) => {
      return prevEvents.filter((event) => event.id != id);
    });
  }

  return (
    <EventsContext.Provider
      value={{ events, addEvents, editEvents, delEvents }}>
      <Calendar
        today={today}
        setEventAddDate={setEventAddDate}
        setShowEventsDate={setShowEventsDate}
      />
      {eventAddDate != null && (
        <AddEventModal
          eventAddDate={eventAddDate}
          setEventAddDate={setEventAddDate}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          eventToEdit={eventToEdit}
          setEventToEdit={setEventToEdit}
        />
      )}
      {showEventsDate != null && (
        <ShowEventsModal
          showEventsDate={showEventsDate}
          setShowEventsDate={setShowEventsDate}
          setIsEdit={setIsEdit}
          setEventAddDate={setEventAddDate}
          setEventToEdit={setEventToEdit}
        />
      )}
    </EventsContext.Provider>
  );
}
