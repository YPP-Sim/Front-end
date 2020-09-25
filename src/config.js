const configs = {
  development: {
    IO_ENDPOINT: "http://127.0.0.1:4000",
    SERVER_ENDPOINT: "http://localhost:4000",
  },
  production: {
    IO_ENDPOINT: "http://167.172.9.113:4000/",
    SERVER_ENDPOINT: "http://167.172.9.113:4000/",
  },
};

const envConfig = process.env.REACT_APP_STAGE
  ? configs[process.env.REACT_APP_STAGE]
  : configs.development;

export default envConfig;
