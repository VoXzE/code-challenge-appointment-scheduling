import React, { useState } from "react";
import DatePicker from "react-datepicker";

const AppointmentBox = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const onChange = dates => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  
  return (
    <div className="appointment-container">
      <div className="header">Make your next appointment</div>
      <div className="content">
        <DatePicker
        selected={startDate}
        onChange={onChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
      />
      </div>
      
    </div>
  );
}

export default AppointmentBox;