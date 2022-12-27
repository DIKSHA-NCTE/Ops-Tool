export const NTPTOOL = {
    SUB: {
        DASHBOARD: 'v1/dashboard/',
        ADMIN: 'v1/admin/',
        MODULES: 'v1/modules/',
        SUPPORT_USERS: 'v1/support/users/',
        AUTH: 'v1/auth/',
        TENANT: 'v1/org/',
        CONTENT: 'v1/content/',
        FORM: 'v1/form/',
        USER: 'v1/user/',
        REPORT: 'v1/reports/',
        COURSES: 'v1/courses/',
        SSU: 'v1/ssusers/',
        SUBMODULES: 'v1/submodules/',
        CERTIFICATE: 'v1/cert/',
        CHANNEL: 'v1/channel/'
    },
    API: {
        LIST: 'list',
        SEARCH: 'search',
        CREATE: 'create',
        ADD: 'add',
        DELETE: 'delete',
        UPDATE: 'update',
        READ: 'read',
        ASSIGN: 'assign',
        SUB: 'subModules',
        SUB_ROLE: 'subrole/',
        TOKEN: 'token',
        CONSTANT_LIST: 'constants/list',
        CONSTANT_ADD: 'constants/add',
        CONSTANT_DELETE: 'constants/delete',
        CONSTANT_CREATE: 'constants/create',
        MODULE_LIST: 'modules/list',
        MODULE_CREATE: 'modules/create',
        MODULE_UPDATE: 'modules/update',
        MODULE_DELETE: 'modules/delete',
        MODULE_GET: 'modules/get',
        DOWNLOAD: 'download',
        UPLOAD: 'upload',
        UPLOAD_STATUS: 'upload/status',
        DATA: 'data/status',
        STATUS: 'status/list',
        REPORTS: 'reports',
        FILTER: 'search/filter',
        SUB_FILTER: {
            SUB_LIST: 'list/',
            SUB_CREATE: 'create/',
            SUB_UPLOAD: 'upload/',
            SUB_UPLOAD_STATUS: 'upload_status/',
            SUB_BATCH_UPLOAD_LIST: 'batch_upload_list/',
            SUB_USER: 'user/',
            SUB_COURSE: 'course/',
            SUB_BATCH: 'batch/'
        },
        ENROLLMENT: 'user/enrollment',
        CERT_PDF: 'pdf/',
        CERT_SVG: 'svg/',
        CONTENT_UPLOAD: 'getContent',
        BROADCAST_UPLOAD: 'broadcastContent',
        BROADCAST: 'broadcast/',
        SHALLOW_COPY: 'shallowCopy/',
        SHALLOW_COPY_UPLOAD: 'contentShallowCopy'
    }
};

export const NTPCONSTANTS = {
    ROUTERLINKS: {
        DASHBOARD: 'dashboard',
        ADMIN: {
            MODULES: 'admin/modules/list',
            CONSTANTS: 'admin/constants/list',
            SUPPORT_USERS: 'admin/support-users/list'
        },
        CONTENTS: {
            LIST: 'contents/list'
        },
        ORGANIZATIONS: {
            ORG: 'organizations',
            LIST: 'organizations/list',
            CREATE: 'organizations/create',
            UPDATE: 'organizations/update'
        },
        USERS: {
            USERS: 'users',
            LIST: 'users/list',
            CREATE: 'users/create',
            UPDATE: 'users/edit'
        },
        REPORTS: {
            LIST: 'reports/list',
            COURSE: 'reports/course',
            SSU: 'reports/self-signup-users'
        },
        USERS_BULK_UPLOAD: {
            LIST: 'users/bulk-upload/list',
            UPLOAD: 'users/bulk-upload/upload',
            UPLOAD_STATUS: 'users/bulk-upload/upload-status',
            BATCH_UPLOAD_LIST: 'users/bulk-upload/batch-upload-list'
        },
        CONTENTS_BULK_UPLOAD: {
            LIST: 'contents/bulk-upload/list',
            UPLOAD: 'contents/bulk-upload/upload',
            UPLOAD_STATUS: 'contents/bulk-upload/upload-status',
            BATCH_UPLOAD_LIST: 'contents/bulk-upload/batch-upload-list'
        },
        BROADCAST_CONTENT: {
            LIST: 'contents/broadcast/list',
            UPLOAD: 'contents/broadcast/upload',
            UPLOAD_STATUS: 'contents/broadcast/upload-status',
            BATCH_UPLOAD_LIST: 'contents/broadcast/batch-upload-list'
        },
        CERTIFICATES: {
            LIST: 'certificates/list',
            COURSE: 'certificates/course',
            USER: 'certificates/user'
        },
        SHALLOW_COPY: {
            LIST: 'contents/shallow-copy/list',
            UPLOAD: 'contents/shallow-copy/upload',
            UPLOAD_STATUS: 'contents/shallow-copy/upload-status',
            BATCH_UPLOAD_LIST: 'contents/shallow-copy/batch-upload-list'
        },
        SUB_ROLE: 'subrole',
        FORMS: {
            LIST: 'forms/list'
        }
    }
};
