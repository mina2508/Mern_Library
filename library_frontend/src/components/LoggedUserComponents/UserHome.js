import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import BooksSlider from './Books/BooksSlider';

const UserHome = () => {
  return (
    <>
      <div className="d-flex">
        <Container>
          <BooksSlider />
        </Container>
      </div>
    </>
  );
};

export default UserHome;
