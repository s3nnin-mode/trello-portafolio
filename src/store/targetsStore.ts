import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TargetsGroup, TargetProps } from "../types/boardProps";

interface State {
    targetsGroup: TargetsGroup[]
    setTargetsGroup: (props: {idBoard: string, idList: string}) => void      //setTargetGroup es para inicializar un objeto con un idBoard, idList para saber a que board y list pertenece, se incializa con un array vacio
    setTarget: (props: {idBoard: string, idList: string, newTarget: TargetProps}) => void
}

export const useTargetsStore = create<State>()(
    persist(
        (set) => ({
            targetsGroup: [],
            setTargetsGroup: ({idBoard, idList}) => set((state) => ({
                targetsGroup: [...state.targetsGroup, { idBoard: idBoard, idList: idList, targets: [] }]
            })),
            setTarget: ({idBoard, idList, newTarget}) => set((state) => ({
                targetsGroup: state.targetsGroup.map((targetGroup) => 
                    targetGroup.idBoard === idBoard && targetGroup.idList === idList
                ?
                {
                    ...targetGroup,
                    targets: [...targetGroup.targets, newTarget]
                }
                :
                targetGroup
                )
            }))
        }),
        {
            name: 'targets-storage'
        }
    )
)
