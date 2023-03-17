import { useState, useEffect } from "react";
import axios from "axios";

//A custom hook used to manage state and actions used to change state
export default function useApplicationData() {
  
  //useState initialization
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  //function for setting the day state
  const setDay = day => setState({ ...state, day });

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

    //update days.spots when a new appointment is added
    const days = [];
    for (let i = 0; i < state.days.length; i++){
      days[i] = {...state.days[i]};
    }

    //check that appointment is being added (not edited)
    if(state.appointments[id].interview === null) {
      if (id <= 5) {
        days[0].spots--;
      } else if (id <= 10) {
        days[1].spots--;
      } else if (id <= 15) {
        days[2].spots--;
      } else if (id <= 20) {
        days[3].spots--;
      } else {
        days[4].spots--;
      }
    }
    
    return axios.put(`/api/appointments/${id}`, appointment)
    .then((response) => {
      setState({ ...state, appointments, days });
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

    //update days.spots when an appointment is canceled
    const days = [];

    for (let i = 0; i < state.days.length; i++){
      days[i] = {...state.days[i]};
    }

    if (id <= 5) {
      days[0].spots++;
    } else if (id <= 10) {
      days[1].spots++;
    } else if (id <= 15) {
      days[2].spots++;
    } else if (id <= 20) {
      days[3].spots++;
    } else {
      days[4].spots++;
    }

    return axios.delete(`/api/appointments/${id}`, appointment)
    .then((response) => {
      setState({ ...state, appointments, days });
    });
  };

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

  return { state, setDay, bookInterview, cancelInterview };
}