import { Navigate, useOutletContext } from "react-router-dom";

import DashboardForm from "../components/dashboard/DashboardForm";

const Dashboard = () => {
  const { isAuthenticated } = useOutletContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardForm />
};

export default Dashboard;
