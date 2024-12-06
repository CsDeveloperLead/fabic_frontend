import { NavLink } from "react-router-dom";
import OrderForm from "./Order";

function Home() {
  return (
    <div className="w-full h-screen flex flex-col ">
      <div className="w-full flex justify-between">
        Home
        <NavLink to="/login">Login</NavLink>

      </div>
    </div>
  );
}

export default Home;
