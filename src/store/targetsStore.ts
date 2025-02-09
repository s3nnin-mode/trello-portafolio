import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TargetProps, TargetsGroup } from "../types/boardProps";

interface State {
    targetsGroup: TargetsGroup[]
    setTargetsGroup: (props: {idBoard: string, idList: string, targets: TargetProps[]}) => void      //setTargetGroup es para inicializar un objeto con un idBoard, idList para saber a que board y list pertenece, se incializa con un array vacio
    setTarget: ({idBoard, idList, newTarget} : {idBoard: string, idList: string, newTarget: TargetProps}) => void
    setTargetToTop: ({idBoard, idList, targetToAdd}: {idBoard: string, idList: string, targetToAdd: TargetProps}) => void
}

export const useTargetsStore = create<State>()(
    persist(
        (set) => ({
            targetsGroup: [],
            setTargetsGroup: ({idBoard, idList, targets}) => set((state) => ({
                targetsGroup: [...state.targetsGroup, { idBoard: idBoard, idList: idList, targets: targets }]
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
            })),
            setTargetToTop: ({idBoard, idList, targetToAdd}) => set((state) => ({
                targetsGroup: state.targetsGroup.map((targetGroup) => 
                    targetGroup.idBoard === idBoard && targetGroup.idList === idList
                ?
                {
                    ...targetGroup,
                    targets: [targetToAdd, ...targetGroup.targets]
                }
                :
                targetGroup
                )
            })),
            
        }),
        {
            name: 'targets-storage'
        }
    )
)

// setActiveTag: ({idBoard, idList, idTarget, nameTag}) => set((state) => ({
//     targetsGroup: state.targetsGroup.map((targetGroup) => 
//         targetGroup.idBoard === idBoard && targetGroup.idList === idList
//         ?
//         {
//             ...targetGroup,
//             targets: targetGroup.targets.map((target) => 
//                 target.idTarget === idTarget
//                 ?
//                 {
//                     ...target, 
//                     tags: target.tags.map((tag) =>
//                         tag.nameTag === nameTag 
//                         ?
//                         { ...tag, active: !tag.active }
//                         :
//                         tag
//                     )
//                 }
//                 :
//                 target
//             )
//         }
//         :
//         targetGroup
//     )
// })),