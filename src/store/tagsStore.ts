import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TagsProps } from "../types/boardProps";

const tags: TagsProps[] = [
    { idTag: "1", color: "#FF5733", nameTag: "Urgente", cardsThatUseIt: [] },
    { idTag: "2", color: "#33FF57", nameTag: "Importante", cardsThatUseIt: [] },
    { idTag: "3", color: "#3357FF", nameTag: "Pendiente", cardsThatUseIt: [] },
    { idTag: "4", color: "#FF33A8", nameTag: "Revisión", cardsThatUseIt: [] },
    { idTag: "5", color: "#A833FF", nameTag: "Aprobado", cardsThatUseIt: [] },
    { idTag: "6", color: "#33FFF5", nameTag: "Rechazado", cardsThatUseIt: [] },
    { idTag: "7", color: "#F5FF33", nameTag: "En proceso", cardsThatUseIt: [] },
    { idTag: "8", color: "#FF8C33", nameTag: "Finalizado", cardsThatUseIt: [] },
    { idTag: "9", color: "#8C33FF", nameTag: "Bloqueado", cardsThatUseIt: [] },
    { idTag: "10", color: "#33FF8C", nameTag: "En espera", cardsThatUseIt: [] },
    { idTag: "11", color: "#FF3333", nameTag: "Urgencia alta", cardsThatUseIt: [] },
    { idTag: "12", color: "#33A8FF", nameTag: "Investigación", cardsThatUseIt: [] },
    { idTag: "13", color: "#A8FF33", nameTag: "Análisis", cardsThatUseIt: [] },
    { idTag: "14", color: "#FF5733", nameTag: "Propuesta", cardsThatUseIt: [] },
    { idTag: "15", color: "#5733FF", nameTag: "Concepto", cardsThatUseIt: [] },
    { idTag: "16", color: "#FF33F5", nameTag: "Feedback", cardsThatUseIt: [] },
    { idTag: "17", color: "#33FFF5", nameTag: "Pendiente de aprobación", cardsThatUseIt: [] },
    { idTag: "18", color: "#F5A833", nameTag: "Soporte", cardsThatUseIt: [] },
    { idTag: "19", color: "#A833F5", nameTag: "Bug", cardsThatUseIt: [] },
    { idTag: "20", color: "#33F5A8", nameTag: "Mejora", cardsThatUseIt: [] }
  ];
  

interface State {
    tags: TagsProps[]
    setCreateTag: (newTag: TagsProps) => void
    setUpdateTag: ({idTag, nameTag, color}: {idTag: string, nameTag: string, color: string}) => void
    setTagUsage: ({idBoard, idList, idCard, idTag}: {idBoard: string, idList: string, idCard: string, idTag: string}) => void
    setRemoveTag: (idTag: string) => void
}

export const useTagsStore = create<State>()(
    persist(
        (set) => ({
            tags: tags,
            setCreateTag: (newTag) => set((state) => ({
                tags: [newTag, ...state.tags]
            })),
            setUpdateTag: ({idTag, nameTag, color}) => set((state) => ({
                tags: state.tags.map((tag) => 
                    tag.idTag === idTag
                    ?
                    {
                        ...tag,
                        nameTag: nameTag,
                        color: color
                    }
                    :
                    tag
                )
            })),
            setTagUsage: ({idBoard, idList, idCard, idTag}) => set((state) => ({
                tags: state.tags.map((tag) => 
                    tag.idTag === idTag 
                    ?
                    {
                      ...tag,
                        cardsThatUseIt: tag.cardsThatUseIt.some(card => 
                        card.idBoard === idBoard && card.idList === idList && card.idCard === idCard) 
                        ? 
                        tag.cardsThatUseIt.filter(card => card.idBoard !== idBoard && card.idList !== idList && card.idCard !== idCard) 
                        : 
                        [...tag.cardsThatUseIt, {idBoard, idList, idCard}]
                    }
                    :
                    tag
                )
            })),
            setRemoveTag: (idTag) => set((state) => ({
                tags: state.tags.filter(tag => tag.idTag !== idTag)
            }))
        }),
        {
            name: 'tags-storage'
        }
    )
)

// setTagUsage: ({idBoard, idList, idTarget, idTag}) => set((state) => ({
//     tags: state.tags.map((tag) => 
//         tag.idTag === idTag && tag.targetsThatUseIt.some(target => target.idBoard === idBoard && target.idList === idList && target.idTarget === idTarget)
//         ?
//         {
//           ...tag,
//           targetsThatUseIt: tag.targetsThatUseIt.filter(target => target.idBoard !== idBoard && target.idList !== idList && target.idTarget !== idTarget)
//         }
//         :
//         {
//             ...tag,
//             targetsThatUseIt: [...tag.targetsThatUseIt, { idBoard, idList, idTarget }]
//         }
//     )
// }))