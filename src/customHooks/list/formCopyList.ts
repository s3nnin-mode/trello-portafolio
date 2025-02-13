import { useState } from "react";
import { useListsStore } from "../../store/listsStore";
import { ListProps } from "../../types/boardProps";
import { useTargetsStore } from "../../store/targetsStore";

interface UseFormCopyList {
    setIsModalOptionsActive: React.Dispatch<React.SetStateAction<boolean>>
}

export const useFormCopyList = ({ setIsModalOptionsActive }: UseFormCopyList) => {
    const { listsGroup, setLists } = useListsStore();
    const { setCardsGroup, cardsGroup } = useTargetsStore()

    const [showFormCopyList, setShowFormCopyList] = useState(false);

    const copyList = ({idBoard, list, inputText}: {idBoard: string, list: ListProps, inputText: string}) => {
        const idListToCopy = list.idList;  //id a buscar
        const indexListGroup = listsGroup.findIndex(listGroup => listGroup.idBoard === idBoard);
        const indexListToCopy = listsGroup[indexListGroup].lists.findIndex(list => list.idList === idListToCopy);

        const idList = (Date.now() + list.nameList).toString();  //nuevo id para la lista copiada

        const listCopy = {
            ...list, 
            idList: idList,
            nameList: inputText
        }

        const indexTargetGroup = cardsGroup.findIndex(cardGroup => cardGroup.idBoard === idBoard && cardGroup.idList === idListToCopy);
        if (indexTargetGroup > -1) {
            const cards = cardsGroup[indexTargetGroup].cards;       //se copia las targets de la lista copiada con un nuevo idList 
            setCardsGroup({idBoard, idList, cards});                   //y se agrega un nuevo targetGroup con las tarjetas de la lista que se copio
        }

        //{   ESTA PARTE POSICIONA LA LISTA COPIADA JUSTO EN LA SIGUIENTE COLUMNA DE LA LISTA QUE SE COPIÓ
        const LISTS = [...listsGroup[indexListGroup].lists];          
        let lists: ListProps[] = [];

        for (let i = 0; i < LISTS.length; i++) {
            lists.push(LISTS[i]);
            if (i === indexListToCopy) {
                lists.push(listCopy);
            }
        }
        //}
        setLists({idBoard, lists})

        {/*
            por si acaso, un targetGroup se ve asi: 
            {
            idBoard: string
            idList: string
            targets: [aqui van sus propiedades]
            }
            
        */}
    }

    const callbackHandleCopyList = ({idBoard, list, inputText}: {idBoard: string, list: ListProps, inputText: string}) => {    //al apretar el boton de copiar se cierra el formulario de copiar lista y se cierra el modal de opciones de la lista
        copyList({ idBoard, list, inputText });
        setShowFormCopyList(false);
        setIsModalOptionsActive(false);
    }

    const openFormCopyList = () => {
        setIsModalOptionsActive(false);
        setShowFormCopyList(true);
    }

    const closeFormCopyList = () => {               //solo se cierra el form
        setShowFormCopyList(false);
        setIsModalOptionsActive(true);
    }

    const closeAllFormCopy = () => {           //se cierra form y modal de opciones
        setShowFormCopyList(false);
        setIsModalOptionsActive(false);
    }

    return { showFormCopyList, openFormCopyList, closeFormCopyList, closeAllFormCopy, callbackHandleCopyList }
}