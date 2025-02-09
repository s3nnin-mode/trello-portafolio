
// export interface ListProps {
//     idList: string
//     nameList: string
//     colorList: string
//     targets: TargetProps[]
// }

// export interface BoardProps {
//     idBoard: string
//     nameBoard: string
//     lists: ListProps[]
// }

//BOARDS TYPES
export interface BoardProps {
    idBoard: string
    nameBoard: string
}

//LISTS TYPES

export interface ListProps {
    idList: string
    nameList: string
    colorList: string
}

export interface ListsGroup {
    idBoard: string
    lists: ListProps[]
}

//TARGETS TYPES

export interface TagsProps {
    idTag: string
    color: string
    nameTag: string
    targetsThatUseIt: {idBoard: string, idList: string, idTarget: string}[]
}

export interface TargetProps {
    idTarget: string
    nameTarget: string
}

export interface TargetsGroup {
    idBoard: string
    idList: string
    targets: TargetProps[]
}