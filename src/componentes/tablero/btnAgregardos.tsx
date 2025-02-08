import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";

interface BtnAddProps {
  onSubmit: (value: string) => void;
  children: React.ReactNode
}

// 📌 Componente principal que maneja el estado
const BtnAdd = ({ onSubmit, children }: { onSubmit: (value: string) => void; children: React.ReactNode }) => {
  const [showForm, setShowForm] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const openForm = () => setShowForm(true);

  const $closeForm = () => {
    setShowForm(false);
    setInputValue("");
  };

  const submit = () => {
    if (inputValue.trim() === '') return;
    onSubmit(inputValue);
    $closeForm();
  };

  // Pasamos estado y funciones como props a los hijos
  return (
    <div className="btn-add">
      {React.Children.map(children, (child) =>
        isValidElement(child)
          ? cloneElement(child, {
              setShowForm,
              showForm,
              inputValue,
              setInputValue,
              handleSubmit,
            })
          : child
      )}
    </div>
  );
};

// 📌 Subcomponentes

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  openForm?: () => void
  showForm?: boolean
}

const Button: React.FC<ButtonProps> = ({children, className, showForm, openForm, ...props }) => {
  if (showForm) return null;

  return (
    <button className={className} onClick={() => openForm?.()} {...props}>
      <AiOutlinePlus />
      {children}
    </button>
  );
};

const Form = ({ children, showForm, ...props }: { children: React.ReactNode; showForm?: boolean }) => {
  if (!showForm) return null;
  return <form {...props}>{children}</form>;
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputValue?: string
  setInputValue?:  (value: string) => void
}

const Input = ({ inputValue = "", setInputValue = (e: any) => {}, ...props }) => {
  return <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} {...props} />;
};


interface ActionsProps {
  $closeForm?: () => void
  submit?: () => void
}

const Actions = ({...props }: ActionsProps) => {
  const { submit, $closeForm } = props
  return (
  <div className="actions" {...props}>
    <button type="button" onClick={submit}>
      Agregar
    </button>
    <button type="button" onClick={$closeForm}>
      Cancelar
    </button>
  </div>
  )
};


// 📌 Asignamos los subcomponentes a `BtnAdd`
BtnAdd.Button = Button;
BtnAdd.Form = Form;
BtnAdd.Input = Input;
BtnAdd.Actions = Actions;

export default BtnAdd;
