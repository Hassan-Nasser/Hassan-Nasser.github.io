import { Component } from "react";
import "./Contacts.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin, faTwitter, faUpwork, faYoutube } from "@fortawesome/free-brands-svg-icons";

class Contacts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            testimonials: []
        };
    }
    render() {
        return (
            <section className="site-section" id="contact">
                <div className="container">
                    <div className="row">


                        <div className="col pl-md-5 white">
                            <h3 className="TechnaSans left font-3">My Contact Details </h3>
                            <h4 className="mb-5 left italic">Have a question or a project? don't hesitate to get in touch with me. </h4>

                            <ul className="site-contact-details TechnaSans">
                                <li>
                                    <span className="text-uppercase">Email</span>
                                    Hassan.h.nasser@gmail.com
                                </li>
                                <li>
                                    <span className="text-uppercase">Phone</span>
                                    +2 0106 562 2685
                                </li>

                                <li>
                                    <span className="text-uppercase">Address</span>
                                    Cairo, Egypt <br />
                                </li>
                                <li>

                                    <a href="https://www.linkedin.com/in/hassan-naser/"
                                        target="_blank"
                                        rel="noreferrer" className="social-item text-center"><FontAwesomeIcon className="social-icon" icon={faLinkedin} /></a>
                                    <a href="https://youtube.com/c/HassanNasserMohamed"
                                        target="_blank"
                                        rel="noreferrer" className="social-item"><FontAwesomeIcon className="social-icon" icon={faYoutube} /></a>
                                    <a href="https://www.upwork.com/freelancers/hassannasser"
                                        rel="noreferrer"
                                        target="_blank" className="social-item"><FontAwesomeIcon className="social-icon" icon={faUpwork} /></a>
                                    <a href="https://www.github.com/Hassan-Nasser"
                                        target="_blank"
                                        rel="noreferrer" className="social-item"><FontAwesomeIcon className="social-icon" icon={faGithub} /></a>
                                </li>
                            </ul>

                        </div>





                    </div>
                </div>
            </section>
        )
    }
}
export default Contacts;