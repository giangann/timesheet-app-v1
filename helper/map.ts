export function arrayObjectToMap<O, K extends keyof O>(arrayObjects: O[], key: K): Map<string, O>;
export function arrayObjectToMap<O, K extends keyof O, V>(arrayObjects: O[], key: K, iniValue: V): Map<string, V>;
export function arrayObjectToMap<O, K extends keyof O, V>(arrayObjects: O[], key: K, iniValue: (obj: O) => V): Map<string, V>;

export function arrayObjectToMap<O, K extends keyof O, V>(arrayObjects: O[], key: K, iniValue?: V | ((obj: O) => V)): Map<string, V | O> {
  const result = new Map<string, V | O>();

  arrayObjects.forEach((obj) => {
    const keyValue = String(obj[key]);
    const value = iniValue instanceof Function ? iniValue(obj) : iniValue ?? obj;
    result.set(keyValue, value);
  });

  return result;
}


export function combineMaps<K, V>(maps: Array<Map<K, V>>): Map<K, V> {
  const combinedMap = new Map<K, V>();

  maps.forEach((map) => {
    map.forEach((value, key) => {
      combinedMap.set(key, value);
    });
  });

  return combinedMap;
}

export function getMapValues<K, V>(map: Map<K, V>): V[] {
  return Array.from(map.values());
}

export function getMapKeys<K, V>(map: Map<K, V>): K[] {
  return Array.from(map.keys());
}

export function getMapKeysBySpecifyValue<K, V>(map: Map<K, V>, value: V): K[] {
  const keys = getMapKeys(map);
  return keys.filter((key) => map.get(key) === value);
}
