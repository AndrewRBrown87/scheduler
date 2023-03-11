import React from "react";

import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment/index.js";
import { getAppointmentsForDay } from "helpers/selectors";
import { getInterview } from "helpers/selectors";
import { getInterviewersForDay } from "helpers/selectors";
import useApplicationData from "hooks/useApplicationData";

export default function Application(props) {
  
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  //get list of interviewers for the selected day
  const interviewers = getInterviewersForDay(state, state.day);

  //get list of appointments for the selected day
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  //create array of Appointment components
  const appointmentsArray = Object.values(dailyAppointments).map((appointmentObject) => {
    const interview = getInterview(state, appointmentObject.interview);
    
    return (
      <Appointment 
        key={appointmentObject.id}
        id={appointmentObject.id}
        time={appointmentObject.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={(id, interview) => bookInterview(id, interview)}
        cancelInterview={(id) => cancelInterview(id)}
      />
    );
  })

  appointmentsArray.push(<Appointment key="last" time="5pm" />)

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
        <DayList
          days={state.days}
          value={state.day}
          onChange={setDay}
        />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentsArray}
      </section>
    </main>
  );
}
