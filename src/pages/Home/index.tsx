import { HandPalm, Play } from "phosphor-react";
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod'
import { createContext, useContext, useEffect, useState } from "react";
import { differenceInSeconds } from 'date-fns';
import { NewCycleForm } from "../Home/components/NewCycleForm/index";
import { Countdown } from "./components/Countdown";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import { CyclesContext } from "../../contexts/CycleContext";



const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(5).max(60),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
    const { activeCycle, createNewCycle, interruptCurrentCycle } = useContext(CyclesContext)


    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: { 
            task: '',
            minutesAmount: 0,
        }
    })

    const {  handleSubmit, watch, reset } = newCycleForm

    const task = watch('task')
    const isSubmiteDisable = !task

    function handleCreateNewCycle(data: NewCycleFormData) {
        createNewCycle(data)
        reset()
    }

    return (
         <HomeContainer>
         <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
            
                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>
                <Countdown/>
            
            {activeCycle ? (
            (<StopCountdownButton onClick={interruptCurrentCycle}  type="button">
                <HandPalm size={24}/>
                Interromper 
            </StopCountdownButton>)
            )
            :
            (<StartCountdownButton disabled={isSubmiteDisable} type="submit">
                <Play size={24}/>
                Começar
            </StartCountdownButton>)
            }
        </form>
         </HomeContainer>
    )
}