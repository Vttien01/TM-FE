import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { ArrowDownOutlined, StarFilled, UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_FORMAT } from '@constants';
import apiConfig from '@constants/apiConfig';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { convertUtcToLocalTime, formatMoney } from '@utils';
import { Button, Card, Col, Flex, Form, Progress, Rate, Row, Space, Spin, Typography } from 'antd';
import CartModal from './CartModal';
import styles from './index.module.scss';
import useAuth from '@hooks/useAuth';
import { showWarningMessage } from '@services/notifyService';
import Container from '@components/common/elements/Container';

const DetailPageDesktop = () => {
    const { id } = useParams();
    const { pathname: pagePath } = useLocation();
    const [ visibleItems, setVisibleItems ] = useState(10);
    const dispatch = useDispatch();
    const queryParameters = new URLSearchParams(window.location.search);
    const [ detail, setDetail ] = useState([]);
    const [ openedDetailsModal, handlerDetailsModal ] = useDisclosure(false);
    const { profile } = useAuth();
    // const productId = queryParameters.get('productId');
    // const productId = useParams();

    // const product = useSelector(getProductSingle);
    // const productSingleStatus = useSelector(getSingleProductStatus);
    // const cartMessageStatus = useSelector(getCartMessageStatus);
    const [ quantity, setQuantity ] = useState(1);
    const [ isLoadingMore, setIsLoadingMore ] = useState(false);
    const [ check, setCheck ] = useState();
    const {
        data: product,
        loading: allproductsLoading,
        execute: executgeallproducts,
    } = useFetch(apiConfig.product.getProductAutocomplete, {
        immediate: true,
        pathParams: { id },
        mappingData: ({ data }) => data,
    });
    useEffect(() => {
        if (product?.length > 0) setDetail(product);
        else setDetail([]);
    }, [ product ]);

    useEffect(() => {
        executgeallproducts({
            pathParams: { id },
            onCompleted: (res) => {
                setDetail(res.data);
            },
            onError: (error) => {},
        });
    }, [ id ]);

    let discountedPrice;
    if (product?.saleOff) {
        discountedPrice = product?.price - product?.price * (product?.saleOff / 100);
    } else {
        discountedPrice = 0;
    }

    const increaseQty = () => {
        setQuantity((prevQty) => {
            let tempQty = prevQty + 1;
            if (tempQty > product?.totalInStock) tempQty = product?.totalInStock;
            return tempQty;
        });
    };

    const decreaseQty = () => {
        setQuantity((prevQty) => {
            let tempQty = prevQty - 1;
            if (tempQty < 1) tempQty = 1;
            return tempQty;
        });
    };

    const {
        data: dataListReview,
        loading: dataListLoading,
        execute: listReview,
    } = useFetch(apiConfig.review.getByProduct, {
        immediate: true,
        pathParams: {
            id: id,
        },
        mappingData: ({ data }) => data.content,
    });

    const getListReview = (id) => {
        listReview({
            pathParams: {
                id: id,
            },
        });
    };
    const {
        data: starData,
        loading: starDataLoading,
        execute: starReview,
    } = useFetch(apiConfig.review.starListReview, {
        immediate: true,
        pathParams: {
            productId: id,
        },
        mappingData: ({ data }) => data.content,
    });

    const getStarReview = (id) => {
        starReview({
            pathParams: {
                productId: id,
            },
        });
    };

    useEffect(() => {
        listReview();
        starReview();
    }, []);

    let totalStars = 0;
    let totalRatings = 0;
    const ratingCount = Array(5).fill(0);

    starData?.forEach((item) => {
        totalStars += item.star * item.amount;
        totalRatings += item.amount;

        if (item.star >= 1 && item.star <= 5) {
            ratingCount[item.star - 1] += item.amount;
        }
    });
    const averageRating = totalRatings > 0 ? (totalStars / totalRatings).toFixed(1) : 0;
    const ratingPercentages = ratingCount.map((count) =>
        totalRatings > 0 ? Math.floor((count / totalRatings) * 100) : 0,
    );

    const dataToShow = dataListReview?.length > 0 ? dataListReview.slice(0, visibleItems) : dataListReview;

    const handleShowMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleItems(visibleItems + 10);
            setIsLoadingMore(false);
        }, 150);
    };
    useEffect(() => {
        if (!open) {
            setVisibleItems(10);
        }
    }, [ open ]);

    const handleBuyNow = () => {
        if (profile) {
            handlerDetailsModal.open();
        } else {
            showWarningMessage('Bạn phải đăng nhập để sử dụng chức năng này!');
        }
    };

    return (
        <Container className={styles.container}>
            <PageWrapper routes={[ { breadcrumbName: 'Sản phẩm' } ]}>
                <CartModal
                    open={openedDetailsModal}
                    onCancel={() => handlerDetailsModal.close()}
                    check={check}
                    product={product}
                />
                <Flex align="center" justify="space-between" vertical style={{ width: '100%' }}>
                    <Space size={'large'} style={{ alignItems: 'center' }}>
                        <div className="product-single-l">
                            <div className="product-img">
                                <div className="product-img-zoom">
                                    <img
                                        src={product ? (product?.image ? product?.image : '') : ''}
                                        alt=""
                                        className="img-cover"
                                    />
                                </div>

                                <div className="product-img-thumbs flex align-center my-2">
                                    <div className="thumb-item">
                                        <img
                                            src={product ? (product?.image ? product?.image : '') : ''}
                                            alt=""
                                            className="img-cover"
                                        />
                                    </div>
                                    {product?.listProductVariant[0]?.image && (
                                        <div className="thumb-item">
                                            <img
                                                src={
                                                    product
                                                        ? product?.image
                                                            ? product?.listProductVariant[0]?.image
                                                            : ''
                                                        : ''
                                                }
                                                alt=""
                                                className="img-cover"
                                            />
                                        </div>
                                    )}
                                    {product?.listProductVariant[1]?.image && (
                                        <div className="thumb-item">
                                            <img
                                                src={
                                                    product
                                                        ? product?.image
                                                            ? product?.listProductVariant[1]?.image
                                                            : ''
                                                        : ''
                                                }
                                                alt=""
                                                className="img-cover"
                                            />
                                        </div>
                                    )}
                                    {product?.listProductVariant[2]?.image && (
                                        <div className="thumb-item">
                                            <img
                                                src={
                                                    product
                                                        ? product?.image
                                                            ? product?.listProductVariant[2]?.image
                                                            : ''
                                                        : ''
                                                }
                                                alt=""
                                                className="img-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="product-single-r">
                            <div className="product-details font-manrope">
                                <div className="title fs-20 fw-5">{product?.name}</div>
                                <div>
                                    <p className="para fw-3 fs-15">{product?.description}</p>
                                </div>
                                <div className="info flex align-center flex-wrap fs-14">
                                    <div className="rating">
                                        <span className="text-orange fw-5">Đánh giá:</span>
                                        {/* <span className="mx-1">{product?.rating}</span> */}
                                    </div>
                                    <div className="vert-line"></div>
                                    <div className="brand">
                                        <span className="text-orange fw-5">Thương hiệu:</span>
                                        <span className="mx-1">{product?.brandDto.name}</span>
                                    </div>
                                    <div className="vert-line"></div>
                                    <div className="brand">
                                        <span className="text-orange fw-5">Loại:</span>
                                        <span className="mx-1 text-capitalize">
                                            {product?.categoryDto.name
                                                ? product?.categoryDto.name.replace('-', ' ')
                                                : ''}
                                        </span>
                                    </div>
                                </div>
                                {discountedPrice !== 0 ? (
                                    <div className="price">
                                        <div className="flex align-center">
                                            <div className="old-price text-gray">
                                                {formatMoney(product?.price, {
                                                    groupSeparator: ',',
                                                    decimalSeparator: '.',
                                                    currentcy: 'đ',
                                                    currentcyPosition: 'BACK',
                                                    currentDecimal: '0',
                                                })}
                                            </div>
                                            <span className="fs-14 mx-2 text-dark">Bao gồm tất cả các loại thuế</span>
                                        </div>

                                        <div className="flex align-center my-1">
                                            <div className="new-price fw-5 font-poppins fs-24 text-orange">
                                                {formatMoney(discountedPrice, {
                                                    groupSeparator: ',',
                                                    decimalSeparator: '.',
                                                    currentcy: 'đ',
                                                    currentcyPosition: 'BACK',
                                                    currentDecimal: '0',
                                                })}
                                            </div>
                                            <div className="discount bg-orange fs-13 text-white fw-6 font-poppins">
                                                {product?.saleOff}% OFF
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="price">
                                        <div className="flex align-center my-1">
                                            <div className="new-price fw-5 font-poppins fs-24 text-orange">
                                                {formatMoney(product?.price, {
                                                    groupSeparator: ',',
                                                    decimalSeparator: '.',
                                                    currentcy: 'đ',
                                                    currentcyPosition: 'BACK',
                                                    currentDecimal: '0',
                                                })}
                                            </div>
                                            <span className="fs-14 mx-2 text-dark">Bao gồm tất cả các loại thuế</span>
                                        </div>
                                    </div>
                                )}

                                <div className="qty flex align-center my-4">
                                    {product?.stock === 0 ? (
                                        <div className="qty-error text-uppercase bg-danger text-white fs-12 ls-1 mx-2 fw-5">
                                            out of stock
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>

                                <div className="btns">
                                    {/* {product && <AddToCardButton onClick={() => AddToCardButton(product?.listProductVariant[0], quantity)} />} */}
                                    <button type="button" className="add-to-cart-btn btn">
                                        <i className="fas fa-shopping-cart"></i>
                                        <span
                                            className="btn-text mx-2"
                                            onClick={(e) => {
                                                setCheck(1);
                                                e.stopPropagation();
                                                handlerDetailsModal.open();
                                            }}
                                        >
                                            Thêm giỏ hàng
                                        </span>
                                    </button>
                                    <button type="button" className="buy-now btn mx-3">
                                        <span
                                            className="btn-text"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCheck(2);
                                                handleBuyNow();
                                            }}
                                        >
                                            Mua ngay
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Space>
                    <Card style={{ backgroundColor: '#ffffff', width: '95%', height: '95%', margin: '10px 0px' }}>
                        <Spin spinning={isLoadingMore}>
                            <div className={styles.modalReview}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Col span={24} align="center">
                                            <Typography.Title style={{ color: '#e6e600' }}>
                                                Đánh giá sản phẩm
                                            </Typography.Title>

                                            <h3
                                                style={{
                                                    marginBottom: '10px',
                                                    fontSize: '30px',
                                                    color: '#1890FF',
                                                }}
                                            >
                                                {averageRating}
                                            </h3>
                                        </Col>
                                        <Col span={24} align="center">
                                            <Rate disabled allowHalf value={averageRating} />
                                        </Col>
                                    </Col>
                                    <Col span={12}>
                                        <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: '8px' }}>5</span>
                                            <StarFilled style={{ color: '#FFD700', marginRight: '8px' }} />
                                            <Progress
                                                strokeColor={'#FFD700'}
                                                percent={ratingPercentages[4]}
                                                style={{ flex: 1 }}
                                            />
                                        </Col>
                                        <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: '8px' }}>4</span>
                                            <StarFilled style={{ color: '#FFD700', marginRight: '8px' }} />
                                            <Progress
                                                strokeColor={'#FFD700'}
                                                percent={ratingPercentages[3]}
                                                style={{ flex: 1 }}
                                            />
                                        </Col>
                                        <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: '8px' }}>3</span>
                                            <StarFilled style={{ color: '#FFD700', marginRight: '8px' }} />
                                            <Progress
                                                strokeColor={'#FFD700'}
                                                percent={ratingPercentages[2]}
                                                style={{ flex: 1 }}
                                            />
                                        </Col>
                                        <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: '8px' }}>2</span>
                                            <StarFilled style={{ color: '#FFD700', marginRight: '8px' }} />
                                            <Progress
                                                strokeColor={'#FFD700'}
                                                percent={ratingPercentages[1]}
                                                style={{ flex: 1 }}
                                            />
                                        </Col>
                                        <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginRight: '8px' }}>1</span>
                                            <StarFilled style={{ color: '#FFD700', marginRight: '8px' }} />
                                            <Progress
                                                strokeColor={'#FFD700'}
                                                percent={ratingPercentages[0]}
                                                style={{ flex: 1 }}
                                            />
                                        </Col>
                                    </Col>
                                </Row>
                                <div
                                    style={{
                                        margin: '10px 0px',
                                        borderBottom: '1px solid #ddd',
                                    }}
                                />
                                <>
                                    <span
                                        style={{
                                            color: '#1890FF',
                                            fontSize: '16px',
                                            marginLeft: '8px',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        Danh sách đánh giá ({totalRatings} Review)
                                    </span>

                                    <div>
                                        {dataToShow?.length > 0
                                            ? dataToShow?.map((item, index) => (
                                                <Row
                                                    gutter={16}
                                                    key={index}
                                                    style={{
                                                        border: '1px solid #ddd',
                                                        borderRadius: '6px',
                                                        padding: '6px',
                                                        margin: '0px 8px 14px 8px',
                                                    }}
                                                >
                                                    <Col span={2} align="center" justify="center">
                                                        <AvatarField
                                                            size="large"
                                                            icon={<UserOutlined />}
                                                            src={item?.userDto?.accountAutoCompleteDto?.avatarPath}
                                                        />
                                                    </Col>
                                                    <Col span={17}>
                                                        <div style={{ fontWeight: '500', fontSize: '16px' }}>
                                                            {item?.userDto?.accountAutoCompleteDto?.fullName}
                                                        </div>
                                                        <Row>
                                                            <span>{item.message}</span>
                                                        </Row>
                                                        <Row>
                                                            <span>
                                                                {convertUtcToLocalTime(
                                                                    item.createdDate,
                                                                    DEFAULT_FORMAT,
                                                                    DEFAULT_FORMAT,
                                                                )}
                                                            </span>
                                                        </Row>
                                                    </Col>
                                                    <Col span={5} style={{ textAlign: 'right' }}>
                                                        <Rate
                                                            disabled
                                                            defaultValue={item?.star}
                                                            style={{ fontSize: '14px' }}
                                                        />
                                                    </Col>
                                                </Row>
                                            ))
                                            : ''}
                                        {visibleItems < dataToShow?.length && (
                                            <Col align="center">
                                                <Button className={styles.btnAdd} type="text" onClick={handleShowMore}>
                                                    <ArrowDownOutlined />
                                                    Xem thêm
                                                </Button>
                                            </Col>
                                        )}
                                    </div>
                                </>
                            </div>
                        </Spin>
                    </Card>
                </Flex>
            </PageWrapper>
        </Container>
    );
};

export default DetailPageDesktop;
