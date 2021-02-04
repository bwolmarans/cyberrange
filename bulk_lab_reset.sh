[centos@ip-10-0-1-234 myapp]$ cat bulk_lab_reset.sh
array=( "waas-student01@bugbug.me" "waas-student02@bugbug.me" "waas-student03@bugbug.me" "waas-student04@bugbug.me" "waas-student05@bugbug.me" "waas-student06@bugbug.me" "waas-student07@bugbug.me" "waas-student08@bugbug.me" "waas-student09@bugbug.me" "waas-student09@bugbug.me" "waas-student10@bugbug.me" "waas-student11@bugbug.me" "waas-student12@bugbug.me" "waas-student13@bugbug.me" "waas-student14@bugbug.me" "waas-student15@bugbug.me" "waas-student16@bugbug.me" "waas-student17@bugbug.me" "waas-student18@bugbug.me" "waas-student19@bugbug.me" "waas-student20@bugbug.me" )
for i in "${array[@]}"; do echo $i serenitynow_insanitylater; done;

echo "Do you wish to install this program?"
select yn in "list" "delete" "create"; do
    case $yn in
        list ) for i in "${array[@]}"; do echo "+++++++++++++++++++++++++++++++++++++++++++++++"; node list_apps.js $i serenitynow_insanitylater; echo "+++++++++++++++++++++++++++++++++++++++++++++++"; done; break;;
        delete ) for i in "${array[@]}"; do echo "+++++++++++++++++++++++++++++++++++++++++++++++"; node delete_apps.js $i serenitynow_insanitylater; echo "+++++++++++++++++++++++++++++++++++++++++++++++"; done; break;;
        create ) for i in "${array[@]}"; do echo "+++++++++++++++++++++++++++++++++++++++++++++++"; node create_apps.js $i serenitynow_insanitylater; echo "+++++++++++++++++++++++++++++++++++++++++++++++"; done; break;;
    esac
done
[centos@ip-10-0-1-234 myapp]$
