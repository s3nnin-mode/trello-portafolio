import { create } from "zustand";
import { TagsProps } from "../types/boardProps";

interface State {
    tags: TagsProps[]
    loadTags: (tags: TagsProps[]) => void
    setCreateTag: (newTag: TagsProps) => void
    setUpdateTag: ({idTag, nameTag, color}: {idTag: string, nameTag: string, color: string}) => void
    setTagUsage: ({idBoard, idList, idCard, idTag}: {idBoard: string, idList: string, idCard: string, idTag: string}) => void
    setRemoveTag: (idTag: string) => void
}

export const useTagsStore = create<State>((set) => ({
    tags: [],
    loadTags: (tags) => set(() => ({
        tags: tags
    })),
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
);