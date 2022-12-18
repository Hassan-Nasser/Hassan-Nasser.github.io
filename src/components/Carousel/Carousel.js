import React, { useState, useEffect, useContext } from 'react';
import "./Carousel.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import AppContext from "../AppContext";

const Carousel = ({ children }) => {
    const [active, setActive] = useState(3);
    const count = React.Children.count(children);
    const [touchStart, setTouchStart] = React.useState(0);
    const [touchEnd, setTouchEnd] = React.useState(0);
    const [startY, setStartY] = React.useState(0);
    const [endY, setEndY] = React.useState(0);
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    // useEffect(() => {
    //     if (isTicking) sleep(300).then(() => { setIsTicking(false); setDisableScroll(false); });
    // }, [isTicking]);


    const handleWindowSizeChange = (e) => {
        setWidth(window.innerWidth);
    }
    const handleTouchStart = (e) => {
        // setDisableScroll(true);
        setTouchStart(e.targetTouches[0].clientX);
        setStartY(e.targetTouches[0].clientY);
    }

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
        setEndY(e.targetTouches[0].clientY);
    }

    const handleTouchEnd = () => {
        if (Math.abs(startY - endY) < Math.abs(touchStart - touchEnd)) {
            if (touchStart - touchEnd > 150) {
                setActive(i => i + 1)
            }

            if (touchStart - touchEnd < -150) {
                setActive(i => i - 1)
            }
        }
    }

    const pervious = () => {
        let newActive = active;
        newActive--;
        setActive(newActive < 0 ? count - 1 : newActive);
    }
    const next = () => {
        let newActive = active;
        setActive((newActive + 1) % count);
    }

    const MAX_VISIBILITY = 3;
    return (
        <div className='carousel'

        >
            {active > 0 &&
                <button className='nav left' onClick={() => pervious()}>
                    <FontAwesomeIcon icon={faChevronLeft} />

                </button>}
            {React.Children.map(children, (child, i) => (
                <div className='card-container'
                    onTouchStart={touchStartEvent => handleTouchStart(touchStartEvent)}
                    onTouchMove={touchMoveEvent => handleTouchMove(touchMoveEvent)}
                    onTouchEnd={() => handleTouchEnd()}
                    style={{
                        '--active': i === active ? 1 : 0,
                        '--offset': (active - i) / (width <= 768 ? 10 : 3.2),
                        '--direction': Math.sign(active - i),
                        '--abs-offset': Math.abs(active - i) / 3,
                        'pointerEvents': active === i ? 'auto' : 'none',
                        'opacity': Math.abs(active - i) >= MAX_VISIBILITY ? '0.8' : '1',
                        'display': Math.abs(active - i) > (width <= 768 ? 1 : MAX_VISIBILITY) ? 'none' : 'block',
                    }}>
                    {child}
                </div>
            ))
            }
            {
                active < count - 1 &&
                <button className='nav right' onClick={() => next()}>
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            }
        </div >
    );
};

export default Carousel;