export const siteSettingsQuery = /* groq */ `*[_type == "siteSettings"][0]{
  academyName,
  applicationStatus,
  applicationUrl,
  interestListUrl,
  nextCohortAnnouncement,
  playbookUrl,
  supportUrl,
  contactEmail,
  whatsappNumber,
  socialLinks[]{platform, url},
  organisationName,
  activeCohort->{
    _id,
    name, status, startDate, endDate, deadline,
    priceNgn, priceUsd, orgPackagePriceNgn, orgPackagePriceUsd,
    deliveryFormat, registrationUrl, confirmedBenefits
  }
}`;

export const testimonialsQuery = /* groq */ `*[_type == "testimonial" && approved == true && published == true][0...6]{_id, quote, name, organisation, role, cohort}`;

export const latestPostsQuery = /* groq */ `*[_type == "post" && status == "published" && defined(slug.current)] | order(publishedAt desc)[0...3]{_id, title, "slug": slug.current, excerpt, publishedAt}`;
