import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
// import { Breadcrumb, Carousel, Col, Image, Layout, Row, Space } from 'antd';
import apiConfig from '@constants/apiConfig';
import useFetch from '@hooks/useFetch';
import banner2 from '@assets/images/HomePage/banner2.jpg';
import banner3 from '@assets/images/HomePage/banner3.jpg';
import banner4 from '@assets/images/HomePage/banner4.jpg';
import banner5 from '@assets/images/HomePage/slider-banner1.jpg';
import banner6 from '@assets/images/HomePage/slider-banner2.jpg';
import banner7 from '@assets/images/HomePage/slider-banner3.jpg';
import './home.css';
import ProductList from '@components/common/elements/ProductList/ProductList';
import ProductGird from '@components/common/elements/ProductGird/ProductGrid';
import screenLaptop from '@assets/images/HomePage/screenLaptop.png';
import {
    Layout,
    Menu,
    Input,
    Button,
    Slider,
    Card,
    Row,
    Col,
    Space,
    Checkbox,
    Badge,
    Typography,
    Breadcrumb,
    Flex,
    Empty,
    InputNumber,
} from 'antd';
import {
    MenuOutlined,
    SearchOutlined,
    BellOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    HomeOutlined,
    DownOutlined,
} from '@ant-design/icons';
import useAuth from '@hooks/useAuth';
import HeaderHomePage from '@modules/layout/common/desktop/Header/HeaderHomePage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { useSelector } from 'react-redux';
import { selectCategory } from '@selectors/app';
import { formatMoney } from '@utils';
import useQueryParams from '@hooks/useQueryParams';
import useDisclosure from '@hooks/useDisclosure';
import CartModal from '../detail/CartModal';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

function LandingCategoryPageDesktop({
    slideShowData,
    expertList,
    categoryCourseList,
    categoryCourseFree,
    categoryCourseTop,
    categoryCourseNew,
    reviewData,
    newsData,
    statistical,
}) {
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search);
    const categoryName = queryParameters.get('category');
    const brandName = queryParameters.get('brandName');
    const priceStart = queryParameters.get('priceStart');
    const priceEnd = queryParameters.get('priceEnd');
    const [ activeCard, setActiveCard ] = useState(null);
    const categories = useSelector(selectCategory);
    const { deserializeParams, setQueryParams, params } = useQueryParams();
    const queryFilter = useMemo(() => deserializeParams(params), [ params ]);
    const [ openedDetailsModal, handlerDetailsModal ] = useDisclosure(false);

    const [ collapsed, setCollapsed ] = useState(false);

    const toggleCollapsed = () => setCollapsed((prev) => !prev);
    const [ items, setItems ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    const {
        data: allproducts,
        loading: allproductsLoading,
        execute: executgetllproducts,
    } = useFetch(apiConfig.product.autocomplete, {
        immediate: false,
        mappingData: ({ data }) => data,
    });
    const {
        data: brandData,
        loading: brandDataLoading,
        execute: executgetBrandData,
    } = useFetch(apiConfig.brand.autocomplete, {
        immediate: false,
        mappingData: ({ data }) => data.content,
    });
    const {
        data: productDetail,
        loading: loadingProductDetail,
        execute: executGetProductDetail,
    } = useFetch(apiConfig.product.getProductAutocomplete, {
        immediate: false,
        mappingData: ({ data }) => data,
    });

    useEffect(() => {
        executgetllproducts({
            params: {
                categoryName,
                brandName,
                ...(Number(priceStart) != null && { priceStart }),
                ...(Number(priceEnd) > 0 && { priceEnd }),
            },
        });
        executgetBrandData({
            params: {
                categoryName,
            },
        });
    }, [ categoryName, brandName, priceStart, priceEnd ]);
    useEffect(() => {
        if (!openedDetailsModal && productDetail) {
            handlerDetailsModal.open();
        } else {
            handlerDetailsModal.close();
        }
    }, [ productDetail ]);
    const marks = {
        0: '0M',
        25: '15M',
        50: '30M',
        75: '45M',
        100: {
            style: {
                color: '#f50',
            },
            label: <strong>60M</strong>,
        },
    };
    const [ inputValue, setInputValue ] = useState([ 0, 0 ]);
    const onChange = (newValue) => {
        setInputValue(newValue);
        if (newValue != null) {
            setQueryParams({
                ...queryFilter,
                priceStart: newValue[0] > 0 ? (newValue[0] * 1000000 * 3) / 5 : 0,
                priceEnd: (newValue[1] * 1000000 * 3) / 5,
            });
        }
    };
    return (
        <Layout className={classNames(styles.landingPage, 'container-fluid')} style={{ padding: '24px' }}>
            {/* <HeaderHomePage /> */}
            {/* <Layout className="container-fluid" style={{ padding: '24px' }}> */}
            <CartModal
                open={openedDetailsModal}
                onCancel={() => handlerDetailsModal.close()}
                check={1}
                product={productDetail}
            />
            <PageWrapper routes={[ { breadcrumbName: `${categoryName}` } ]}>
                <Layout style={{ background: '#fff' }}>
                    <Sider
                        width={280}
                        style={{ background: '#fff', padding: '24px', border: '1px solid #f0f0f0' }}
                        breakpoint="lg"
                        collapsedWidth={0}
                    >
                        <Space direction="vertical" size={24} style={{ width: '100%' }}>
                            <Row>
                                <Title level={5}>Khoảng giá</Title>
                                <Col span={24}>
                                    <Input
                                        min={1}
                                        max={100}
                                        style={{
                                            margin: 0,
                                            textAlign: 'center',
                                        }}
                                        value={
                                            priceStart
                                                ? `${formatMoney((inputValue[0] * 3 * 1000000) / 5, {
                                                    groupSeparator: ',',
                                                    decimalSeparator: '.',
                                                    currentcy: 'đ',
                                                    currentcyPosition: 'BACK',
                                                    currentDecimal: '0',
                                                })} - ${formatMoney((inputValue[1] * 3 * 1000000) / 5, {
                                                    groupSeparator: ',',
                                                    decimalSeparator: '.',
                                                    currentcy: 'đ',
                                                    currentcyPosition: 'BACK',
                                                    currentDecimal: '0',
                                                })}`
                                                : '0đ'
                                        }
                                        readOnly
                                    />
                                </Col>
                                <Col span={24}>
                                    <Slider
                                        range
                                        marks={marks}
                                        step={null}
                                        defaultValue={[ 0, 0 ]}
                                        onChange={onChange}
                                        value={inputValue}
                                    />
                                </Col>
                            </Row>
                            <div style={{ width: '100%' }}>
                                <Title level={5}>Danh mục</Title>
                                <Space direction="vertical" width="100%">
                                    {categories?.length > 0 &&
                                        categories.map(({ name, id }) => (
                                            <Card
                                                key={id}
                                                hoverable
                                                style={{
                                                    textAlign: 'center',
                                                    backgroundColor: 'var(--primary-light-color)',
                                                    borderColor: name == categoryName ? 'var(--primary-color)' : '#fff',
                                                    width: '175%',
                                                    padding: 0,
                                                }}
                                                onClick={() => {
                                                    setInputValue([ 0, 0 ]);
                                                    navigate(`/c?category=${name}`);
                                                }}
                                            >
                                                {name}
                                            </Card>
                                        ))}
                                </Space>
                            </div>
                            {/* <div>
                                <Title level={5}>Kích thước màn hình</Title>
                                <Row gutter={[ 8, 8 ]}>
                                    <Col span={12}>
                                        <Checkbox>{`14"`}</Checkbox>
                                    </Col>
                                    <Col span={12}>
                                        <Checkbox>{`15.6"`}</Checkbox>
                                    </Col>
                                    <Col span={12}>
                                        <Checkbox>{`18.5"`}</Checkbox>
                                    </Col>
                                    <Col span={12}>
                                        <Checkbox>{`19.5"`}</Checkbox>
                                    </Col>
                                </Row>
                                <Button type="link" size="small">
                                    Xem thêm
                                </Button>
                            </div> */}
                        </Space>
                    </Sider>
                    <Content style={{ padding: '24px', minHeight: 280 }}>
                        <Title level={3}>
                            {categoryName}{' '}
                            <small style={{ fontSize: '16px', color: '#666' }}>
                                ({allproducts?.length || 0} sản phẩm)
                            </small>
                        </Title>
                        <Row gutter={[ 16, 16 ]} style={{ marginBottom: '24px' }}>
                            {brandData?.length > 0 &&
                                brandData.map(({ name, id }) => (
                                    <Col xs={12} sm={8} md={6} lg={4} xl={3} key={id}>
                                        <Card
                                            hoverable
                                            style={{
                                                textAlign: 'center',
                                                backgroundColor:
                                                    activeCard === id ? 'var(--primary-light-color)' : '#fff',
                                            }}
                                            onClick={() => {
                                                setActiveCard(id);
                                                setQueryParams({
                                                    ...queryFilter,
                                                    brandName: name,
                                                });
                                            }}
                                        >
                                            {name}
                                        </Card>
                                    </Col>
                                ))}
                            <Col xs={12} sm={8} md={6} lg={4} xl={3}>
                                <Card
                                    hoverable
                                    style={{ textAlign: 'center' }}
                                    onClick={() => {
                                        setActiveCard(null);
                                        navigate(`/c?category=${categoryName}`);
                                    }}
                                >
                                    All
                                </Card>
                            </Col>
                        </Row>
                        {allproducts?.length > 0 ? (
                            <ProductList
                                products={allproducts}
                                title={categoryName}
                                executGetProductDetail={executGetProductDetail}
                                loadingProductDetail={loadingProductDetail}
                            />
                        ) : (
                            <Flex
                                style={{
                                    backgroundColor: 'var(--primary-light-color)',
                                    padding: '24px',
                                    height: '70%',
                                }}
                                align="center"
                                justify="center"
                                // headStyle={{ background: '#1890ff', color: '#fff' }}
                            >
                                <Empty />
                            </Flex>
                        )}
                    </Content>
                </Layout>
            </PageWrapper>
            {/* </Layout> */}
        </Layout>
    );
}

export default LandingCategoryPageDesktop;
