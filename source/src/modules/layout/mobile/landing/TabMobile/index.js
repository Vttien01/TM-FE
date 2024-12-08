import React from 'react';
import CourseCarouselList from '@modules/layout/mobile/common/CourseCarouselList';
import styles from './index.module.scss';
import useTranslate from '@hooks/useTranslate';
import { FormattedMessage, defineMessages } from 'react-intl';
import Container from '@components/common/elements/Container';
const message = defineMessages({
    title: 'Những kinh nghiệm được học nhiều nhất? ',
    tab1: 'Khóa học miễn phí',
    tab2: 'Khóa học Cao cấp',
});
const TabMobile = ({ courseList, categoryCourseTop, categoryCourseFree }) => {
    const translate = useTranslate();
    return (
        <div>
            
        </div>
    );
};

export default TabMobile;
