import React from 'react'
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';
import useVisualMode from 'hooks/useVisualMode';

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRMING = "CONFIRMING";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  // useVisualMode helpers
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  )
  
  // function to save an interview
  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    props.bookInterview(props.id, interview)
    .then (() => {transition(SHOW)})
    .catch (error => {transition(ERROR_SAVE, true)});
  }

  // function to delete an interview
  const cancel = () => {
    transition(DELETING, true);

    props.cancelInterview(props.id)
    .then (() => {transition(EMPTY)})
    .catch (error => {transition(ERROR_DELETE, true)});
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRMING)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={(name, interviewer) => save(name, interviewer)}
        />
      )}
      {mode === SAVING && <Status message='Saving' />}
      {mode === DELETING && <Status message='Deleting' />}
      {mode === CONFIRMING && (
        <Confirm
          message='Are you sure you would like to delete?'
          onCancel={() => back()} 
          onConfirm={() => cancel()} 
        />
      )}
      {mode === EDIT && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={(name, interviewer) => save(name, interviewer)}
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
        />
      )}
      {mode === ERROR_SAVE && <Error message='Could not save appointment' onClose={() => back()} />}
      {mode === ERROR_DELETE && <Error message='Could not delete appointment' onClose={() => back()} />}
    </article>
  );
}