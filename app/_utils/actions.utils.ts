export type NullableFieldsRecord<T extends Record<PropertyKey, unknown> | null> = {
  [Key in keyof T]: T[Key] | null;
};

export type RecordEntries<T> = Array<
  {
    [K in keyof T]: [K, T[K]];
  }[keyof T]
>;
