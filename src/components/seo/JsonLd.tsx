/**
 * JSON-LD Structured Data Component
 *
 * Provides structured data for search engines to better understand
 * the website content (Sports Club, Events, etc.)
 */

interface SportsClubData {
  name: string;
  alternateName?: string;
  description: string;
  url: string;
  logo: string;
  image?: string;
  foundingDate: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  telephone?: string;
  email?: string;
  sameAs?: string[];
  sport: string;
  memberOf?: {
    name: string;
    url?: string;
  };
}

interface SportsEventData {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location: {
    name: string;
    address: string;
  };
  homeTeam: string;
  awayTeam: string;
  eventStatus?: 'EventScheduled' | 'EventCancelled' | 'EventPostponed';
  offers?: {
    price: number;
    priceCurrency: string;
    url?: string;
    availability?: 'InStock' | 'SoldOut' | 'PreOrder';
  };
}

export function SportsClubJsonLd({ data }: { data: SportsClubData }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name: data.name,
    alternateName: data.alternateName,
    description: data.description,
    url: data.url,
    logo: data.logo,
    image: data.image || data.logo,
    foundingDate: data.foundingDate,
    sport: data.sport,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address.streetAddress,
      addressLocality: data.address.addressLocality,
      addressRegion: data.address.addressRegion,
      postalCode: data.address.postalCode,
      addressCountry: data.address.addressCountry,
    },
    ...(data.geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: data.geo.latitude,
        longitude: data.geo.longitude,
      },
    }),
    ...(data.telephone && { telephone: data.telephone }),
    ...(data.email && { email: data.email }),
    ...(data.sameAs && { sameAs: data.sameAs }),
    ...(data.memberOf && {
      memberOf: {
        '@type': 'SportsOrganization',
        name: data.memberOf.name,
        ...(data.memberOf.url && { url: data.memberOf.url }),
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function SportsEventJsonLd({ data }: { data: SportsEventData }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: data.name,
    description: data.description,
    startDate: data.startDate,
    endDate: data.endDate,
    eventStatus: data.eventStatus ? `https://schema.org/${data.eventStatus}` : undefined,
    location: {
      '@type': 'Place',
      name: data.location.name,
      address: data.location.address,
    },
    homeTeam: {
      '@type': 'SportsTeam',
      name: data.homeTeam,
    },
    awayTeam: {
      '@type': 'SportsTeam',
      name: data.awayTeam,
    },
    ...(data.offers && {
      offers: {
        '@type': 'Offer',
        price: data.offers.price,
        priceCurrency: data.offers.priceCurrency,
        url: data.offers.url,
        availability: data.offers.availability
          ? `https://schema.org/${data.offers.availability}`
          : undefined,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Default club data for Cwmbran Celtic
export const cwmbranCelticData: SportsClubData = {
  name: 'Cwmbran Celtic AFC',
  alternateName: 'Cwmbran Celtic',
  description:
    'Cwmbran Celtic AFC is a Welsh football club based in Cwmbran, Torfaen. The club competes in the JD Cymru South league.',
  url: 'https://cwmbranceltic.com',
  logo: 'https://cwmbranceltic.com/images/club-logo.webp',
  image: 'https://cwmbranceltic.com/og-image.jpg',
  foundingDate: '1925',
  sport: 'Football',
  address: {
    streetAddress: 'Cwmbran Stadium',
    addressLocality: 'Cwmbran',
    addressRegion: 'Torfaen',
    postalCode: 'NP44 3YS',
    addressCountry: 'GB',
  },
  geo: {
    latitude: 51.6508,
    longitude: -3.0217,
  },
  sameAs: [
    'https://twitter.com/cwmbranceltic',
    'https://www.instagram.com/cwmbrancelticfc/',
    'https://www.facebook.com/groups/171728059584376',
  ],
  memberOf: {
    name: 'Cymru South (JD Cymru South)',
    url: 'https://www.faw.cymru',
  },
};
