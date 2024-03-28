import { CalendarTwoTone, HeartFilled, IdcardOutlined } from '@ant-design/icons';
import { CardInfo } from '@tstypes/types';

import { PATHS } from './paths';

export const contentCards: CardInfo[] = [
    {
        title: 'Расписать тренировки',
        btnText: 'Тренировки',
        btnIcon: <HeartFilled />,
        path: '',
        dataTest: ''
    },
    {
        title: 'Назначить календарь',
        btnText: 'Календарь',
        btnIcon: <CalendarTwoTone twoToneColor='#2F54EB' />,
        path: PATHS.CALENDAR,
        dataTest: 'menu-button-calendar'
    },
    {
        title: 'Заполнить профиль',
        btnText: 'Профиль',
        btnIcon: <IdcardOutlined />,
        path: PATHS.PROFILE,
        dataTest: 'menu-button-profile'
    },
];
