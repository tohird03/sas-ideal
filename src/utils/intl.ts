type Params = Record<string, string | number>;
type Return = (key: string, params?: Params) => string;

/***
 * @Example:
 * dictionary: {'text": "Email: {email}, Name: {name}, Age: {age}'}
 * i18n('text', params);
 * @return [string] // 'Email: email@site.ru, Name: Ivan, Age: 105'
 * */

export const dictionaryWithKeys: Return = (text, params) => {
  let dictItem = text;

  if (params) {
    Object.keys(params).forEach((paramKey) => {
      const trimmedParamKey = paramKey.trim();
      const searchValue = `{${trimmedParamKey}}`;

      dictItem = dictItem.replace(new RegExp(searchValue, 'g'), `${params[trimmedParamKey]}`);
    });
  }

  return dictItem;
};
