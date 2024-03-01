import { useEffect, useState } from "react";
import dayjs, {Dayjs} from "dayjs";
import { ProjectedDate } from "../../types";


const TimerCountDown = ({date} : ProjectedDate) => {
    const [dateDifference, setDateDifference] = useState<Dayjs>(dayjs(date.diff(dayjs(), "millisecond")));

    useEffect(() => {
        setInterval(() => {
            setDateDifference(dayjs(date.diff(dayjs(), "millisecond")));
        }, 500);
    }, []);
    const formatCountdown = () => {
        const days = dateDifference.day().toString().padStart(2, '0');
        const hours = dateDifference.hour().toString().padStart(2, '0');
        const minutes = dateDifference.minute().toString().padStart(2, '0');
        const seconds = dateDifference.second().toString().padStart(2, '0');
        return `${days} DAYS :${hours} HOURS :${minutes} MINUTES :${seconds} SECONDS`;
    };
    
    return (
        <div className="timer-count-dowm">
            <p>{formatCountdown()}</p>
        </div>
    );
};

export default TimerCountDown;