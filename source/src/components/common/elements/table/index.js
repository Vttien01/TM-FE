import classNames from 'classnames';
import React, { useMemo } from 'react';
import styles from './index.module.scss';
import useTranslate from '@hooks/useTranslate';
// import sort from '@assets/images/sort-default.png';
// import sortAsc from '@assets/images/sort-asc.png';
// import sortDesc from '@assets/images/sort-desc.png';
const BaseTable = ({
    data = [],
    className,
    columns,
    rowKey,
    tableProps,
    loading,
    showHeader = true,
    noDataMessage = true,
    additionRow,
    rowClassName = () => {
        return;
    },
}) => {
    const renderContent = useMemo(() => {
        if (data.length === 0 && noDataMessage) return <div className={styles.nodata}></div>;
        return data.map((item, index) => {
            return (
                <tr key={index} className={rowClassName(item, index)}>
                    {columns.map((col, _index) => {
                        const { render, dataIndex, name } = col;
                        const data = col.dataIndex?.reduce((acc, current) => acc && acc[current], item);
                        function returnFunc(data) {
                            return <span>{data}</span>;
                        }
                        return (
                            <td
                                // className={classNames('col', name)}
                                key={_index}
                                style={{ textAlign: col.align }}
                            >
                                {render ? render(data, item, item[rowKey]) : returnFunc(data)}
                            </td>
                        );
                    })}
                </tr>
            );
        });
    }, [ data, columns ]);

    return (
        <div style={{ position: 'relative' }}>
            {/* <LoadingOverlay loading={loading} /> */}
            <table className={className} {...tableProps}>
                {showHeader && (
                    <thead>
                        <tr>
                            {columns.map((item, index) => (
                                <th
                                    className={classNames('col', styles[item.name], {
                                        [styles.sortable]: item.sortable,
                                    })}
                                    style={{ width: item.width, textAlign: item.align }}
                                    key={index}
                                    onClick={!item.showMore && item.onClick}
                                    {...item.props}
                                >
                                    <div className={styles.titleWrapper}>
                                        <div>
                                            <div
                                                className={styles.labelWrapper}
                                                style={{ justifyContent: item.align }}
                                                onClick={item.showMore && item.onClick}
                                            >
                                                {item.label}
                                            </div>
                                            {item.showMore && <div>{item.showMore}</div>}
                                        </div>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                )}
                <tbody>
                    {renderContent} {additionRow}
                </tbody>
            </table>
        </div>
    );
};

export default BaseTable;
