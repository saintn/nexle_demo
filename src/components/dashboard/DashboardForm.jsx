import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Navbar
} from 'reactstrap';

import { logout } from '../../store/slices/authSlice';

const DashboardForm = () => {
  const dispatch = useDispatch();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login'; // or use navigate('/login') if using react-router
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar color="white" light className="shadow-sm px-4">
        <div className="ms-auto d-flex align-items-center">
          <div className="text-end me-2 text-nowrap">
            <div className="fw-bold">John Doe</div>
            <small className="text-muted">Available</small>
          </div>

          <Dropdown isOpen={dropdownOpen} toggle={toggle} direction="down">
            <DropdownToggle
              tag="span"
              data-toggle="dropdown"
              className="cursor-pointer"
            >
              <img
                src="/images/avatar.webp"
                alt="avatar"
                className="rounded-circle"
                style={{ width: '36px', height: '36px' }}
              />
            </DropdownToggle>

            <DropdownMenu className="mt-5 text-end" style={{ marginLeft: -100 }} end>
              <DropdownItem className="text-end" style={{
                backgroundColor: 'transparent',
              }}
                onClick={handleLogout}
              >
                Logout <i className="fa-solid fa-power-off ms-2"></i>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Navbar>

      <div className="flex-grow-1 d-flex flex-column text-center">
        <div className="flex-shrink-0">
          <h4 className="my-3" style={{ color: '#5A537B' }}>
            Welcome to Demo App
          </h4>
        </div>

        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <img
            src="/images/dashboard_bg_img.png"
            alt="Demo Illustration"
            style={{
              maxWidth: "50%",
              maxHeight: "50%",
              objectFit: 'contain',
            }}
          />
        </div>
      </div>

      <footer className="text-muted text-start px-4 pb-3 small">
        COPYRIGHT © 2020
      </footer>
    </div>
  );
};

export default DashboardForm;
