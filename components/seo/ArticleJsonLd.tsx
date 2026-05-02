type ArticleJsonLdProps = {
  headline: string;
  description?: string;
  url: string;
  image?: string;
  datePublished?: string;
  authorName?: string;
};

export default function ArticleJsonLd({
  headline,
  description,
  url,
  image,
  datePublished,
  authorName = "BTTB MOVEMENT",
}: ArticleJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    mainEntityOfPage: url,
    image: image ? [image] : undefined,
    datePublished: datePublished || undefined,
    dateModified: datePublished || undefined,
    author: {
      "@type": "Organization",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "BTTB MOVEMENT",
      url: "https://bttbmovement.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}