import { useEffect, useRef } from 'react'

const useDeepCompareEffect = () => {
    const deepEqual = (obj1, obj2) => {
        if (obj1 === obj2) return true

        if (
            typeof obj1 !== 'object' ||
            obj1 === null ||
            typeof obj2 !== 'object' ||
            obj2 === null
        )
            return false

        let keys1 = Object.keys(obj1)
        let keys2 = Object.keys(obj2)

        if (keys1.length !== keys2.length) return false

        for (let key of keys1) {
            if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key]))
                return false
        }

        return true
    }

    const useDeepCompareEffect = (callback, dependencies) => {
        const firstRenderRef = useRef(true)
        const dependenciesRef = useRef(dependencies)

        useEffect(() => {
            if (
                firstRenderRef.current ||
                !deepEqual(dependencies, dependenciesRef.current)
            ) {
                callback()
                dependenciesRef.current = dependencies
                firstRenderRef.current = false
            }
        }, [dependencies])
    }

    return { useDeepCompareEffect }
}

export default useDeepCompareEffect
