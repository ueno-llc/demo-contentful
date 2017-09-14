const defaultLocale = 'en-US';

// field might be on form { locale: value }, e.g { 'en-US': 'title' }
function setFieldLocale(field, locale = defaultLocale) {
  if (typeof field === 'object' && (locale in field)) {
    return field[locale];
  }

  return field;
}

function linkField(field, includes, locale) {
  let f = setFieldLocale(field);

  if (typeof field === 'object' && (locale in field)) {
    f = field[locale];
  }

  if (f.sys && f.sys.type === 'Link') {
    const link = includes[f.sys.linkType].find(m => m.sys.id === f.sys.id);

    if (link && link.fields) {
      return linkEntry(link, includes); // eslint-disable-line no-use-before-define
    }

    return link;
  }

  return f;
}

function setItemLocale(item, locale = defaultLocale) {
  Object.keys(item.fields).forEach((key) => {
    const field = item.fields[key];

    item.fields[key] = setFieldLocale(field, locale);
    if (typeof field === 'object' && (locale in field)) {
      const value = field[locale];

      item.fields[key] = value;
    }
  });

  return item;
}

function linkEntry(item, includes) {
  const res = {};
  const locale = (item.sys && item.sys.locale) || defaultLocale;

  Object.keys(item.fields).forEach((key) => {
    if (Array.isArray(item.fields[key])) {
      const mapped = item.fields[key]
        .map(m => linkField(m, includes, locale))
        // drop any undefined values from linking
        .filter(Boolean);
      res[key] = mapped;
    } else {
      res[key] = linkField(item.fields[key], includes, locale);
    }
  });

  return {
    id: item.sys.id,
    ...res,
  };
}

function parse(data = {}) {
  const items = data.items || {};
  const includes = data.includes || {};
  const parsed = items.map(m => linkEntry(m, includes));

  return parsed;
}

function parseIncludes(data = {}) {
  const includes = data.includes || {};

  const entries = includes.Entry || [];
  const assets = includes.Asset || [];

  return { entries, assets };
}

export { linkField, linkEntry, parse, parseIncludes, setItemLocale };
