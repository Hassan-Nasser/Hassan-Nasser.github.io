import React from "react";
import { useEffect, useState } from "react";
import "./Review.scss";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import "react-image-gallery/styles/css/image-gallery.css";
import { db } from "../../config/firebase";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import "swiper/css";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';



const Review = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    firebase.firestore().collection('reviews').get().then(reviews => {
      const reviewList = reviews.docs.map(doc => doc.data());
      setReviews(reviewList);
    }).catch(err => console.log(err));

  }, []);


  return (
    <div className="container">
      <div className=" d-flex justify-content-center">
        <header>
          <h2 className="prototype white">Client's Reviews</h2>
          <p className="font-5 montserrat custom-grey">Some of my freelance projects reviews, projects were done on upwork. </p>
        </header>
      </div>
      <div className="row d-flex justify-content-center">

        <Swiper
          className="review-swiper"
          modules={[Navigation, Pagination,A11y]}
          spaceBetween={100}
          loop={true}
          // navigation={{ nextEl: ".swipper-button-next", prevEl: ".swipper-button-prev" }}
          navigation
          pagination={{ clickable: true }}
          // scrollbar={{ draggable: true }}
        >
          {reviews.length > 0 && reviews.map((review, i) =>
            <SwiperSlide key={i}>
              <div className="image-review-cover">
                <img className="image-review" alt={review.name}
                  src={review.url}
                />
                <span className="review-subject prototype white">{review.name}</span>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </div>
  );
};
export default Review;
