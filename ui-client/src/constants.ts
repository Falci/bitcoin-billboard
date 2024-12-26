const IS_DEV = parseInt(location.port) !== 443 || location.search.includes('dev');

export const ONE_BTC = 1e8;
export const MIN_SATS =  IS_DEV ? 1e4 : ONE_BTC;