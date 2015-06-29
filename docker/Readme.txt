Following information will help you in setting up a nodejs application running on a Docker container.
These instructions were tested on ubuntu 14.04.1 LTS operating system with nodejs 0.12.4 and Docker version 1.2.0.

Pre-requisites:
1. Linux OS. (Vencore used Ubuntu 14.04.1 LTS with nodejs version 0.12.4)
2. Docker client 1.2.0 is installed
3. Docker daemon 1.2.0 is installed
4. Execute the following command to make sure docker client and daemon is running
                sudo docker version
5. Docker server should have internet access to be able to download Docker image from Docker Hub.
6. Port 80 should be available on server where the docker container is being created.
7. Linux user account being used to executing these scripts should have sudo privileges to execute any command or use root user account.

Docker Container creation and application install process:
1. Connect to the Docker Machine and create a working folder.
                sudo mkdir -p /vencore/docker
2. copy/sftp/ftp the following files to working folder. 
                Dockerfile
                archive.tar
                application.properties
                vencoreDemoApp.sh

3. Change to the working folder eg: "/vencore/docker"
                cd /vencore/docker
4. Execute the following command to make the file executable
                sudo chmod +x vencoreDemoApp.sh
5. Execute the following command to build the docker container and launch application on port 80. If you need to change the application folder or application port, updated the script file (vencoreDemoApp.sh) before running the script.
                sudo ./vencoreDemoApp.sh > "VencoreDemoAppInstall-$(date +"%Y-%m-%d:%T").log"
