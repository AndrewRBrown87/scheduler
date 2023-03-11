import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment/index.js";
import { getAppointmentsForDay } from "helpers/selectors";
import { getInterview } from "helpers/selectors";
import { getInterviewersForDay } from "helpers/selectors";

export default function Application(props) {
  //useState initialization
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  //get list of appointments for the selected day
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  //get list of interviewers for the selected day
  const interviewers = getInterviewersForDay(state, state.day);

  //function for booking an interview
  const bookInterview = (id, interview) => {
    
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    return axios.put(`/api/appointments/${id}`, appointment)
    .then((response) => {
      setState({ ...state, appointments });
    });
  };

  //function for canceling an interview
  const cancelInterview = (id) => {

    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    return axios.delete(`/api/appointments/${id}`, appointment)
    .then((response) => {
      setState({ ...state, appointments });
    });
  };

  //function for setting the day state
  const setDay = day => setState({ ...state, day });

  //useEffect initialization
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    });
  }, []);

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
