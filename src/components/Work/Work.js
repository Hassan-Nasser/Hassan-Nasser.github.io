import React from "react";
import { useEffect, useState } from "react";
import "./Work.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft } from "@fortawesome/fontawesome-free-solid";

const _items = [
  {
    work: {
      title: 'Unity',
      desc: `Used unity game engine for ${new Date().getFullYear() - 2017}+ years in different projects,from games to simulations to mobile apps.`,
      image: require("../../images/Unity.png"),
    },
  },
  {
    work: {
      title: "Unreal",
      desc: "Experienced in unreal engine and capable of developing all kind of AAA games with it, From battle royale games to FPS games to MMO games.",
      image: require("../../images/Unreal.png"),
    },
  },
  {
    work: {
      title: 'Multiplayer',
      desc: 'Used different frameworks like Photon and Unet with unity to integrate multiplayer to different kind of games,board games with turn based and Host migration multiplayer, and real-time strategy games.',
      image: require("../../images/Multiplayer.png"),
    },
  },
  {
    work: {
      title: 'AR & VR',
      desc: 'Developed all kind of AR apps and VR games, used vuforia marker AR to develop multiple mobile apps,used SteamVR to develop multiple PC games and simulations.',
      image: require("../../images/AR&VR.png"),
    },
  },

];

const length = _items.length;
const mobilSlideWidth = 20;
const webSlideWidth = 20
_items.push(..._items);




const CarouselSlideItem = ({ pos, idx, activeIdx }) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [slideWidth, setSlideWidth] = useState(width <= 990 ? mobilSlideWidth : webSlideWidth);

  useEffect(() => {
    const handleWindowSizeChange = (e) => {
      setWidth(window.innerWidth);
      if (width <= 990) {
        setSlideWidth(mobilSlideWidth);
      } else {
        setSlideWidth(webSlideWidth);
      }

    }
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, [width, slideWidth]);


  const createItem = (position, idx) => {
    const item = {
      styles: {
        transform: `translateX(${position * slideWidth}rem)`,
      },
      work: _items[idx].work,
    };

    switch (position) {
      case length:
        break;
      case (width > 990) && length - 1:
        break;
      case (width > 990) && length + 1:
        break;
      default:
        item.styles = { ...item.styles, opacity: 0 };
        break;
    }

    return item;
  };
  const item = createItem(pos, idx, activeIdx);

  return (

    <li className="box style1 carousel__slide-item" style={item.styles} >
      <div className="work-contain">
        <div className="image-icon ">
          <img src={item.work.image} alt={item.work.title} />
        </div>
        <h3 className="subject prototype white">{item.work.title}</h3>
        <p className="work-description montserrat custom-grey">{item.work.desc} </p>
      </div>
    </li>
  );
};

const keys = Array.from(Array(_items.length).keys());

const Work = () => {
  const [items, setItems] = useState(keys);
  const [isTicking, setIsTicking] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);
  const [startY, setStartY] = React.useState(0);
  const [endY, setEndY] = React.useState(0);
  const bigLength = items.length;

  const prevClick = (jump = 1) => {
    if (!isTicking) {
      setIsTicking(true);
      setItems((prev) => {
        return prev.map((_, i) => prev[(i + jump) % bigLength]);
      });
    }
  };

  const nextClick = (jump = 1) => {
    if (!isTicking) {
      setIsTicking(true);
      setItems((prev) => {
        return prev.map(
          (_, i) => prev[(i - jump + bigLength) % bigLength],
        );
      });
    }
  };

  const sleep = (ms = 0) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  useEffect(() => {
    if (isTicking) sleep(300).then(() => setIsTicking(false));
  }, [isTicking]);

  useEffect(() => {
    setActiveIdx((length - (items[0] % length)) % length) // prettier-ignore
  }, [items]);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setStartY(e.targetTouches[0].clientY);
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
    setEndY(e.targetTouches[0].clientY);
  }

  const handleTouchEnd = () => {
    if (Math.abs(startY - endY) < Math.abs(touchStart - touchEnd)) {
      if (touchStart - touchEnd > 0) {
        nextClick()
      } else
        prevClick()

      setIsTicking(true);
    }
  }

  return (
    <div className="container">
      <div className="row d-flex justify-content-center">
        <header className=" work-header">
          <h2 className="prototype white">Here's all the stuff I do</h2>
          <p className="font-5 montserrat custom-grey">Softwares and technologies i have multiple years experience at.</p>
        </header>
      </div>
      <div className="row d-flex justify-content-center">
        <div className="carousel__wrap">
          <div className="carousel__inner">

            <div className="carousel__container">
              <ul
                onTouchStart={touchStartEvent => handleTouchStart(touchStartEvent)}
                onTouchMove={touchMoveEvent => handleTouchMove(touchMoveEvent)}
                onTouchEnd={() => handleTouchEnd()}
                className="carousel__slide-list">
                {items.map((pos, i) => (
                  <CarouselSlideItem
                    key={i}
                    idx={i}
                    pos={pos}
                    activeIdx={activeIdx}
                  />
                ))}
              </ul>
            </div>
            <FontAwesomeIcon
              onClick={() => prevClick()}
              className="carousel__btn carousel__btn--prev"
              icon={faChevronLeft} size="5x" />
            <FontAwesomeIcon
              onClick={() => nextClick()}
              className="carousel__btn carousel__btn--next"
              icon={faChevronRight} size="5x" />
            {/* <div className="carousel__dots">
              {items.slice(0, length).map((pos, i) => (
                <button
                  key={i}
                  onClick={() => handleDotClick(i)}
                  className={i === activeIdx ? 'dot active' : 'dot'}
                />
              ))}
            </div> */}
          </div>
        </div>
      </div>

    </div>

  );
};

export default Work;