import { Dispatch, SetStateAction, useCallback, useState, ChangeEvent } from "react"

type ReturnTypes<T> = [T, (e: ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>]

 // 형태를 사용되고 있는 코드와 비슷하게 만들자
export const useInput = <T>(initialData: T): ReturnTypes<T> => {
  const [value, setValue] = useState(initialData)

  const handler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value as unknown as T);
  }, []);

  return [value, handler, setValue];
}