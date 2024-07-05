import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { Event, EventsContext } from "../App";

type PropTypes = {
  eventAddDate: Date | undefined;
  setEventAddDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  eventToEdit: Event | undefined;
  setEventToEdit: React.Dispatch<React.SetStateAction<Event | undefined>>;
};

export function AddEventModal({
  eventAddDate,
  setEventAddDate,
  isEdit,
  setIsEdit,
  eventToEdit,
  setEventToEdit,
}: PropTypes) {
  const [name, setName] = useState(eventToEdit?.name || "");
  const [allDay, setAllDay] = useState(eventToEdit?.allDay || false);
  const [startTime, setStartime] = useState(eventToEdit?.startTime || "");
  const [endTime, setEndTime] = useState(eventToEdit?.endTime || "");
  const [color, setColor] = useState(eventToEdit?.color || "");

  const eventsContext = useContext(EventsContext);
  const addEvents = eventsContext?.addEvents;
  const editEvents = eventsContext?.editEvents;
  const delEvents = eventsContext?.delEvents;

  useEffect(() => {
    if (allDay) {
      setStartime("");
      setEndTime("");
    }
  }, [allDay]);

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    isEdit ? handleEdit() : handleAdd();
  }

  function handleAdd() {
    if (addEvents == null || eventAddDate == null) return;
    addEvents({ name, allDay, date: eventAddDate, startTime, endTime, color });
    setEventAddDate(undefined);
    setIsEdit(false);
    setEventToEdit(undefined);
  }

  function handleEdit() {
    if (eventToEdit == null || editEvents == null) return;
    editEvents({
      event: {
        id: eventToEdit.id,
        name,
        allDay,
        date: eventToEdit.date,
        startTime,
        endTime,
        color,
      },
    });
    setEventAddDate(undefined);
    setIsEdit(false);
    setEventToEdit(undefined);
  }

  function handleDelete() {
    if (eventToEdit == null || delEvents == null) return;
    delEvents({ id: eventToEdit.id });
    setEventAddDate(undefined);
    setIsEdit(false);
    setEventToEdit(undefined);
  }

  if (eventAddDate == null) return;
  return (
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-body">
        <div className="modal-title">
          <div>{isEdit ? "Edit Event" : "Add Event"}</div>
          <small>{format(eventAddDate, "(d/M/yy)")}</small>
          <button
            className="close-btn"
            onClick={() => {
              setEventAddDate(undefined);
              setIsEdit(false);
              setEventToEdit(undefined);
            }}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group checkbox">
            <input
              type="checkbox"
              name="all-day"
              id="all-day"
              checked={allDay}
              onChange={() => {
                setAllDay((c) => !c);
              }}
            />
            <label htmlFor="all-day">All Day?</label>
          </div>
          <div className="row">
            <div className="form-group">
              <label htmlFor="start-time">Start Time</label>
              <input
                type="time"
                name="start-time"
                id="start-time"
                disabled={allDay}
                value={startTime}
                onChange={(e) => {
                  setStartime(e.currentTarget.value);
                }}
                required={!allDay}
              />
            </div>
            <div className="form-group">
              <label htmlFor="end-time">End Time</label>
              <input
                type="time"
                name="end-time"
                id="end-time"
                disabled={allDay}
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.currentTarget.value);
                }}
                min={startTime}
                required={!allDay}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Color</label>
            <div className="row left">
              <input
                type="radio"
                name="color"
                value="blue"
                id="blue"
                className="color-radio"
                checked={color === "blue"}
                onChange={() => {
                  setColor("blue");
                }}
                required
              />
              <label htmlFor="blue">
                <span className="sr-only">Blue</span>
              </label>
              <input
                type="radio"
                name="color"
                value="red"
                id="red"
                className="color-radio"
                checked={color === "red"}
                onChange={() => {
                  setColor("red");
                }}
                required
              />
              <label htmlFor="red">
                <span className="sr-only">Red</span>
              </label>
              <input
                type="radio"
                name="color"
                value="green"
                id="green"
                className="color-radio"
                checked={color === "green"}
                onChange={() => {
                  setColor("green");
                }}
                required
              />
              <label htmlFor="green">
                <span className="sr-only">Green</span>
              </label>
            </div>
          </div>
          <div className="row">
            <button className="btn btn-success" type="submit">
              {isEdit ? "Save" : "Add"}
            </button>
            {isEdit && (
              <button
                className="btn btn-delete"
                type="button"
                onClick={handleDelete}>
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
