export function getAppointmentsForDay(state, day) {
  //... returns an array of appointments for that day
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
  let interviewObject = interview;

  if (interviewObject === null) {
    return null;
  } else {
    interviewObject.interviewer = state.interviewers[interview.interviewer];
    return interviewObject;
  }
}