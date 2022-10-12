import { IOptions } from 'soap';
import { ModuleMetadata, Scope, Type } from '@nestjs/common/interfaces';
import { BASIC_AUTH, WSSECURITY_AUTH, WSSECURITYCERT_AUTH, CLIENTSSLSECURITY_AUTH } from './soap-constants';

export { Client, IOptions } from 'soap';

interface Auth {
  username: string;
  password: string;
}

export interface BasicAuth extends Auth {
  type: typeof BASIC_AUTH;
}

export interface WSSecurityAuth extends Auth {
  type: typeof WSSECURITY_AUTH;
  options?: WSSecurityOptions
}

export interface WSSecurityCertAuth extends Omit<WSSecurityAuth, 'username' | 'type'> {
  type: typeof WSSECURITYCERT_AUTH;
  privateKey: string | Buffer;
  publicKey: string | Buffer;
}

export interface ClientSSLSecurityAuth {
  type: typeof CLIENTSSLSECURITY_AUTH;
  key: string | Buffer;
  cert: string | Buffer;
  ca?: string | Buffer;
  options?: {
    strictSSL?: boolean;
    rejectUnauthorized?: boolean;
    hostname?: string;
    secureOptions?: string;
    forever?: boolean;
  }
}

export type WSSecurityOptions = {
  passwordType?: string;
  hasTimeStamp?: boolean;
  hasTokenCreated?: boolean;
  hasNonce?: boolean;
  mustUnderstand?: boolean,
  actor?: string;
};

export type SoapModuleOptions = {
  uri: string;
  clientName: string;
  auth?: BasicAuth | WSSecurityAuth | WSSecurityCertAuth | ClientSSLSecurityAuth;
  clientOptions?: IOptions;
};

export type SoapModuleOptionsFactoryType = Omit<SoapModuleOptions, 'clientName'>

export interface SoapModuleOptionsFactory {
  createSoapModuleOptions(): Promise<SoapModuleOptionsFactoryType> | SoapModuleOptionsFactoryType;
}

export interface SoapModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  clientName: string;
  inject?: any[];
  scope?: Scope;
  useClass?: Type<SoapModuleOptionsFactory>;
  useExisting?: Type<SoapModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<SoapModuleOptionsFactoryType> | SoapModuleOptionsFactoryType;
}
