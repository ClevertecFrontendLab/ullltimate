import React from 'react';
import { useAppDispatch } from '@hooks/typed-react-redux-hooks';
import { editExercises } from '@redux/reducers/training-slice';
import { Checkbox, Form, Input, InputNumber, Space } from 'antd';

import './drawer-form.css';

type DrawerProps = {
    index: number;
    name: string;
    approaches: number;
    replays: number;
    weight: number;
    isEditTraining: boolean;
    indexes: number[];
    setIndexes: React.Dispatch<React.SetStateAction<number[]>>;
};

export const DrawerForm: React.FC<DrawerProps> = ({
    name,
    approaches,
    replays,
    weight,
    isEditTraining,
    index,
    indexes,
    setIndexes,
}) => {
    const dispatch = useAppDispatch();
    const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) =>
        dispatch(editExercises({ name: event.target.value as string, index }));
    const onChangeAproaches = (value: number | null) =>
        value && dispatch(editExercises({ approaches: value, index }));
    const onChangeWeight = (value: number | null) =>
        value && dispatch(editExercises({ weight: value, index }));
    const onChangeReplays = (value: number | null) =>
        value && dispatch(editExercises({ replays: value, index }));
    const onChangeCheckbox = () =>
        indexes.includes(index)
            ? setIndexes(indexes.filter((e) => e !== index))
            : setIndexes((prevIndexes) => prevIndexes.concat(index));

    return (
        <Form className='drawer-form' initialValues={{ name, approaches, replays, weight }}>
            <Form.Item name='name'>
                <Input
                    placeholder='Упражнение'
                    onChange={onChangeName}
                    data-test-id={`modal-drawer-right-input-exercise${index}`}
                    addonAfter={
                        isEditTraining ? (
                            <Checkbox
                                data-test-id={`modal-drawer-right-checkbox-exercise${index}`}
                                checked={indexes.includes(index)}
                                onChange={onChangeCheckbox}
                            />
                        ) : (
                            ''
                        )
                    }
                />
            </Form.Item>
            <Space direction='horizontal'>
                <Form.Item className='item-approaches'>
                    <div className='form-label'>Подходы</div>
                    <Form.Item name='approaches'>
                        <InputNumber
                            addonBefore='+'
                            onChange={onChangeAproaches}
                            data-test-id={`modal-drawer-right-input-approach${index}`}
                        />
                    </Form.Item>
                </Form.Item>
                <Form.Item className='item-weight'>
                    <div className='form-label'>Вес, кг</div>
                    <Form.Item name='weight'>
                        <InputNumber
                            onChange={onChangeWeight}
                            data-test-id={`modal-drawer-right-input-weight${index}`}
                        />
                    </Form.Item>
                </Form.Item>
                <div className='item-separator'>x</div>
                <Form.Item className='item-count'>
                    <div className='form-label'>Количество</div>
                    <Form.Item name='replays'>
                        <InputNumber
                            onChange={onChangeReplays}
                            data-test-id={`modal-drawer-right-input-quantity${index}`}
                        />
                    </Form.Item>
                </Form.Item>
            </Space>
        </Form>
    );
};
