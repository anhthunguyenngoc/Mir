const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/api', createProxyMiddleware({
    target: 'http://192.168.86.139', // Địa chỉ máy chủ của bạn
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/api', // Giữ nguyên đường dẫn
    },
}));

app.listen(3000, () => {
    console.log('Proxy server is running on http://localhost:3000');
});