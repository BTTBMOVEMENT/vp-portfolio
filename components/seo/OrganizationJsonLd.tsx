export default function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BTTB MOVEMENT",
    url: "https://bttbmovement.com",
    description:
      "BTTB MOVEMENT is a cinematic portfolio focused on virtual production, cinematography, visual storytelling, works, journals, and image archives.",
    email: "bttbmovement@gmail.com",
    sameAs: [
      "https://x.com/BTTBMovement",
      "https://www.instagram.com/24minus0.024/",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}