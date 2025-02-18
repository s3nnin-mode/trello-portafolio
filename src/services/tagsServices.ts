import { useAuthContext } from "../customHooks/useAuthContext"
import { useTagsStore } from "../store/tagsStore";
import { TagsProps } from "../types/boardProps";

export const useTagsService = () => {
    const { userAuth } = useAuthContext();

    const tagsServices = (updateFn: (tags: TagsProps[]) => TagsProps[]) => {

        useTagsStore.setState((state) => ({
            tags: updateFn(state.tags)
        }));

        if (userAuth) {
        } else {
            const tagsLS = localStorage.getItem('tags-storage');

            if (tagsLS) {
                const updateTags = updateFn(JSON.parse(tagsLS));
                localStorage.setItem('tags-storage', JSON.stringify(updateTags));
            }
        }
    }

    return { tagsServices }
}