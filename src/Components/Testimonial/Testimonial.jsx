import { Component } from "react";
import "./Testimonial.scss";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-flip';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

class Testimonial extends Component {

    constructor(props) {
        super(props);
        this.state = {
            testimonials: [],
            loading: true
        };
    }
    componentDidMount() {
        this.getAllTestimonial();
    }

    getAllTestimonial = async () => {
        const testimonialDocs = collection(db, "testimonials");
        const allDocs = await getDocs(testimonialDocs);
        const allTestimonial = allDocs.docs.map(doc => {
            return doc.data()
        })
        this.setState({ testimonials: allTestimonial,loading:false })
    }

    render() {
        return (
            <section id="testimonial" className="site-section">
                <div className="container">

                    <div className="row mb-5">
                        <div className="col-md-12">
                            <div className="section-heading text-center white">
                                <h2 className="TechnaSans"> A few words from people that choose to work with me.</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row testmoinal">
                        <Swiper
                            breakpoints={{
                                640: {
                                    slidesPerView: 1,
                                    spaceBetween: 20,
                                },
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 20,
                                }
                            }}
                            centeredSlides={true}
                            pagination={{
                                type: 'bullets',
                            }}
                            loop={true}
                            // autoplay={{
                            //     delay: 5000,
                            //     disableOnInteraction: false,
                            // }}
                            modules={[Pagination, Autoplay]}
                            className="mySwiper"
                        >

                            {this.state.loading ?
                                (Array(4).fill().map((_, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="block-47 d-flex ">
                                            <div className="block-47-image">
                                                <Skeleton
                                                    circle
                                                    height={50} width={50}
                                                     style={{ backgroundColor: '#eaeaea' }}
                                                    containerClassName="img-fluid"
                                                />
                                            </div>
                                            <blockquote className="block-47-quote">
                                                <p className="Holden font-1 mb-0"> 
                                                    <Skeleton count={3}  style={{ backgroundColor: '#eaeaea' }}/> 
                                                </p>
                                                <cite className="block-47-quote-author TechnaSans font-2">
                                                    <Skeleton
                                                        width={70}
                                                    />
                                                </cite>
                                            </blockquote>
                                        </div>
                                    </SwiperSlide>
                                ))) :
                                this.state.testimonials.map((testimonial, index) =>
                                    <SwiperSlide key={index}>
                                        <div className="block-47 d-flex ">
                                            <div className="block-47-image">
                                                <img src={testimonial.picture} alt="Image placeholder" className="img-fluid" />
                                            </div>
                                            <blockquote className="block-47-quote">
                                                <p className="Holden font-1">
                                                    <span className="quotes">&ldquo; </span>
                                                    {testimonial.review}
                                                    <span className="quotes" >&rdquo;</span>
                                                </p>
                                                <cite className="block-47-quote-author TechnaSans font-2">{testimonial.clientName}</cite>
                                            </blockquote>
                                        </div>
                                    </SwiperSlide>
                                )}
                        </Swiper>
                    </div>
                </div>
            </section>
        )
    }
}
export default Testimonial;