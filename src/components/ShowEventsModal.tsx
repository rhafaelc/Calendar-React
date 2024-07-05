import { format, isSameDay } from "date-fns";
import { useContext } from "react";
import { Event, EventsContext } from "../App";

type PropTypes = {
  showEventsDate: Date | undefined;
  setShowEventsDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setEventAddDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setEventToEdit: React.Dispatch<React.SetStateAction<Event | undefined>>;
};

export function ShowEventsModal({
  showEventsDate,
  setShowEventsDate,
  setIsEdit,
  setEventAddDate,
  setEventToEdit,
}: PropTypes) {
  const eventsContext = useContext(EventsContext);
  if (
    eventsContext == null ||
    showEventsDate == null ||
    setEventAddDate == null
  )
    return;

  const events = eventsContext.events;

  const eventsSelectedAllDay = events
    ?.filter((event) => {
      return isSameDay(event.date, showEventsDate) && event.allDay;
    })
    ?.sort((a, b) => a.name.localeCompare(b.name));

  const eventsSelectedTimed = events
    ?.filter((event) => {
      return isSameDay(event.date, showEventsDate) && !event.allDay;
    })
    ?.sort((a, b) => {
      if (a.startTime === b.startTime) {
        return a.name.localeCompare(b.name);
      }
      return a.startTime.localeCompare(b.startTime);
    });

  const eventsSelected = [...eventsSelectedAllDay, ...eventsSelectedTimed];

  function handleEdit(event: Event) {
    setEventToEdit(event);
    setShowEventsDate(undefined);
    setIsEdit(true);
    setEventAddDate(event.date);
  }

  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-body">
        <div className="modal-title">
          {format(showEventsDate, "d/M/yy")}
          <button
            className="close-btn"
            onClick={() => {
              setShowEventsDate(undefined);
            }}>
            &times;
          </button>
        </div>
        <div className="events">
          {eventsSelected.map((event) => {
            return (
              <button
                key={event.id}
                className={`event ${event.allDay && "all-day-event"} ${
                  event.color
                }`}
                onClick={() => {
                  handleEdit(event);
                }}>
                {!event.allDay && (
                  <div className={`color-dot ${event.color}`}></div>
                )}
                {!event.allDay && (
                  <div className="event-time">
                    {parseInt(event.startTime.split(":")[0]) >= 12
                      ? `${parseInt(event.startTime.split(":")[0]) - 12}pm`
                      : `${parseInt(event.startTime.split(":")[0])}am`}
                  </div>
                )}
                <div className="event-name">{event.name}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
