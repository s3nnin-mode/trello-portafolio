import '../../../../styles/components/list/optionsList/formsOptions/removeList.scss';
import { Modal, Button } from "react-bootstrap";
import { ListProps } from "../../../../types/boardProps";
import { useListsServices } from '../../../../services/listsServices';

interface ModalRemoveListProps {
    show: boolean
    onHide: () => void
    idBoard: string
    list: ListProps
}

export const ModalToRemoveList: React.FC<ModalRemoveListProps> = ({show, onHide, list, idBoard}) => {
    const { listsService } = useListsServices();

    const handleRemoveList = () => {
        const idList = list.idList;
        listsService({
            updateFn: (state) => state.map((listGroup) => 
            listGroup.idBoard === idBoard ?
            {...listGroup, lists: listGroup.lists.filter(list => list.idList !== idList)} :
            listGroup
            )
        });
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
};