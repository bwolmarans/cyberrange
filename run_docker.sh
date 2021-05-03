call this one directly or from logging wrapper find that file in this repo somewhere
[root@ip-10-0-1-84 ec2-user]# cat run_docker.sh
#!/bin/bash

docker kill badstore1
docker kill badstore2
docker kill badstore3
docker kill badstore4
docker kill badstore5
docker kill badstore6
docker kill badstore7
docker kill badstore8
docker kill badstore9
docker kill badstore10
docker kill badstore11
docker kill badstore12
docker kill badstore13
docker kill badstore14
docker kill badstore15
docker kill badstore16
docker kill badstore17
docker kill badstore18
docker kill badstore19
docker kill badstore20
docker kill nginx
sleep 2
docker kill swaggerapi-petstore3
sleep 2
docker rm nginx
docker rm badstore
docker rm badstore1
docker rm badstore2
docker rm badstore3
docker rm badstore4
docker rm badstore5
docker rm badstore6
docker rm badstore7
docker rm badstore8
docker rm badstore9
docker rm badstore10
docker rm badstore11
docker rm badstore12
docker rm badstore13
docker rm badstore14
docker rm badstore15
docker rm badstore16
docker rm badstore17
docker rm badstore18
docker rm badstore19
docker rm badstore20
sleep 2
docker rm swaggerapi-petstore3
sleep 2
echo y | docker system prune -a
sleep 10
docker build -t nginx /home/ec2-user/nginx
docker run -it --rm -d -p 80:80 --name nginx nginx
docker run -it --rm -d -p 8081:80 --name badstore1 bwolmarans/badstore
docker run -it --rm -d -p 8082:80 --name badstore2 bwolmarans/badstore
docker run -it --rm -d -p 8083:80 --name badstore3 bwolmarans/badstore
docker run -it --rm -d -p 8084:80 --name badstore4 bwolmarans/badstore
docker run -it --rm -d -p 8085:80 --name badstore5 bwolmarans/badstore
docker run -it --rm -d -p 8086:80 --name badstore6 bwolmarans/badstore
docker run -it --rm -d -p 8087:80 --name badstore7 bwolmarans/badstore
docker run -it --rm -d -p 8088:80 --name badstore8 bwolmarans/badstore
docker run -it --rm -d -p 8089:80 --name badstore9 bwolmarans/badstore
docker run -it --rm -d -p 8090:80 --name badstore10 bwolmarans/badstore
docker run -it --rm -d -p 8091:80 --name badstore11 bwolmarans/badstore
docker run -it --rm -d -p 8092:80 --name badstore12 bwolmarans/badstore
docker run -it --rm -d -p 8093:80 --name badstore13 bwolmarans/badstore
docker run -it --rm -d -p 8094:80 --name badstore14 bwolmarans/badstore
docker run -it --rm -d -p 8095:80 --name badstore15 bwolmarans/badstore
docker run -it --rm -d -p 8096:80 --name badstore16 bwolmarans/badstore
docker run -it --rm -d -p 8097:80 --name badstore17 bwolmarans/badstore
docker run -it --rm -d -p 8098:80 --name badstore18 bwolmarans/badstore
docker run -it --rm -d -p 8099:80 --name badstore19 bwolmarans/badstore
docker run -it --rm -d -p 8100:80 --name badstore20 bwolmarans/badstore
sleep 5
docker run --name swaggerapi-petstore3 -d -p 8080:8080 swaggerapi/petstore3:unstable
