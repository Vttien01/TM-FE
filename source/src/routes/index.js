import PageNotAllowed from '@components/common/page/PageNotAllowed';
import PageNotFound from '@components/common/page/PageNotFound';
import LandingPageContainer from '@modules/containers/landing';
import LoginPageContainer from '@modules/containers/login';
import RegisterPageContainer from '@modules/containers/register';
import PublicLayout from '@modules/layout/common/PublicLayout';
import ForgetPasswordPageContainer from '@modules/containers/forgetPassword';
import ChangeForgetPasswordPageContainer from '@modules/containers/ChangeforgetPassword';
import VerifyPage from '@modules/containers/verify';
import DetailPageContainer from '@modules/containers/detail';
import LandingCategoryPageContainer from '@modules/containers/landingCategory';
import IntroductionHome from '@modules/layout/desktop/intro/IntroductionHome';
import ContactHome from '@modules/layout/desktop/intro/ContactHome';
import ExperienceHome from '@modules/layout/desktop/intro/ExperienceHome';
import OrderPage from '@modules/layout/desktop/order';
import ResultFail from '@modules/layout/desktop/order/ResultFail';
import ResultSuccess from '@modules/layout/desktop/order/ResultSucces';
import HistoryOrderPage from '@modules/layout/desktop/HistoryOrder';
import HistoryOrderGuest from '@modules/layout/desktop/HistoryOrder/HistoryOrderGuest';
import ProfileUser from '@modules/layout/desktop/profileUser/routes';
import ReviewPage from '@modules/layout/desktop/Review';

/*
	auth
		+ null: access login and not login
    + true: access login only
		+ false: access not login only
*/
const routes = {
    pageNotAllowed: {
        path: '/not-allowed',
        component: PageNotAllowed,
        auth: false,
        title: 'Page not allowed',
    },
    homePage: {
        path: '/',
        component: LandingPageContainer,
        auth: null,
        title: 'Home',
    },
    loginPage: {
        path: '/login',
        component: LoginPageContainer,
        auth: false,
        title: 'login',
    },
    registerPage: {
        path: '/register',
        component: RegisterPageContainer,
        auth: false,
        title: 'register',
    },
    forgetPasswordPage: {
        path: '/change-passwor',
        component: ForgetPasswordPageContainer,
        auth: false,
        title: 'change-passwor',
    },
    ChangePasswordPage: {
        path: '/change-password',
        component: ChangeForgetPasswordPageContainer,
        auth: false,
        title: 'change-passwor',
    },
    notFound: {
        component: PageNotFound,
        auth: null,
        title: 'Page not found',
        path: '*',
        layout: PublicLayout,
    },
    verify: {
        path: '/verify/:id',
        component: VerifyPage,
        auth: null,
        title: 'News List',
    },
    detail: {
        path: '/detail/:id',
        component: DetailPageContainer,
        auth: null,
        title: 'Detail',
    },
    detailCategory: {
        path: '/c',
        component: LandingCategoryPageContainer,
        auth: true,
        title: 'Landing Category',
    },
    IntroductionHome: {
        path: '/introduction',
        component: IntroductionHome,
        auth: null,
        title: 'Giới thiệu trang web',
    },
    ContactHome: {
        path: '/contact',
        component: ContactHome,
        auth: null,
        title: 'Liên hệ với chúng tôi',
    },
    experencies: {
        path: '/experencies',
        component: ExperienceHome,
        auth: null,
        title: 'Kinh nghiệm',
    },
    OderPage: {
        path: '/my-order',
        component: OrderPage,
        auth: null,
        title: 'Đặt hàng',
    },
    ResultFail: {
        path: '/my-order-fail',
        component: ResultFail,
        auth: null,
        title: 'Đặt hàng thất bại',
    },
    ResultSuccess: {
        path: '/my-order-success',
        component: ResultSuccess,
        auth: null,
        title: 'Đặt hàng thành công',
    },
    HistoryOrder: {
        path: '/history-order',
        component: HistoryOrderPage,
        auth: null,
        title: 'Lịch sử đơn hàng',
    },
    HistoryOrderGuest: {
        path: '/history-order-guest',
        component: HistoryOrderGuest,
        auth: null,
        title: 'Đặt hàng thành công',
    },
    ReviewPage: {
        path: '/review',
        component: ReviewPage,
        auth: null,
        title: 'Evaluate Page',
        // permissions: [apiConfig.order.create.baseURL, apiConfig.order.update.baseURL],
    },
    ...ProfileUser,
};

export default routes;
