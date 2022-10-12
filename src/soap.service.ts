import { Inject, Injectable, Logger } from '@nestjs/common';
import { BasicAuth, SoapModuleOptions, WSSecurityAuth, WSSecurityCertAuth } from './soap-module-options.type';
import { BASIC_AUTH, SOAP_MODULE_OPTIONS, WSSECURITY_AUTH, WSSECURITYCERT_AUTH } from './soap-constants';
import { BasicAuthSecurity, Client, createClientAsync, ISecurity, WSSecurity, WSSecurityCert } from 'soap';

function createSecurity(auth: BasicAuth | WSSecurityAuth | WSSecurityCertAuth): ISecurity {
  switch (auth.type) {
    case BASIC_AUTH: {
      const {username, password} = auth as BasicAuth;

      return new BasicAuthSecurity(username, password);
    }
    case WSSECURITY_AUTH: {
      const {username, password, options} = auth as WSSecurityAuth;

      return new WSSecurity(username, password, options);
    }
    case WSSECURITYCERT_AUTH: {
      const {options, password, privateKey, publicKey} = auth as WSSecurityCertAuth;

      return new WSSecurityCert(privateKey, publicKey, password, options);
    }
    default:
      throw new Error(`Invalid Auth type: ${auth.type}`);
  }
}

@Injectable()
export class SoapService {
  constructor(@Inject(SOAP_MODULE_OPTIONS) readonly soapModuleOptions: SoapModuleOptions) {}

  async createAsyncClient(): Promise<Client> {
    const options = this.soapModuleOptions;

    try {
      const client = await createClientAsync(options.uri, options.clientOptions);

      if (!options.auth) return client;
      const authMethod: ISecurity = createSecurity(options.auth);
      client.setSecurity(authMethod);

      return client;

    } catch (err) {
      const logger = new Logger('SoapModule');

      logger.error(
        `${err.message} \n - An error occurred while creating the soap client. Check the SOAP service URL and status.`,
      );

      return null;
    }
  }
}
