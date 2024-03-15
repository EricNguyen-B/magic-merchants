import { useEffect, useState } from "react";
import dayjs, {Dayjs} from "dayjs";
import { ProjectedDate } from "../../types";

const TimerCountDown = ({ date }: ProjectedDate) => {
    const calculateTimeLeft = () => {
        const difference = date.diff(dayjs());
        const duration = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
        return duration;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatCountdown = () => {
        const { days, hours, minutes, seconds } = timeLeft;
        return `${days.toString().padStart(2, '0')} DAYS : ${hours.toString().padStart(2, '0')} HOURS : ${minutes.toString().padStart(2, '0')} MINUTES : ${seconds.toString().padStart(2, '0')} SECONDS`;
    };

    return (
        <div className="timer-count-down">
            <p>{formatCountdown()}</p>
        </div>
    );
};

export default TimerCountDown;