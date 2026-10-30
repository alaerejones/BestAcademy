import Image from "next/image";
import Link from "next/link";
import { ApplicationStatus, getStatusView } from "@/components/ApplicationStatus";
import { ProgrammeScroller } from "@/components/ProgrammeScroller";
import { ScrollLink } from "@/components/ScrollLink";
import { SiteShell } from "@/components/SiteShell";
import { areas, audience, faqs, mayBe, mayNot, needs, PLAYBOOK_FALLBACK_URL, steps } from "@/lib/content";
import { feesFromCohort, formatMoney, hasAnyFee } from "@/lib/registration/types";
import { safeFetch } from "@/lib/sanity/client";
import { latestPostsQuery, testimonialsQuery } from "@/lib/sanity/queries";
import { getSettings } from "@/lib/settings";

export const revalidate = 60;

type Testimonial = { _id: string; quote: string; name: string; organisation?: string; role?: string; cohort?: string };
type Post = { _id: string; title: string; slug: string; excerpt: string };
const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null);

const Chapter = ({ n, label }: { n: string; label: string }) => (
  <p className="chapter" data-reveal="line"><span>{n}</span>{label}</p>
);

export default async function Home() {
  const [settings, testimonials, posts] = await Promise.all([
    getSettings(),
    safeFetch<Testimonial[]>(testimonialsQuery),
    safeFetch<Post[]>(latestPostsQuery),
  ]);
  const v = getStatusView(settings);
  const open = v.status === "open";
  const playbook = settings?.playbookUrl || PLAYBOOK_FALLBACK_URL;
  const cohort = settings?.activeCohort;
  const fees = feesFromCohort(cohort);
  const showPricing = open && hasAnyFee(fees);

  return (
    <SiteShell>
      <section className="hero" data-spy="top">
        <div className="container hero__grid">
          <div>
            <ApplicationStatus settings={settings} />
            <h1 data-reveal>Build an NGO that can do more than run projects.</h1>
            <p className="lead" data-reveal>A practical programme for NGO founders and leaders who want stronger organisations, better funding readiness and systems that support long-term impact.</p>
            <div className="actions" data-reveal>
              {open && (v.external ? <a className="btn btn--primary" href={v.href} rel="noopener noreferrer">Register now</a> : <Link className="btn btn--primary" href={v.href}>Register now</Link>)}
              <ScrollLink id="programme" className={open ? "btn btn--ghost" : "btn btn--primary"}>Join the waitlist</ScrollLink>
            </div>
          </div>
          <div className="collage" aria-label="Programme at a glance">
            <div className="collage__main frame"><Image src="/images/workshop-facilitator.jpeg" alt="A facilitator in a blue blazer speaking to seated participants in a meeting room" fill priority sizes="(min-width: 62rem) 42vw, 100vw" /></div>
            <div className="collage__small frame"><Image src="/images/workshop-table.jpeg" alt="Participants gathered around a table, reading and taking notes together" fill sizes="(min-width: 62rem) 18vw, 40vw" /></div>
            <aside className="panel on-navy">
              <p className="panel__big">8 weeks</p>
              {/* <p className="panel__sub">Eight areas that decide whether an NGO can function, attract funding and sustain its work.</p> */}
            </aside>
          </div>
        </div>
      </section>

      <section id="about" tabIndex={-1} className="section" data-spy="about">
        {/* <div className="container split split--media"> */}
        <div>
          {/* <figure className="photo frame frame--tall"><Image src="/images/training-discussion.jpeg" alt="A participant speaking into a microphone during a group session while others listen" fill sizes="(min-width: 62rem) 40vw, 100vw" style={{ objectPosition: "35% 40%" }} /></figure> */}
          <div>
            <Chapter n="01" label="Why this exists" />
            <h2 data-reveal>A strong mission is not enough.</h2>
            <p data-reveal>Many founders start with a genuine desire to solve a problem. Good intentions alone do not create an organisation that consistently delivers results. An NGO also needs:</p>
            <ul className="rules" data-reveal="stagger">{needs.map((n) => <li key={n}>{n}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="section section--photo on-navy" data-spy="about">
        <Image className="bg-photo" src="/images/background.jpeg" alt="" fill sizes="100vw" />
        <div className="container narrow">
          <Chapter n="02" label="The approach" />
          <h2 data-reveal>Stop running from project to project. Start building the organisation behind the mission.</h2>
          <p className="lead" data-reveal>Structured learning, practical guidance and frameworks you can apply to your own organisation. Learn it. Apply it. Improve it.</p>
          <ScrollLink id="programme" className="btn btn--accent">See what you will learn</ScrollLink>
        </div>
      </section>

      <section id="programme" tabIndex={-1} className="section" data-spy="programme">
        <div className="container">
          <Chapter n="03" label="The programme" />
          <h2 data-reveal>Eight weeks. One stronger organisation.</h2>
          <ProgrammeScroller areas={areas} />
        </div>
      </section>

      <section id="audience" tabIndex={-1} className="section section--white" data-spy="programme">
        <div className="container split split--media">
          <div>
            <Chapter n="04" label="Who it is for" />
            <h2 data-reveal>Built for people building real organisations.</h2>
            <ul className="rules" data-reveal="stagger">{audience.map((a) => <li key={a}>{a}</li>)}</ul>
            <p>You do not need a large organisation. You do need to be serious about building one.</p>
          </div>
          <figure className="photo frame"><Image src="/images/workshop-flipchart.jpeg" alt="Participants writing together on a large sheet of paper during a workshop" fill sizes="(min-width: 62rem) 45vw, 100vw" /></figure>
        </div>
        <div className="container fit">
          <div><h3>This may be for you if</h3><ul className="rules" data-reveal="stagger">{mayBe.map((a) => <li key={a}>{a}</li>)}</ul></div>
          <div><h3>This may not be for you if</h3><ul className="rules rules--not" data-reveal="stagger">{mayNot.map((a) => <li key={a}>{a}</li>)}</ul></div>
        </div>
      </section>

      <section className="section" data-spy="programme">
  <div className="container split split--media">
    <div>
      <Chapter n="05" label="How it works" />
      <h2 data-reveal>From registration to joining</h2>
      <figure className="photo frame">
        <Image
          src="/images/dr-best-portrait.jpeg"
          alt="Participants completing the registration process for an NGO Academy session"
          fill
          sizes="(min-width: 62rem) 40vw, 100vw"
        />
      </figure>
    </div>

    <ol className="steps" data-reveal="stagger">
      {steps.map(([t, d]) => (
        <li key={t}>
          <h3>{t}</h3>
          <p>{d}</p>
        </li>
      ))}
    </ol>
  </div>
</section>

      {cohort?.confirmedBenefits?.length ? (
        <section className="section section--white" data-spy="programme"><div className="container narrow">
          <h2>What participants receive</h2>
          <ul className="rules">{cohort.confirmedBenefits.map((b) => <li key={b}>{b}</li>)}</ul>
        </div></section>
      ) : null}

      <section id="pricing" tabIndex={-1} className="section" data-spy="programme">
        <div className="container narrow">
          <Chapter n="06" label="Fees" />
          <h2 data-reveal>Fees</h2>
          {showPricing ? (
            <>
              {cohort?.name && <p>{cohort.name}{fmtDate(cohort.startDate) ? `, starts ${fmtDate(cohort.startDate)}` : ""}{fmtDate(cohort.deadline) ? `. Register by ${fmtDate(cohort.deadline)}` : ""}.</p>}
              <table className="table"><thead><tr><th scope="col">Package</th><th scope="col">Naira</th><th scope="col">US dollars</th></tr></thead>
                <tbody>
                  <tr><th scope="row">Individual</th><td>{fees.individual.NGN ? formatMoney(fees.individual.NGN, "NGN") : "n/a"}</td><td>{fees.individual.USD ? formatMoney(fees.individual.USD, "USD") : "n/a"}</td></tr>
                  {(fees.organisation.NGN || fees.organisation.USD) && <tr><th scope="row">Organisation, three representatives</th><td>{fees.organisation.NGN ? formatMoney(fees.organisation.NGN, "NGN") : "n/a"}</td><td>{fees.organisation.USD ? formatMoney(fees.organisation.USD, "USD") : "n/a"}</td></tr>}
                </tbody></table>
              {cohort?.deliveryFormat && <p>Delivery: {cohort.deliveryFormat}</p>}
              <Link className="btn btn--primary" href="/register">Register and pay</Link>
            </>
          ) : <p>Fees are published with each cohort, so you will see them here when registration opens.</p>}
        </div>
      </section>

      <section id="facilitator" tabIndex={-1} className="section section--navy on-navy" data-spy="facilitator">
        <div className="container split split--media">
          <figure className="portrait frame"><Image src="/images/dr-best-portrait.jpeg" alt="Portrait of Dr. Best Green in a navy double-breasted suit with a red paisley tie" fill sizes="(min-width: 62rem) 38vw, 100vw" style={{ objectPosition: "50% 20%" }} /></figure>
          <div>
            <Chapter n="07" label="Your facilitator" />
            <h2 data-reveal>Meet Dr. Best Green</h2>
            <p className="lead" data-reveal>Strategic communications and public affairs professional.</p>
            <p data-reveal>Dr. Best Green is a Nigerian strategic communications and public affairs professional with more than 10 years of experience across communications, media relations, public engagement, advocacy and nonprofit consulting. He helps nonprofits and social impact organisations strengthen their communication, visibility, stakeholder engagement and organisational effectiveness.</p>
            <p data-reveal>He is the author of The NGO Playbook, a practical resource for NGO leaders who want to build organisations that work, attract funding and remain sustainable.</p>
          </div>
        </div>
      </section>

      {testimonials?.length ? (
        <section className="section section--white" data-spy="facilitator"><div className="container narrow">
          <h2>What participants say</h2>
          {testimonials.map((t) => (<figure key={t._id} className="quote"><blockquote><p>{t.quote}</p></blockquote>
            <figcaption>{t.name}{t.role ? `, ${t.role}` : ""}{t.organisation ? `, ${t.organisation}` : ""}{t.cohort ? ` (${t.cohort})` : ""}</figcaption></figure>))}
        </div></section>
      ) : null}

      <section id="playbook" tabIndex={-1} className="section" data-spy="playbook">
        <div className="container split split--media">
          <div>
            <Chapter n="08" label="A separate product" />
            <h2 data-reveal>The NGO Playbook</h2>
            <p data-reveal>Written by Dr. Best Green, and not part of the Academy. The Academy gives you structured learning. The Playbook gives you a resource you can keep and use.</p>
            <p data-reveal>It has been presented as a practical 100-day guide for NGO leaders, with a funding resource list and grant proposal resources. Digital, hard copy and combined options are available. Pricing and availability are handled on Nestuge, separately from Academy registration.</p>
            <a className="btn btn--primary" href={playbook} rel="noopener noreferrer">Get The NGO Playbook on Nestuge</a>
          </div>
          <figure className="photo photo--product frame"><Image src="/images/playbook-cover.jpeg" alt="The NGO Playbook by Dr. Best Green, shown as a hardcover book, a phone and a tablet" fill sizes="(min-width: 62rem) 45vw, 100vw" /></figure>
        </div>
      </section>

      {posts?.length ? (
        <section className="section section--white" data-spy="playbook"><div className="container">
          <h2>Latest insights</h2>
          <ul className="rules">{posts.map((p) => (<li key={p._id}><strong>{p.title}</strong><br />{p.excerpt}</li>))}</ul>
        </div></section>
      ) : null}

      <section id="faqs" tabIndex={-1} className="section" data-spy="faqs">
        <div className="container narrow">
          <Chapter n="09" label="Questions" />
          <h2 data-reveal>Frequently asked questions</h2>
          {faqs.map(([q, a]) => (<details key={q} className="faq"><summary>{q}</summary><p>{a}</p></details>))}
        </div>
      </section>

      <section className="section section--navy on-navy" data-spy="faqs">
        <div className="container narrow">
          <ApplicationStatus settings={settings} id="apply" />
          <p>Payment is made on Paystack's hosted checkout. Your place is confirmed only when Paystack confirms the payment.</p>
        </div>
      </section>
    </SiteShell>
  );
}
