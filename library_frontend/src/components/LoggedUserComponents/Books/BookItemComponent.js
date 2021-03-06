import React from 'react';
import { Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { UseAuth } from '../../Helpers/Auth';
import { Link } from 'react-router-dom';
import AverageRating from '../Ratings/AverageRating';

const BookItemComponent = ({ data }) => {
  const { user, login } = UseAuth();
  const book = user.userInfo.books.find((element) => element.book === data._id);

  const addToMyBooks = () => {
    const addedBook = { book: data._id, state: 'Want To Read' };
    axios
      .patch(
        `http://localhost:5000/user/${user.userInfo.id}/book`,
        { addedBook },
        {
          headers: {
            authorization: user.userInfo.authorization,
          },
        }
      )
      .then((response) => {
        const books = user.userInfo.books.push(addedBook);
        const newuser = { ...user, books };

        login(newuser);
      })
      .catch((error) => {});
  };
  return (
    <>
      <Card className="text-black m-auto mt-3 book-card-item">
        <div className="ui-card d-flex">
          <Card.Img
            variant="top"
            src={data.photo}
            width={100}
            height={300}
            className="custom-card-img"
          />
          <div className="info">
            <h3>
              <AverageRating
                currentlyRating={Math.floor(
                  Number(data.rating.totalRate) /
                    Number(data.rating.numberOfRates)
                )}
              />
              <h5>Book Rating</h5>
            </h3>
            <Link
              to={'/Book/' + data._id}
              className="btn btn-outline-success details-btn"
            >
              Show Details
            </Link>
          </div>
        </div>
        <Card.Body className="card-body ">
          <Card.Title>{data.bookName}</Card.Title>

          {book ? (
            <Button variant="secondary" disabled className=" mt-1">
              Already Added
            </Button>
          ) : (
            <button
              className="px-5 mt-1 btn btn-outline-success"
              onClick={addToMyBooks}
            >
              Add To Favourites
            </button>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default BookItemComponent;
