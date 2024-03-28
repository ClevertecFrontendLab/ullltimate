import React, { useState } from 'react';
import { StarTwoTone } from '@ant-design/icons';
import { Loader } from '@components/loader/loader';
import { useCreateReviewMutation } from '@services/feedbacks';
import { Button, Form, Modal, Rate, Result } from 'antd';
import TextArea from 'antd/lib/input/TextArea';

type ModalCreateCommentProps = {
    isModalReview: boolean;
    handleCancel: () => void;
    showModalReview: () => void;
};

export const ModalCreateComment: React.FC<ModalCreateCommentProps> = ({
    isModalReview,
    handleCancel,
    showModalReview,
}) => {
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [createReview, { isLoading }] = useCreateReviewMutation();
    const [review, setReview] = useState({ message: '', rating: 0 });
    const [isModalResult, setIsModalResult] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const createComment = async () => {
        await createReview(review)
            .unwrap()
            .then(() => {
                setReview({ message: '', rating: 0 });
                handleCancel();
                setIsSuccess(true);
                setIsModalResult(true);
            })
            .catch(() => {
                setIsSuccess(false);
                handleCancel();
                setIsModalResult(true);
            });
    };

    const changeRate = (value: number): void => {
        const submitDisabled = !(value > 0)

        setIsSubmitDisabled(submitDisabled);
    };

    return (
        <React.Fragment>
            {isLoading && <Loader />}
            <Modal
                title='Ваш отзыв'
                centered={true}
                maskStyle={{ background: '#799CD41A', backdropFilter: 'blur(5px)' }}
                open={isModalReview}
                onCancel={handleCancel}
                footer={[
                    <Button
                        type='primary'
                        key='submit'
                        htmlType='submit'
                        disabled={isSubmitDisabled}
                        onClick={createComment}
                        data-test-id='new-review-submit-button'
                    >
                        Опубликовать
                    </Button>,
                ]}
            >
                <div className='modal-form'>
                    <Form
                        onValuesChange={(_, allValues) => setReview(allValues)}
                        initialValues={review}
                    >
                        <Form.Item name='rating'>
                            <Rate
                                onChange={changeRate}
                                allowClear={true}
                                character={<StarTwoTone />}
                            />
                        </Form.Item>
                        <Form.Item name='message'>
                            <TextArea
                                placeholder='Autosize height with minimum and maximum number of lines'
                                autoSize={{ minRows: 2, maxRows: 10 }}
                            />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
            <Modal
                open={isModalResult}
                footer={null}
                centered={true}
                closable={false}
                maskStyle={{ background: '#799cd480', backdropFilter: 'blur(5px)' }}
            >
                {isSuccess ? (
                    <div className='modal-success'>
                        <Result
                            status='success'
                            title='Отзыв успешно опубликован'
                            extra={
                                <Button type='primary' onClick={() => setIsModalResult(false)}>
                                    Отлично
                                </Button>
                            }
                        />
                    </div>
                ) : (
                    <div className='modal-error'>
                        <Result
                            status='error'
                            title='Данные не сохранились'
                            subTitle='Что-то пошло не так. Попробуйте ещё раз.'
                            extra={[
                                <Button
                                    type='primary'
                                    key='newReview'
                                    onClick={() => {
                                        setIsModalResult(false);
                                        showModalReview();
                                    }}
                                    data-test-id='write-review-not-saved-modal'
                                >
                                    Написать отзыв
                                </Button>,
                                <Button
                                    type='text'
                                    key='close'
                                    onClick={() => setIsModalResult(false)}
                                >
                                    Закрыть
                                </Button>,
                            ]}
                        />
                    </div>
                )}
            </Modal>
        </React.Fragment>
    );
};
