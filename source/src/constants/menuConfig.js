import logout from '@assets/icons/logout.svg';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
    EditOutlined,
    HomeOutlined,
    InboxOutlined,
    LogoutOutlined,
    PlusOutlined,
    RetweetOutlined,
    StarOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { IconReplace } from '@tabler/icons-react';
const configPages = [
    {
        title: <FormattedMessage defaultMessage="Hồ sơ" />,
        // component: InfoProfile,
        key: 'info',
        icon: <UserOutlined />,
        // access: [ GROUP_KIND_EXPERT, GROUP_KIND_STUDENT, GROUP_KIND_SELLER ],
    },
    {
        title: <FormattedMessage defaultMessage="Đổi mật khẩu" />,
        // component: InfoProfile,
        key: 'change-password',
        icon: <RetweetOutlined />,
        // access: [ GROUP_KIND_EXPERT, GROUP_KIND_STUDENT, GROUP_KIND_SELLER ],
    },
    {
        title: <FormattedMessage defaultMessage="Địa chỉ của tôi" />,
        // component: InfoProfile,
        key: 'my-address',
        icon: <HomeOutlined />,
        // access: [ GROUP_KIND_EXPERT, GROUP_KIND_STUDENT, GROUP_KIND_SELLER ],
    },
    {
        title: <FormattedMessage defaultMessage="Đánh giá của tôi" />,
        // component: InfoProfile,
        key: 'my-review',
        icon: <StarOutlined />,
        // access: [ GROUP_KIND_EXPERT, GROUP_KIND_STUDENT, GROUP_KIND_SELLER ],
    },
    {
        title: <FormattedMessage defaultMessage="Voucher của tôi" />,
        // component: InfoProfile,
        key: 'my-voucher',
        icon: <InboxOutlined />,
        // access: [ GROUP_KIND_EXPERT, GROUP_KIND_STUDENT, GROUP_KIND_SELLER ],
    },
];

export default configPages;
