import subprocess
import sys
import time
from pathlib import Path


def run_command(command, cwd=None, shell=False):
    try:
        subprocess.check_call(command, cwd=cwd, shell=shell)
    except subprocess.CalledProcessError as e:
        print(f"Error executing {command}: {e}")
        sys.exit(1)


def main():
    print("--- 🚀 Starting Project Setup ---")

    backend_path = Path("backend")
    frontend_path = Path("frontend")

    if (backend_path / "requirements.txt").exists():
        print("\n--- [1/4] Installing Python dependencies ---")
        run_command([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], cwd="backend")

    if (frontend_path / "package.json").exists():
        print("\n--- [2/4] Installing Node dependencies ---")
        if not (frontend_path / "node_modules" / "lucide-react").exists():
            run_command("npm install", cwd="frontend", shell=True)

    print("\n--- [3/4] Database Setup ---")
    if (backend_path / "scripts" / "setup_db.py").exists():
        run_command([sys.executable, "-m", "scripts.enrich_os_data"], cwd="backend")
        run_command([sys.executable, "-m", "scripts.setup_db"], cwd="backend")

    print("\n--- [4/4] Launching Servers ---")

    backend_proc = subprocess.Popen([sys.executable, "app.py"], cwd="backend")
    frontend_proc = subprocess.Popen("npm run dev", cwd="frontend", shell=True)

    print("\n✅ Services are running! Press CTRL+C to stop.")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n--- Terminating processes ---")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("Clean exit.")


if __name__ == "__main__":
    main()
