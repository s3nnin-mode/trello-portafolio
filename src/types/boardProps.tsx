export interface TargetProps {
    idTarget: string
    nameTarget: string
    tags: { color: string, active: boolean, nameTag: string }[]
}

export interface ListProps {
    idList: string
    nameList: string
    colorList: string
    targets: TargetProps[]
}

export interface BoardProps {
    idBoard: string
    nameBoard: string
    lists: ListProps[]
}