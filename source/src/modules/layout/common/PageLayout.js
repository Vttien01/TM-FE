import React, { Children, cloneElement } from 'react';
import styles from './PageLayout.module.scss';
import Container from '@components/common/elements/Container';
import Breadcrumb from '@components/common/elements/Breadcrumb';
const PageLayout = ({ children, breadScrumbs, bannerName, className }) => {
    let Top, Side, Body;
    Children.forEach(children, (child) => {
        if (child.type === PageLayout.Top) Top = child;
        if (child.type === PageLayout.Side) Side = child;
        if (child.type === PageLayout.Body) Body = child;
    });
    return (
        <div className={className}>
            {bannerName && (
                <div className={styles.banner}>
                    <Container className={styles.bannerContainer}>{bannerName}</Container>
                </div>
            )}
            <Container className={styles.wrapper}>
                {cloneElement(
                    <div>
                        {Top} {breadScrumbs && <Breadcrumb className={styles.breadcrumb} routes={breadScrumbs} />}{' '}
                        {Body}
                    </div>,
                    {},
                )}
                {Side}
            </Container>
        </div>
    );
};
const Body = ({ children }) => <div>{children}</div>;
const Side = ({ children }) => <div>{children}</div>;
const Top = ({ children }) => <div>{children}</div>;

export default Object.assign(PageLayout, {
    Body,
    Side,
    Top,
});
