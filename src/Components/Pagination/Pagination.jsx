import React, { useState, useEffect, useImperativeHandle } from "react";
import "./Pagination.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import Modal from "../Modal/Modal";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export const Pagination = React.forwardRef((props, ref) => {
    const { projectsProps } = props;
    const [projects, SetProjects] = useState(projectsProps);
    const [projectPerPage, SetPostPerPage] = useState(6);
    const [currentPage, SetCurrentPage] = useState(1);
    const [isOpen, SetIsOpen] = useState(false);
    const [isLoading, SetIsLoading] = useState(true);
    const [currentProject, SetCurrentProject] = useState({});

    const [pageItem, SetPageItem] = useState({
        start: 0,
        end: projectPerPage
    })

    const onPageChangeEvent = (start, end) => {
        SetPageItem({
            start: start,
            end: end
        })
    }

    const numOfPages = Math.ceil(projectsProps.length / projectPerPage);

    const numOfButtons = [];
    for (let i = 1; i <= numOfPages; i++) {
        numOfButtons.push(i);
    }

    const prevPageClick = () => {
        if (currentPage === 1) {
            SetCurrentPage(currentPage);
        } else {
            SetCurrentPage(currentPage - 1);
        }
    }

    const nextPageClick = () => {
        if (currentPage === numOfButtons.length) {
            SetCurrentPage(currentPage);
        } else {
            SetCurrentPage(currentPage + 1);
        }
    }

    useImperativeHandle(ref, () => ({
        resetCurrentPage() {
            SetCurrentPage(1);
        },
        SetLoading(val) {
            SetIsLoading(val);
        }
    }))

    const [arrOfCurrButtons, setArrOfCurrButtons] = useState([]);

    useEffect(() => {

        SetProjects(projectsProps)
        let tempNumberOfButtons = [...arrOfCurrButtons]

        let dotsInitial = '...'
        let dotsLeft = '... '
        let dotsRight = ' ...'

        if (numOfButtons.length < 6) {
            tempNumberOfButtons = numOfButtons
        }

        else if (currentPage >= 1 && currentPage <= 3) {
            tempNumberOfButtons = [1, 2, 3, 4, dotsInitial, numOfButtons.length]
        }

        else if (currentPage === 4) {
            const sliced = numOfButtons.slice(0, 5)
            tempNumberOfButtons = [...sliced, dotsInitial, numOfButtons.length]
        }

        else if (currentPage > 4 && currentPage < numOfButtons.length - 2) {
            // from 5 to 8 -> (10 - 2)
            const sliced1 = numOfButtons.slice(currentPage - 2, currentPage)
            // sliced1 (5-2, 5) -> [4,5] 
            const sliced2 = numOfButtons.slice(currentPage, currentPage + 1)
            // sliced1 (5, 5+1) -> [6]
            tempNumberOfButtons = ([1, dotsLeft, ...sliced1, ...sliced2, dotsRight, numOfButtons.length])
            // [1, '...', 4, 5, 6, '...', 10]
        }

        else if (currentPage > numOfButtons.length - 3) {
            // > 7
            const sliced = numOfButtons.slice(numOfButtons.length - 4)
            // slice(10-4) 
            tempNumberOfButtons = ([1, dotsLeft, ...sliced])
        }

        else if (currentPage === dotsInitial) {
            // [1, 2, 3, 4, "...", 10].length = 6 - 3  = 3 
            // arrOfCurrButtons[3] = 4 + 1 = 5
            // or 
            // [1, 2, 3, 4, 5, "...", 10].length = 7 - 3 = 4
            // [1, 2, 3, 4, 5, "...", 10][4] = 5 + 1 = 6
            SetCurrentPage(arrOfCurrButtons[arrOfCurrButtons.length - 3] + 1)
        }
        else if (currentPage === dotsRight) {
            SetCurrentPage(arrOfCurrButtons[3] + 2)
        }

        else if (currentPage === dotsLeft) {
            SetCurrentPage(arrOfCurrButtons[3] - 2)
        }

        setArrOfCurrButtons(tempNumberOfButtons);
        const value = currentPage * projectPerPage;

        onPageChangeEvent(value - projectPerPage, value)
    }, [currentPage, projectPerPage, numOfPages, projectsProps, isOpen]);

    return (
        <>
            {
                isLoading ?
                    (Array(6).fill().map((_, index) => {
                        return (
                            <div
                                key={index} className="col-lg-4 col-md-6 col-sm-6 mix branding ">
                                <div className="portfolio__item">
                                    <div className="portfolio__item__video set-bg">
                                    <Skeleton height={270} width={270} style={{ backgroundColor: '#eaeaea' }} />
                                    </div>
                                    <div className="portfolio__item__text">
                                        <Skeleton width={70} style={{ backgroundColor: '#eaeaea' }} />
                                        <ul>
                                            {Array(3).fill().map((_, index) =>
                                                <li className="TechnaSans" key={index}><Skeleton width={30} style={{ backgroundColor: '#eaeaea' }} /></li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )
                    }))
                    :
                    (
                        <>
                            {
                                projects.slice(pageItem.start, pageItem.end).map((project, index) => {
                                    return (
                                        <div
                                            onClick={() => {
                                                SetIsOpen(true);
                                                SetCurrentProject(project);
                                            }}
                                            key={index} className="col-lg-4 col-md-6 col-sm-6 mix branding ">
                                            <div className="portfolio__item pointer">
                                                <div className="portfolio__item__video set-bg" style={{ backgroundImage: `url(${project.profile})` }} >
                                                    <a className="play-btn video-popup">
                                                        <FontAwesomeIcon icon={faPlay} /></a>
                                                </div>
                                                <div className="portfolio__item__text">
                                                    <h4>{project.name}</h4>
                                                    <ul>
                                                        {project.tags.map((tag, index) =>
                                                            <li className="TechnaSans" key={index}>{tag.name}</li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div className="table-filter-info">
                                <div className="dt-pagination">
                                    <ul className="dt-pagination-ul">
                                        <li className={`dt-item ${currentPage === 1 ? 'disabled' : ''}`}><a className="dt-link" onClick={prevPageClick}>Prev</a></li>
                                        {
                                            arrOfCurrButtons.map((data, index) => {
                                                return (
                                                    <li key={index} className={`dt-item ${currentPage === data ? 'active' : ''}`}><a className="dt-link" onClick={() => SetCurrentPage(data)}>{data}</a></li>
                                                )
                                            })
                                        }
                                        <li className={`dt-item ${currentPage === numOfButtons.length ? 'disabled' : ''}`}><a className="dt-link" onClick={nextPageClick}>Next</a></li>
                                    </ul>
                                </div>
                            </div>
                        </>
                    )
            }

            {isOpen && <Modal project={currentProject} isOpen={isOpen} onClose={() => SetIsOpen(false)} />}

        </>
    );
});


