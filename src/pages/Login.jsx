import { Navigate, useOutletContext } from 'react-router-dom';

import LoginForm from '../components/login/LoginForm';
import AuthComponent from '../components/shared/AuthComponent';

const Login = () => {
  const { isAuthenticated } = useOutletContext();
  if (isAuthenticated) return <Navigate to="/dashboard" />;

  return (
    <AuthComponent backgroundImage="/images/signup_bg_img.png">
      <LoginForm />
    </AuthComponent>
  );
};

export default Login;
