"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

type Props = { id: string; title: string; text: string; images: string[]; alt: string };

// Awards / certificates carousel. Rendered only when SHOW_CREDENTIALS is true in app/page.tsx.
export default function Credentials({ id, title, text, images, alt }: Props) {
  return (
    <section className="section section--white" id={id}>
      <div className="container">
        <div className="section-head">
          <h2 className="title">{title}</h2>
          <p>{text}</p>
        </div>
        <Swiper
          modules={[Autoplay, Pagination]}
          loop
          spaceBetween={20}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{ 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }}
          className="credentials-slider"
        >
          {images.map((src) => (
            <SwiperSlide key={src}>
              <div className="credential">
                <img src={src} alt={alt} loading="lazy" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
