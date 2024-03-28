import React from 'react';
import { Button, Typography } from 'antd';

import './empty-comments.css';

const { Title, Text } = Typography;

type IShowModal = {
    showModalReview: () => void;
};

export const EmptyComments: React.FC<IShowModal> = ({ showModalReview }) => (
    <React.Fragment>
        <div className='comments-empty'>
            <div className='text-wrapper'>
                <Title level={3}>Оставьте свой отзыв первым</Title>
                <Text type='secondary'>
                    Вы можете быть первым, кто оставит отзыв об этом фитнесс приложении. Поделитесь
                    своим мнением и опытом с другими пользователями, и помогите им сделать
                    правильный выбор.
                </Text>
            </div>
        </div>
        <div className='comments-empty-btns'>
            <Button type='primary' onClick={showModalReview} data-test-id='write-review'>
                Написать отзыв
            </Button>
        </div>
    </React.Fragment>
);

