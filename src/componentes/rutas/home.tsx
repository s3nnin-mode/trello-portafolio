import { Link } from 'react-router-dom';
import '../../styles/home.scss';

export const Home = () => {

    return (
        <div className='container_home'>
            <div className='modal_home'>
                <p>Usaras la app formalmente o eres reclutador</p>
                <div>
                    <button>
                        <Link to='/kanbaX'>
                            Solo estoy viendo, gracias
                        </Link>
                    </button>
                    <button>Uso profesional</button>
                </div>
            </div>
        </div>
    )
}