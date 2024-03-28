import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATHS } from '@constants/paths';
import { Button } from 'antd';

type ButtonsCommentProps = {
    showModalReview: () => void;
    isShowAllComments?: () => void;
    showAllComments?: boolean;
};

export const ButtonsComment: React.FC<ButtonsCommentProps> = ({
    showModalReview,
    isShowAllComments,
    showAllComments,
}) => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className='comments-btns'>
            <Button type='primary' onClick={showModalReview} data-test-id='write-review'>
                Написать отзыв
            </Button>
            {location.pathname === PATHS.FEEDBACKS ? (
                <Button type='link' onClick={isShowAllComments} data-test-id='all-reviews-button'>
                    {showAllComments ? 'Свернуть все отзывы' : 'Развернуть все отзывы'}
                </Button>
            ) : (
                <Button
                    type='link'
                    onClick={() => navigate(PATHS.FEEDBACKS)}
                    data-test-id='all-reviews-button'
                >
                    Смотреть все отзывы
                </Button>
            )}
        </div>
    );
};
