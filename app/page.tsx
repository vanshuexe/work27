import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PromoSlider from "@/components/PromoSlider";
import Services from "@/components/Services";
import About from "@/components/About";
import WhyUs from "@/components/WhyUs";
import Process from "@/components/Process";
import Blogs from "@/components/Blogs";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import Credentials from "@/components/Credentials";
import StructuredData from "@/components/StructuredData";
import { IMG_ALT, PHONE, TEL } from "@/lib/site";
import { readPublicContent, readPublicBlogContent } from "@/lib/admin/content";

// Hidden until Kali Charan's own award and certificate photos replace the files in
// public/assets/img/awards and public/assets/img/certificate. Set to true to show them.
const SHOW_CREDENTIALS = false;

const AWARDS = [1, 2, 3, 4, 5, 6].map((n) => `/assets/img/awards/${n}.jpg`);
const CERTIFICATES = [1, 2, 3, 4, 5].map((n) => `/assets/img/certificate/${n}.jpg`);

export default async function Home() {
  const [{ services }, { blogs }] = await Promise.all([
    readPublicContent(),
    readPublicBlogContent(),
  ]);
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="announce">
        <strong>Trusted by 98K+ clients</strong>
        <span className="sep hide-sm">•</span>
        <span className="hide-sm">100% privacy</span>
        <span className="sep">•</span>
        <a href={TEL}>
          Call <strong>{PHONE}</strong>
        </a>
      </div>
      <Header />
      <main id="main">
        <Hero />
        <PromoSlider />
        <Services services={services} />
        <About />
        <WhyUs />
        {SHOW_CREDENTIALS && (
          <>
            <Credentials
              id="awards"
              title="Awards and Achievements"
              text="Our awards are a mark of recognition for helping people overcome challenges in their personal and marital lives."
              images={AWARDS}
              alt={IMG_ALT}
            />
            <Credentials
              id="certificates"
              title="Recognitions and Certifications"
              text="Certifications that reflect years of experience and trust in astrology guidance."
              images={CERTIFICATES}
              alt={IMG_ALT}
            />
          </>
        )}
        <Process />
        <Testimonials />
        <Blogs blogs={blogs.filter((b) => b.visible)} />
        <Faq />
        <CtaBand />
      </main>
      <Footer />
      <FloatingActions />
      <StructuredData services={services} />
    </>
  );
}
