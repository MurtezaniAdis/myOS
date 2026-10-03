import time

from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

BEGINNER_FRIENDLY_OS = [
    "Linux Mint",
    "Ubuntu",
    "Zorin OS",
    "Pop!_OS",
    "MX Linux",
    "elementary OS",
    "Linux Lite",
    "Manjaro Linux",
    "Kubuntu",
    "EndeavourOS"
]

TABLE_FEATURES = ["Price (US$)", "Image Size (MB)"]

OS_NAMES_URL = "https://distrowatch.com/search.php?ostype=Linux&category=All&origin=All&basedon=All&notbasedon=None&desktop=All&architecture=All&package=All&rolling=All&isosize=All&netinstall=All&language=All&defaultinit=All&status=Active#simpleresults"


def create_browser():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    return webdriver.Chrome(options=chrome_options)


def scrape_os_list(browser):
    browser.get(OS_NAMES_URL)
    time.sleep(2)

    soup = BeautifulSoup(browser.page_source, "html.parser")

    os_list = []
    for cell in soup.select("td.NewsText b a"):
        name = cell.get_text(strip=True)
        href = cell.get('href')

        if name and not name.isdigit() and name.lower() != "popularity":
            os_list.append({
                "name": name,
                "url": "https://distrowatch.com/" + href
            })

    return os_list


def scrape_details(browser, os_list):
    for os_entry in os_list:
        browser.get(os_entry["url"])
        time.sleep(2)

        detail_soup = BeautifulSoup(browser.page_source, "html.parser")

        info_container = detail_soup.select_one("td.TablesTitle")

        if info_container:
            for li in info_container.select("ul li"):
                label_tag = li.find("b")
                if label_tag:
                    key = label_tag.get_text(strip=True).replace(":", "")
                    full_text = li.get_text(strip=True)
                    value = full_text.replace(label_tag.get_text(strip=True), "").strip()

                    if key == "Popularity":
                        value = value.split("(")[0].strip()

                    if value:
                        os_entry[key] = value

            text_parts = [
                str(child).strip()
                for child in info_container.children
                if isinstance(child, str) and child.strip()
            ]
            if text_parts:
                os_entry["description"] = text_parts[0]

        os_entry["Beginner-friendly"] = os_entry["name"] in BEGINNER_FRIENDLY_OS

        for row in detail_soup.find_all("tr"):
            th = row.find("th")
            td = row.find("td")

            if th and td:
                key = th.get_text(strip=True)
                if key in TABLE_FEATURES:
                    os_entry[key] = td.get_text(strip=True)
                if key == "Free Download":
                    link = td.select_one("a")
                    os_entry["Download"] = link.get("href")


def main():
    browser = create_browser()
    try:
        os_list = scrape_os_list(browser)
        scrape_details(browser, os_list)
    finally:
        browser.quit()
    print(os_list)


if __name__ == "__main__":
    main()
