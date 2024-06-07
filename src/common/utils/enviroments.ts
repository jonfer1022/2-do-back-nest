export const environments = () => ({
  port: parseInt(process.env.PORT) || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  awsCognito: {
    region: process.env.AWS_COGNITO_REGION,
    clientId: process.env.AWS_COGNITO_CLIENT_ID,
    userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
    clientSecret: process.env.AWS_COGNITO_CLIENT_SECRET,
  },
});
