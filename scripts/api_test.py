import json
import platform
import urllib.request

url = "https://api.github.com/zen"
req = urllib.request.Request(url, headers={"User-Agent": "github-video-render-test"})
with urllib.request.urlopen(req, timeout=20) as response:
    body = response.read().decode("utf-8", errors="replace")
    print(json.dumps({
        "python": platform.python_version(),
        "status": response.status,
        "url": url,
        "response": body[:200]
    }, indent=2))
