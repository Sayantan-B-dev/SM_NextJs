import yt_dlp
import os
import json


def download_playlist(url, output_path="."):

    ydl_opts = {
        # 🎬 Videos
        'outtmpl': os.path.join(
            output_path,
            '%(playlist_title)s/videos/%(playlist_index)03d.%(ext)s'
        ),

        'format': 'bestvideo+bestaudio/best',
        'merge_output_format': 'mp4',

        'paths': {
            'home': output_path,
        },

        # Metadata
        'writedescription': True,
        'writeinfojson': True,
        'writesubtitles': True,
        'writeautomaticsub': True,

        # 🔥 THIS is enough (no postprocessor needed)
        'progress_hooks': [organize_files],

        'ignoreerrors': True,
        'windowsfilenames': True,
        'playliststart': 1,

        'embed_metadata': True,
        'embed_thumbnail': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            print(f"\n📥 Downloading: {url}")
            ydl.download([url])
    except Exception as e:
        print(f"❌ Error downloading {url}: {e}")


def organize_files(d):
    if d['status'] != 'finished':
        return

    filepath = d['filename']
    video_dir = os.path.dirname(filepath)
    base_dir = os.path.dirname(video_dir)  # Playlist root

    filename = os.path.basename(filepath)
    idx = filename.split('.')[0]

    meta_dir = os.path.join(base_dir, "metadata")
    sub_dir = os.path.join(base_dir, "subtitles")
    desc_dir = os.path.join(base_dir, "descriptions")

    os.makedirs(meta_dir, exist_ok=True)
    os.makedirs(sub_dir, exist_ok=True)
    os.makedirs(desc_dir, exist_ok=True)

    for file in os.listdir(video_dir):
        if not file.startswith(idx):
            continue

        src = os.path.join(video_dir, file)

        try:
            if file.endswith(".info.json"):
                os.rename(src, os.path.join(meta_dir, f"{idx}.json"))

            elif file.endswith(".description"):
                os.rename(src, os.path.join(desc_dir, f"{idx}.txt"))

            elif file.endswith(".vtt"):
                os.rename(src, os.path.join(sub_dir, f"{idx}.vtt"))

        except Exception as e:
            print(f"⚠️ Skip {file}: {e}")

def load_links(json_file):
    try:
        with open(json_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        links = data.get("links", [])

        if not isinstance(links, list):
            raise ValueError("'links' must be a list")

        return links

    except Exception as e:
        print(f"❌ Failed to read JSON: {e}")
        return []


def main():
    json_file = "playlists.json"
    output_folder = "."  # Root

    links = load_links(json_file)

    if not links:
        print("⚠️ No playlist links found.")
        return

    for link in links:
        download_playlist(link, output_folder)

    print("\n✅ All downloads + organization completed!")


if __name__ == "__main__":
    main()