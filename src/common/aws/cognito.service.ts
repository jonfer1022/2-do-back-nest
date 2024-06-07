import * as AWS from 'aws-sdk';
import * as crypto from 'crypto';

export class CognitoService {
  private clientId: string;
  private secretHash: string;
  private cognitoIdentity: AWS.CognitoIdentityServiceProvider;

  constructor(
    region: string,
    clientId: string,
    secretHash: string,
    apiVersion: string = '2016-04-18',
  ) {
    this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider({
      region,
      apiVersion,
    });
    this.clientId = clientId;
    this.secretHash = secretHash;
  }

  private hashSecret(username: string): string {
    return crypto
      .createHmac('SHA256', this.secretHash)
      .update(username + this.clientId)
      .digest('base64');
  }

  async signUp(username: string, password: string, attributes?: Array<any>) {
    try {
      const params = {
        ClientId: this.clientId,
        Password: password,
        Username: username,
        SecretHash: this.hashSecret(username),
        UserAttributes: attributes,
      };

      return await this.cognitoIdentity.signUp(params).promise();
    } catch (error) {
      const { message } = error;
      console.log(
        '-----> ~ cognitoService ~ signUp ~ error:',
        message || error,
      );
      throw new Error("Can't sign up user");
    }
  }

  async confirmSignUp(username: string, code: string) {
    try {
      const params = {
        ClientId: this.clientId,
        ConfirmationCode: code,
        Username: username,
        SecretHash: this.hashSecret(username),
      };
      return await this.cognitoIdentity.confirmSignUp(params).promise();
    } catch (error) {
      const { message } = error;
      console.log(
        '-----> ~ cognitoService ~ confirmSignUp ~ error:',
        message || error,
      );
      throw new Error("Can't confirm sign up user");
    }
  }

  async signIn(username: string, password: string) {
    try {
      const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: this.clientId,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
          SECRET_HASH: this.hashSecret(username),
        },
      };

      return await this.cognitoIdentity.initiateAuth(params).promise();
    } catch (error) {
      const { message } = error;
      console.log(
        '-----> ~ cognitoService ~ signIn ~ error:',
        message || error,
      );
      throw new Error("Can't sign in user");
    }
  }

  async signOut(accessToken: string) {
    try {
      const params = { AccessToken: accessToken };
      return await this.cognitoIdentity.globalSignOut(params).promise();
    } catch (error) {
      const { message } = error;
      console.log(
        '-----> ~ cognitoService ~ signOut ~ error:',
        message || error,
      );
      throw new Error("Can't sign out user");
    }
  }

  async verifyAccessToken(accessToken: string) {
    try {
      const params = { AccessToken: accessToken };
      return await this.cognitoIdentity.getUser(params).promise();
    } catch (error) {
      const { message } = error;
      console.log(
        '-----> ~ CognitoService ~ verifyAccessToken ~ message:',
        message || error,
      );
      throw new Error("Can't verify access token");
    }
  }
}
