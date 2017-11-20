import flattenObject from 'utils/flattenObject';

function linkedAsset(asset) {
  const { sys, fields } = asset;

  if (!(fields.file && fields.file.url)) return undefined;

  return flattenObject({ ...fields, id: sys.id });
}

function linkField(field, includes) {
  if (field.sys && field.sys.type === 'Link') {
    const link =
      includes[field.sys.linkType] &&
      includes[field.sys.linkType].find(m => m.sys.id === field.sys.id);

    if (link && link.fields) {
      return linkEntry(link, includes); // eslint-disable-line no-use-before-define
    }

    return link;
  }

  return field;
}

function linkEntry(item, includes) {
  const res = {};

  if (item.sys.type === 'Asset') {
    return linkedAsset(item);
  }

  Object.keys(item.fields).forEach((key) => {
    if (Array.isArray(item.fields[key])) {
      res[key] = item.fields[key].reduce((result, m) => {
        const linkedField = linkField(m, includes);
        if (linkedField) {
          result.push(linkedField);
        }
        return result;
      }, []);
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
  const { items, includes } = data;

  return items.map(item => linkEntry(item, includes));
}

export { linkField, linkEntry, parse };
