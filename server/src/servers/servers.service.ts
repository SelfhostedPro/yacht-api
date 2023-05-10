import { Injectable } from '@nestjs/common';
import { Logger } from 'src/logger/logger.service';
import { ConfigService } from 'src/config/config.service';
import { ServerDict, YachtConfig } from '@yacht/types';
import { createDecipheriv, createCipheriv, randomBytes, generateKeyPairSync } from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';
import { pathExists, readJSON, writeJSON, writeFileSync } from 'fs-extra';
import { NewServerOptions } from './servers.dto';
import { parseKey, parsePrivateKey } from 'sshpk';
const { Client } = require('ssh2');
const Docker = require('dockerode')
type PassphraseFile = Map<string, string>;

@Injectable()
export class ServersService {
    constructor(
        private readonly logger: Logger,
        private readonly configService: ConfigService
    ) { }
    async getServersFromConfig(): Promise<ServerDict> {
        const servers = this.configService.yachtConfig.base.servers;
        const result: ServerDict = {};
        for (const server of servers) {
            if (server.options.protocol === 'ssh') {
                const privateKey = await this.getPrivateKey(server.name);
                // @ts-ignore
                result[server.name] = new Docker({ protocol: 'ssh', host: server.options.host, port: server.options.port, username: server.options.username, sshOptions: { privateKey: privateKey } });
            } else {
                result[server.name] = new Docker(server.options);
            }
        }
        return result;
    }
    async getServerFromConfig(name: string): Promise<typeof Docker> {
        const servers = await this.getServersFromConfig();
        return servers[name];
    }
    async getServerConfig(): Promise<YachtConfig['base']['servers']> {
        return this.configService.yachtConfig.base.servers
    }
    async addServerToConfig(name: string, options: NewServerOptions): Promise<YachtConfig> {
        const servers = await this.getServerConfig();
        // Check for existing servers
        let serverExists = false;
        this.logger.log(`Checking if server ${name} already exists`)
        for (const server of servers) {
            if (server.name === name) {
                serverExists = true;
                break;
            }
        }
        if (serverExists) {
            throw new Error('Server already exists');
        }
        // Generate a new ssh key and copy it to the remote server
        if (options.protocol === 'ssh') {
            // Generate random passphrase and create SSH key
            this.logger.log(`Generating SSH key for ${name}`)
            await this.createSSHKey(name, randomBytes(32).toString('hex'))
            this.logger.log(`Copying SSH key to ${name}`)
            await this.copyPublicKeyToRemoteServer(name, options.host, options.port, options.username, options.password)
        }
        delete options.password
        servers.push({ name, options })
        const currentConfig = this.configService.yachtConfig
        currentConfig.base.servers = servers

        return this.configService.writeConfig(currentConfig)
    }
    // SSH Key management
    async createSSHKey(keyName: string, passphrase: string) {
        // Generate a private key
        const { publicKey, privateKey } = generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: passphrase,
            }
        })
        // Define the paths to the private and public key
        const privateKeyPath = path.join(this.configService.sshKeyPath, `/${keyName}`);
        const publicKeyPath = `${privateKeyPath}.pub`;

        // Check if key already exists
        const [privateKeyExists, publicKeyExists] = await Promise.all([
            fs.access(privateKeyPath).then(() => true, () => false),
            fs.access(publicKeyPath).then(() => true, () => false),
        ]);

        // Write the keys to the filesystem
        if (!privateKeyExists && !publicKeyExists) {
            writeFileSync(privateKeyPath, privateKey.toString());
            writeFileSync(publicKeyPath, publicKey.toString());
            this.logger.log(`SSH key ${keyName} created`);
        }

        // Save the passphrase to a file if requested
        if (!await this.checkSavedPassphrases(keyName)) {
            this.logger.log(`Saving passphrase for ${keyName}`)
            const encryptedPassphrase = this.encryptPassphrase(passphrase);
            await this.writePassphraseToFile(keyName, encryptedPassphrase);
        }
    }
    public async copyPublicKeyToRemoteServer(keyName: string, remoteHost: string, port: string | number, username: string, password: string): Promise<void> {
        const { publicKeyPath } = await this.getSSHKeyInfo(keyName);
        const publicKey = await fs.readFile(publicKeyPath, 'utf8');
        const convertedPublicKey = parseKey(publicKey, 'pem').toString('ssh');
        const conn = new Client();
        this.logger.log(`Copying SSH key to ${remoteHost}`)
        await new Promise<void>((resolve, reject) => {
            conn.on("ready", async () => {
                this.logger.log(`Connected to ${remoteHost}`)
                conn.exec(`mkdir -p ~/.ssh/ && echo "${convertedPublicKey}" >> ~/.ssh/authorized_keys`, (err, stream) => {
                    if (err) throw err;
                    stream.on("close", () => {
                        console.log('SSH key copied')
                        conn.end();
                        resolve();
                    }).on('data', (data) => {
                        console.log('STDOUT: ' + data);
                    }).stderr.on('data', (data) => {
                        console.log('STDERR: ' + data);
                    });;
                });
            }).connect({
                host: remoteHost,
                port: port,
                username: username,
                password: password,
            });
        });
    }
    async getPrivateKey(keyName: string, passphrase?: string) {
        passphrase = passphrase || await this.getSavedPassphrase(keyName);
        const { privateKeyPath } = await this.getSSHKeyInfo(keyName);
        const privateKey = await fs.readFile(privateKeyPath, 'utf8');
        return parsePrivateKey(privateKey, 'pem', { passphrase: passphrase }).toString('ssh-private');
    }
    private async getSSHKeyInfo(keyName: string): Promise<{ privateKeyPath: string, publicKeyPath: string }> {
        const privateKeyPath = path.join(this.configService.sshKeyPath, keyName);
        const publicKeyPath = `${privateKeyPath}.pub`;
        return { privateKeyPath, publicKeyPath };
    }
    private async readPassphraseFile(): Promise<PassphraseFile> {
        const passphraseFilePath = `${this.configService.sshKeyPath}/passphrases`;
        if (!await pathExists(passphraseFilePath)) {
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
    // Passphrase management
    private async checkSavedPassphrases(keyName: string): Promise<boolean> {
        const passphrases = await this.readPassphraseFile();
        return passphrases.has(keyName);
    }
    private async writePassphraseToFile(keyName: string, encryptedPassphrase: string): Promise<void> {
        const passphraseFilePath = `${this.configService.sshKeyPath}/passphrases`;

        const fileExists = await pathExists(passphraseFilePath);
        const passphraseFile = fileExists
            ? { ...(await readJSON(passphraseFilePath)), [keyName]: encryptedPassphrase }
            : { [keyName]: encryptedPassphrase };

        await writeJSON(passphraseFilePath, passphraseFile, { spaces: 4 });
    }

    private encryptPassphrase(passphrase: string): string {
        const encrypt = createCipheriv('aes-256-cbc', Buffer.from(this.configService.secrets.passphraseSecret.key, 'base64'), Buffer.from(this.configService.secrets.passphraseSecret.iv, 'base64'))
        return encrypt.update(passphrase, 'utf8', 'hex') + encrypt.final('hex')
    }
    private decryptPassphrase(name: string): string {
        const decrypt = createDecipheriv('aes-256-cbc', Buffer.from(this.configService.secrets.passphraseSecret.key, 'base64'), Buffer.from(this.configService.secrets.passphraseSecret.iv, 'base64'))
        return decrypt.update(name, 'hex', 'utf8') + decrypt.final('utf8')
    }

}
