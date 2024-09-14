/**
 * TP: orbital period in tropical years
 * mP: mass relative to earth
 * rP: radius in km
 * eP: orbital excentricity
 * aP: length of the orbital semi-major axis in AUs
 * thetaP: angular diameter at 1AU
 * VP: visual magnitude at 1AU
 * myP: standard gravitational parameter in km3/s2
 * iP: inclination of the orbital plane w.r.t. the ecliptic
 * epsilonP: ecliptic longitude at the epoch
 * piP: ecliptic longitude at perihelion
 * OmegaP: ecliptic longitude of the ascending node at the epoch
 */
const planets = [
  {
    name: "Mercurius",
    TP: 0.240847,
    mP: 0.055274,
    rP: 2439.7,
    eP: 0.205636,
    aP: 0.3870993,
    thetaP: 6.74,
    VP: -0.42,
    myP: 22032,
    iP: 7.004979,
    epsilonP: 252.250324,
    piP: 77.457796,
    OmegaP: 48.330766,
  },
  {
    name: "Venus",
    TP: 0.615197,
    mP: 0.814998,
    rP: 6051.8,
    eP: 0.0067767,
    aP: 0.723336,
    thetaP: 16.92,
    VP: -4.4,
    myP: 324860,
    iP: 3.394676,
    epsilonP: 181.9791,
    piP: 131.602467,
    OmegaP: 76.679843,
  },
  {
    name: "Mars",
    TP: 1.880848,
    mP: 0.107447,
    rP: 3389.5,
    eP: 0.093394,
    aP: 1.52371,
    thetaP: 9.36,
    VP: -1.52,
    myP: 42828,
    iP: 1.849691,
    epsilonP: -4.553432,
    piP: -23.94363,
    OmegaP: 49.559539,
  },
  {
    name: "Iupiter",
    TP: 11.862615,
    mP: 317.828133,
    rP: 69911,
    eP: 0.048393,
    aP: 5.202887,
    thetaP: 196.74,
    VP: -9.4,
    myP: 126687000,
    iP: 1.3043975,
    epsilonP: 34.396441,
    piP: 14.72848,
    OmegaP: 100.473909,
  },
  {
    name: "Saturnus",
    TP: 29.447498,
    mP: 95.160904,
    rP: 58232,
    eP: 0.053862,
    aP: 9.536676,
    thetaP: 165.6,
    VP: -8.88,
    myP: 37931000,
    iP: 2.485992,
    epsilonP: 49.954244,
    piP: 92.598878,
    OmegaP: 113.662424,
  },
];

export default planets;
