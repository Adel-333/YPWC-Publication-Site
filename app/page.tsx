import { YpwcLanding } from "@/components/YpwcLanding";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Young Physics Writers Contest",
    description:
      "A magazine-style physics writing competition by Physics Club Magazine.",
    organizer: {
      "@type": "Organization",
      name: "Physics Club Magazine",
      url: "https://www.octphysicsclub.org/magazine/",
    },
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <YpwcLanding />
    </>
  );
}
