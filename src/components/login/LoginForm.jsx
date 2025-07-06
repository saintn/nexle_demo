import debounce from 'lodash/debounce';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, useNavigate } from 'react-router-dom';
import {
  Button,
  FormFeedback,
  FormGroup,
  Input,
  Label
} from 'reactstrap';

import { signinService } from '../../api/authServices';
import { login } from '../../store/slices/authSlice';

const LoginForm = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const validateForm = (data) => {
    const newErrors = {};
    if (!data.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!data.password) {
      newErrors.password = 'Password is required';
    } if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/.test(data.password))
      newErrors.password = 'Password is invalid';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    dispatch(login({ email: formData.email, password: formData.password }));
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    const isValidForm = Object.keys(validationErrors).length === 0 || (Object.keys(validationErrors).length === 1 && validationErrors.password === "Password is good");
    if (isValidForm) {
      try {
        const response = await signinService(formData);
        if (response.status === 200) {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          navigate('/dashboard');
        }

        console.log("Success:", response);
      } catch (error) {
        console.error("API error:", error);
      }
    }
  };

  const validateField = useCallback((name, value) => {
    let error = '';
    if (!value) {
      error = `${name[0].toUpperCase() + name.slice(1)} is required`;
    } else {
      if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
        error = 'Email is invalid';
      }
      if (name === 'password' && !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/.test(value)) {
        error = 'Password is invalid';
      }
    }

    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, []);


  const debouncedValidateField = useMemo(
    () => debounce((name, value) => validateField(name, value), 100),
    [validateField]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    debouncedValidateField(name, value);
  };

  return (
    <Form className="text-black" onSubmit={handleSubmit}>
      <h4 className="mb-3" style={{ color: '#5A537B' }}>Welcome to Entrance Test Interview</h4>
      <p className="text-muted mb-4" style={{ color: '#5A537B' }}>Please sign-in to your account and start the adventure</p>

      <FormGroup>
        <Label for="email">Email<span className="text-danger">*</span></Label>
        <Input
          type="email"
          name="email"
          id="email"
          placeholder="johndoe@gmail.com"
          value={formData.email}
          invalid={!!errors.email}
          onChange={handleInputChange}
          autoComplete="username"
        />
        <FormFeedback>{errors.email}</FormFeedback>
      </FormGroup>

      <FormGroup>
        <Label for="password">Password<span className="text-danger">*</span></Label>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="*********"
          value={formData.password}
          onChange={handleInputChange}
          autoComplete="new-password"
          invalid={!!errors.password}
        />
        <FormFeedback>{errors.password}</FormFeedback>
      </FormGroup>
      <FormGroup check className="mb-3">
        <Input type="checkbox" />
        <Label check>
          I agree to <Label style={{ color: "#7367F0" }}>Remember me</Label>
        </Label>

      </FormGroup>

      <Button style={{ backgroundColor: '#7367F0' }} block className="mb-3" type="submit" >
        Sign In
      </Button>

      <p className="text-center">
        New on our platform? <a href="signup" style={{ color: "#7367F0", textDecoration: "none" }}>Create an account</a>
      </p>

      <hr />

      <div className="d-flex justify-content-center gap-2">
        <Button color="primary" className="mx-1"><i className="fab fa-facebook-f"></i></Button>
        <Button color="info" className="mx-1"><i className="fab fa-twitter"></i></Button>
        <Button color="danger" className="mx-1"><i className="fas fa-envelope"></i></Button>
        <Button color="dark" className="mx-1"><i className="fab fa-github"></i></Button>
      </div>

    </Form>)
}

export default LoginForm