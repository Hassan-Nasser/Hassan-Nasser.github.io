import "./Profile.scss";
import Background from '../../images/Title-Frame.png';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import "swiper/css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleRight, faArrowAltCircleLeft } from "@fortawesome/fontawesome-free-solid";

const SwiperButtonNext = ({ children }) => {
  const swiper = useSwiper();
  return <div onClick={() => swiper.slideNext()}>{children}</div>;
};
const SwiperButtonPrev = ({ children }) => {
  const swiper = useSwiper();
  return <div onClick={() => swiper.slidePrev()}>{children}</div>;
};

const Profile = () => {
  return (
    <div className="container" >
      <div className=" d-flex justify-content-center">
        <Swiper
          spaceBetween={100}
          className="profile-swiper" >
          <SwiperSlide>
            <div className="row d-flex justify-content-center">
              <div className="col-lg-3 col-md-4 col-sm-6 profile-img">
                <span className="image fit">
                  <img className="profile-image" src={require('../../images/ProfilePicture.jpg')} alt="pic" />
                </span>
              </div>
            </div>

            <div className="row d-flex justify-content-center " >
              <header className=" col-md-12 col-sm-12 col-lg-6" >
                <h1 className="profile-header ">
                  <strong className="font-1 prototype white">Hassan Nasser</strong>
                </h1>
                <div className="job-title" style={{ backgroundImage: "url(" + Background + ")" }}>
                  <span className="font-2 blenda custom-grey">Senior Game Developer</span>
                </div>
              </header>
            </div>
            <div className="row d-flex justify-content-right ">
              <div className="title-profile col-md-12 col-sm-12 col-lg-12 col-12">
                <div className="intro">
                  <p className="montserrat font-5">
                    I've been working as a game developer for more than {new Date().getFullYear() - 2017}  years,
                    I enjoy participating in every aspect of game industry.
                  </p>
                </div>

              </div>
            </div>
            <div className="row  d-flex justify-content-center">
              <SwiperButtonNext>
                <div className=" swipe-next white montserrat">
                  Swipe Left For More {" "}<FontAwesomeIcon icon={faArrowAltCircleRight} />
                </div>
              </SwiperButtonNext>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="row d-flex justify-content-center ">
              <div className="title-profile col-md-12 col-sm-12 col-lg-12 col-12">
                <div className="intro">
                  <p className="montserrat font-5">
                    I am a passionate game developer. I enjoy playing games. Because I like to play games, I became interested in game production at a young age.

                    I interned at a nearby gaming studio throughout my undergrad years and worked my way up after that.

                    In my more than {new Date().getFullYear() - 2017} years as a game developer, I've developed a wide range of projects, from hyper-casual mobile games to full-fledged multiplayer high-fidelity ones.

                    Passionate about my craft, I started participating in every aspect of the projects I worked on, starting from the game design and writing a well-documented game design document to creating game mechanics and implementing highly maintainable and readable source code.

                    I take what I do to heart, organising the projects using version control and project tasks using project management tools.

                    Implementing code that is well-formed, documented, maintainable, and can be easily understood by any developer

                    Learn more about what I thrive to do and achieve in the following pages.
                  </p>
                </div>

              </div>
            </div>
            <div className="row  d-flex justify-content-center">
              <SwiperButtonPrev>
                <div className=" swipe-next white montserrat">
                  <FontAwesomeIcon icon={faArrowAltCircleLeft} /> {" "}Back
                </div>
              </SwiperButtonPrev>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );

}
export default Profile;
