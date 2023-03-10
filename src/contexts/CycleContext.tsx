import { differenceInSeconds } from "date-fns";
import React, { useState } from "react";
import { ReactNode } from "react";
import { useEffect } from "react";
import { createContext, useReducer } from "react";
import { ActionTypes, addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import {   Cycle, cyclesReducer } from '../reducers/cycles/reducer';


interface CreateCycleData {
    task: string,
    minutesAmount:number
}

interface CyclesContextType {
    cycles: Cycle[],
    activeCycle: Cycle | undefined,
    activeCycleId: string | null,
    amountSecondsPassed: number,
    markCurrentCycleFinished: () => void,
    setSecondsPassed: (seconds: number) => void,
    createNewCycle: (data: CreateCycleData) => void,
    interruptCurrentCycle: () => void,
}
 
export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
     children: ReactNode
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
    const [cyclesState, dispatch] = useReducer(cyclesReducer,
    {
        cycles: [],
        activeCycleId: null
        // }, () => {
        //     // const storedStateAsJSON = localStorage.getItem('@ignite-timer:cycles-state-1.0.0')

        //     // if (storedStateAsJSON) {
        //     //     return JSON.parse(storedStateAsJSON)
        //     // }
    })

    const {cycles, activeCycleId} = cyclesState
    const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)


    const [amountSecondsPassed, setAmountSecondsPassed] = useState( () => {
        if (activeCycle) {
            return differenceInSeconds(new Date(), new Date(activeCycle.startDate)) 
        }
        return 0
    })

    // useEffect(() => {
    //     const stateJSON = JSON.stringify(cyclesState)
        
    //     localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
    // }, [cyclesState])

   



    // const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }
     
    function markCurrentCycleFinished() {
        dispatch(markCurrentCycleAsFinishedAction())
    }

    function createNewCycle(data: CreateCycleData) {

        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }
 
        dispatch(addNewCycleAction( newCycle))

        setAmountSecondsPassed(0)
    }

    function interruptCurrentCycle() {
        dispatch(interruptCurrentCycleAction())
}

    return(
        <CyclesContext.Provider 
            value={{ 
             cycles,
             activeCycle, 
             activeCycleId, 
             markCurrentCycleFinished, 
             amountSecondsPassed, 
             setSecondsPassed,
             createNewCycle,
             interruptCurrentCycle,
            }}>
         { children  }
        </CyclesContext.Provider>
    )
}