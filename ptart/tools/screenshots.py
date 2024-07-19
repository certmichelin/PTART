import os
import re

#-----------------------------------------------------------------------------#
screenshot_pattern = re.compile(r'!\[ptart_screenshot\]\((.*?)\)')
#-----------------------------------------------------------------------------#

def prune_images_from_markdown(md):
    """Prune images from the markdown"""
    return re.sub(screenshot_pattern, '', md)

def extract_images_from_markdown(texts):
    """Return all screenshots that are not injected in the body nor remediation"""
    screenshot_injected = []
    for text in texts:
        matches = screenshot_pattern.findall(text)
        for match in matches :                        
            screenshot_injected.append(match.split("/")[-2])
    return screenshot_injected

def get_screenshot_raw_data(screenshot):
    """Get screenshot data in binary format"""
    result = ''
    url = screenshot.url
    if url.startswith('.') is False :
        url = "." + url
    try:
        with open(url, 'rb') as img_f:
            result = img_f.read()
    except FileNotFoundError:
        result = None
    return result

def delete_screenshot_file(screenshot):
    """Delete file related to the screenshot"""
    url = screenshot.url
    if url.startswith('.') is False :
        url = "." + url
    try:
        os.remove(url)
    except FileNotFoundError:
        pass