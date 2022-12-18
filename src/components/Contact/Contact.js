import { Component } from "react";
import "./Contact.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faYoutube
} from "@fortawesome/free-brands-svg-icons";
import emailjs from "emailjs-com";
import Swal from "sweetalert2";
import Upwork from '../../images/Upwork.png';

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      name: "",
      subject: "",
      message: "",
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();

    emailjs
      .sendForm(
        "service_r20v2oq",
        "template_ut7ulbk",
        event.target,
        "user_nIYi5nzBdXtnfE7x9yLNv"
      )
      .then(
        (result) => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your message has been send",
            showConfirmButton: false,
            timer: 1500,
          });
          this.setState({ message: "", name: "", subject: "", email: "" });
        },
        (error) => {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Your message doesn't send,Please try again.",
            showConfirmButton: false,
            timer: 1500,
          });
          // console.log("error, = ", error.text);
        }
      ).catch(err=>console.log(err))
  };
  handleChange = (type, e) => {
    e.preventDefault();
    if (type === "name") this.setState({ name: e.target.value });
    else if (type === "subject") this.setState({ subject: e.target.value });
    else if (type === "email") this.setState({ email: e.target.value });
    else if (type === "message") this.setState({ message: e.target.value });
  };

  render() {
    return (
      <div className="container ">
        <div className="row d-flex justify-content-center white">
          <header >
            <h2 className="prototype">Get in touch</h2>
            <p className="montserrat custom-grey">
              As a freelancer, i'm available for new projects and
              collaborations.
            </p>
          </header>
        </div>

        <div className="row d-flex justify-content-center">
          <div className="col-12">
            <form method="post" onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-lg-6 col-sm-12 col-md-6 ">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="disable"
                    required
                    placeholder="Name"
                    value={this.state.name}
                    onChange={(e) => this.handleChange("name", e)}
                  />
                </div>
                <div className="col-lg-6 col-sm-12  col-md-6">
                  <input
                    type="email"
                    name="email"
                    id="email" 
                    className="disable"
                    required
                    placeholder="Email"
                    value={this.state.email}
                    onChange={(e) => this.handleChange("email", e)}
                  />
                </div>
                <div className="col-lg-12">
                  <input
                    type="text"
                    name="subject"
                    className="disable"
                    id="subject"
                    required
                    placeholder="Subject"
                    value={this.state.subject}
                    onChange={(e) => this.handleChange("subject", e)}
                  />
                </div>
                <div className="col-lg-12">
                  <textarea
                    name="message"
                    id="message"
                    className="disable"
                    required
                    placeholder="Message"
                    value={this.state.message}
                    onChange={(e) => this.handleChange("message", e)}
                  ></textarea>
                </div>
                <div className="row submit ">
                  <div className="col-lg-12 center">

                    {this.state.name !== "" &&
                      this.state.subject !== "" &&
                      this.state.email !== "" &&
                      this.state.message !== "" ? (
                      <input
                        type="submit"
                        className="btn btn-lg btn-primary"
                        value="Send Message"
                      />
                    ) : (
                      <input
                        type="submit"
                        disabled
                        className="btn btn-lg btn-primary"
                        value="Send Message"
                      />
                    )}

                  </div>
                </div>

              </div>
            </form>
          </div>

        </div>
        <div className="row d-flex justify-content-center">
          <div className="col-12">
            <hr />
          </div>
        </div>
        <div className="row d-flex justify-content-center white">
          <div >
            <h3>Find me on ...</h3>
          </div>
        </div>
        <div className="row d-flex justify-content-center white">
          <div >
            <ul className="social">
              <li>
                <a
                  href="https://www.upwork.com/freelancers/hassannasser"
                  rel="noreferrer"
                  target="_blank"
                >
                  <div className="upwork" style={{ backgroundImage: "url(" + Upwork + ")" }}></div>
                  {/* <img className="upwork" style={{ backgroundImage: "url(" + Upwork + ")" }} /> */}
                </a>
              </li>

              <li>
                <a
                  href="https://www.linkedin.com/in/hassan-naser/"
                  target="_blank"
                  rel="noreferrer"

                >
                  <FontAwesomeIcon icon={faLinkedin} size="2x" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.github.com/Hassan-Nasser"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon={faGithub} size="2x" />
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com/c/HassanNasserMohamed"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon={faYoutube} size="2x" />
                </a>
              </li>
            </ul>
          </div>
        </div>

      </div>
    );
  }
}
export default Contact;
