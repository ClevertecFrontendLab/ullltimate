import React from 'react';
import { Feedbacks } from '@tstypes/feedbacks';

import { ButtonsComment } from '../buttons-comment/buttons-comment';
import { CustomComment } from '../comment/custom-comment';

import './all-reviews.css';

type AllCommentsProps = {
    showModalReview: () => void;
    reviews: Feedbacks[];
    showAllComments: boolean;
    isShowAllComments: () => void;
};

export const AllComments: React.FC<AllCommentsProps> = ({
    showModalReview,
    reviews,
    showAllComments,
    isShowAllComments,
}) => (
    <React.Fragment>
        <div className='comments-list'>
            {showAllComments
                ? reviews.map((e: Feedbacks) => (
                      <CustomComment
                          key={e.id}
                          createdAt={e.createdAt}
                          fullName={e.fullName}
                          imageSrc={e.imageSrc}
                          rating={e.rating}
                          message={e.message}
                      />
                  ))
                : reviews
                      .slice(0, 4)
                      .map((e: Feedbacks) => (
                          <CustomComment
                              key={e.id}
                              createdAt={e.createdAt}
                              fullName={e.fullName}
                              imageSrc={e.imageSrc}
                              rating={e.rating}
                              message={e.message}
                          />
                      ))}
        </div>
        <ButtonsComment showModalReview={showModalReview} isShowAllComments={isShowAllComments} showAllComments={showAllComments}/>
    </React.Fragment>
);
