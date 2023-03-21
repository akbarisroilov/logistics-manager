import { useNavigate } from "react-router";
import { GiAnticlockwiseRotation } from "react-icons/gi";
import { BiUser } from "react-icons/bi";
import { BsPencil } from "react-icons/bs";
import { TRAILER_STATUS } from "../../../constants/constants";
import { getNumber, getChoice } from "../../../functions/Functions";

const TrailersTable = ({ trailers, units, handleEdit, handleUpdates }) => {
    const navigate = useNavigate();
    return (
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>№</th>
              <th>Number</th>
              <th>Status</th>
              <th>Attached truck</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trailers.map((trailer, index) => {
              return (
                <tr key={trailer.id}>
                  <td>{index + 1}</td>
                  <td>{trailer.number}</td>
                  <td>{getChoice(trailer.status, TRAILER_STATUS)}</td>
                  <td>{getNumber(trailer.unit, units)}</td>
                  <td>{trailer.notes}</td>
                  <td>
                    <div className="actions">
                      <div
                        className="icon-holder"
                        title="edit"
                        onClick={() => {
                          handleEdit(trailer);
                        }}
                      >
                        <BsPencil className="icon edit" />
                      </div>
                      <div
                        className="icon-holder"
                        title="see all updates"
                        onClick={() => {
                          navigate("/trailer/" + trailer.id);
                        }}
                      >
                        <BiUser className="icon profile" />
                      </div>
                      <div
                        className="icon-holder"
                        title="see all updates"
                        onClick={() => {
                          handleUpdates(trailer);
                        }}
                      >
                        <GiAnticlockwiseRotation className="icon clock" />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
}

export default TrailersTable