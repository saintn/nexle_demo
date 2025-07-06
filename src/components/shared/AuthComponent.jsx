import { Col, Container, Row } from 'reactstrap';

const AuthPageLayout = ({ children, backgroundImage }) => {
  return (
    <Container fluid className="vh-100 d-flex flex-column">
      <Row className="flex-fill">
        <Col
          md="8"
          className="bg-light p-3"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            boxShadow: '4px 0 10px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Col
          md="4"
          className="text-white flex-fill justify-content-center align-items-center d-flex"
        >
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default AuthPageLayout;
