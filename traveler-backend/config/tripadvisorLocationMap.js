const tripadvisorLocationMap = {
  paris: '187147',
  tokyo: '298184',
  'new york': '60763',
  london: '186338',
  dubai: '295424',
  barcelona: '187497',
  rome: '187791',
  amsterdam: '188590',
  singapore: '294265',
  bangkok: '293916',
  mumbai: '304554'
};

// Optional aliases for common spelling variants.
const tripadvisorLocationAliases = {
  nyc: 'new york',
  'new york city': 'new york',
  roma: 'rome',
  bombay: 'mumbai'
};

const normalizeKey = (value = '') => String(value).trim().toLowerCase();

const resolveTripadvisorLocationId = (cityName = '') => {
  const normalized = normalizeKey(cityName);
  const aliasTarget = tripadvisorLocationAliases[normalized] || normalized;
  return tripadvisorLocationMap[aliasTarget] || '';
};

module.exports = {
  tripadvisorLocationMap,
  tripadvisorLocationAliases,
  resolveTripadvisorLocationId
};
