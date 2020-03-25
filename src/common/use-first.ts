import {useRef} from "react";

export function useFirst<T>(value: T): T
{
    return useRef(value).current;
}
