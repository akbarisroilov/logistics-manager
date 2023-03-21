import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import useRequest from "../../../hooks/useRequest";
import TrailersTable from "./TrailersTable";
import TrailerForm from "./TrailerForm";
import Loading from "../../common/Loading";
import {
  TRAILERS_URL,
  USERS_LIST_URL,
  DISPATCHERS_LIST_URL,
} from "../../../constants/constants";

const Trailers = () => {
    const request = useRequest(TRAILERS_URL);
    // const usersRequest = useRequest(USERS_LIST_URL);
    // const dispatchersRequest = useRequest(DISPATCHERS_LIST_URL);
  
    useEffect(() => {
      request.getData();
    //   usersRequest.getData();
    //   dispatchersRequest.getData();
    }, []);
  
    const [formOpen, setFormOpen] = useState(false);
    const [updatesOpen, setUpdatesOpen] = useState(false);
    const [edit, setEdit] = useState({});
    const [method, setMethod] = useState("POST");
  
    const closeForm = ({ reload }) => {
      setFormOpen(false);
      if (reload) {
        request.getData();
        // usersRequest.getData();
        // dispatchersRequest.getData();
      }
    };
    const closeUpdates = () => {
      setUpdatesOpen(false);
    };
    const handleEdit = (driver) => {
      setEdit(driver);
      setMethod("PUT");
      setUpdatesOpen(false);
      setFormOpen(true);
    };
    const handleUpdates = (driver) => {
      setEdit(driver);
      setFormOpen(false);
      setUpdatesOpen(true);
    };
  
    return (
      <div className="page-container">
        <div className="row">
          <h1>Trailers</h1>
          <button
            className="button"
            onClick={() => {
              setMethod("POST");
              setUpdatesOpen(false);
              setFormOpen(true);
            }}
          >
            New Trailer
          </button>
        </div>
        {request.isLoading ? (
          <Loading />
        ) : (
          <TrailersTable
            trailers={request.data}
            units={[]}
            handleEdit={handleEdit}
            handleUpdates={handleUpdates}
          />
        )}
        <AnimatePresence initial={false}>
          {formOpen && (
            <TrailerForm
              closeForm={closeForm}
              units={[]}
              method={method}
              edit={edit}
            />
          )}
        </AnimatePresence>
        {/* <AnimatePresence initial={false}>
          {updatesOpen && (
            <DriverUpdates
              dispatchers={dispatchersRequest.data}
              users={usersRequest.data}
              closeUpdates={closeUpdates}
              edit={edit}
            />
          )}
        </AnimatePresence> */}
      </div>
    );
}

export default Trailers