ec2-user@kali:~$ cat headless-chrome-badstore-ddos.py
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
driver.get(target)

for x in range(1000):
    #driver.get("http://waf.brett1.com")
    #driver.get("http://waas.cudathon.com")
    ##ddd = json.load(driver.get_log('browser'))
    ##print ddd
    #print(driver.title)
    # --> this is good, maybe uncomment later --> print(driver.page_source)


    #pp = driver.get_log('performance')
    #print pp[0]['headers']
    #print ddd
    #xx = str(pp).strip('[]')
    #for i in pp:
        #print i['headers']
    #jj = json.loads(pp.read)
    #print pp['headers']
    #print yy['headers']
    #yy = xx.split(",");
    #for entry in yy:
    #    print (entry)

    #time.sleep(1)
    #print("Hello", "how are you?")
    assert "BadStore" in driver.title
    #assert "Python" in driver.title
    elem = driver.find_element_by_name("searchquery")
    #to refresh the browser
    #driver.refresh()
    # identifying the source element
    #source= driver.find_element_by_xpath("//*[text()='username']");
    # action chain object creation
    action = ActionChains(driver)
    # move to the element and click then perform the operation
    # elem = driver.find_element_by_name("username")
    action.move_to_element(elem).click().perform()
    elem.clear()
    elem.send_keys("Snake Oil")
    elem.send_keys(Keys.RETURN)
    time.sleep(1)
    print(driver.page_source)
    assert "Useless" in driver.page_source
    #source= driver.find_element_by_xpath("//*[text()='cartitem']");
    #action.move_to_element(elem).click().perform()
    #elem = driver.find_element_by_name("Add Items to Cart")
    #action.move_to_element(elem).click().perform()

    #elem.send_keys("miyuki")
    #elem = driver.find_element_by_name("password")
    #elem.clear()
    #elem.send_keys("hello")
    #elem.send_keys(Keys.RETURN)
    #assert "animal" in driver.page_source
    #print(driver.page_source)
