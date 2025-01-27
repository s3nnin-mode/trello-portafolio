export interface TargetProps {
    nameTarget: string, 
    tags: { color: string, active: boolean, nameTag: string }[]
}

export interface ListProps {
    nameList: string
    targets: TargetProps[]
}


export interface BoardProps {
    nameBoard: string
    lists: ListProps[]
}