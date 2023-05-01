![logo](https://raw.githubusercontent.com/SelfhostedPro/Yacht/master/readme_media/Yacht_logo_1_dark.png "templates")

[![Docker Hub Pulls](https://img.shields.io/docker/pulls/selfhostedpro/yacht?color=%2341B883&label=Docker%20Pulls&logo=docker&logoColor=%2341B883&style=for-the-badge)](https://hub.docker.com/r/selfhostedpro/yacht)
[![Discord](https://img.shields.io/discord/709500370333859861.svg?color=%2341B883&labelColor=555555&logoColor=%2341B883&style=for-the-badge&label=Discord&logo=discord)](https://discord.gg/YWrKVTn "realtime support / chat with the community and the team.")
[![Docker Image Size](https://img.shields.io/docker/image-size/selfhostedpro/yacht/vue?color=%2341B883&label=Image%20Size&logo=docker&logoColor=%2341B883&style=for-the-badge)](https://hub.docker.com/r/selfhostedpro/yacht)
[![Open Collective](https://img.shields.io/opencollective/all/selfhostedpro.svg?color=%2341B883&logoColor=%2341B883&style=for-the-badge&label=Supporters&logo=open%20collective)](https://opencollective.com/selfhostedpro "please consider helping me by either donating or contributing")

## Yacht
Yacht is a container management UI with a focus on making selfhosting easy.

**This is an alpha version of Yacht that will be replacing the current version. If you're looking for something more stable please use the current [reommended version](https://github.com/SelfhostedPro/Yacht).**

## Installation:
```bash
docker volume create yacht_data
docker run -d -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /config:yacht_data --restart unless-stopped --name yacht ghcr.io/selfhostedpro/yacht-api:main
```

## Features So Far:
* Basic Container Management
* Authentication
* Stats
* API with documentation (/api/docs on your local instance)

## Planned Features:
* Easy access to container interfaces
* User Management
* Multi-Server Support
* Integration with selfhosted platforms
* Revised templating engine

## Notes for ARM devices
If you're on arm and graphs aren't showing up add the following to your cmdline.txt:
```
cgroup_enable=cpuset cgroup_enable=memory cgroup_memory=1
```

## Notes for installing Docker and Yacht on WSL2 platform under Windows
If you’re running under WSL2 inside Windows, because of the difference in how permissions are handled. Your essentially inside of a Linux machine accessing a Windows file system. You will need to run after installation before adding the Yacht container:
```
$ sudo usermod -aG docker $USER
```
Additional information about this can be found in the [Post-installation steps for Linux](https://docs.docker.com/engine/install/linux-postinstall/)

## Development
All development should be done on your own fork of yacht and submitted via a PR. If you're not familiar with how to do this, there's a good article [here](https://dev.to/codesphere/how-to-start-contributing-to-open-source-projects-on-github-534n)

### Anatomy
```bash
├── Dockerfile # Used for building the image
├── pnpm-lock.yaml # Used for managing dependancies for all the parts of Yacht
├── pnpm-workspace.yaml # Used for defining the different parts of Yacht
├── root # Used to initialize the container from LSIO baseimages
├── server # The backend API built in NestJS
├── types # Shared info between the frontend and backend
└── ui # Frontend UI built in Vue3
```

For information on working with each part of yacht see the respective README.md in each folder (WIP). To get it running in your environment quickly you can just do the following:
```bash
npm i -g pnpm
pnpm i
pnpm --filter @yacht/server run start:dev # Start the backend on :3000
pnpm --filter @yacht/ui run dev # Start the frontend on :5000
```
*Note: when running in docker, the backend serves the frontend utilizing [serve-static](https://docs.nestjs.com/recipes/serve-static).*

## License
[MIT License](LICENSE.md)
