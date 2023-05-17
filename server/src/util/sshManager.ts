import { generateKeyPairSync } from 'crypto';
import { createCipheriv, createDecipheriv } from 'crypto';
import { promises as fs } from 'fs';
import { pathExists, readJSON, writeJSON, writeFileSync, removeSync, outputFileSync } from 'fs-extra';
import { parseKey, parsePrivateKey } from 'sshpk';
import * as path from 'path';
import { ConfigService } from '../config/config.service';
import { Logger } from '../common/logger/logger.service';
const { Client } = require('ssh2');

type PassphraseFile = Map<string, string>;

export class SSHKeyManager {
  private readonly configService: ConfigService;
  private readonly logger = new Logger();

  constructor() {
    this.configService = new ConfigService();
    this.logger.setContext(SSHKeyManager.name);
  }
  // Generate an SSH key
  async createSSHKey(keyName: string, passphrase: string) {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: passphrase,
      },
    });
    // Define the paths to the private and public key
    const privateKeyPath = path.join(
      this.configService.sshKeyPath,
      `/${keyName}`,
    );
    const publicKeyPath = `${privateKeyPath}.pub`;

    // Check if key already exists
    const [privateKeyExists, publicKeyExists] = await Promise.all([
      fs.access(privateKeyPath).then(
        () => true,
        () => false,
      ),
      fs.access(publicKeyPath).then(
        () => true,
        () => false,
      ),
    ]);

    // Write the keys to the filesystem
    if (!privateKeyExists && !publicKeyExists) {
      outputFileSync(privateKeyPath, privateKey.toString());
      outputFileSync(publicKeyPath, publicKey.toString());
      this.logger.log(`SSH key ${keyName} created`);
    }

    // Save the passphrase to a file if requested
    if (!(await this.checkSavedPassphrases(keyName))) {
      this.logger.log(`Saving passphrase for ${keyName}`);
      const encryptedPassphrase = this.encryptPassphrase(passphrase);
      await this.writePassphraseToFile(keyName, encryptedPassphrase);
    }
  }

  public async removeSSHKey(keyName: string): Promise<void> {
    const { privateKeyPath, publicKeyPath } = await this.getSSHKeyInfo(keyName);
    if (await pathExists(privateKeyPath) && await pathExists(publicKeyPath)) {
      await Promise.all([
        removeSync(privateKeyPath),
        removeSync(publicKeyPath),
        this.removePassphrase(keyName),
      ]);
    } else {
      this.logger.log('SSH key does not exist');
    }
  }

  public async removePublicKeyFromRemoteServer(
    keyName: string,
    remoteHost: string,
    port: string | number,
    username: string,
  ): Promise<void> {
    const { publicKeyPath } = await this.getSSHKeyInfo(keyName);
    if (!(await pathExists(publicKeyPath))) {
      this.logger.log('SSH key does not exist');
      return;
    }
    const publicKey = await fs.readFile(publicKeyPath, 'utf8');
    const privateKey = await this.getPrivateKey(keyName);
    const conn = new Client();
    // Remove public key from remote server
    this.logger.log(`Removing SSH key from ${remoteHost}`);
    await new Promise<void>((resolve, reject) => {
      conn
        .on('ready', async () => {
          this.logger.log(`Connected to ${remoteHost}`);
          conn.exec(
            `sed -i '/${publicKey}/d' ~/.ssh/authorized_keys`,
            (err, stream) => {
              if (err) reject(err);
              stream
                .on('close', () => {
                  this.logger.log('SSH key removed');
                  conn.end();
                  resolve();
                })
                .on('data', (data) => {
                  this.logger.log('STDOUT: ' + data);
                })
                .stderr.on('data', (data) => {
                  this.logger.log('STDERR: ' + data);
                });
            },
          );
        })
        .on('error', (err) => {
          this.logger.log(`Connection error: \${err}`);
          reject(err);
        })
        .connect({
          host: remoteHost,
          port: port,
          username: username,
          privateKey: privateKey,
        });
    });
  }

  public async copyPublicKeyToRemoteServer(
    keyName: string,
    remoteHost: string,
    port: string | number,
    username: string,
    password: string,
  ): Promise<void> {
    // Get ssh public key
    const { publicKeyPath } = await this.getSSHKeyInfo(keyName);
    const publicKey = await fs.readFile(publicKeyPath, 'utf8');
    const convertedPublicKey = parseKey(publicKey, 'pem').toString('ssh');
    const conn = new Client();
    // Copy the public key to the remote server
    this.logger.log(`Copying SSH key to ${remoteHost}`);
    await new Promise<void>((resolve, reject) => {
      conn
        .on('ready', async () => {
          this.logger.log(`Connected to ${remoteHost}`);
          conn.exec(
            `mkdir -p ~/.ssh/ && echo "${convertedPublicKey}" >> ~/.ssh/authorized_keys`,
            (err, stream) => {
              if (err) reject(err);
              stream
                .on('close', () => {
                  this.logger.log('SSH key copied');
                  conn.end();
                  resolve();
                })
                .on('data', (data) => {
                  this.logger.log('STDOUT: ' + data);
                })
                .stderr.on('data', (data) => {
                  this.logger.log('STDERR: ' + data);
                });
            },
          );
        })
        .on('error', (err) => {
          this.logger.log(`Connection error: \${err}`);
          reject(err);
        })
        .connect({
          host: remoteHost,
          port: port,
          username: username,
          password: password,
        })
    });
  }

  async getAllKeys(): Promise<string[]> {
    const passphrases = await this.readPassphraseFile();
    return Array.from(passphrases.keys());
  }

  async getPrivateKey(keyName: string, passphrase?: string) {
    passphrase = passphrase || (await this.getSavedPassphrase(keyName));
    const { privateKeyPath } = await this.getSSHKeyInfo(keyName);
    const privateKey = await fs.readFile(privateKeyPath, 'utf8');
    // Decrypt and return the private key
    return parsePrivateKey(privateKey, 'pem', {
      passphrase: passphrase,
    }).toString('ssh-private');
  }

  private async getSSHKeyInfo(
    keyName: string,
  ): Promise<{ privateKeyPath: string; publicKeyPath: string }> {
    const privateKeyPath = path.join(this.configService.sshKeyPath, keyName);
    const publicKeyPath = `${privateKeyPath}.pub`;
    return { privateKeyPath, publicKeyPath };
  }

  private async readPassphraseFile(): Promise<PassphraseFile> {
    const passphraseFilePath = `${this.configService.sshKeyPath}/passphrases`;
    if (!(await pathExists(passphraseFilePath))) {
      return new Map();
    }
    const passphrases = await readJSON(passphraseFilePath);
    return new Map(Object.entries(passphrases));
  }

  private async getSavedPassphrase(keyName: string): Promise<string> {
    const passphrases = await this.readPassphraseFile();
    const encryptedPassphrase = passphrases.get(keyName);
    const passphrase = this.decryptPassphrase(encryptedPassphrase);
    return passphrase;
  }

  private async removePassphrase(keyName: string): Promise<void> {
    const passphrases = await this.readPassphraseFile();
    const currentPassphrase = passphrases.get(keyName);
    if (currentPassphrase) {
      passphrases.delete(keyName);
      await writeJSON(
        `${this.configService.sshKeyPath}/passphrases`,
        Object.fromEntries(passphrases),
        { spaces: 4 },
      );
    } else {
      this.logger.log(`No passphrase found for ${keyName}`);

    }

  }

  private async checkSavedPassphrases(keyName: string): Promise<boolean> {
    const passphrases = await this.readPassphraseFile();
    return passphrases.has(keyName);
  }
  private async writePassphraseToFile(
    keyName: string,
    encryptedPassphrase: string,
  ): Promise<void> {
    const passphraseFilePath = `${this.configService.sshKeyPath}/passphrases`;
    const fileExists = await pathExists(passphraseFilePath);
    const passphraseFile = fileExists
      ? {
        ...(await readJSON(passphraseFilePath)),
        [keyName]: encryptedPassphrase,
      }
      : { [keyName]: encryptedPassphrase };
    await writeJSON(passphraseFilePath, passphraseFile, { spaces: 4 });
  }

  private encryptPassphrase(passphrase: string): string {
    const encrypt = createCipheriv(
      'aes-256-cbc',
      Buffer.from(this.configService.secrets.passphraseSecret.key, 'base64'),
      Buffer.from(this.configService.secrets.passphraseSecret.iv, 'base64'),
    );
    return encrypt.update(passphrase, 'utf8', 'hex') + encrypt.final('hex');
  }
  private decryptPassphrase(name: string): string {
    const decrypt = createDecipheriv(
      'aes-256-cbc',
      Buffer.from(this.configService.secrets.passphraseSecret.key, 'base64'),
      Buffer.from(this.configService.secrets.passphraseSecret.iv, 'base64'),
    );
    return decrypt.update(name, 'hex', 'utf8') + decrypt.final('utf8');
  }
}
