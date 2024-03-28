import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AllComments } from '@components/content-comments-page/all-reviews/all-reviews';
import { EmptyComments } from '@components/content-comments-page/empty/empty-comments';
import { ModalCreateComment } from '@components/content-comments-page/modal-create-comment/modal-create-comment';
import { Loader } from '@components/loader/loader';
import { PATHS } from '@constants/paths';
import { useGetFeedbacksQuery } from '@services/feedbacks';
import { Feedbacks } from '@tstypes/feedbacks';
import { Button, Modal, Result } from 'antd';
import { Content } from 'antd/lib/layout/layout';

import './comments-page.css';

export const CommentsPage: React.FC = () => {
    const navigate = useNavigate();
    const { data, isFetching, error } = useGetFeedbacksQuery();
    const [reviews, setReviews] = useState<Feedbacks[]>();
    const [showAllComments, setShowAllComments] = useState(false);
    const [isModalReview, setIsModalReview] = useState(false);
    const [isModalError, setIsModalError] = useState(false);
    const showModalError = (): void => setIsModalError(true);
    const handleCancelError = (): void => navigate(PATHS.MAIN);
    const showModalReview = (): void => setIsModalReview(true);
    const isShowAllComments = (): void => setShowAllComments(!showAllComments);
    const handleCancel = (): void => setIsModalReview(false);

    useEffect(() => {
        if(error) showModalError();
        if(data)
            setReviews(
                [...data].sort(
                    (a: Feedbacks, b: Feedbacks) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
                ),
            );
    }, [data, error]);

    return (
        <React.Fragment>
            <Content style={{ margin: 24 }}>
                {(isFetching) && <Loader />}
                {reviews &&
                    (reviews.length === 0 ? (
                        <EmptyComments showModalReview={showModalReview} />
                    ) : (
                        <AllComments
                            showModalReview={showModalReview}
                            reviews={reviews}
                            showAllComments={showAllComments}
                            isShowAllComments={isShowAllComments}
                        />
                    ))}
            </Content>
            <ModalCreateComment isModalReview={isModalReview} handleCancel={handleCancel} showModalReview={showModalReview}/>
            <Modal
                open={isModalError}
                footer={null}
                centered={true}
                closable={false}
                maskStyle={{ background: '#799cd480', backdropFilter: 'blur(5px)' }}
            >
                <div className='comments-modal'>
                    <Result
                        status='500'
                        title='Что-то пошло не так'
                        subTitle='Произошла ошибка, попробуйте ещё раз.'
                        extra={
                            <Button type='primary' onClick={handleCancelError}>
                                Назад
                            </Button>
                        }
                    />
                </div>
            </Modal>
        </React.Fragment>
    );
};
