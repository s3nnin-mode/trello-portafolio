export interface BoardProps {
    name: string
    lists: { 
        listName: string,
        targets: { 
            nameTarget: string, 
            nameList: string,  
            tags: { color: string, active: boolean, nameTag: string }[]
        }[]
    }[]
}