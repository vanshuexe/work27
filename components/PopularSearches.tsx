import { Search } from "lucide-react";
import { POPULAR_SEARCHES, whatsappWith } from "@/lib/site";

export default function PopularSearches() {
  return (
    <section className="tags-section" aria-labelledby="popular-searches">
      <div className="container">
        <h2 id="popular-searches" className="tags-section__title">
          <Search size={18} aria-hidden="true" />
          Popular Searches
        </h2>
        <ul className="tags">
          {POPULAR_SEARCHES.flatMap(({ tags }) => tags).map((tag) => (
            <li key={tag}>
              <a href={whatsappWith(tag)} target="_blank" rel="noreferrer" className="tag">
                {tag}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
