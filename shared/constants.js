'use strict';

var constants = {
    properties: {
        UUID: 'uuid'
    },
    auth: {
        roles: {
            ADMIN: 'admin',
            USER: 'user'
        },
        BEARER: 'bearer',
        TOKEN_PARAM: 'token',
        ID_TOKEN: 'id_token',
        GENDER_MALE: 'male',
        GENDER_FEMALE: 'female',
        AUTH0_AUDIENCE: 'XjqQOct27l6s9mJmkikqC9OPaCOkmM0S',
        AUTH0_DOMAIN: 'metavrse.auth0.com',
        LOGIN_SCOPE: 'openid profile',
        CONNECTIONS: ['google-oauth2']
    },
    ui: {
        UI_CONTAINER: 'ui-container',
        PROFILE_PICTURE: 'profilePicture',
        USER_NAME: 'userName',
        MAIL: 'mail',
        ROLE: 'role',
        LOGOUT_BUTTON: 'logout button',
        LOVE_BUTTON: 'love button'
    },
    coding: {
        CODE_TEXTAREA: 'leCode',
        UPDATE_BUTTON: 'update',
        CLOSE_BUTTON: 'close'
    },
    html: {
        DIV: 'div',
        STYLE: 'style',
        DISPLAY_NONE: 'none',
        DISPLAY_BLOCK: 'block',
        COLOR_BLACK: 'black'
    },
    events: {
        KEY_DOWN: 'keydown',
        KEY_UP: 'keyup',
        MOUSE_DOWN: 'mousedown',
        MOUSE_UP: 'mouseup',
        MOUSE_MOVE: 'mousemove',
        RESIZE: 'resize'
    },
    keyboard: {
        F4: 115,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        W: 87,
        A: 65,
        S: 83,
        D: 68,
        SPACE: 32,
        SHIFT: 16
    },
    mouse: {
        LEFT_BUTTON: 0,
        MID_BUTTON: 1,
        RIGHT_BUTTON: 2
    },
    camera: {
        FIELD_OF_VIEW: 45,
        NEAR: 0.1,
        FAR: 100000
    },
    firstPerson: {
        JUMP_SPEED: 350,
        INITIAL_Y: 15,
        LOWEST_Y: 70,
        GRAVITY: 9.8,
        PLAYER_MASS: 75.0,
        WALKING_SPEED: 4000,
        RUNNING_SPEED: 16000,
        DECELERATION: 10.0
    },
    socket: {
        keyvr: {
            NAMESPACE: '/keyvr',
            QR_CODE_SCANNED: 'qrCodeScanned',
            DEVICE_CONNECTED: 'deviceConnected',
            KEYBOARD_ID: 'keyboardId'
        },
        playerSync: {
            NAMESPACE: '/sync',
            REGISTER: 'register',
            CHANGE: 'change',
            OTHER_CONNECT: 'other connect',
            OTHER_DISCONNECT: 'other disconnect',
            OTHER_CHANGE: 'other change'
        }
    },
    renderer: {
        CLEAR_COLOR: 0x00ff00
    },
    mobile: {
        ANDROID_REGEX: /Android/i
    },
    reticle: {
        COLOR: 0x333333,
        TWEEN_TIME: 250,
        SEGMENTS: 32,
        LARGE_RADIUS: 0.12,
        SMALL_RADIUS: 0.03,
        Z_POSITION: -10
    },
    scripts: {
        APP_PARAM: 'app',
        SCENE_PARAM: 'scene'
    },
    rtc: {
        CHANNEL: 'continuum',
        DEFAULT_ROOM: 'default_room'
    },
    objects: {
        TEXTURE: 'texture',
        GEOMETRY: 'geometry',
        IMAGE: 'image',
        MATERIAL: 'material',
        SCRIPT: 'script',
        GUI: 'gui'
    },
    routes: {
        api: {
            BASE: '/api',
            SCENE: '/scene'
        },
        LOGIN_SCREEN: '/login',
        WORLD: '/',
        CLIENT: '/client',
        SHARED: '/shared',
        NODE_MODULES: '/node_modules',
        KEYVR: '/keyvr'
    },
    environments: {
        DEV: 'dev'
    },
    db: {
        COUNTERS: 'counters',
        OBJECT: 'object',
        SCENE: 'scene'
    }
};

// detect if we're using requirejs, if not export with module.exports :)
if (typeof define === 'function' && define.amd) {
    define([], function() {
        return constants;
    });
} else if (typeof exports === 'object') {
    module.exports = constants;
} else {
    window.constants = constants;
}
