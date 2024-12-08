import { defineMessages } from 'react-intl';

export const commonMessage = defineMessages({
    notification : "Thông báo",
    confirm : "Xác nhận",
    cancel:"Hủy",
    confirmNotification : "Bạn có muốn xóa toàn bộ thông báo",
    free: ' Miễn Phí',
    lesson: 'Bài giảng',
    hour: 'Giờ',
    preview: 'Xem trước',
    time: 'Thời lượng',
    onCart: 'Đã thêm vào giỏ hàng ',
    shareExpert: 'Chia sẻ kinh nghiệm ngay hôm nay',
    courseSuggest: 'Có thể bạn thích?',
    reivewWrite: 'Viết đánh giá',
    reivewSystemWrite: 'Viết đánh giá hệ thống',
    reivewSystem: 'Đánh giá hệ thống',
    myReview: 'Đánh giá của tôi',
    registerSuccess: 'Đăng ký tài khoản thành công ',
    expert: 'Chuyên gia',
    NotCourse : "Không có khóa học",
    NotCourseDone : "Bạn chưa hoàn thành khóa học nào",
    NotCourseExited : "Khóa học không tồn tại",
    NotLesson : "Không có bài học",
    student : "đã học",
    total : "Tổng số",
    timeTotal : "Thời gian",
    notNotification : "Không có thông báo",
    guidePayment : "Hướng dẫn thanh toán",
    // export const notificationKind = {
    //     NOTIFICATION_KIND_APRROVE_SELLER,
    //     NOTIFICATION_KIND_REJECT_SELLER,
    //     NOTIFICATION_KIND_EXPERT_REGISTRATION,
    //     NOTIFICATION_KIND_APPROVE_EXPERT,
    //     NOTIFICATION_KIND_REG_EXPERT,
    //     NOTIFICATION_KIND_SING_UP_STUDENT,
    // };
    // ==========================================
    notificationAprroveSeller: '1 người mua hàng đã được chấp nhận thành công bằng mã giới thiệu của bạn',
    notificationRejectSeller: '1 người hàng đã bị từ chối khi đăng ký bằng mã giới thiệu của bạn',
    notificationExpertRegistration: '1 Chuyên gia đã đăng ký thành công bằng mã giới thiệu của bạn',
    notficationApproveExpert: '1 Chuyên gia đã chấp nhận thành công bằng mã giới thiệu của bạn',
    notficationUpdateSeller: 'Bạn đã được nâng cấp thành công thành người bán hàng',
    notificationSingUpStudent: '1 học sinh đã đăng ký thành công bằng mã giới thiệu của bạn',
    notificationReviceRevenueMess: `Bạn đã nhận được {revenueMoney} doanh thu từ khóa học {courseName}`,
    notificationOrderSuccessMess: `Đơn hàng {orderId} của bạn đã được duyệt`,
    notificationOrderRejectMess: `Giao dịch {orderId} bị từ chối, vui lòng kiểm tra lại hoặc liên hệ đến số Hotline`,
    linkDocs: 'Đường dẫn tài liệu',
    loadMore:'Xem thêm',
    bank: 'Ngân hàng',
    stk: 'Số tài khoản',
    billPayment: 'Upload chứng từ thanh toán',
    accountOwner: 'Tên chủ tài khoản',
    branchs: 'Chi nhánh',
    walletBalance: 'Số dư trong ví',
    payMoney: 'Số tiền thanh toán',
    remainingBalance: 'Số tiền còn lại trong ví',
    refCode: 'Mã giới thiệu',
});

export const commonValidation = defineMessages({
    phoneAndEmailExit: 'Số điện thoại và email đã sử dụng ',
    phoneExitsValidation: 'Số điện thoại này đã được sử dụng',
    emailValidation: 'Email này đã được sử dụng',
    phoneValidation: 'Số điện thoại / Email không đúng',
    passwordValidation: 'Số điện thoại / Email hoặc mật khẩu không đúng, vui lòng kiểm tra email và mật khẩu của bạn hoặc tạo một tài khoản',
    paymentMethodValidation: 'Vui lòng chọn phương thức thanh toán',
    passwordLengthValidation: 'Mật khẩu phải ít nhất 6 kí tự ',
    refCodeInvaild:"Mã giới thiệu không hợp lệ",
});

export const commonLabel = defineMessages({
    videos: 'Videos',
    articles: 'Articles',
    games: 'Games',
    quiz: 'Quiz',
    lesson: 'lesson',

    welcomeUser: 'Welcome, {user}',
});

export const commonButton = defineMessages({
    login: 'Login',
});