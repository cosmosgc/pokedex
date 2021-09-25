interface IObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: number]: any
}

const safeDelete = <TObject extends IObject, TProp extends keyof TObject>(
  object: TObject,
  property: TProp,
): Omit<TObject, TProp> => {
  delete object[property]

  return object
}

export default safeDelete
