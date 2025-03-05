//BOARDS TYPES
export interface BoardProps {
    idBoard: string
    nameBoard: string
}

//boards: boardsProps[]

//LISTS TYPES

export interface ListProps {
    idList: string
    nameList: string
    colorList: string
    order: number
}

//Lists: ListsGroup[] donde cada lista en ralidad es un grupo de lista enlazado al idBoard para saber que pertenece a el
//esto esta hecho asi porque boards, lists, cards son tres estados diferentes
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
    complete: boolean
    description: string | null
    order: number
}

export interface CardGroupProps {
    idBoard: string
    idList: string
    cards: CardProps[]
}

export interface CardRef {
    idBoard: string
    idList: string
    idCard: string
}