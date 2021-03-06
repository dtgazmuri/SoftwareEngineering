import React, { useState, useEffect } from "react";
import "./App.css";
import dayjs from "dayjs";
import { Form, Modal, Button, Container } from "react-bootstrap";

let newday;
function Clock(props) {
  useEffect(() => {
    if (!props.dirty) {
      setInterval(
        async () => props.setTime(dayjs().format("dddd DD/MMMM/YYYY HH:mm")),
        1000
      );
    } else {
      setInterval(
        async () =>
          props.setFakeTime(
            dayjs(props.faketime).add(1, "m").format("dddd DD/MMMM/YYYY HH:mm")
          ),
        60000
      );
    }
  }, [props]);

  return <>{!props.dirty ? props.time : props.faketime}</>;
}

function ModalDate(props) {
  const [newdate, setNewDate] = useState("");
  const [newtime, setNewTime] = useState("");
  const handleTime = (ev) => {
    setNewTime(ev.target.value);
    if (ev.target.value !== "") {
      if (newtime === "") setNewTime("12:00");
    }
    console.log(newtime);
  };

  const handleDate = (ev) => {
    setNewDate(ev.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    newday = dayjs(`${newdate} ${newtime}`).format("dddd DD/MMMM/YYYY HH:mm");
    props.setFakeTime(newday);
    props.setDirty(true);
    props.handleClose();
  };

  const setToday = () => {
    props.setDirty(false);
    props.handleClose();
  };
  return (
    <>
      <Modal show={props.show}>
        <Modal.Title>
          <Container className="d-flex justify-content-center align-items-center">
            <b>Pick a Date:</b>
          </Container>
        </Modal.Title>
        <Form>
          <Modal.Body>
            <Form.Group controlId="form-date">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                format="dd/MM/yyyy"
                value={newdate}
                onChange={handleDate}
              />
            </Form.Group>
            <Form.Group controlId="form-deadline-time">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={newtime}
                onChange={handleTime}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Container className="d-flex justify-content-center align-items-center">
              <Button variant="info" onClick={setToday}>
                Today
              </Button>
              &nbsp;&nbsp;
              <Button variant="primary" type="submit" onClick={handleSubmit}>
                Save
              </Button>
              &nbsp;&nbsp;
              <Button variant="secondary" onClick={props.handleClose}>
                Close
              </Button>
              &nbsp;&nbsp;
            </Container>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export { Clock, ModalDate };
