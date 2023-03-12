import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useRequest from "../../../hooks/useRequest";
import {
  DRIVERS_URL,
  DRIVERS_PROGRESS_URL,
  DRIVER_TYPE,
  DRIVER_STATUS,
  DRIVER_STATUS_COLOR,
  ACTIVITY_RANGE,
} from "../../../constants/constants";
import { fixDate, getChoice, dateToString, stringToDateTime } from "../../../functions/Functions";
import Loading from "../../common/Loading";
import Select from "../../common/Select";
import Input from "../../common/Input"
import ActivityCart from "../../common/ActivityCart";

const Driver = () => {
  const params = useParams();
  const request = useRequest(DRIVERS_URL + "?id=" + params.id);
  
  const [scale, setScale] = useState({
    choice: "r2",
    from: stringToDateTime("beginning week & no time"),
    to: stringToDateTime("today"),
  });

  const [customScale, setCustomScale] = useState({
    date_from: "",
    date_to: ""
  })

  const progressRequest = useRequest(
    `${DRIVERS_PROGRESS_URL}?id=${params.id}&from=${dateToString(scale.from, "%y-%m-%dT%H:%M:%S")}&to=${dateToString(scale.to, "%y-%m-%dT%H:%M:%S")}`
  );

  const handleScaleChange = ({ currentTarget: input }) => {
    const newScale = { ...scale };
    newScale[input.name] = input.value;
    switch(input.value) {
      case "r1":
        newScale.from = stringToDateTime("beginning week & 7 days before & no time")
        newScale.to = stringToDateTime("beginning week & no time")
        break;
      case "r2":
        newScale.from = stringToDateTime("beginning week & no time")
        newScale.to = stringToDateTime("today")
        break;
      case "r3":
        newScale.from = stringToDateTime("beginning month & 1 month before & no time")
        newScale.to = stringToDateTime("beginning month & no time")
        break;
      case "r4":
        newScale.from = stringToDateTime("beginning month & no time")
        newScale.to = stringToDateTime("today")
        break;
      default:
        console.log("value is out of chices!!!")
    }
    progressRequest.setUrl(
      `${DRIVERS_URL}?id=${params.id}&activity=True&from=${dateToString(scale.from, "%y-%m-%dT%H:%M:%S")}&to=${dateToString(scale.to, "%y-%m-%dT%H:%M:%S")}`
      );
    setScale(newScale);
  };

  const hanleCalendarChange = ({currentTarget: input}) => {
    const newCustomScale = { ...customScale };
    newCustomScale[input.name] = input.value;
    setCustomScale(newCustomScale)
  }

  const getCustomData = () => {
    if (customScale.date_from && customScale.date_to) {
      const newScale = { ...scale };
      newScale.from = stringToDateTime("tomorrow & no time", customScale.date_from)
      newScale.to = stringToDateTime("tomorrow & no time", customScale.date_to)
      setScale(newScale);
    }
  }

  useEffect(() => {
    request.getData();
  }, [])

  useEffect(() => {
    progressRequest.getData();
  }, [scale]);

  return (
    <div className="page-container">
      <div className="row">
        <h1>Driver</h1>
      </div>
      {request.isLoading ? (
        <Loading />
      ) : (
        request.data &&
        request.data.load && (
          <div className="row">
            <div className="info-container">
              <span>
                <b>Name: </b>
                {request.data.first_name}
              </span>
              <span>
                <b>Surname: </b>
                {request.data.last_name}
              </span>
              <span>
                <b>Date joined: </b>
                {fixDate(request.data.date_joined)}
              </span>
              <span>
                <b>Type: </b>
                {getChoice(request.data.driver_type, DRIVER_TYPE)}
              </span>
              <span>
                <b>Status: </b>
                {getChoice(request.data.status, DRIVER_STATUS)}
              </span>
              <span>
                <b>Weekly gross: </b>
                {}
              </span>
              <span>
                <b>Weekly loads: </b>
                {}
              </span>
              <span>
                <b>Weekly RPM: </b>
                {}
              </span>
            </div>
            <div className="info-container">
              <span>
                <b>Current load: </b>
                {request.data.load ? request.data.load.bol_number : "no load"}
              </span>
              <span>
                <b>load PCS number: </b>
                {request.data.load.pcs_number}
              </span>
              <span>
                <b>Carrier name: </b>
                {request.data.carrier_name}
              </span>
              <span>
                <b>Origin: </b>
                {request.data.load.origin +
                  ", " +
                  request.data.load.origin_state}
              </span>
              <span>
                <b>Destination: </b>
                {request.data.load.destination +
                  ", " +
                  request.data.load.destination_state}
              </span>
              <span>
                <b>Miles: </b>
                {request.data.load.total_miles + " mile"}
              </span>
            </div>
            <div className="info-container">
              <span>
                <b>Truck: </b>
                {}
              </span>
              <span>
                <b>Current location: </b>
                {}
              </span>
              <span>
                <b>Trailer: </b>
                {}
              </span>
            </div>
            <div className="info-container">
              <span>
                <b>Dispatcher: </b>
                {}
              </span>
              <span>
                <b>Driver Preference: </b>
              </span>
              <span>{}</span>
            </div>
          </div>
        )
      )}
      {
        progressRequest.isLoading ? <p>loading...</p> :
      (
        <ActivityCart
          data={{
            from: scale.from,
            to: scale.to,
            charts: progressRequest.data,
            colors: DRIVER_STATUS_COLOR,
            colorChoices: DRIVER_STATUS
          }}
        />
      )}
      <div className="row"> 
        <Select
          name="choice"
          selections={ACTIVITY_RANGE}
          isObject={true}
          value={scale.choice}
          label="Quick choices"
          onChange={handleScaleChange}
          error={""}
        />
        <Input  
          name="date_from"
          type="date"
          value={customScale.date_from} //dateToString(scale.from, "%y-%m-%d")
          label="From"
          onChange={hanleCalendarChange}
          error={""}
        />
        <Input
          name="date_to"
          type="date"
          value={customScale.date_to}
          label="To"
          onChange={hanleCalendarChange}
          error={""}
        />
        <button className="button" onClick={getCustomData}>Get data</button>
        <div></div>
      </div>
    </div>
  );
};

export default Driver;
