import debounce from 'lodash/debounce';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, useNavigate } from 'react-router-dom';
import {
  Button,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';

import { signinService, signupService } from '../../api/authServices';
import { login } from '../../store/slices/authSlice';

const SignUpForm = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const dispatch = useDispatch();

  const validateField = useCallback((name, value) => {
    let error = '';

    if (!value) {
      error = `${name[0].toUpperCase() + name.slice(1)} is required`;
    } else {
      switch (name) {
        case 'email':
          if (!/\S+@\S+\.\S+/.test(value)) error = 'Email is invalid';
          break;
        case 'password':
          if (value.length < 6) error = 'Password is weak';
          else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/.test(value))
            error = 'Password is fair';
          else error = 'Password is good';
          break;
        default:
          break;
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const debouncedValidateField = useMemo(
    () => debounce(validateField, 100),
    [validateField]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    debouncedValidateField(name, value);
  };

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.firstName) newErrors.firstName = 'First name is required';
    if (!data.lastName) newErrors.lastName = 'Last name is required';

    if (!data.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!data.password) {
      newErrors.password = 'Password is required';
    } else if (data.password.length < 6) {
      newErrors.password = 'Password is weak';
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/.test(data.password)) {
      newErrors.password = 'Password is fair';
    } else {
      newErrors.password = 'Password is good';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    const isValidForm =
      Object.keys(validationErrors).length === 0 ||
      (Object.keys(validationErrors).length === 1 &&
        validationErrors.password === 'Password is good');

    if (isValidForm) {
      try {
        const response = await signupService(formData);
        if (response.status === 201) {
          dispatch(login({ email: formData.email, password: formData.password }));
          const loginResponse = await signinService({
            email: formData.email,
            password: formData.password,
          });
          if (response.status === 201) {
            localStorage.setItem('accessToken', loginResponse.data.accessToken);
            localStorage.setItem('refreshToken', loginResponse.data.refreshToken);
            navigate('/dashboard');
          }
        }
      } catch (error) {
        console.error('API error:', error);
      }
    }
  };

  const hasValidationErrors = useMemo(
    () =>
      hasSubmitted &&
      Object.values(errors).some((e) => e && e !== 'Password is good'),
    [errors, hasSubmitted]
  );

  const renderInput = (name, label, type = 'text', autoComplete = '') => (
    <FormGroup>
      <Label for={name}>
        {label} <span className="text-danger">*</span>
      </Label>
      <Input
        type={type}
        name={name}
        id={name}
        placeholder={label.toLowerCase()}
        value={formData[name]}
        onChange={handleInputChange}
        autoComplete={autoComplete}
        invalid={!!errors[name] && (name !== 'password' || errors[name] !== 'Password is good')}
      />
      {name === 'password' ? (
        <>
          {(errors.password === 'Password is weak' || errors.password === 'Password is fair') && (
            <FormFeedback
              className={
                errors.password === 'Password is fair'
                  ? 'text-warning'
                  : 'text-danger'
              }
            >
              {errors.password}
            </FormFeedback>
          )}
          {errors.password === 'Password is good' && (
            <div className="mt-1 text-primary small">{errors.password}</div>
          )}
        </>
      ) : (
        <FormFeedback>{errors[name]}</FormFeedback>
      )}
    </FormGroup>
  );

  return (
    <Form className="text-black" onSubmit={handleSubmit}>
      <h4 className="mb-3" style={{ color: '#5A537B' }}>Adventure starts here</h4>
      <p className="text-muted mb-4" style={{ color: '#5A537B' }}>
        Make your app management easy and fun!
      </p>

      <Row>{renderInput('firstName', 'First Name')}</Row>
      <Row>{renderInput('lastName', 'Last Name')}</Row>
      {renderInput('email', 'Email', 'email', 'username')}
      {renderInput('password', 'Password', 'password', 'new-password')}

      <FormGroup check className="mb-3">
        <Input type="checkbox" />
        <Label check>
          I agree to{' '}
          <Label style={{ color: '#7367F0' }}>privacy policy & terms</Label>
        </Label>
      </FormGroup>

      <Button
        style={{ backgroundColor: '#7367F0' }}
        block
        className="mb-3"
        type="submit"
        disabled={hasValidationErrors}
      >
        Sign Up
      </Button>

      <p className="text-center">
        Already have an account?{' '}
        <a href="login" style={{ color: '#7367F0', textDecoration: 'none' }}>
          Sign in instead
        </a>
      </p>

      <hr />

      <div className="d-flex justify-content-center gap-2">
        <Button color="primary" className="mx-1">
          <i className="fab fa-facebook-f"></i>
        </Button>
        <Button color="info" className="mx-1">
          <i className="fab fa-twitter"></i>
        </Button>
        <Button color="danger" className="mx-1">
          <i className="fas fa-envelope"></i>
        </Button>
        <Button color="dark" className="mx-1">
          <i className="fab fa-github"></i>
        </Button>
      </div>
    </Form>
  );
};

export default SignUpForm;
