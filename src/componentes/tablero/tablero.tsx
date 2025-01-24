import '../../styles/tablero/tablero.scss';
import { List } from './lista';
import { BtnAdd } from './btnAgregar';
import { useState } from "react";
import { Target } from "./tarjeta";

interface ListaProps {
    name: string
}


export const Tablero = () => {
    const [lists, setLists] = useState<ListaProps[]>([]);

    const createList = (nameList:  string) => {
        const newLists = [...lists, {name: nameList}];
        setLists(newLists);
        console.log(newLists);
    }

    return (
        <div className='board'>
            <header>
                <h2>Nombre Tablero</h2>
            </header>
            <div className='board_content'>
                {
                    lists.map((list) => (
                        <List nameList={list.name} key={list.name} />
                    ))
                }
                <BtnAdd createListOrTargetName={createList} btnName='list'/>
            </div>
        </div>
    )
};