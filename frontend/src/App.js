import { Route, Routes } from "react-router-dom";
import { ROLES } from "./constants/constants";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Missing from "./components/Missing";
import GrossBoard from "./components/pages/GrossBoard/GrossBoard";
import Trailers from "./components/pages/Trailers/Trailers";
import Users from "./components/pages/Users/Users";
import Drivers from "./components/pages/Drivers/Drivers";
import Driver from "./components/pages/Drivers/Driver";
import Carriers from "./components/pages/Carriers/Carriers";
import Accounting from "./components/pages/Accounting/Accounting";
import DriversGross from "./components/pages/DriversGross/DriversGross";
import Logs from "./components/pages/Logs/Logs";
import Log from "./components/pages/Logs/Log";
import Actions from "./components/pages/Actions/Actions";
import Unauthorized from "./components/Unauthorized";
import RequireAuth from "./components/RequireAuth";
import "./styles/App.css";
import "./styles/index.css";
import "./styles/home.css";
import "./styles/eld.css";
import "./styles/charts.css";
// import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <div id="App" className="App">
      <Routes>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />

        {/* protected routes */}
        <Route path="/" element={<Layout />}>
          <Route element={<RequireAuth allowedRoles={[ROLES.Owner, ROLES.Admin, ROLES.Dispatcher, ROLES.Updater]} />}>
            <Route path="gross-board" element={<GrossBoard />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="driver/:id" element={<Driver />} />
            <Route path="users" element={<Users />} />
            <Route path="trailers" element={<Trailers />} />
            <Route path="carriers" element={<Carriers />} />
            <Route path="actions" element={<Actions />} />
            <Route path="logs" element={<Logs />} />
            <Route path="logs/:id/:date" element={<Log />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Owner, ROLES.Admin]} />}>
            <Route path="accounting" element={<Accounting />} />
            <Route path="driver-gross" element={<DriversGross />} />
          </Route>
          <Route path="/unauthorized" element={<Unauthorized />} />
          {/* catch all */}
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
