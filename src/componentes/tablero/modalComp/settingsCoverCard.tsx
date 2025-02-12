import { useEffect, useState } from 'react';
import '../../../styles/tablero/list/modalCard/components/settingsCoverCard.scss';
import { TargetProps } from '../../../types/boardProps';
import { useTargetsStore } from '../../../store/targetsStore';

const colors = [
    "#E63946", "#F4A261", "#2A9D8F", "#264653", "blue",
    "#F39C12", "#16A085", "#2980B9", "#D35400", "#C0392B",
    "#3498DB", "#27AE60", "#8E44AD", "#F1C40F", "#2C3E50",
    "#E67E22", "#1ABC9C", "#9B59B6", "#34495E", "#E74C3C", 'grey'
];

interface SettingsCoverProps {
    idBoard: string
    idList: string
    card: TargetProps
    closeComponent: () => void
}

export const SettingsCover: React.FC<SettingsCoverProps> = ({ card, idList, idBoard, closeComponent }) => {
    const { setCoverCard, setCoverCardImg } = useTargetsStore();
    const [coverType, setCoverType] = useState<'color' | 'img'>('color');
    const [coverPreview, setCoverPreview] = useState('');             //coverPreview será el color o la url de la imagen

    useEffect(() => {
        setCoverType(card.currentCoverType);
        setCoverPreview(card.coverCard);

    }, []);

    if (!card) return;

    const handleColorPreview = (availableColor: string) => {
        setCoverType('color');
        setCoverPreview(availableColor)
    }

    const handleImgPreview = (img: string) => {
        setCoverType('img');
        // setCoverPreview(URL.createObjectURL(file));
        setCoverPreview(img)
    }

    const handleUpdateImg = (e: React.ChangeEvent<HTMLInputElement>) => {
        const idCard = card.idTarget;
        const file = e.target.files?.[0];  //file
        if (!file) return;
        const img = URL.createObjectURL(file);
        setCoverCardImg({idBoard, idList, idCard, img});  //reemplaze img con 'file' y al momento de iterar creare una url nueva temporal. img es del tipo File
    }

    const handleSaveChanges = () => {
        const idCard = card.idTarget;
        const cover = coverPreview;
        setCoverCard({idBoard, idList, idCard, cover, coverType});
        closeComponent();
    }

    return (
        <article className='settings_cover_card'>
            <header className='header_preview_cover_card'>          {/*Aqui debes renderizar un componente nuevo y similar al header para la vista previa */}
                <div className='text_previw_and_closeCoverSettings'>
                    <span>
                        Vista previa
                    </span>
                    <button onClick={closeComponent}>X</button>
                </div>
                {
                coverType === 'color' ?
                <div style={{backgroundColor: coverPreview}} className='color_preview' /> :
                <img src={coverPreview} alt='cover card' />
                }
            </header>
            <main>
                <div className='colors_to_cover'>
                    <h5>Selecciona un color para la portada</h5>
                    <div>
                        {
                            colors.map((availableColor) => (
                                <button 
                                    key={availableColor}
                                    onClick={() => handleColorPreview(availableColor)}
                                    style={{
                                        backgroundColor: availableColor, 
                                        border: coverType === 'color' && availableColor === coverPreview ? '2px solid': 0,
                                    }}
                                >
                                </button>
                            ))
                        }    
                    </div>    
                </div>

                <div className='cover_imgs'>
                    <label htmlFor='inputFile'> cargar imagen </label>
                    <input type='file' id='inputFile' onChange={(e) => handleUpdateImg(e)} style={{display: 'none'}} />

                    <div className='cover_imgs_container'>
                        {
                            card.coverCardImgs !== undefined && (
                                card.coverCardImgs.map((img) => {
                                    return (<button onClick={() => handleImgPreview(img)} key={img}>
                                        <img src={img} alt='cover card' />
                                    </button>)
                                })
                            )              
                        }
                    </div>
                </div>
            </main>
            <footer>
                <button onClick={handleSaveChanges}>Guardar cambios</button>
                <button onClick={closeComponent}>Cancelar</button>
            </footer>
        </article>
    )
}