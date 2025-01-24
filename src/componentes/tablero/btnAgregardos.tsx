import React, { Children, ReactNode } from 'react';
import '../../styles/tablero/agregarLista.scss';
import { AiOutlinePlus } from "react-icons/ai";
import { useState } from 'react';

interface BtnAddProps {
    createListWithThisName: (name: string) => void;
    btnName: string;
    // btnAdd: (props: any) => JSX.Element;
    BtnAdd: ReactNode;
    Form: ReactNode;
    Actions: ReactNode;
}


export const CompountBtnAdd: React.FC<BtnAddProps> = ({ props,  children}: any) => {
    const [showForm, setShowForm] = useState(false);
    const [listName, setListName] = useState('');

    const cancel = () => {
        setShowForm(false);
        setListName('');
    }

    const handleClick = () => {
        if (listName.trim() === '') return;
        // createListWithThisName(listName);
        setShowForm(false);
    }

    return (
        <div {...props}>
            {children}
        </div>
    )
}



const BtnAdd = ({props, children}: any) => <button {...props}>{children}</button>;
const Icono = ({props}: any) => <AiOutlinePlus {...props} />;
const BtnName = ({props, children}: any) => <span {...props}>{children}</span>;

BtnAdd.Icono = Icono;
BtnAdd.BtnName = BtnName;


const Form = ({props, children}: any) => <form {...props}>{children}</form>;
const Input = ({props}: any) => <input {...props} />;
const Actions = ({props, children}: any) => <div {...props}>{children}</div>;

Form.Input = Input;
Form.Actions = Actions;


const Button = ({props, children}: any) => <button {...props}>{children}</button>;

// CompountBtnAdd.BtnAdd = BtnAdd;
// CompountBtnAdd.Form = Form;
// CompountBtnAdd.Actions = Button;
// CompountBtnAdd.btnAdd = btnAdd;





