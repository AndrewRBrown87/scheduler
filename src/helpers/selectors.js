export function getAppointmentsForDay(state, day) {
  //returns an array of appointments for that day
  let appointments = [];
  let appointmentDetails = [];

  //find appointments for selected day
  for (let dayOfState of state.days) {
    if (dayOfState.name === day) {
      appointments = dayOfState.appointments;
    }
  }

  //find appointment details
  for (let appointment of appointments) {
    appointmentDetails.push(state.appointments[appointment]);
  }

  return appointmentDetails;
}

export function getInterview(state, interview) {
  //returns an interviewObject with the interviewer name
  let interviewObject = {};
  interviewObject = {...interview};

  if (interview === null) {
    return null;
  } else {
    interviewObject.interviewer = state.interviewers[interview.interviewer];
    return interviewObject;
  }
}

export function getInterviewersForDay(state, day) {
  //returns an array of interviewers for that day
  let interviewers = [];
  let interviewersDetails = [];

  //find interviewers for selected day
  for (let dayOfState of state.days) {
    if (dayOfState.name === day) {
      interviewers = dayOfState.interviewers;
    }
  }

  //find interviewer details
  for (let interviewer of interviewers) {
    interviewersDetails.push(state.interviewers[interviewer]);
  }

  return interviewersDetails;
}