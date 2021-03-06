import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PaginationComponent from '../PaginationComponents/PaginationComponent';
import { UseAuth } from '../../Helpers/Auth';
import CategoryItemComponent from './CategoryItemComponent';

const AuthorsSlider = () => {
  const [res, setRes] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const { user } = UseAuth();

  const changeCurrent = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/user/${user.userInfo.id}/categories/${currentPage}`,
        {
          headers: {
            authorization: user.userInfo.authorization,
          },
        }
      )
      .then((response) => {
        setRes(response.data);
      })
      .catch((error) => {});
  }, [currentPage]);

  return (
    <>
      {res.CategoriesCount ? (
        <PaginationComponent
          Data={res.categories}
          itemsCount={Number(res.CategoriesCount)}
          totalPageCount={Math.ceil(Number(res.CategoriesCount) / 6)}
          RenderComponent={CategoryItemComponent}
          changeCurrent={changeCurrent}
          currentPageNumber={currentPage}
          title="Categories"
        />
      ) : (
        <h1
          className="noBooks"
          style={{ fontFamily: 'Brush Script MT, Brush Script Std, cursive' }}
        >
          No Categories...
        </h1>
      )}
    </>
  );
};

export default AuthorsSlider;
