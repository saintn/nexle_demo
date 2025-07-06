import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return <Outlet context={{ isAuthenticated }} />;
};

export default App;
