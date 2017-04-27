
function linkField(field, includes) {
  if (field.sys && field.sys.type === 'Link') {
    const link = includes[field.sys.linkType].find(m => m.sys.id === field.sys.id);

    if (link && link.fields) {
      return linkEntry(link, includes); // eslint-disable-line no-use-before-define
    }

    return link;
  }

  return field;
}

function linkEntry(item, includes) {
  const res = {};

  Object.keys(item.fields).forEach((key) => {
    if (Array.isArray(item.fields[key])) {
      res[key] = item.fields[key].map(m => linkField(m, includes));
    } else {
      res[key] = linkField(item.fields[key], includes);
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

export { linkField, linkEntry, parse };
