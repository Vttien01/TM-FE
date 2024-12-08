import React, { useEffect, useState } from 'react';
import { Button, Flex, Form, Image, Input, Menu, Row, Space, Tooltip } from 'antd';
import { Header } from 'antd/es/layout/layout';
import {
    LoginOutlined,
    MenuOutlined,
    SearchOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from '@ant-design/icons';
import useAuth from '@hooks/useAuth';
import { useSelector } from 'react-redux';
import { selectCategory } from '@selectors/app';
import styles from './HeaderHomePage.module.scss';
import { ClockCircleOutlined, LaptopOutlined, PhoneOutlined, TabletOutlined } from '@ant-design/icons';
import { IconHeadphones } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const HeaderHomePage = ({ openLogin, style, openProfile, openConfirm }) => {
    const { profile } = useAuth();
    const categories = useSelector(selectCategory);
    const navigate = useNavigate();
    const Menu1 = () => {
        return (
            <Space direction="vertical">
                {navMenuConfig.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className={styles.menuItem}
                            onClick={() => {
                                navigate(`/c?category=${item.key}`);
                            }}
                        >
                            {item.label}
                        </div>
                    );
                })}
            </Space>
        );
    };
    return (
        <Header
            style={{
                padding: '0 24px',
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: '#f7a44c',
                height: 'max-content',
            }}
        >
            <Row justify="space-between" align="center" className="container-fluid" style={{ height: '80px' }}>
                <Flex size={24} align="center" gap={8}>
                    {/* <div className="logo" style={{ color: '#1890ff', fontSize: '24px' }}>
                            ••
                        </div> */}
                    <Tooltip title={<Menu1/>} placement='bottom' color='white'>
                        <Button icon={<MenuOutlined />} style={{ fontSize: 18 }}>
                            Danh mục sản phẩm
                        </Button>
                    </Tooltip>
                        
                </Flex>
                <div style={{ width: '50%' }}>
                    <Input placeholder="Nhập từ khóa cần tìm" prefix={<SearchOutlined />} />
                </div>

                <Flex gap={16} style={{ fontSize: '18px', color: '#fff' }}>
                    {profile ? (
                        <Space align="center">
                            <ShoppingCartOutlined style={{ fontSize: '30px', marginTop: '20px' }} />
                            <span>(0) sản phẩm</span>
                        </Space>
                    ) : (
                        <Space split="|">
                            <a>Đăng nhập</a>
                            <a>Đăng Ký</a>
                        </Space>
                    )}
                </Flex>
            </Row>
        </Header>);
};

const navMenuConfig = [
    {
        label: (
            <Flex style={{ marginLeft: 2, fontSize: 16 }} gap={8}>
                <PhoneOutlined size={20} /> Điện thoại
            </Flex>
        ),
        key: 'Điện thoại',
    },
    {
        label: (
            <Flex style={{ marginLeft: 2, fontSize: 16 }} gap={8}>
                <LaptopOutlined size={20} /> Laptop
            </Flex>
        ),
        key: 'Laptop',
    },
    {
        label: (
            <Flex style={{ marginLeft: 2, fontSize: 16 }} gap={8}>
                <TabletOutlined size={20} /> Tablet
            </Flex>
        ),
        key: 'Tablet',
    },
    {
        label: (
            <Flex style={{ marginLeft: 2, fontSize: 16 }} gap={8}>
                <ClockCircleOutlined size={20} /> SmatchWatch
            </Flex>
        ),
        key: 'smatchwatch',
    },
    {
        label: (
            <Flex style={{ marginLeft: 2, fontSize: 16 }} gap={8}>
                <IconHeadphones size={20} /> Tai nghe
            </Flex>
        ),
        key: 'Tai nghe',
    },
];

export default HeaderHomePage;
