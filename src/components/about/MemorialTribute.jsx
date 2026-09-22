export default function MemorialTribute() {
  return (
    <section className="mb-10 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="grid gap-0 md:grid-cols-[minmax(240px,0.8fr)_1.4fr]">
        <div className="min-h-72 bg-secondary">
          <img
            src="https://circlesofgiving.org/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-24-at-14.46.44-892x1024.jpeg"
            alt="Herman P. and Sophia Taubman"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-6 md:p-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">In Memoriam</p>
          <h2 className="font-display text-3xl text-foreground">A Legacy of Giving</h2>
          <p className="mt-3 text-sm font-semibold text-foreground">
            Goodwin and Geraldine Steinberg · Herman P. and Sophia Taubman
          </p>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              Goodwin (Abraham ben Edward Perry) and Geraldine (Tamar bat Albert) Steinberg were founding supporters who helped initiate and champion the New Seed Foundation’s programs. They inspired their daughter, Joan Rachel Bracha Laurence, to unite community design with social service. Goodwin, an architect, came to Israel and found the building that became the center.
            </p>
            <p>
              Herman P. and Sophia Taubman emigrated from Eastern Europe to the United States in the early 1900s and raised their family in Tulsa, Oklahoma. They cared deeply about Israel and the wellbeing of its people, playing a meaningful role in New Seed Foundation projects over many years.
            </p>
            <p className="font-medium text-foreground">
              Their belief in every person’s uniqueness, in generosity, and in caring for others continues to guide our work. This community is dedicated to their memory.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}