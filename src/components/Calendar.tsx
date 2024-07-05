import {
  addMonths,
  compareAsc,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDate,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useContext, useState } from "react";
import { EventsContext } from "../App";

type PropTypes = {
  today: Date;
  setEventAddDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setShowEventsDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

export function Calendar({
  today,
  setEventAddDate,
  setShowEventsDate,
}: PropTypes) {
  const [currentMonth, setCurrentMonth] = useState(today);

  const eventsContext = useContext(EventsContext);
  if (eventsContext == null) return;
  const events = eventsContext.events;

  function showPreviousMonth() {
    setCurrentMonth((cur) => {
      return addMonths(cur, -1);
    });
  }

  function showNextMonth() {
    setCurrentMonth((cur) => {
      return addMonths(cur, 1);
    });
  }

  function goToday() {
    setCurrentMonth(today);
  }

  const visibleDates = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  return (
    <div className="calendar">
      <div className="header">
        <button className="btn" onClick={goToday}>
          Today
        </button>
        <div>
          <button className="month-change-btn" onClick={showPreviousMonth}>
            &lt;
          </button>
          <button className="month-change-btn" onClick={showNextMonth}>
            &gt;
          </button>
        </div>
        <span className="month-title">
          {format(currentMonth, "MMMM")} {format(currentMonth, "yyyy")}
        </span>
      </div>
      <div className="days">
        {visibleDates.map((date, idx) => {
          const nonMonthDay = isSameMonth(date, currentMonth)
            ? undefined
            : "non-month-day";

          const oldMonthDay =
            compareAsc(date, currentMonth) == -1 && !isToday(date)
              ? "old-month-day"
              : undefined;

          const todayClass = isToday(date) ? "today" : undefined;
          return (
            <div
              key={date.toString()}
              className={`day ${nonMonthDay} ${oldMonthDay}`}>
              <div className="day-header">
                {idx < 7 && (
                  <div className="week-name">
                    {format(date, "iii").toUpperCase()}
                  </div>
                )}
                <div className={`day-number ${todayClass}`}>
                  {getDate(date)}
                </div>
                <button
                  className="add-event-btn"
                  onClick={() => {
                    setEventAddDate(date);
                  }}>
                  +
                </button>
                <div
                  className="events"
                  onClick={() => {
                    setShowEventsDate(date);
                  }}>
                  {events
                    .filter(
                      (event) => isSameDay(event.date, date) && event.allDay
                    )
                    ?.sort((a, b) => a.name.localeCompare(b.name))
                    ?.map((event) => (
                      <button
                        key={event.id}
                        className={`event ${event.allDay && "all-day-event"} ${
                          event.color
                        }`}>
                        {!event.allDay && (
                          <div className={`color-dot ${event.color}`}></div>
                        )}
                        {!event.allDay && (
                          <div className="event-time">
                            {parseInt(event.startTime.split(":")[0]) >= 12
                              ? `${
                                  parseInt(event.startTime.split(":")[0]) - 12
                                }pm`
                              : `${parseInt(event.startTime.split(":")[0])}am`}
                          </div>
                        )}
                        <div className="event-name">{event.name}</div>
                      </button>
                    ))}
                  {events
                    .filter(
                      (event) => isSameDay(event.date, date) && !event.allDay
                    )
                    ?.sort((a, b) => {
                      if (a.startTime === b.startTime) {
                        return a.name.localeCompare(b.name);
                      }
                      return a.startTime.localeCompare(b.startTime);
                    })
                    ?.map((event) => (
                      <button
                        key={event.id}
                        className={`event ${event.allDay && "all-day-event"} ${
                          event.color
                        }`}>
                        {!event.allDay && (
                          <div className={`color-dot ${event.color}`}></div>
                        )}
                        {!event.allDay && (
                          <div className="event-time">
                            {parseInt(event.startTime.split(":")[0]) >= 12
                              ? `${
                                  parseInt(event.startTime.split(":")[0]) - 12
                                }pm`
                              : `${parseInt(event.startTime.split(":")[0])}am`}
                          </div>
                        )}
                        <div className="event-name">{event.name}</div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
