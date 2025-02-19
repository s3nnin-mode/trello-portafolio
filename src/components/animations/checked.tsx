import Lottie from "lottie-react";
import checkAnimation from '../../assets/animations/checked_blue.json';
import { useEffect, useRef } from "react";
import { LottieRefCurrentProps } from "lottie-react";

interface CheckAnimationProps {
    className: string
    isPlaying: boolean
    handleClick: (e: React.MouseEvent) => void
}

export const CheckAnimation: React.FC<CheckAnimationProps> = ({className, isPlaying, handleClick}) => {
    const lottieRef = useRef<LottieRefCurrentProps | null>(null);

    useEffect(() => {
        if (lottieRef.current) {
            if (isPlaying) {
                lottieRef.current.play();
            } else {
                lottieRef.current.pause();
                lottieRef.current.goToAndStop(0, true);
            }
        }
    }, [isPlaying]);

    return (
        <Lottie 
            lottieRef={lottieRef}
            className={className} 
            onClick={handleClick}
            animationData={checkAnimation}
            loop={false}
            autoPlay={false} />
    )
}
