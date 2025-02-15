import '../../../../styles/components/list/optionsList/formsOptions/removeList.scss';
import { Modal, Button } from "react-bootstrap";
import { useListsStore } from "../../../../store/listsStore";
import { ListProps } from "../../../../types/boardProps";

interface ModalRemoveListProps {
    show: boolean
    onHide: () => void
    idBoard: string
    list: ListProps
}

export const ModalToRemoveList: React.FC<ModalRemoveListProps> = ({show, onHide, list, idBoard}) => {
    const { deleteList } = useListsStore();
    const handleRemoveList = () => {
        const idList = list.idList;
        deleteList({ idBoard, idList });
        onHide();
    }

    return (
        <Modal className="" show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body style={{textAlign: 'center'}}>
                Estas seguro de que quieres eliminar la lista "{list.nameList}"?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleRemoveList}>
                    Remove
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

<div>
    <header>header</header>
    <body>
        body
    </body>
    <footer>

    </footer>
</div>