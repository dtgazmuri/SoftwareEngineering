import React, { useState, useEffect } from 'react';
import './App.css';
import dayjs from 'dayjs';

let newday;
function Clock(props) {
    useEffect(() => {
        setInterval(async () => props.setTime(dayjs().format("dddd DD/MMMM/YYYY HH:mm")), 1000);
    }, [props]);

    return (<>
        {props.time}
    </>)
}
export { Clock};

