module.exports = {
  apps: [
    {
      name: "SMARTFARM",
      script: "./server.js",
      instances: "0",
      exec_mode: "cluster",
      wait_ready: true,
      listen_timeout: 50000,
      env: {
        PORT: 3000,
        NODE_ENV: "development",
      },

      env_production: {
        NODE_ENV: "production", // 배포환경시 적용될 설정 지정
      },
    },
  ],
};
