import React from "react";
import { useContext } from "react";
import { pages } from "../../data";
import "./Navigation.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from '@fortawesome/fontawesome-free-solid';
import AppContext from "../AppContext";

export function Navigation(props) {
  const [click, setClick] = React.useState(false);
  const { setIsNav } = useContext(AppContext);
  const handleClick = () => {
    setClick(!click);
    setIsNav(!click);
  };
  const Close = () => setClick(false);

  return (
    <>
      <div className={click ? "main-container" : ""} onClick={() => { handleClick() }} ></div>
      <nav className="prototype navbar fixed-top" onClick={e => e.stopPropagation()}>
        <div className="nav-container">
          <div className=" font-3 nav-logo" onClick={() => { props.goToPage(0) }}>
            Hassan Nasser
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            {pages.map((page, index) => (
              <li className={props.activePage === index ? "nav-item active" : "nav-item"} key={index}
                onClick={() => {
                  setIsNav(false);
                  setTimeout(() => {
                    props.goToPage(page.pageNumber);
                    Close();
                  }, 200);
                }}
                data-menuanchor={page.title}>
                <a className="font-2 nav-links">
                  {page.title}
                </a>
              </li>

            ))}
          </ul>
          <div className="nav-icon" onClick={handleClick}>
            {click ?
              <FontAwesomeIcon icon={faTimes} />
              : <FontAwesomeIcon icon={faBars} />}

          </div>
        </div>
      </nav>
    </>
  );
}

