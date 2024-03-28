import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { PATHS } from '@constants/paths';
import { useAppDispatch} from '@hooks/typed-react-redux-hooks';
import { saveToken } from '@redux/reducers/token-slice';

export const CustomLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [params] = useSearchParams();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (location.pathname === PATHS.INITIAL) {
            const token = params.get('accessToken');

            if (token) {
                localStorage.setItem('token', token);
                dispatch(saveToken(token));
                navigate(PATHS.MAIN);
            } else {
                navigate(PATHS.AUTH);
            }
        }
    }, [dispatch, location.pathname, navigate, params]);

    return (
        <div>
            <Outlet />
        </div>
    );
};
