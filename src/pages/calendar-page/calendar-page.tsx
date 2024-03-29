import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Calendar, Drawer, Empty, Modal, Select } from 'antd';
import { ArrowLeftOutlined, CloseOutlined, EditOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import type { CalendarMode } from 'antd/es/calendar/generateCalendar';
import type { Moment } from 'moment';
import { Content } from 'antd/lib/layout/layout';
import ru_Ru from 'antd/es/calendar/locale/ru_RU';
import moment from 'moment';
import 'moment/locale/ru';
import { Header } from '@components/header/header';
import { Loader } from '@components/loader/Loader';
import { DrawerForm } from '@components/content-calendar-page/drawer-form/drawer-form';
import { useGetTrainingListQuery } from '@services/catalogs';
import { Training, useCreateTrainingMutation, useGetTrainingQuery, useUpdateTrainingMutation } from '@services/trainings';
import { colorTrainings } from '@constants/calendar';
import { Exercise, addExercises, removeExercises, resetExercises, saveTrainingDate, saveTrainingId, saveTrainingName, setExercises, setIsImplementation } from '@redux/reducers/training-slice';
import { useAppDispatch, useAppSelector } from '@hooks/typed-react-redux-hooks';
import { trainingSelector } from '@redux/reducers/training-slice';
import { useResize } from '@hooks/useResize';
import { saveSceenSize, screenSizeSelector } from '@redux/reducers/resize-slice';
import './calendar-page.css';
import './modal-training.css';

moment.locale('ru');
moment.updateLocale('ru', {
    weekdaysMin : ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    monthsShort : ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'], 
    week: {dow: 1}
  })

export const CalendarPage: React.FC = () => {
    const {screenSize} = useAppSelector(screenSizeSelector);
    const { data: trainings } = useGetTrainingQuery();
    const { data: trainingList, error: errorList, isLoading, refetch } = useGetTrainingListQuery();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [coordinates, setCoordinates] = useState<DOMRect>();
    const [selectedDate, setSelectedDate] = useState('');
    const widthCreateTraining = screenSize < 630 ? 313 : 264;
    const [selectedWeekDay, setSelectedWeekDay] = useState(moment().day());
    const [trainingsForDay, setTrainingsForDay] = useState<Training[]>([]);
    const [isCreateExercise, setIsCreateExercise] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [valueEditTrain, setValueEditTrain] = useState('Выбор типа тренировки');
    const [exercisesForDay, setExercisesForDay] = useState<Exercise[]>([]);
    const [elemForCoordinates, setElemForCoordinates] = useState<Element>();
    const [disabledCreateTraining, setDisabledCreateTraining] = useState(false);
    const [selectedDateInvalidFormat, setSelectedDateInvalidFormat] = useState('');
    const [isEditTraining, setIsEditTraining] = useState(false);
    const [indexesForDelete, setIndexesForDelete] = useState<number[]>([]);
    const dispatch = useAppDispatch();
    const { date, name, exercises, isImplementation, id } = useAppSelector(trainingSelector);
    const [createTraining] = useCreateTrainingMutation();
    const [updateTraining] = useUpdateTrainingMutation();
    const windowSize = useResize();

    const onPanelChange = (value: Moment, mode: CalendarMode) => {
        console.log('panel', value.format('DD.MM.YYYY'), mode);
        setIsModalOpen(false);
    };

    useEffect(() => {
        trainings &&
            setTrainingsForDay(
                trainings.filter(
                    (e) => new Date(e.date).toLocaleString('ru').split(',')[0] === selectedDate,
                ),
            );
    }, [trainings, selectedDate]);

    useEffect(() => {
        const exersices = trainingsForDay.find((train) => train.name === valueEditTrain);
        if (exersices) {
            setExercisesForDay(exersices.exercises);
        } else {
            setExercisesForDay([]);
        }
    }, [trainings, selectedDate, valueEditTrain, trainingsForDay]);

    const modalError = useCallback((isErrorList: boolean) => {
        Modal.error({
            className: 'error-list',
            centered: true,
            closable: true,
            maskClosable: true,
            closeIcon: (
                <span data-test-id='modal-error-user-training-button-close'>
                    <CloseOutlined />
                </span>
            ),
            maskStyle: { background: '#799CD41A', backdropFilter: 'blur(5px)' },
            title: (
                <span data-test-id='modal-error-user-training-title'>
                    {   
                        isErrorList 
                        ? 'При открытии данных произошла ошибка'
                        : 'При сохранении данных произошла ошибка '
                    }
                </span>
            ),
            content: (
                <div>
                    <p data-test-id='modal-error-user-training-subtitle'>
                       {
                            isErrorList
                            ? 'Попробуйте ещё раз.'
                            : 'Придётся попробовать ещё раз'
                       }
                    </p>
                </div>
            ),
            okText: <span data-test-id='modal-error-user-training-button'>
                        {
                            isErrorList
                            ? 'Обновить'
                            : 'Закрыть'
                       }
                    </span>,
            onOk() {
                refetch();
                setIsModalOpen(false);
                setOpenDrawer(false);
            },
        });
    }, [refetch]);

    useEffect(() => {
        errorList && modalError(true);
    }, [errorList, modalError]);

    type ListData = {
        color: string;
        content: string;
    };

    const getListData = (value: Moment) => {
        const listData: ListData[] = [];
        trainings &&
            trainingList &&
            trainings.map((el) => {
                if (
                    value.format('DD.MM.YYYY') ===
                    new Date(el.date).toLocaleString('ru').split(',')[0]
                ) {
                    listData.push({
                        color: `${colorTrainings.find((train) => train.name === el.name)?.color}`,
                        content: `${el.name}`,
                    });
                }
            });

        return listData || [];
    };

    const dateCellRender = (value: Moment) => {
        const listData = getListData(value);
        return (
            screenSize > 630 ?
                <ul className='events' style={{ listStyleType: 'none' }}>
                    {listData.map((item: ListData, i: number) => (
                        <li key={i}>
                            <Badge color={item.color} text={item.content} />
                        </li>
                    ))}
                </ul> 
                : <div style={{background: `${listData.length && 'var(--color-bg-blue)'}`, border: `${moment(moment().format('YYYY-MM-DD')).isSame(value.format('YYYY-MM-DD')) ? '1px solid var(--color-primary)' : 'none'}`, borderRadius: 2}}>
                    {value.format('DD')}
                </div>
        );
    };

    const showModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, date: Moment) => {
        dispatch(resetExercises());
        dispatch(saveTrainingDate(date.toJSON()));
        setIndexesForDelete([])
        setIsCreateExercise(false);
        (screenSize > 630) ? e.stopPropagation() : '';
        setSelectedDate(date.format('DD.MM.YYYY'));
        setSelectedDateInvalidFormat(date.format('YYYY-MM-DD'));
        setSelectedWeekDay(date.day());
        const elem = e.target as Element;
        setElemForCoordinates(elem);
        setIsModalOpen(true);
    };

    const defineCoordinates = useCallback((elem: Element) => {
        if(elem.tagName === 'SPAN'){
            setCoordinates((((((elem.parentNode as Element).parentNode as Element).parentNode as Element).parentNode as Element).parentNode as Element).getBoundingClientRect());
        } else if (elem.tagName === 'LI'){
            setCoordinates(((((elem.parentNode as Element).parentNode as Element).parentNode as Element).parentNode as Element).getBoundingClientRect());
        }else {
            (elem.parentNode as Element) &&
            setCoordinates(((elem.parentNode as Element).parentNode as Element).getBoundingClientRect());
        }
    },[]);

    useEffect(() => {
        if(screenSize != windowSize.windowSize){
            dispatch(saveSceenSize(windowSize.windowSize))
        }
    },[dispatch, screenSize, windowSize])

    useEffect(() => {
        if(screenSize > 630){
            elemForCoordinates && defineCoordinates(elemForCoordinates);
        }
    },[defineCoordinates, elemForCoordinates, screenSize])

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsCreateExercise(false);
    };

    const handleChange = (value: string) => {
        trainingList &&
            setValueEditTrain(trainingList.filter((train) => train.key === value)[0].name);
        dispatch(resetExercises());
    };

    const showDrawer = () => setOpenDrawer(true);

    const closeDrawer = () => {
        setExercisesForDay(exercises);
        setOpenDrawer(false);
    };

    const editTraining = (nameTrain: string) => {
        setIsCreateExercise(true);
        setValueEditTrain(nameTrain);
        dispatch(resetExercises());
    };

    const addTrain = () => {
        setIsCreateExercise(true);
        setValueEditTrain('Выбор типа тренировки');
    };
    useEffect(() => {
        trainingsForDay.length === 5 ||
        moment(selectedDateInvalidFormat).isSameOrBefore(moment(), 'day')
            ? setDisabledCreateTraining(true)
            : setDisabledCreateTraining(false);
    }, [trainingsForDay, selectedDateInvalidFormat]);

    useEffect(() => {
        moment(selectedDateInvalidFormat).isSameOrBefore(moment(), 'day') 
            ? dispatch(setIsImplementation(true))
            : dispatch(setIsImplementation(false))
    },[selectedDateInvalidFormat, dispatch])

    useEffect(() => {
        const training = trainingsForDay.find((e) => e.name === valueEditTrain);
        if (training) {
            dispatch(saveTrainingId(training._id));
            dispatch(resetExercises());
            dispatch(setExercises(training.exercises));
        } else {
            dispatch(saveTrainingId(''));
            dispatch(resetExercises());
        }
        dispatch(saveTrainingName(valueEditTrain));
    }, [valueEditTrain, dispatch, trainingsForDay]);

    const createTrain = async () => {
        await createTraining({ date, name, exercises })
            .unwrap()
            .then(() => setIsCreateExercise(false))
            .catch(() => modalError(false));
    };
    const updateTrain = async () => {
        await updateTraining({ date, name, exercises, isImplementation, id })
            .unwrap()
            .then(() => {setIsCreateExercise(false)})
            .catch(() => {
                modalError(false); 
                const exersicess = trainingsForDay.find((train) => train.name === valueEditTrain)
                console.log(exersicess?.exercises)
                exersicess && (dispatch(setExercises(exersicess.exercises)), setExercisesForDay(exersicess.exercises))
            });
    };
    const save = () => id === '' ?  createTrain() : updateTrain();

    return (
        <>
            {isLoading && <Loader />}
            <Header />
            <Content style={{ padding: `${screenSize <=360 ? 0 : 24}`, background: 'var(--color-bg-blue)', marginBottom: `${screenSize < 370 ? '192px' : '42px'}` }}>
                <Calendar
                    onPanelChange={onPanelChange}
                    locale={ru_Ru}
                    fullscreen={screenSize >= 630}
                    dateFullCellRender={(date) => (
                        <div
                            className='date-cell'
                            style={{ zIndex: 0, background: 'var(--color-bg-card)' }}
                            onClick={(e) => showModal(e, date)}
                        >
                            {
                                screenSize >= 630 && 
                                    <div className='ant-picker-calendar-date-value'>
                                        {moment(date).format('DD')}
                                    </div>
                            }
                            <div className='ant-picker-calendar-date-content'>
                                {
                                   dateCellRender(date)
                                }
                            </div>
                        </div>
                    )}
                />
            </Content>
            <div
                className='modal-training'
                data-test-id={`${
                    !isCreateExercise ? 'modal-create-training' : 'modal-create-exercise'
                }`}
                style={{
                    display: `${isModalOpen ? 'block' : 'none'}`,
                    top: `${screenSize > 630 ? `${coordinates?.top}px` : '42%'}`,
                    left: `${ screenSize > 630 ?
                        (coordinates &&
                        (selectedWeekDay === 0 || selectedWeekDay >= 5
                            ? `${coordinates.right - widthCreateTraining}px`
                            : `${coordinates.left}px`))
                        : '50%'
                    }`,
                    transform: `${screenSize > 630 ? '':'translate(-50%, -0%)'}`,
                    width: widthCreateTraining,
                    boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)'
                }}
            >
                {!isCreateExercise ? (
                    <>
                        <div className='modal-title' style={{marginBottom: `${trainingsForDay?.length != 0 ? '14px' : '0px'}`}}>
                            <h4 className='title'>Тренировки на {selectedDate}</h4>
                            <CloseOutlined
                                data-test-id='modal-create-training-button-close'
                                onClick={handleCancel}
                            />
                        </div>
                        <p
                            className='modal-subtitle'
                            style={{
                                display: `${trainingsForDay?.length === 0 ? 'block' : 'none'}`,
                                margin: 0,
                            }}
                        >
                            Нет активных тренировок
                        </p>
                        <div className='modal-content' style={{minHeight: `${trainingsForDay?.length != 0 ? '84px' : '64px'}`}}>
                            <ul className='modal-events' style={{ listStyleType: 'none' }}>
                                {trainingsForDay.length != 0 ? (
                                    trainingsForDay.map((e, i) => (
                                        <li key={e._id} className='list-item'>
                                            <Badge
                                                color={
                                                    colorTrainings.find((el) => el.name === e.name)
                                                        ?.color
                                                }
                                                text={e.name}
                                            />
                                            <Button type='link'   
                                                    disabled={e.isImplementation}
                                                    data-test-id={`modal-update-training-edit-button${i}`}
                                                    onClick={() => editTraining(e.name)}
                                            >
                                                <EditOutlined
                                                />
                                            </Button>
                                        </li>
                                    ))
                                ) : (
                                    <Empty
                                        image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
                                        imageStyle={{
                                            height: 32,
                                        }}
                                        description={false}
                                    />
                                )}
                            </ul>
                        </div>
                        <Button
                            type='primary'
                            className='modal-btn'
                            onClick={() => addTrain()}
                            disabled={disabledCreateTraining}
                            style={{marginBottom: 12}}
                        >
                            Создать тренировку
                        </Button>
                    </>
                ) : (
                    <>
                        <div className='create-exercise'>
                            <ArrowLeftOutlined
                                data-test-id='modal-exercise-training-button-close'
                                style={{ width: 16, marginTop: 12 }}
                                onClick={() => setIsCreateExercise(false)}
                            />
                            <Select
                                defaultValue={valueEditTrain}
                                data-test-id='modal-create-exercise-select'
                                style={{ width: `${screenSize <630 ? '270px' : '228px'}`, marginTop: 12 }}
                                onChange={handleChange}
                                options={trainingList
                                    ?.map((e) => ({ value: e.key, label: e.name }))
                                    .filter((name) =>
                                        trainingsForDay.every(
                                            (train) => !name.label.includes(train.name),
                                        ),
                                    )}
                            />
                        </div>
                        <div className='modal-content'>
                            {valueEditTrain != 'Выбор типа тренировки' ? (
                                <ul style={{ padding: '12px 0' }}>
                                    {exercisesForDay
                                        .filter((e) => e.name != '')
                                        .map((e, i) => (
                                            <li key={i} className='list-item'>
                                                <p style={{color: 'var(--color-disabled)'}}>{e.name}</p>
                                                <Button type='link' 
                                                        disabled={e.isImplementation}
                                                        data-test-id={`modal-update-training-edit-button${i}`}
                                                        onClick={() => {
                                                        dispatch(setExercises(exercisesForDay));
                                                        setIsEditTraining(true);
                                                        setOpenDrawer(true);
                                                    }}>
                                                    <EditOutlined
                                                    />
                                                </Button>
                                            </li>
                                        ))}
                                </ul>
                            ) : (
                                <Empty
                                    image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
                                    imageStyle={{ height: 32, margin:16 }}
                                    description={false}
                                />
                            )}
                        </div>
                        <Button
                            type='text'
                            className='modal-btn btn-text'
                            disabled={!(valueEditTrain != 'Выбор типа тренировки')}
                            onClick={() => {
                                dispatch(setExercises(exercisesForDay));
                                dispatch(addExercises());
                                exercisesForDay.length === 0
                                    ? setIsEditTraining(false)
                                    : setIsEditTraining(true);
                                setIsEditTraining(false);
                                showDrawer();
                            }}
                        >
                            Добавить упражнения
                        </Button>
                        <Button
                            type='link'
                            className='modal-btn'
                            disabled={exercisesForDay.filter((e) => e.name != '').length === 0}
                            onClick={save}
                        >
                            {isEditTraining ? 'Сохранить изменения' : 'Сохранить'}
                        </Button>
                    </>
                )}
            </div>
            <Drawer
                width={screenSize<630 ? 360 : 408}
                style={{marginTop: `${screenSize<630 ? '85px': '0px'}`, borderRadius: 15}}
                data-test-id='modal-drawer-right'
                closeIcon={<CloseOutlined data-test-id='modal-drawer-right-button-close' />}
                title={
                    <>
                        {!isEditTraining ? (
                            <PlusOutlined style={{ marginRight: 6 }} />
                        ) : (
                            <EditOutlined style={{ marginRight: 6 }} />
                        )}
                        <h4
                            style={{
                                display: 'inline-block',
                                margin: 0,
                                fontSize: 20,
                                fontWeight: 500,
                            }}
                        >
                            {!isEditTraining ? 'Добавление упражнений' : 'Редактирование'}
                        </h4>
                    </>
                }
                placement='right'
                onClose={closeDrawer}
                open={openDrawer}
                maskStyle={{ background: 'transparent' }}
                headerStyle={{ padding: `var(--unit-16) var(--unit-${screenSize<630?16:32})`, border: 'none' }}
                bodyStyle={{ padding: `0px var(--unit-${screenSize<630?16:32})` }}
            >
                <div className='drawer-name'>
                    <Badge
                        color={colorTrainings.find((el) => el.name === valueEditTrain)?.color}
                        text={valueEditTrain}
                    />
                    <p className='date-training'>{selectedDate}</p>
                </div>
                {exercises.map((e: Exercise, i: number) => (
                    <DrawerForm
                        key={`${e._id}${i}`}
                        name={e.name}
                        approaches={e.approaches}
                        replays={e.replays}
                        weight={e.weight}
                        isEditTraining={isEditTraining}
                        index={i}
                        indexes={indexesForDelete}
                        setIndexes={setIndexesForDelete}
                    />
                ))}
                <div className='drawer-buttons'>
                    <Button
                        type='link'
                        style={{ width: `${screenSize>630?'170px':'165px'}` }}
                        onClick={() => dispatch(addExercises())}
                    >
                        <PlusOutlined />
                        Добавить ещё
                    </Button>
                    <Button
                        type='text'
                        style={{ width: `${screenSize>630?'170px':'150px'}` , display: `${!isEditTraining ? 'none' : 'inline'}` }}
                        disabled={indexesForDelete.length === 0}
                        onClick={() => {
                            dispatch(removeExercises(indexesForDelete));
                            setIndexesForDelete([]);
                        }}
                    >
                        <MinusOutlined />
                        Удалить
                    </Button>
                </div>
            </Drawer>
        </>
    );
};
