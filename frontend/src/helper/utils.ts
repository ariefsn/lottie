import { IMap } from "@/entities";

const getJwtExp = (token: string): number => {
  if (!token) {
    return 0
  }
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const decodedToken = JSON.parse(atob(base64));
  const exp = decodedToken.exp;
  return exp
}

const isJwtExpired = (token: string) => {
  const exp = getJwtExp(token);
  if (!token) {
    return true
  }
  return exp < Date.now() / 1000
}

const isEmpty = (val: any): boolean => {
  return [undefined, null, 0, ''].includes(val)
}

const parseGqlError = (error: any): string => {
  const errors = error?.response?.errors ?? []
  if (errors.length > 0) {
    const err = errors[0]
    return capitalizeFirstLetter(err.message)
  }

  return 'Unknown error'
}

const isClient = (): boolean => typeof window !== 'undefined';

const isServer = (): boolean => !isClient();

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const arrayChunk = <T>(array: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) => array.slice(i * size, i * size + size));
}

const sleep = (ms: number = 0) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const documentTitle = (title: string) => `${title} | ${process.env.NEXT_PUBLIC_APP_NAME}`

const getDeepValue = <T>(obj: IMap | undefined, key: string, fallback?: T): T => {
  var arr = key ? key.split(".") : [];

  while (arr.length && obj) {
    var comp = arr.shift() ?? '';
    var match = new RegExp("(.+)\\[([0-9]*)\\]").exec(comp);

    // handle arrays
    if ((match !== null) && (match.length == 3)) {
      var arrayData = {
        arrName: match[1],
        arrIndex: match[2]
      };
      if (obj[arrayData.arrName] !== undefined) {
        if (fallback && arr.length === 0) {
          obj[arrayData.arrName][arrayData.arrIndex] = fallback;
        }
        obj = obj[arrayData.arrName][arrayData.arrIndex];
      } else {
        obj = undefined;
      }

      continue;
    }

    // handle regular things
    if (fallback) {
      if (obj[comp] === undefined) {
        obj[comp] = {};
      }

      if (arr.length === 0) {
        obj[comp] = fallback;
      }
    }

    obj = obj[comp];
  }

  return obj as T;
}

const extractCurlyBracket = (text: string): string[] => text.match(/(?<=\{)[^\][]*(?=})/g) || [];

const formatCurrency = (value: number, opt?: { locale: string, decimal: number }) => {
  const decimalPart = (value % 1).toFixed(2)
  const minimumFractionDigits = decimalPart === '0.00' ? 0 : opt?.decimal || 2

  return new Intl.NumberFormat(opt?.locale ?? 'id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits
  }).format(value)
};

const pluralExtension = (value: number, opt?: { singular: string, plural: string }) => value < 2 ? opt?.singular ?? '' : opt?.plural ?? 's'

export { arrayChunk, capitalizeFirstLetter, documentTitle, extractCurlyBracket, formatCurrency, getDeepValue, getJwtExp, isClient, isEmpty, isJwtExpired, isServer, parseGqlError, pluralExtension, sleep };

