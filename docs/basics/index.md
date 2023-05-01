## supported architectures
Yacht is built for the following architectures:

* linux/amd64
* linux/arm64

It may work on others such as Windows or MacOS but they will not be officially supported.

## software requirements
The latest version of docker is recommended. Instructions for how to install it are available [here](https://docs.docker.com/engine/install/).

## install

### docker
Running Yacht in docker is as simple as running the following two commands:

```bash
docker volume create yacht
docker run -d --name yacht --restart unless-stopped \
        -p 3000:3000 \
        -v /var/run/docker.sock:/var/run/docker.sock \
        -v yacht:/config  \
        ghcr.io/selfhostedpro/yacht-api:main
```

After that you can access Yacht on port 3000 on your server in a web browser.

- _If you're using Yacht alongside portainer, you'll want to change the 8000 on the left of the `:` to 8001, then it will be available on that port on your host._
- _If SELinux is enabled on the host, you'll need to pass the `--privileged` flag to docker when deploying Yacht._

Once you're at the login page you can setup your user.

*If you need to reset your password/username to the included defaults, please delete the `auth.json` file in `/config/storage/` and restart the container.

## arm
### memory support in graphs
If you're on arm and graphs aren't showing up add the following to your cmdline.txt:

```
sudo nano /boot/cmdline.txt
```

Add at the end of line
```
cgroup_enable=cpuset cgroup_enable=memory cgroup_memory=1
```

Like this: console=serial0,124557 console=tty1 root=PARTUUID=xxxxxx rootfstype=ext4 fsck.repair=yes rootwait cgroup_enable=cpuset cgroup_enable=memory

Then, reboot:

```
sudo reboot
```

## macos
### permissions issues
MacOS will throw errors about being unable to access the docker socket (`/var/run/docker.sock`) in order to resolve this problem you'll need to run with `PUID=0` and `PGID=0` environment variables set. 

Here's an example docker-compose:

```yaml title="docker-compose.yml"
version: '3'
services:
  yacht:
    container_name: yacht
    restart: unless-stopped
    ports:
      - 3000:3000
    volumes:
      - yacht:/config
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - PUID=0
      - PGID=0
      - COMPOSE_DIR=/compose
    image: ghcr.io/selfhostedpro/yacht-api:main
volumes:
  yacht:
```

*Please note that the above docker-compose sets up a compose directory for managing compose projects. You'll need to change the paths to fit your system or remove these if you're not going to be using docker-compose*

## podman

Yacht is compatible with podman. In order to run a Yacht container in podman you can use the following command:

```bash
podman volume create yacht
podman run --name yacht --restart unless-stopped \
        -p 8000:8000 \
        -v /var/run/podman/podman.sock:/var/run/docker.sock -v yacht:/config \
        -d ghcr.io/selfhostedpro/yacht-api:main
```
