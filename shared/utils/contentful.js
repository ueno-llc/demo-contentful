
function linkField(field, includes, locale) {
  let f = field;

  // field might be on form { locale: value }, e.g { 'en-US': 'title' }
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

function linkEntry(item, includes) {
  const res = {};
  const locale = (item.sys && item.sys.locale) || 'en-US';

  Object.keys(item.fields).forEach((key) => {
    if (Array.isArray(item.fields[key])) {
      res[key] = item.fields[key].map(m => linkField(m, includes, locale));
    } else {
      res[key] = linkField(item.fields[key], includes, locale);
    }
  });

  return {
    id: item.sys.id,
    ...res,
  };
}

function parse(data) {
  const items = data.items;
  const includes = data.includes || {};
  const parsed = items.map(m => linkEntry(m, includes));

  return parsed;
}

function parseIncludes(data) {
  const includes = data.includes || {};

  const entries = includes.Entry || [];
  const assets = includes.Asset || [];

  return { entries, assets };
}

export { linkField, linkEntry, parse, parseIncludes };
