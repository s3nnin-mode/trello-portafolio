import { useState } from "react";
import { useSettingsModalList } from "../../componentes/tablero/settingsList";

interface AccesDirectToAddTargetProps {
    setIsModalOptionsActive: React.Dispatch<React.SetStateAction<boolean>>
}

export const useAccesDirectToAddTarget = ({setIsModalOptionsActive}: AccesDirectToAddTargetProps) => {
    const [showAccesDirectToAddNewTarget, setShowAccesDirectToAddNewTarget] = useState(false);

    const openAccesDirect = () => {
        setShowAccesDirectToAddNewTarget(true);
        setIsModalOptionsActive(false);
    }

    return { showAccesDirectToAddNewTarget, openAccesDirect }
}