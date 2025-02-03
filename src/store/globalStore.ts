// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { ListsGroup, useListsStore } from "./listsStore";
// import { TargetsGroup, useTargetsStore } from "./targetsStore";
// import { useBoardsStoree } from "./boardsStoredos";

// interface BoardProps {
//     idBoard: string
//     nameBoard: string
// }

// interface GlobalStoreProps {
//     boards: BoardProps[]
//     lists: ListsGroup[]
//     targets: TargetsGroup[]
// }

// const { boards } = useBoardsStoree();
// const { listsGroup } = useListsStore();
// const { targetsGroup } = useTargetsStore();

// export const useGlobalStore = create<GlobalStoreProps>()(
//     persist(
//         (set) => ({
//             boards: boards,
//             lists: listsGroup,
//             targets: targetsGroup
//         }),
//         {
//             name: 'boards-storage'
//         }
//     )
// )