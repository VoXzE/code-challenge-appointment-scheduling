import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import TimePicker from "../TimePicker";
import { useParams } from "react-router-dom";
import { getUserByUUID, createNewAppointment } from "../../sdk";
import { useHistory } from "react-router-dom";

import "./index.scss"

const AppointmentBox = () => {
  const history = useHistory();
  const { userId } = useParams()
  const [infoStep, setInfoStep] = useState(false);

  // Date related state
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState<string | null>(null);

  // Info related state ex(name, desc)
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<null | string>(null);

  
  // Handle changing date
  const onChangeDate = date => setDate(date);

  // handle switching to input form
  const handleNextStep = () => {
    if (!time) {
      return console.log("Please select a time");
    }

    // If infostep is already true that means we want to submit the form
    if (infoStep) {
      return submitAppointment();
    }

    setInfoStep(true);
  }

  // Check if all inputs have a value
  // Then calls firebase cloud function to create new appointment
  // Entry in the firestore db
  const submitAppointment = async () => {
    if (name === "") return setError("Please provide a name");
    if (phoneNumber === "") return setError("Please provide a phone number");
    if (description === "") return setError("Please provide a description");
    
    const payload = {
      name: name,
      time: time,
      date: date.toDateString(),
      pending: true,
      accepted: false,
      appointmentWith: userId,
      phoneNumber: phoneNumber,
      description: description,
    }

    try {
      await createNewAppointment(payload)
      setError(null);
    } catch (error) {
      setError(error.message)
    }
  }

  const checkIfValidUser = async () => {
    const doesExist = await getUserByUUID(userId);
    if (!doesExist) {
      history.push("/")
    }
  }

  // On mount of component lets check if the userId provided is a valid user
  useEffect(() => {
    checkIfValidUser()
  }, []);
  
  
  return (
    <div className="appointment-container">
      <div className="header">Make your next appointment</div>

      {!infoStep &&
        <div className="content">
          <DatePicker
            selected={date}
            onChange={onChangeDate}
            inline/>
          <TimePicker selected={time} onChange={setTime} />
        </div>
      }

      {infoStep && 
        <div className="content">
          <form className="appointment-info">
            <label>Fullname</label>
            <input placeholder="Enter Fullname" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <label>Phone Number</label>
            <input placeholder="Enter Phonenumber" type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <label>Description</label>
            <textarea placeholder="Brief description for appointment" value={description} onChange={(e) => setDescription(e.target.value)} />
          </form>
          {error && <p className="error-text">{error}</p> }
        </div>
      }

      <div className="buttons">
        <button className="blue-btn" onClick={handleNextStep}>Next</button>
      </div> 

    </div>
  );
}

export default AppointmentBox;
