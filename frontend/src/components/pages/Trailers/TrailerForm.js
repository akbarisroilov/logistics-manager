import { useState, useEffect } from "react";
import {
  TRAILERS_URL,
  TRAILER_STATUS
} from "../../../constants/constants";
import useRequest from "../../../hooks/useRequest";
import Form from "../../common/Form";
import Input from "../../common/Input";
import Select from "../../common/Select";
import LoadingButton from "../../common/LoadingButton";

const TrailerForm = ({ closeForm, units, method, edit }) => {
  const { errors, postPutData, isLoading } = useRequest(TRAILERS_URL);

  const [errMsg, setErrMsg] = useState("");

  const [log, setLog] = useState(
    method === "PUT"
      ? {
          ...edit,
        }
      : {
          number: "",
          unit: "",
          status: "rea",
          notes: "",
        }
  );

  // preparing dispatchers selections for the form
  // const DISPATCHERS = [];
  // DISPATCHERS.push(["", "--------"]);
  // for (let dispatcher of dispatchers) {
  //   DISPATCHERS.push([dispatcher.id, dispatcher.username]);
  // }

  const handleChange = ({ currentTarget: input }) => {
    const newLog = { ...log };
    if (input.type == "checkbox") {
      newLog[input.name] = !newLog[input.name];
    } else {
      newLog[input.name] = input.value;
    }
    setLog(newLog);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    // post or put to server
    console.log("submitted", method);
    console.log(log);
    postPutData(method, log, closeForm);
  };
  const handelCancel = (e) => {
    e.preventDefault();
    closeForm({ reload: false });
  };

  return (
    <Form>
      <div className="row">
        {method == "POST" ? <h1>Add new trailer</h1> : <h1>Update trailer</h1>}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <Input
            name="number"
            type="text"
            value={log.number}
            label="Trailer number"
            onChange={handleChange}
            error={errors.number}
          />
          <Select
            name="unit"
            selections={[]}
            isObject={true}
            value={log.unit}
            label="Unit"
            onChange={handleChange}
            error={errors.unit}
          />
        </div>
        <div className="row">
          <Select
            name="status"
            selections={TRAILER_STATUS}
            isObject={true}
            value={log.status}
            label="Status"
            onChange={handleChange}
            error={errors.status}
          />
          <Input
            name="notes"
            type="text"
            value={log.notes}
            label="Notes"
            onChange={handleChange}
            error={errors.notes}
          />
        </div>

        <p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
          {errMsg}
        </p>
        <div className="buttons">
          <div>
            {isLoading ? <LoadingButton /> : <button>OK</button>}
            <button onClick={handelCancel}>Cancel</button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default TrailerForm;
