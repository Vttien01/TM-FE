import logout from '@assets/icons/logout.svg';
import { ReactComponent as Study } from '@assets/icons/study.svg';
import { ReactComponent as User } from '@assets/icons/user.svg';
import { ReactComponent as Wallet } from '@assets/icons/wallet.svg';

import { ReactComponent as RevenueIcon } from '@assets/icons/revenue.svg';
import { ReactComponent as Notification } from '@assets/icons/notification.svg';
import { ReactComponent as PadLock } from '@assets/icons/padlock.svg';
import { IconCoins, IconMenu2 } from '@tabler/icons-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { GROUP_KIND_EXPERT, GROUP_KIND_SELLER, GROUP_KIND_STUDENT } from '@constants';
import { IconReplace } from '@tabler/icons-react';
const configPages = [
    {
        title: <FormattedMessage defaultMessage="Hồ sơ" />,
        // component: InfoProfile,
        key: 'info',
        icon: <User height={30}/>,
        // access: [ GROUP_KIND_EXPERT, GROUP_KIND_STUDENT, GROUP_KIND_SELLER ],
    },
    // {
    //     title: <FormattedMessage defaultMessage="Ví của tôi" />,
    //     component: MyWallet,
    //     key: 'my-wallet',
    //     icon: <Wallet height={30}/>,
    //     access: [ GROUP_KIND_EXPERT, GROUP_KIND_STUDENT, GROUP_KIND_SELLER ],
    // },
    // {
    //     title: <FormattedMessage defaultMessage="Khóa học của tôi" />,
    //     component: CourseInfo,
    //     key: 'course-learn',
    //     icon: <Study height={30}/>,
    //     access: [ GROUP_KIND_STUDENT, GROUP_KIND_SELLER ],
    // },
    // {
    //     title: <FormattedMessage defaultMessage="Thông báo" />,
    //     component: NotificationMobile,
    //     key: 'notification',
    //     icon: <Notification height={30}/>,
    //     access: [ GROUP_KIND_STUDENT, GROUP_KIND_SELLER ],
    // },

    // {
    //     title: <FormattedMessage defaultMessage="Đổi mật khẩu" />,
    //     component: ChangPassword,
    //     key: 'change',
    //     icon: <PadLock height={30} style={{ marginLeft:'-2px' }}/>,
    //     access: [ GROUP_KIND_STUDENT, GROUP_KIND_SELLER ],
    // },
];

export default configPages;
