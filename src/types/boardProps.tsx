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
    cardsThatUseIt: {idBoard: string, idList: string, idCard: string}[]
}

export interface CardProps {
    idCard: string
    nameCard: string
    coverCard: string
    coverCardImgs: string[]
    currentCoverType: 'color' | 'img'
    complete?: boolean
}

export interface CardGroupProps {
    idBoard: string
    idList: string
    cards: CardProps[]
}