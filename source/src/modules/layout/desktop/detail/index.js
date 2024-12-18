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
import { convertUtcToLocalTime, formatMoney, getImageUrl, price } from '@utils';
import { Button, Card, Col, Divider, Flex, Form, Image, Progress, Rate, Row, Space, Spin, Typography } from 'antd';
import CartModal from './CartModal';
import styles from './index.module.scss';
import useAuth from '@hooks/useAuth';
import { showWarningMessage } from '@services/notifyService';
import Container from '@components/common/elements/Container';
import InputTextField from '@components/common/form/InputTextField';
import RichTextRender from '@components/common/elements/RichTextRender';
import ProductList from '@components/common/elements/ProductList/ProductList';

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
    const [ averageRating, setAverageRating ] = useState(0);
    const [ ratingPercentages, setRatingPercentages ] = useState([ 0, 0, 0, 0, 0 ]);
    const { data: product, execute: executGetAllproducts } = useFetch(apiConfig.product.getProductAutocomplete, {
        immediate: false,
        mappingData: ({ data }) => data,
    });
    const {
        data: listProductRelated,
        execute: executeGetListRelated,
        loading: loadingGetListRelated,
    } = useFetch(apiConfig.product.getListRelated, {
        immediate: false,
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

    const { data: dataListReview, execute: executeListReview } = useFetch(apiConfig.review.getByProduct, {
        immediate: false,
        mappingData: ({ data }) => data.content,
    });

    const {
        data: starReviewData,
        loading: starDataLoading,
        execute: executeStarReviewData,
    } = useFetch(apiConfig.review.starCountForEach, { immediate: false, mappingData: ({ data }) => data.content });
    useEffect(() => {
        executGetAllproducts({
            pathParams: { id },
            onCompleted: (res) => {
                if (res?.data?.length > 0) setDetail(res.data);
                else setDetail([]);
            },
            onError: (error) => {},
        });
        executeListReview({
            params: {
                productId: id,
            },
        });
        executeStarReviewData({
            pathParams: {
                id,
            },
        });
        executeGetListRelated({
            pathParams: {
                id,
            },
        });
    }, [ id ]);

    useEffect(() => {
        if (starReviewData) {
            const ratingCount = Array(5).fill(0);
            let totalStars = 0;
            let totalRatings = 0;
            starReviewData?.forEach((item) => {
                totalStars += item.star * item.amount;
                totalRatings += item.amount;

                if (item.star >= 1 && item.star <= 5) {
                    ratingCount[item.star - 1] += item.amount;
                }
            });
            const value = totalRatings > 0 ? (totalStars / totalRatings).toFixed(1) : 0;
            setAverageRating(totalRatings > 0 ? (totalStars / totalRatings).toFixed(1) : 0);
            const ratingPercentages = ratingCount.map((count) =>
                totalRatings > 0 ? Math.floor((count / totalRatings) * 100) : 0,
            );
            setRatingPercentages(ratingPercentages);
        }
    }, [ starReviewData ]);

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

    const detailCard = [
        { title: 'Danh mục', content: product?.categoryDto?.name },
        { title: 'Thương hiệu', content: product?.brandDto?.name },
        {
            title: 'Đánh giá',
            content: (
                <>
                    {product?.avgStart}
                    <StarFilled style={{ color: '#FFD700', marginLeft: '8px' }} />
                </>
            ),
        },
        { title: 'Số hàng còn trong kho', content: product?.totalInStock },
        { title: 'Số sản phẩm đã bán', content: product?.soldAmount },
        { title: 'Hạng bảo hàng', content: '12 tháng' },
        { title: 'Xuất xứ', content: 'Việt Nam' },
    ];

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
                                <Typography.Title level={2}>{product?.name}</Typography.Title>
                                <div className="info flex align-center flex-wrap fs-14">
                                    <div className="brand">
                                        <span className="text-orange fw-5">Thương hiệu: </span>
                                        <span className="mx-1">{product?.brandDto.name}</span>
                                    </div>
                                    <div className="vert-line"></div>
                                    <div className="brand">
                                        <span className="text-orange fw-5">Loại: </span>
                                        <span className="mx-1 text-capitalize">
                                            {product?.categoryDto.name
                                                ? product?.categoryDto.name.replace('-', ' ')
                                                : ''}
                                        </span>
                                    </div>
                                    <div className="vert-line"></div>
                                    <div className="brand">
                                        <span className="text-orange fw-5">Đã bán: </span>
                                        <span className="mx-1 text-capitalize">{product?.soldAmount || 0}</span>
                                    </div>
                                </div>
                                {discountedPrice != 0 ? (
                                    <Flex className={styles.price} gap={8} vertical>
                                        <Flex align="center" justify="start">
                                            <div className={styles.oldPrice}>
                                                {formatMoney(product?.price, {
                                                    groupSeparator: ',',
                                                    decimalSeparator: '.',
                                                    currentcy: 'đ',
                                                    currentcyPosition: 'BACK',
                                                    currentDecimal: '0',
                                                })}
                                            </div>
                                            <div className={styles.saleOff}>-{product?.saleOff}% OFF</div>
                                        </Flex>

                                        <Flex align="center" justify="space-between">
                                            <span className={styles.newPrice}>
                                                {formatMoney(discountedPrice, {
                                                    groupSeparator: ',',
                                                    decimalSeparator: '.',
                                                    currentcy: 'đ',
                                                    currentcyPosition: 'BACK',
                                                    currentDecimal: '0',
                                                })}
                                            </span>
                                            <span>Bao gồm tất cả các loại thuế</span>
                                        </Flex>
                                    </Flex>
                                ) : (
                                    <Flex align="center" justify="space-between" className={styles.price}>
                                        <div className={styles.newPrice}>
                                            {formatMoney(product?.price, {
                                                groupSeparator: ',',
                                                decimalSeparator: '.',
                                                currentcy: 'đ',
                                                currentcyPosition: 'BACK',
                                                currentDecimal: '0',
                                            })}
                                        </div>
                                        <span>Bao gồm tất cả các loại thuế</span>
                                    </Flex>
                                )}

                                <div className="qty flex align-center my-4">
                                    {product?.totalInStock === 0 ? (
                                        <div className="qty-error text-uppercase bg-danger text-white fs-12 ls-1 mx-2 fw-5">
                                            Hết hàng
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                                <Row align="center" justify="space-between" gutter={16} className={styles.price}>
                                    <Col span={5}>
                                        <span style={{ fontSize: 18 }}>An tâm mua sắm cùng Tech Market</span>
                                    </Col>
                                    <Col
                                        span={19}
                                        style={{
                                            display: 'flex',
                                            width: 'max-content',
                                            border: '2px solid #ccc',
                                            borderRadius: 10,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '20px 15px',
                                        }}
                                    >
                                        <Image src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/e3c4dc83fbfcab7b0654.svg" />
                                        <span style={{ fontSize: 18 }}>Trả hàng miễn phí sau 15 ngày trải nghiệm</span>
                                    </Col>
                                </Row>

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
                            <div style={{ padding: '24px' }}>
                                <Typography.Title level={2} style={{ color: 'black' }}>
                                    Chi tiết sản phẩm
                                </Typography.Title>
                                {detailCard.map((item, index) => {
                                    return (
                                        <Row key={index} align="center" gap={8} style={{ margin: '16px 0px' }}>
                                            <Col span={4} className={styles.modalReview_title}>
                                                {item.title}
                                            </Col>
                                            <Col span={20} className={styles.modalReview_content}>
                                                {item.content}
                                            </Col>
                                        </Row>
                                    );
                                })}
                                <Divider />
                                <Typography.Title level={2} style={{ color: 'black' }}>
                                    Mô tả sản phẩm
                                </Typography.Title>
                                <RichTextRender
                                    value={product?.description}
                                    type={'textarea'}
                                    disabled={true}
                                    style={{ height: 'max-content' }}
                                />
                            </div>
                        </Spin>
                    </Card>
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
                                        Danh sách đánh giá ({dataListReview?.length || 0} Review)
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
                                                            src={getImageUrl(
                                                                item?.userDto?.accountAutoCompleteDto?.avatarPath,
                                                            )}
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
                    {listProductRelated && (
                        <Card style={{ backgroundColor: '#ffffff', width: '95%', height: '95%', margin: '10px 0px' }}>
                            <Spin spinning={isLoadingMore}>
                                <Typography.Title level={2}>Sản phẩm liên quan</Typography.Title>
                                <div className={styles.modalReview}>
                                    <ProductList
                                        products={listProductRelated}
                                        executGetProductDetail={executGetProductDetail}
                                        loadingProductDetail={loadingProductDetail}
                                        isRealated={true}
                                    />
                                </div>
                            </Spin>
                        </Card>
                    )}
                </Flex>
            </PageWrapper>
        </Container>
    );
};

export default DetailPageDesktop;
