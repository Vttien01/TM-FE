import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
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
    Image,
    Carousel,
    Tag,
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
import NavSiderCommon from '@components/common/elements/NavSiderCommon/NavSiderCommon';
import { PercentageOutlined } from '@ant-design/icons';
import useDisclosure from '@hooks/useDisclosure';
import { showErrorMessage } from '@services/notifyService';
import { useSelector } from 'react-redux';
import { selectCategory } from '@selectors/app';
import CartModal from '../detail/CartModal';

const { Title, Text } = Typography;

const { Header, Content, Sider } = Layout;

function LandingPageDesktop({
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
    const categories = useSelector(selectCategory);
    const navigate = useNavigate();
    const [ collapsed, setCollapsed ] = useState(false);

    const toggleCollapsed = () => setCollapsed((prev) => !prev);
    const params = 'all-product';
    const [ items, setItems ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ openedDetailsModal, handlerDetailsModal ] = useDisclosure(false);
    const [ check, setCheck ] = useState(1);
    // useEffect(() => {
    //     (params?.categoryId ? getProductsByCategory(params.categoryId) : getAllProduct()).then((res) => {
    //         setItems(res.products);
    //         setLoading(false);
    //     });
    // }, [ params ]);

    const {
        data: top10BestSelling,
        loading: getCategorysLoading,
        execute: executeGetCategorys,
    } = useFetch(apiConfig.product.top10BestSelling, {
        immediate: true,
    });
    const {
        data: allproducts,
        loading: allproductsLoading,
        execute: executgeallproducts,
    } = useFetch(apiConfig.product.autocomplete, {
        immediate: true,
        mappingData: ({ data }) => data,
    });
    const {
        data: productDetail,
        loading: loadingProductDetail,
        execute: executGetProductDetail,
    } = useFetch(apiConfig.product.getProductAutocomplete, {
        immediate: false,
        mappingData: ({ data }) => data,
    });

    let catProductsOne = allproducts?.filter((product) => product?.categoryDto.name === 'Laptop') || [];
    let catProductsTwo = allproducts?.filter((product) => product?.categoryDto.name === 'Điện Thoại') || [];
    let catProductsThree = allproducts?.filter((product) => product?.categoryDto?.name === 'Phụ kiện') || [];
    let catProductsFour = allproducts?.filter((product) => product?.categoryDto?.name === 'Tai Nghe') || [];
    useEffect(() => {
        if (!openedDetailsModal && productDetail) {
            handlerDetailsModal.open();
        } else {
            handlerDetailsModal.close();
        }
    }, [ productDetail ]);
    return (
        <div className="container-fluid">
            {/* <div className="siderHome" style={{ marginTop: 10 }}>
                <NavSiderCommon collapsed={collapsed} onCollapse={toggleCollapsed} />
            </div> */}
            <CartModal
                open={openedDetailsModal}
                onCancel={() => handlerDetailsModal.close()}
                check={check}
                product={productDetail}
            />

            <div className="BannerHome" style={{ marginLeft: 14 }}>
                <Row justify="space-between" align="middle" style={{ paddingTop: 0 }}>
                    <Col span={18}>
                        <Carousel autoplay>
                            <div>
                                <Image
                                    src={banner2}
                                    style={{
                                        height: '700px',
                                        width: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </div>
                            <div>
                                <Image
                                    src={banner3}
                                    style={{
                                        height: '700px',
                                        width: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </div>
                            <div>
                                <Image
                                    src={banner4}
                                    c
                                    style={{
                                        height: '700px',
                                        width: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </div>
                        </Carousel>
                        {/* <Space>
                            <Image src={banner5} style={{ height: '200px' }} />
                            <Image src={banner6} style={{ height: '200px' }} />
                        </Space> */}
                    </Col>
                    <Col span={6}>
                        {/* <Image
                            src={banner7}
                            style={{
                                height: '700px',
                                width: '100%',
                                // objectFit: 'cover',
                            }}
                        /> */}
                        <div
                            style={{
                                height: '690px',
                                backgroundImage: `url(${banner7})`, // Correctly use backgroundImage
                                backgroundSize: 'cover', // Ensures the image covers the container
                                backgroundPosition: 'center', // Centers the background image
                                backgroundRepeat: 'no-repeat',
                            }}
                        ></div>
                    </Col>
                </Row>
            </div>
            <div className="contentFlask" style={{ marginTop: 14 }}>
                <div className="main-content bg-whitesmoke">
                    <Row gutter={[ 16, 16 ]} style={{ marginBottom: '24px' }}>
                        {categories?.length > 0 &&
                            categories.map(({ name, id }) => (
                                <Col xs={12} sm={8} md={6} lg={4} xl={3} key={id}>
                                    <Card
                                        hoverable
                                        style={{ textAlign: 'center', backgroundColor: 'var(--primary-light-color)' }}
                                        onClick={() => navigate(`/c?category=${name}`)}
                                    >
                                        {name}
                                    </Card>
                                </Col>
                            ))}
                    </Row>
                </div>
                <div className="main-content bg-whitesmoke">
                    <div>
                        <div className="categories py-0">
                            <div className="categories-item">
                                <div className="title-md">
                                    <h3>Sản phẩm bán chạy</h3>
                                </div>
                                {top10BestSelling && (
                                    <ProductList
                                        products={top10BestSelling?.data}
                                        executGetProductDetail={executGetProductDetail}
                                        loadingProductDetail={loadingProductDetail}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="contentTrend" style={{ marginTop: 14 }}>
                <div className="main-content bg-whitesmoke">
                    <div>
                        <div className="categories py-0">
                            <div className="categories-item">
                                <div className="title-md">
                                    <h3>Điện thoại</h3>
                                </div>
                                {catProductsTwo && (
                                    <ProductList
                                        products={catProductsTwo}
                                        executGetProductDetail={executGetProductDetail}
                                        loadingProductDetail={loadingProductDetail}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="contentProduct" style={{ marginTop: 14 }}>
                <div className="main-content bg-whitesmoke">
                    <div>
                        <div className="categories py-0">
                            <div className="categories-item">
                                <div className="title-md">
                                    <h3>Laptop</h3>
                                </div>
                                {catProductsOne && (
                                    <ProductList
                                        products={catProductsOne}
                                        executGetProductDetail={executGetProductDetail}
                                        loadingProductDetail={loadingProductDetail}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPageDesktop;
