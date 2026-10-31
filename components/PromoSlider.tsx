"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper/types";
import "swiper/css";
import "swiper/css/pagination";
import { IMG_ALT } from "@/lib/site";

const BANNERS = [
  { src: "/assets/img/slide/hero-love-back.jpg?v=4", alt: "Ex love back solutions" },
  { src: "/assets/img/slide/hero-love-marriage.jpg?v=4", alt: "Love marriage specialist" },
  { src: "/assets/img/slide/hero-husband-wife.jpg?v=4", alt: "Husband–wife problem solution" },
];

export default function PromoSlider() {
  const swiperRef = useRef<SwiperInstance | null>(null);

  return (
    <section className="promo section--dark" aria-label="Specialities">
      <div className="container promo__wrap">
        <Swiper
          modules={[Autoplay, Pagination]}
          loop
          speed={800}
          autoHeight
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          onSwiper={(s) => (swiperRef.current = s)}
        >
          {BANNERS.map((b, i) => (
            <SwiperSlide key={b.src}>
              <img
                src={b.src}
                alt={`${b.alt} – ${IMG_ALT}`}
                width={1897}
                height={829}
                loading={i === 0 ? "eager" : "lazy"}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          type="button"
          className="slider-btn slider-btn--prev"
          aria-label="Previous banner"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          className="slider-btn slider-btn--next"
          aria-label="Next banner"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </section>
  );
}
