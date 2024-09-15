interface CalendarProps {
    date: Date;
    onDateChange: (date: Date) => void;

    selectedDate: Date[];
}

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

function Calendar(props: CalendarProps) {
    const { date, onDateChange, selectedDate } = props;

    const currentDay = new Date();

    return <h1>Calendar</h1>;
}

export default Calendar;
