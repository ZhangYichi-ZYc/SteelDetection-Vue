// import axios from 'axios';

// const apiClient = axios.create({
//     baseURL: 'http://your-api-url.com',
//     headers: {
//         'Content-Type': 'application/json'
//     }
// });

// export default {
//     login(credentials) {
//         return apiClient.post('/auth/login', credentials);
//     },
//     getOrders() {
//         return apiClient.get('/orders');
//     }
//     // 其他API请求
// }; 

export default {
    login(credentials) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (credentials.username === 'admin' && credentials.password === '123456') {
                    resolve({ data: { success: true, token: 'fake-token' } });
                } else {
                    resolve({ data: { success: false, message: '用户名或密码错误' } });
                }
            }, 1000);
        });
    },
    getOrders() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: [
                        { id: 1, name: '订单1', status: '进行中' },
                        { id: 2, name: '订单2', status: '已完成' }
                    ]
                });
            }, 1000);
        });
    },
    getStaff() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: [
                        { id: 1, name: '员工1', role: '管理员' },
                        { id: 2, name: '员工2', role: '普通员工' }
                    ]
                });
            }, 1000);
        });
    }
};
// src/api/index.js
export function loginWithPassword(username, password) {
    return new Promise((resolve, reject) => {
        // 模拟 API 调用
        if (username === 'test' && password === '1234') {
            resolve({ success: true });
        } else {
            reject({ success: false, message: '用户名或密码错误' });
        }
    });
}

export function loginWithPhone(phone, code) {
    return new Promise((resolve, reject) => {
        // 模拟 API 调用
        if (phone === '1234567890' && code === '0000') {
            resolve({ success: true });
        } else {
            reject({ success: false, message: '手机号或验证码错误' });
        }
    });
}
