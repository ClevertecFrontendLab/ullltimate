import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BreadCrumbRoute, routes } from '@constants/breadcrumbs';
import { PATHS } from '@constants/paths';
import { Breadcrumb } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import './breadcrumb.css';

export const CustomBreadcrumb: React.FC = () => {
    const [currentRoutes, setCurrentRoutes] = useState<BreadCrumbRoute[]>();
    const location = useLocation();

    useEffect(() => {
        switch (location.pathname) {
            case PATHS.MAIN:
                setCurrentRoutes(routes.main);
                break;
            case PATHS.FEEDBACKS:
                setCurrentRoutes(routes.feedbacks);
                break;
            case PATHS.CALENDAR:
                setCurrentRoutes(routes.calendar)

        }
    }, [location.pathname]);

    return (
        <div className='breadcrumb'>
            <Breadcrumb>
                {currentRoutes &&
                    currentRoutes.map((e: BreadCrumbRoute) => (
                        <Breadcrumb.Item key={uuidv4()}>
                            {e.path ? <Link to={e.path}>{e.name}</Link> : e.name}
                        </Breadcrumb.Item>
                    ))}
            </Breadcrumb>
        </div>
    );
};
