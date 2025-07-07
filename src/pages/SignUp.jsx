import { Navigate, useOutletContext } from 'react-router-dom';

import AuthComponent from '../components/shared/AuthComponent';
import SignUpForm from '../components/signup/SignUpForm';

const Register = () => {
  const { isAuthenticated } = useOutletContext();
  if (isAuthenticated) return <Navigate to="/dashboard" />;

  return (
    <AuthComponent backgroundImage="/images/login_bg_img.png">
      <SignUpForm />
    </AuthComponent>
  );
};

export default Register;
