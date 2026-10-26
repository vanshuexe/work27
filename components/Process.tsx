import { STEPS } from "@/lib/site";

export default function Process() {
  return (
    <section className="section" id="how-it-works">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">How It Works</span>
          <h2 className="title">Get Your Solution in 3 Simple Steps</h2>
        </div>
        <ol className="steps">
          {STEPS.map((step, i) => (
            <li className="step" key={step.title}>
              <span className="step__num">{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
