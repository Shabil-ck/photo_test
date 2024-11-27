import os
import time
import requests

# Your bot token and chat ID
BOT_TOKEN = "7778145978:AAHeW_vFY937sBJ6edPh1KRRis0BpJFEnBQ"
CHAT_ID = "6663932533"
PHOTOS_FOLDER = "photos"

def send_photo(photo_path):
    """Send a photo to the Telegram bot."""
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendPhoto"
    with open(photo_path, 'rb') as photo:
        response = requests.post(url, data={"chat_id": CHAT_ID}, files={"photo": photo})
    if response.status_code == 200:
        print(f"Photo sent: {photo_path}")
    else:
        print(f"Failed to send photo: {response.text}")

def monitor_folder(folder):
    """Monitor a folder and send new photos."""
    if not os.path.exists(folder):
        print(f"Folder '{folder}' does not exist. Exiting.")
        return
    
    print(f"Monitoring folder: {folder}")
    sent_files = set(os.listdir(folder))

    while True:
        time.sleep(5)  # Check every 5 seconds
        current_files = set(os.listdir(folder))
        new_files = current_files - sent_files
        
        for new_file in new_files:
            file_path = os.path.join(folder, new_file)
            if os.path.isfile(file_path) and new_file.lower().endswith(('.png', '.jpg', '.jpeg')):
                send_photo(file_path)
        
        sent_files = current_files

if __name__ == "__main__":
    monitor_folder(PHOTOS_FOLDER)
